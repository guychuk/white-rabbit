// inputs

import { Alphabet, AState, makeAState, makeDFA } from "../typescript/automata.js"

const alphabetIn = document.getElementById("alphabet-in") as HTMLInputElement;
const statesIn = document.getElementById("states-in") as HTMLInputElement;
const acceptingIn = document.getElementById("accepting-in") as HTMLInputElement;
const initialIn = document.getElementById("initial-in") as HTMLInputElement;

const submitButton = document.getElementById("submit-button") as HTMLButtonElement;

const errorOut = document.getElementById("error-out") as HTMLOutputElement;
const dfaOut = document.getElementById("dfa-out") as HTMLOutputElement;

function printDFA() : void {
    const alphabetVal = alphabetIn.value;
    const statesVal = statesIn.value;
    const acceptingVal = acceptingIn.value;
    const initialVal = initialIn.value;

    const alphabet : Alphabet = alphabetVal.length === 0 ? [] : alphabetVal.split(',').map(char => char.trim());
    const states: AState[] = statesVal.length === 0 ? [] : statesVal.split(',').map(stateName => makeAState(stateName.trim()));
    const acceptingStates: AState[] = acceptingVal.length === 0 ? [] : acceptingVal.split(',').map(stateName => makeAState(stateName.trim()));
    const initialState: AState | undefined = initialVal.length === 0 ? undefined : makeAState(initialVal.trim());

    try {
        if (initialState === undefined)
            throw new Error("DFA must have an initial state");

        const dfa = makeDFA(alphabet, states, acceptingStates, initialState, []);
        
        dfaOut.textContent = JSON.stringify(dfa);
        errorOut.textContent = "";
    }
    catch (error) {
        if (error instanceof Error)
            errorOut.textContent = error.message;
        else
            errorOut.textContent = "unknown error";
    }
}


submitButton.addEventListener("click", printDFA);
