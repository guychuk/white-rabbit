import { Alphabet, AState, makeAState, makeDFA, makeATransition, ATransition, DFA } from "../typescript/automata.js"
import { drawAutomata } from "./fa-drawer.js"

/**
 * Create a DFA from the given input.
 * @throws Error with a message when failing.
 * @returns a DFA object.
 */
function createDFA(): DFA {
    const alphabetVal = (document.getElementById("alphabet-in") as HTMLTextAreaElement).value;
    const statesVal = (document.getElementById("states-in") as HTMLTextAreaElement).value;
    const acceptingVal = (document.getElementById("accepting-in") as HTMLTextAreaElement).value;
    const initialVal = (document.getElementById("initial-in") as HTMLTextAreaElement).value;
    const transitionsVal = (document.getElementById("transitions-in") as HTMLTextAreaElement).value.replace(/\s+/g, "");

    const alphabet: Alphabet = alphabetVal.length === 0 ? [] : alphabetVal.split(',').map(char => char.trim());
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

    return makeDFA(alphabet, states, acceptingStates, initialState, transitions);
}

function submit(): void {
    const errorOut = document.getElementById("error-out") as HTMLOutputElement;
    const dfaOut = document.getElementById("dfa-out") as HTMLOutputElement;
    const canvas = document.getElementById("dfa-canv") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    dfaOut.textContent = "";
    errorOut.textContent = "";

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    try {
        const dfa = createDFA();
        dfaOut.textContent = JSON.stringify(dfa);
        drawAutomata(dfa, canvas, ctx);
    } catch (error) {
        errorOut.textContent = (error instanceof Error) ? error.message.toUpperCase() : "unknown error";
    }
}

const submitButton = document.getElementById("submit-button") as HTMLButtonElement;

submitButton.addEventListener("click", submit);
