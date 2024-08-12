import { isSubArray, checkDuplicates } from "./helpers.js";
export const makeAlphabet = (alphabet) => alphabet.split('');
export const makeAState = (name) => ({ tag: "AState", name: name });
export const makeATransition = (src, char, dest) => ({ tag: "ATransition", src: src, char: char, dest: dest });
export const makeAConfiguration = (word, state) => ({ tag: "AConfiguration", word: word, state: state });
export const makeDFA = (alphabet, states, acceptingStates, initialState, transitions) => {
    assertValidAutomata(alphabet, states, acceptingStates, initialState, transitions);
    if (!isDetermenistic(transitions))
        throw new Error("non-deterministic transition function");
    return {
        tag: "DFA",
        alphabet: alphabet,
        states: states,
        acceptingStates: acceptingStates,
        initialState: initialState,
        transitions: transitions
    };
};
export const makeNFA = (alphabet, states, acceptingStates, initialState, transitions) => {
    assertValidAutomata(alphabet, states, acceptingStates, initialState, transitions, true);
    return {
        tag: "NFA",
        alphabet: alphabet,
        states: states,
        acceptingStates: acceptingStates,
        initialState: initialState,
        transitions: transitions
    };
};
export const sameTransition = (ft, st) => ft.src === st.src && ft.dest === st.dest && ft.char === st.char;
export const sameState = (fs, ss) => fs.name === ss.name;
export const sameCharacter = (fc, sc) => fc === sc;
/**
 * Check if the alphabet is a set, that the accepting and initial stets are in
 * the states list, and that the transitions are valid.
 * @param alphabet the sautomata's alphabet.
 * @param states a list of the automata's states.
 * @param acceptingStates a list of accepting states
 * @param initialState the initial state of the automata.
 * @param transitions a list of transitions between the states of the automata.
 */
export const assertValidAutomata = (alphabet, states, acceptingStates, initialState, transitions, allowEpsilon = false) => {
    if (alphabet.length === 0)
        throw new Error("empty alphabet");
    if (alphabet.indexOf('') > -1)
        throw new Error("empty character is not allowed");
    if (checkDuplicates(alphabet, (s1, s2) => s1 === s2))
        throw new Error("repeated characters in alphabet");
    if (states.length === 0)
        throw new Error("empty list of states");
    if (checkDuplicates(states, sameState))
        throw new Error("repeated states");
    if (checkDuplicates(acceptingStates, sameState))
        throw new Error("repeated accepting states");
    if (!isSubArray(states, acceptingStates, sameState))
        throw new Error("accepting states is not a subset of all states");
    if (states.findIndex(st => sameState(st, initialState)) === -1)
        throw new Error("initial state is not in the list of states");
    if (checkDuplicates(transitions, sameTransition))
        throw new Error("repeated transitions");
    if (allowEpsilon) {
        if (!isSubArray(alphabet.concat(['']), transitions.map(t => t.char), sameCharacter))
            throw new Error("some transitions are from invalid characters");
    }
    else {
        if (!isSubArray(alphabet, transitions.map(t => t.char), sameCharacter))
            throw new Error("some transitions are from invalid characters");
    }
    if (!isSubArray(states, transitions.map(t => t.src), sameState))
        throw new Error("some sources are not in the list of states");
    if (!isSubArray(states, transitions.map(t => t.dest), sameState))
        throw new Error("some destinations are not in the list of states");
};
/**
 * For each transition, check that there is no other transition from
 * the same state using the same character.
 * @param transitions transition function.
 * @returns true if the list of transition is deterministic.
 */
export const isDetermenistic = (transitions) => transitions.reduce((acc, curr) => acc && // haven't found non determinism
    transitions.reduce((innerAcc, innerCurr) => innerAcc && // haven't found non determinism
        (innerCurr.src !== curr.src ||
            innerCurr.char !== curr.char ||
            innerCurr.dest === curr.dest), true), true);
/**
 * Run a word on a DFA.
 * @param dfa a DFA.
 * @param word a word to test on the DFA.
 * @param initState a state to begin with, by default it's the DFA's initial state.
 * @returns The state on ehich the words stops/end, or undefined if it got stuck.
 */
export const runWordOnDFA = (dfa, word, print = false, initState = dfa.initialState) => {
    const arr = word.split('');
    if (!isSubArray(dfa.alphabet, arr, sameCharacter))
        throw new Error("illegal characters in the word");
    return arr.reduce((curr, char, index) => {
        if (print)
            console.log(`${curr?.name} ${word.slice(index)}`);
        if (curr === undefined || index === arr.length)
            return curr;
        const nextState = dfa.transitions.filter(t => sameState(t.src, curr) && t.char === char);
        // this should result in an empty array or in an array of one element 
        // due to determinism
        return nextState.length === 0 ? undefined : nextState[0].dest;
    }, initState);
};
/**
 * Check if a word is accepted in a DFA.
 * @param dfa a DFA.
 * @param word a word to test on the DFA.
 * @returns true iff the word is accepted in the DFA, false otherwise.
 */
export const isAcceptedByDFA = (dfa, word, print = false) => {
    const state = runWordOnDFA(dfa, word, print);
    if (state !== undefined && dfa.acceptingStates.findIndex(st => sameState(st, state)) > -1) {
        if (print)
            console.log("ACCEPTED");
        return true;
    }
    if (print)
        console.log("REJECTED");
    return false;
};
/**
 * Run a word on an NFA.
 * @param nfa a NFA.
 * @param word a word to test on the NFA.
 * @param initState a state to begin with, by default it's the NFA's initial state.
 * @returns The state on ehich the words stops/end, or undefined if it got stuck.
 */
export const runWordOnNFA = (nfa, word, print = false, initState = nfa.initialState, pastConfigurations = []) => {
    if (word.length === 0 && (nfa.acceptingStates.findIndex(st => sameState(st, initState)) > -1)) {
        if (print)
            console.log(`${initState.name} ${word}`);
        return initState;
    }
    const chars = word.split('');
    if (!isSubArray(nfa.alphabet, chars, sameCharacter))
        throw new Error("illegal characters in the word");
    const nextStates = nfa.transitions
        .filter(t => sameState(initState, t.src) && word[0] === t.char);
    const nonEpsilon = nextStates.reduce((end, curr) => {
        // try each one if the previous weren't successful
        if (end === undefined || nfa.acceptingStates.findIndex(st => sameState(st, end)) === -1) {
            if (print)
                console.log(`${curr?.src.name} ${word}`);
            return runWordOnNFA(nfa, word.slice(1), print, curr.dest, [makeAConfiguration(word, curr.src)]);
        }
        return end;
    }, undefined);
    if (nonEpsilon !== undefined && nfa.acceptingStates.findIndex(st => sameState(st, nonEpsilon)) > -1)
        return nonEpsilon;
    const nextStatesEpsilon = nfa.transitions
        .filter(t => sameState(initState, t.src) && t.char === '');
    const epsilon = nextStatesEpsilon.reduce((end, curr) => {
        // detected a loop
        if (pastConfigurations.filter(c => c.word === word && c.state === curr.src).length > 0)
            return undefined;
        // try each one if the previous weren't successful
        if (end === undefined || nfa.acceptingStates.findIndex(st => sameState(st, end)) === -1) {
            if (print)
                console.log(`${curr.src.name} ${word}`);
            return runWordOnNFA(nfa, word, print, curr.dest, pastConfigurations.concat([makeAConfiguration(word, curr.src)]));
        }
        return end;
    }, undefined);
    return epsilon;
};
/**
 * Check if a word is accepted in a NFA.
 * @param nfa a NFA.
 * @param word a word to test on the NFA.
 * @returns true iff the word is accepted in the NFA, false otherwise.
 */
export const isAcceptedByNFA = (nfa, word, print = false) => {
    const state = runWordOnNFA(nfa, word, print);
    if (state !== undefined && nfa.acceptingStates.findIndex(st => sameState(st, state)) > -1) {
        if (print)
            console.log("ACCEPTED");
        return true;
    }
    if (print)
        console.log("REJECTED");
    return false;
};
