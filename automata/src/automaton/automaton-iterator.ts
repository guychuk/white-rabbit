import { Configuration, NFA, makeConfiguration } from "./automaton";


export class AutomatonIterator implements IterableIterator<Set<Configuration>> {
    private automaton: NFA;
    private currentConfigurations: Set<Configuration>;
    private visitedConfigurations: Set<Configuration>;
    private word: string[];
    private done: boolean;

    constructor(word: string[], automaton: NFA, initialState?: string) {
        if (word.some(char => !automaton.alphabet.has(char))) {
            throw new Error("invalid characters");
        }

        this.automaton = automaton;

        if (initialState === undefined) {
            this.currentConfigurations = new Set([makeConfiguration(automaton.initialState, word)]);
        }
        else if (!automaton.states.has(initialState)) {
            throw new Error("initial state is not in the states set");
        }
        else {
            this.currentConfigurations = new Set([makeConfiguration(initialState, word)]);
        }

        this.word = word;
        this.done = false;
        this.visitedConfigurations = new Set<Configuration>();
    }

    [Symbol.iterator](): IterableIterator<Set<Configuration>> {
        return this;
    }

    next(): IteratorResult<Set<Configuration>, any> {
        if (this.done || this.currentConfigurations.size === 0){
            this.done = true;
            return { value: this.currentConfigurations, done: this.done };
        }

        const nextConfigurations = new Set<Configuration>();
        const acceptingConfigurations = new Set<Configuration>();

        for (let configuration of this.currentConfigurations){
            if (configuration.word.length === 0 && this.automaton.acceptingStates.has(configuration.state)){
                acceptingConfigurations.add(configuration);
                continue;   // we'll be done after the loop
            }

            // epsilon transitions
            this.automaton.transitions.get(configuration.state)?.get('')?.
                forEach(dest => {
                    if (Array.from(this.visitedConfigurations).
                            every(conf => conf.state !== dest || conf.word !== configuration.word)){
                        // add iff not already visited!
                        nextConfigurations.add(makeConfiguration(dest, configuration.word));
                        this.visitedConfigurations.add(makeConfiguration(dest, configuration.word));
                    }
                });

            if (configuration.word.length > 0){
                // non-epsilon transitions
                this.automaton.transitions.get(configuration.state)?.get(configuration.word[0])?.
                    forEach(dest => {
                        if (Array.from(this.visitedConfigurations).
                                every(conf => conf.state !== dest || conf.word !== configuration.word.slice(1))){
                            nextConfigurations.add(makeConfiguration(dest, configuration.word.slice(1)));
                            this.visitedConfigurations.add(makeConfiguration(dest, configuration.word.slice(1)));
                        }
                    });
            }
        }

        this.done = acceptingConfigurations.size > 0;

        if (!this.done){
            this.currentConfigurations = nextConfigurations;
        }

        return { value: this.currentConfigurations, done: this.done };
    }

    return?(value?: any): IteratorResult<Set<Configuration>, any> {
        this.clear();

        return { value: value, done: true };
    }

    throw?(e?: any): IteratorResult<Set<Configuration>, any> {
        this.clear();

        throw new Error(e);
    }

    getWord() : string[] { return this.word.slice(); };

    getConfigurations() : Set<Configuration> { return new Set(this.currentConfigurations); };

    getStates() : Set<string> { 
        const states = new Set<string>();

        this.currentConfigurations.forEach(configuration => states.add(configuration.state));

        return states;
    };

    private clear(){
        this.word = [];
        this.done = true;
        this.currentConfigurations.clear();
    }
}
