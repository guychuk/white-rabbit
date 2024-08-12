import { Alphabet, AState, makeAState, makeDFA, makeATransition, ATransition } from "../typescript/automata.js"

const alphabetIn = document.getElementById("alphabet-in") as HTMLTextAreaElement;
const statesIn = document.getElementById("states-in") as HTMLTextAreaElement;
const acceptingIn = document.getElementById("accepting-in") as HTMLTextAreaElement;
const initialIn = document.getElementById("initial-in") as HTMLTextAreaElement;
const transitionsIn = document.getElementById("transitions-in") as HTMLTextAreaElement;

const submitButton = document.getElementById("submit-button") as HTMLButtonElement;

const errorOut = document.getElementById("error-out") as HTMLOutputElement;
const dfaOut = document.getElementById("dfa-out") as HTMLOutputElement;

function printDFA() : void {
    try {
        const alphabetVal = alphabetIn.value;
        const statesVal = statesIn.value;
        const acceptingVal = acceptingIn.value;
        const initialVal = initialIn.value;
        const transitionsVal = transitionsIn.value.replace(/\s+/g, "");

        const alphabet : Alphabet = alphabetVal.length === 0 ? [] : alphabetVal.split(',').map(char => char.trim());
        const states: AState[] = statesVal.length === 0 ? [] : statesVal.split(',').map(stateName => makeAState(stateName.trim()));
        const acceptingStates: AState[] = acceptingVal.length === 0 ? [] : acceptingVal.split(',').map(stateName => makeAState(stateName.trim()));
        const initialState: AState | undefined = initialVal.length === 0 ? undefined : makeAState(initialVal.trim());
        const transitions: ATransition[] = transitionsVal.length === 0 ? [] :
            transitionsVal.split('/').map(transition => {
                const args = transition.split(',');

                if (args.length !== 3)
                    throw new Error("illegal transition [" + transition + "]");

                return makeATransition(makeAState(args[0]), args[1], makeAState(args[2]));
            });

        if (initialState === undefined)
            throw new Error("DFA must have an initial state");

        const dfa = makeDFA(alphabet, states, acceptingStates, initialState, transitions);

        dfaOut.textContent = JSON.stringify(dfa);
        errorOut.textContent = "";
    }
    catch (error) {
        if (error instanceof Error)
            errorOut.textContent = error.message;
        else
            errorOut.textContent = "unknown error";

            dfaOut.textContent = ""
    }
}


submitButton.addEventListener("click", printDFA);
