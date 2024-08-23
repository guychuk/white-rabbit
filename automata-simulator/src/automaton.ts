import { isSubset } from "./util";
import { AutomatonIterator } from "./automaton-iterator";


export type Configuration = { state: string; word: string[] };

export const makeConfiguration = (state: string, word: string[]) : Configuration => ({ state: state, word: word });

export class NFA {
    alphabet: Set<string>;
    states: Set<string>;    // a set of states names
    acceptingStates: Set<string>;
    initialState: string;
    transitions: Map<string, Map<string, Set<string>>>; // state -> (char -> next states)

    constructor(alphabet: Set<string>, states: Set<string>,
        acceptigStates: Set<string>, initialState: string,
        transitions: Map<string, Map<string, Set<string>>>) {

        this.alphabet = alphabet;
        this.states = states;
        this.acceptingStates = acceptigStates;
        this.initialState = initialState;
        this.transitions = transitions;


        if (this.alphabet.size === 0){
            throw new Error("the alphabet must not be empty");
        }

        if (this.isDeterministic() && alphabet.has('')){
            throw new Error("epsilon transitions are not allowed in a DFA");
        }

        if (this.states.size === 0){
            throw new Error("the set of states must not be empty");
        }

        if (!isSubset(acceptigStates, states)) {
            throw new Error("accepting states set is not a subset of the states set");
        }

        if (!states.has(initialState)) {
            throw new Error("initial state set is not in the states set");
        }

        if (!this.transitionsAreValid()) {
            throw new Error("transition function is not valid");
        }
    }

    static create(alphabet: string | string[], states: string[], acceptigStates: string[], initialState: string, transitions: string[][]){
        var transitionsMap = new Map<string, Map<string, Set<string>>>(); 

        for (let transition of transitions){
            if (transition.length != 3){
                throw new Error("invalid transition");
            }

            const [src, char, dest] = transition;

            const current = transitionsMap.get(src);

            if (current !== undefined){
                const transitionsSet = current.get(char);

                if (transitionsSet !== undefined){
                    transitionsSet.add(dest);
                } else {
                    current.set(char, new Set([dest]));
                }
            } else {
                transitionsMap.set(src, new Map([[char, new Set([dest])]]));
            }
        }
        
        return new this(new Set(alphabet), new Set(states), new Set(acceptigStates), initialState, transitionsMap);
    }

    isDeterministic(): boolean { return false; };

    iteratorForWord(word: string | string[]) : AutomatonIterator {
        return new AutomatonIterator(typeof word === "string" ? word.split('') : word, this);
    }

    acceptsWord(word: string | string[]){
        const it = this.iteratorForWord(word);

        var result = it.next();

        while(!result.done) { 
            result = it.next();
        }

        const val: Set<Configuration> = result.value;

        return val.size > 0;
    }

    /**
     * Check if the transitions are valid.
     * @returns true if the trasitions are valid.
     */
    private transitionsAreValid(): boolean {
        for (let [source, transitions] of this.transitions) {
            // source state is in the set of states
            if (!this.states.has(source)) {
                return false;
            }

            for (let [char, destinations] of transitions) {
                if (this.isDeterministic() && destinations.size > 1) {
                    return false;
                }

                if (!this.alphabet.has(char) && (this.isDeterministic() || char !== '')) {
                    return false
                }

                for (let destination of destinations) {
                    // destination is a state in the set of states
                    if (!this.states.has(destination)) {
                        return false;
                    }
                }
            }
        }

        return true;
    }
};

export class DFA extends NFA {
    override isDeterministic(): boolean { return true; }
}

