import { isSubArray, checkDuplicates } from "./helpers.js";

export type Character = string;

export type Alphabet = Character[];

export type AState = { tag: "AState"; name: string };

export type ATransition = {
    tag: "ATransition";
    src: AState;
    char: Character;
    dest: AState;
};
export type AConfiguration = {
    tag: "AConfiguration";
    word: string;
    state: AState;
}

export type DFA = {
    tag: "DFA";
    alphabet: Alphabet;
    states: AState[];
    acceptingStates: AState[];
    initialState: AState;
    transitions: ATransition[];
}

export type NFA = {
    tag: "NFA";
    alphabet: Alphabet;
    states: AState[];
    acceptingStates: AState[];
    initialState: AState;
    transitions: ATransition[];
}

export const makeAlphabet = (alphabet: string) => alphabet.split('');

export const makeAState = (name: string): AState => ({ tag: "AState", name: name });

export const makeATransition = (src: AState, char: Character, dest: AState): ATransition =>
    ({ tag: "ATransition", src: src, char: char, dest: dest });

export const makeAConfiguration = (word: string, state: AState) : AConfiguration => 
    ({tag: "AConfiguration", word: word, state: state});

export const makeDFA = (alphabet: Alphabet, states: AState[],
    acceptingStates: AState[], initialState: AState,
    transitions: ATransition[]) : DFA => {
    
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
    }
}

export const makeNFA = (alphabet: Alphabet, states: AState[],
    acceptingStates: AState[], initialState: AState,
    transitions: ATransition[]) : NFA => {
    
    assertValidAutomata(alphabet, states, acceptingStates, initialState, transitions, true);

    return {
        tag: "NFA",
        alphabet: alphabet,
        states: states,
        acceptingStates: acceptingStates,
        initialState: initialState,
        transitions: transitions
    }
}

export const sameTransition = (ft: ATransition, st: ATransition) : boolean =>
    ft.src === st.src && ft.dest === st.dest && ft.char === st.char;

export const sameState = (fs: AState, ss: AState) : boolean => fs.name === ss.name;

export const sameCharacter = (fc: Character, sc: Character) : boolean => fc === sc;

/**
 * Check if the alphabet is a set, that the accepting and initial stets are in
 * the states list, and that the transitions are valid.
 * @param alphabet the sautomata's alphabet.
 * @param states a list of the automata's states.
 * @param acceptingStates a list of accepting states
 * @param initialState the initial state of the automata.
 * @param transitions a list of transitions between the states of the automata.
 */
export const assertValidAutomata = (alphabet: Alphabet, states: AState[],
    acceptingStates: AState[], initialState: AState,
    transitions: ATransition[], allowEpsilon: boolean = false) => {
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

        if (allowEpsilon){
            if (!isSubArray(alphabet.concat(['']), transitions.map(t => t.char), sameCharacter))
                throw new Error("some transitions are from invalid characters");
        } else {
            if (!isSubArray(alphabet, transitions.map(t => t.char), sameCharacter))
                throw new Error("some transitions are from invalid characters");
        }
    
        if (!isSubArray(states, transitions.map(t => t.src), sameState))
            throw new Error("some sources are not in the list of states");
    
        if (!isSubArray(states, transitions.map(t => t.dest), sameState))
            throw new Error("some destinations are not in the list of states");
    }

/**
 * For each transition, check that there is no other transition from
 * the same state using the same character.
 * @param transitions transition function.
 * @returns true if the list of transition is deterministic.
 */
export const isDetermenistic = (transitions: ATransition[]): boolean =>
    transitions.reduce((acc: boolean, curr) =>
        acc && // haven't found non determinism
        transitions.reduce((innerAcc: boolean, innerCurr) =>
            innerAcc && // haven't found non determinism
            (innerCurr.src !== curr.src || 
                innerCurr.char !== curr.char || 
                innerCurr.dest === curr.dest),
            true), true);

/**
 * Run a word on a DFA.
 * @param dfa a DFA.
 * @param word a word to test on the DFA.
 * @param initState a state to begin with, by default it's the DFA's initial state.
 * @returns The state on ehich the words stops/end, or undefined if it got stuck.
 */
export const runWordOnDFA = (dfa: DFA, word: string, print: boolean = false, initState: AState = dfa.initialState) : AState | undefined =>
{
    const arr = word.split('');

    if (!isSubArray(dfa.alphabet, arr, sameCharacter))
        throw new Error("illegal characters in the word");

    return arr.reduce((curr: AState | undefined, char, index) : AState | undefined => {
        if (print)
            console.log(`${curr?.name} ${word.slice(index)}`);

        if (curr === undefined || index === arr.length)
            return curr;

        const nextState = dfa.transitions.filter(t => 
            sameState(t.src, curr) && t.char === char);
        
        // this should result in an empty array or in an array of one element 
        // due to determinism

        return nextState.length === 0 ? undefined : nextState[0].dest;
    }, initState);
}

/**
 * Check if a word is accepted in a DFA.
 * @param dfa a DFA.
 * @param word a word to test on the DFA.
 * @returns true iff the word is accepted in the DFA, false otherwise.
 */
export const isAcceptedByDFA = (dfa: DFA, word: string, print: boolean = false) : boolean => {
    const state = runWordOnDFA(dfa, word, print);

    if (state !== undefined && isAcceptingState(dfa, state)){
        if (print)
            console.log("ACCEPTED");
        return true;
    }

    if (print)
        console.log("REJECTED");

    return false;
}

/**
 * Run a word on an NFA.
 * @param nfa a NFA.
 * @param word a word to test on the NFA.
 * @param initState a state to begin with, by default it's the NFA's initial state.
 * @returns The state on ehich the words stops/end, or undefined if it got stuck.
 */
export const runWordOnNFA = (nfa: NFA, word: string, print: boolean = false, initState: AState = nfa.initialState, pastConfigurations: AConfiguration[] = []) : AState | undefined =>
    {
        if (word.length === 0 && isAcceptingState(nfa, initState)){
            if (print)
                console.log(`${initState.name} ${word}`);

            return initState;
        }

        const chars = word.split('');
        
        if (!isSubArray(nfa.alphabet, chars, sameCharacter))
            throw new Error("illegal characters in the word");

        const nextStates = nfa.transitions
            .filter(t => sameState(initState, t.src) && word[0] === t.char);

        const nonEpsilon = nextStates.reduce((end: AState | undefined, curr: ATransition) => {
            // try each one if the previous weren't successful
            if (end === undefined || nfa.acceptingStates.findIndex(st => sameState(st, end)) === -1){
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

        const epsilon = nextStatesEpsilon.reduce((end: AState | undefined, curr: ATransition) => {
            // detected a loop
            if (pastConfigurations.filter(c => c.word === word && c.state === curr.src).length > 0)
                return undefined;

            // try each one if the previous weren't successful
            if (end === undefined || nfa.acceptingStates.findIndex(st => sameState(st, end)) === -1){
                if (print)
                    console.log(`${curr.src.name} ${word}`);

                return runWordOnNFA(nfa, word, print, curr.dest, pastConfigurations.concat([makeAConfiguration(word, curr.src)]));
            }


            return end;
        }, undefined);

        return epsilon;
    }

/**
 * Check if a word is accepted in a NFA.
 * @param nfa a NFA.
 * @param word a word to test on the NFA.
 * @returns true iff the word is accepted in the NFA, false otherwise.
 */
export const isAcceptedByNFA = (nfa: NFA, word: string, print: boolean = false) : boolean => {
    const state = runWordOnNFA(nfa, word, print);

    if (state !== undefined && isAcceptingState(nfa, state)){
        if (print)
            console.log("ACCEPTED");
        return true;
    }

    if (print)
        console.log("REJECTED");

    return false;
}

export const isAcceptingState = (fa: DFA | NFA, state: AState) : boolean =>
    fa.acceptingStates.findIndex(s => sameState(s, state)) > -1;

export const getPathOnNFA = (nfa: NFA, word: string, initState: AState = nfa.initialState, pastConfigurations: AConfiguration[] = []) : AState[] =>
    {
        // empty word in an accepting state - just accept
        if (word.length === 0 && isAcceptingState(nfa, initState))
            return [initState];

        // check word validity

        const chars = word.split('');
        
        if (!isSubArray(nfa.alphabet, chars, sameCharacter))
            throw new Error("illegal characters in the word");

        // next states that are accessible via a non-epsilon transition

        const nextStates = nfa.transitions
            .filter(t => sameState(initState, t.src) && word[0] === t.char);

        const nonEpsilon = nextStates.reduce((path: AState[], curr: ATransition) => {
            // try each one if the previous weren't successful

            // last path was empty or ended in a non-accepting state
            if (path.length === 0 || !isAcceptingState(nfa, path[path.length - 1]))
                // create a list starting in this path and continues in the run on the rest of the word
                return [curr.src].concat(getPathOnNFA(nfa, word.slice(1), curr.dest, [makeAConfiguration(word, curr.src)]));
            
            // the path is accepting so no need to search anymore
            return path;
        }, []);

        // if the overall path is accepting, stop
        if (nonEpsilon.length > 0 && isAcceptingState(nfa, nonEpsilon[nonEpsilon.length - 1]))
            return nonEpsilon;

        // else try epsilon transitions

        const nextStatesEpsilon = nfa.transitions
            .filter(t => sameState(initState, t.src) && t.char === '');

        const epsilon = nextStatesEpsilon.reduce((path: AState[], curr: ATransition) => {
            // detected a loop
            if (pastConfigurations.filter(c => c.word === word && c.state === curr.src).length > 0)
                return [];

            // try each one if the previous weren't successful
            if (path.length === 0 || !isAcceptingState(nfa, path[path.length - 1]))
                return [curr.src].concat(getPathOnNFA(nfa, word, curr.dest, pastConfigurations.concat([makeAConfiguration(word, curr.src)])));

            return path;
        }, []);

        return epsilon;
    }
