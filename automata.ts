import { isSubArray, checkDuplicates } from "./helpers";

export type Character = string;

export type Alphabet = Character[];

export const makeAlphabet = (alphabet: string) => alphabet.split('');

/**
 * An automata state.
 */
export type AState = { tag: "AState"; name: string };

/**
 * An automata transition.
 */
export type ATransition = {
    tag: "ATransition";
    read: Character;
    src: AState;
    dest: AState;
};

export type DFA = {
    tag: "DFA";
    alphabet: Alphabet;
    states: AState[];
    acceptingStates: AState[];
    initialState: AState;
    transitions: ATransition[];
}

export const makeAState = (name: string): AState => ({ tag: "AState", name: name });

export const makeATransition = (read: Character, src: AState, dest: AState): ATransition =>
    ({ tag: "ATransition", read: read, src: src, dest: dest });

export const makeDFA = (alphabet: Alphabet, states: AState[],
    acceptingStates: AState[], initialState: AState,
    transitions: ATransition[]) : DFA => {
    
    if (alphabet.length === 0)
        throw new Error("empty alphabet");

    if (checkDuplicates(alphabet, (s1, s2) => s1 === s2))
        throw new Error("repeated characters in alphabet");

    if (states.length === 0)
        throw new Error("empty list of states");

    if (checkDuplicates(states, sameState))
        throw new Error("repeated states");

    if (acceptingStates.length === 0)
        throw new Error("empty list of accepting states");

    if (checkDuplicates(acceptingStates, sameState))
        throw new Error("repeated accepting states");

    if (!isSubArray(states, acceptingStates))
        throw new Error("accepting states is not a subset of all states");

    if (states.indexOf(initialState) === -1)
        throw new Error("initial state is not in the list of states");

    if (checkDuplicates(transitions, sameTransition))
        throw new Error("repeated transitions");

    const allRead: Character[] = transitions.map(t => t.read);

    const allSrc: AState[] = transitions.map(t => t.src);

    const allDest: AState[] = transitions.map(t => t.dest);

    if (!isSubArray(alphabet, allRead))
        throw new Error("some transitions are from invalid characters");

    if (!isSubArray(states, allSrc))
        throw new Error("some sources are not in the list of states");

    if (!isSubArray(states, allDest))
        throw new Error("some destinations are not in the list of states");

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

export const sameTransition = (ft: ATransition, st: ATransition) : boolean =>
    ft.src === st.src && ft.dest === st.dest && ft.read === st.read;

export const sameState = (fs: AState, ss: AState) : boolean => fs.name === ss.name;

/**
 * for each transition, check that there is no other transition from
 * the same state using the same character.
 * @param transitions transition function.
 * @returns true if the list of transition is deterministic.
 */
const isDetermenistic = (transitions: ATransition[]): boolean =>
    transitions.reduce((acc: boolean, curr) =>
        acc && // haven't found non determinism
        transitions.reduce((innerAcc: boolean, innerCurr) =>
            innerAcc && // haven't found non determinism
            (innerCurr.src !== curr.src || innerCurr.read !== curr.read || innerCurr.dest === curr.dest),
            true), true);

export const runWordOnDFA = (dfa: DFA, word: string) : boolean =>
{
    const arr = word.split('');

    const dummy: AState = makeAState("dummy");

    if (!isSubArray(dfa.alphabet, arr))
        throw new Error("illegal characters in the word");

    const s = arr.reduce((acc: AState, char, index) : AState => {
        if (index === arr.length)
            return acc;

        if (acc == dummy)
            return dummy;

        const next = dfa.transitions.filter(t => 
            sameState(t.src, acc) && t.read === char);
        
        // this should result in an empty array or in an array of one element 
        // due to determinism

        return next.length === 0 ? dummy : next[0].dest;
    }, dfa.initialState);

    return dfa.acceptingStates.indexOf(s) > -1;
}
