import { NFA, DFA } from "../automaton/automaton"
import { randomInteger, randomElements } from "../automaton/util";

export function generateAutomaton(deterministic: boolean) : NFA{
    const letterPool = "abcdefghijklmnopqrstuvwxyz";

    const alphabet: string[] = randomElements(letterPool, randomInteger(1, letterPool.length));

    const states: string[] = Array.from({ length: randomInteger(1, 8) }, (_, k) => "q" + k);

    const acceptingStates: string[] = randomElements(states, randomInteger(0, states.length));

    const initialState: string = randomElements(states, 1)[0];

    const transitions: string[][] = Array.from({ length: randomInteger(0, states.length * states.length / 2) }, (_) => [
        randomElements(states, 1)[0], randomElements(alphabet.concat(['']), 1)[0], randomElements(states, 1)[0]
    ]);

    if (deterministic){
        const noEpsilonTransitions = transitions.filter(transition => transition[1] !== '');

        const noDuplicates = noEpsilonTransitions.filter((transition, index) => 
            noEpsilonTransitions.findIndex(other => transition[0] === other[0] && transition[1] === other[1]) === index
        );

        return DFA.create(alphabet, states, acceptingStates, initialState, noDuplicates);
    }

    return NFA.create(alphabet, states, acceptingStates, initialState, transitions);
}

export function generateWord(alphabet: string[]) : string {
    return Array.from({ length: randomInteger(0, 10) }, () => randomElements(alphabet, 1)).join('');
}

export function valueToCleanArray(value: string, separator: string) : string[]{
    const clear = value.replace(/\s+/g, "");

    return clear.length === 0 ? [] : clear.split(separator);
}
