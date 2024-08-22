import { NFA, DFA } from "../../src/automaton";

const randomInteger = (lower: number, upper: number) : number =>
    Math.floor(lower + Math.random() * (upper - lower + 1));

const flipCoin = (p: number) : boolean => Math.random() <= p;

function randomElements<T>(population: Iterable<T>, count: number) : T[] {
    const arr = Array.from(population);
    const chosens: T[] = [];
    var current;

    while (chosens.length < count && arr.length > 0){
        current = randomInteger(0, arr.length - 1);
        chosens.push(arr[current]);
        arr.splice(current, 1);
    }

    return chosens;
}

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
