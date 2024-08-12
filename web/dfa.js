// inputs
import { makeAState, makeDFA } from "../typescript/automata.js";
const alphabetIn = document.getElementById("alphabet-in");
const statesIn = document.getElementById("states-in");
const acceptingIn = document.getElementById("accepting-in");
const initialIn = document.getElementById("initial-in");
const submitButton = document.getElementById("submit-button");
const errorOut = document.getElementById("error-out");
const dfaOut = document.getElementById("dfa-out");
function printDFA() {
    const alphabetVal = alphabetIn.value;
    const statesVal = statesIn.value;
    const acceptingVal = acceptingIn.value;
    const initialVal = initialIn.value;
    const alphabet = alphabetVal.length === 0 ? [] : alphabetVal.split(',').map(char => char.trim());
    const states = statesVal.length === 0 ? [] : statesVal.split(',').map(stateName => makeAState(stateName.trim()));
    const acceptingStates = acceptingVal.length === 0 ? [] : acceptingVal.split(',').map(stateName => makeAState(stateName.trim()));
    const initialState = initialVal.length === 0 ? undefined : makeAState(initialVal.trim());
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
