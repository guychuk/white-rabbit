import { Alphabet, AState, makeAState, makeDFA, makeATransition, ATransition, DFA, sameTransition } from "../typescript/automata.js"
import { drawAutomata } from "./fa-drawer.js"
import { removeDuplicates } from "../typescript/helpers.js";

const alphabetTA  = document.getElementById("alphabet-in") as HTMLTextAreaElement;
const statesTA = document.getElementById("states-in") as HTMLTextAreaElement;
const acceptingTA = document.getElementById("accepting-in") as HTMLTextAreaElement;
const initialTA = document.getElementById("initial-in") as HTMLTextAreaElement;
const transitionsTA = document.getElementById("transitions-in") as HTMLTextAreaElement;

/**
 * Create a DFA from the given input.
 * @throws Error with a message when failing.
 * @returns a DFA object.
 */
function createDFA(): DFA {
    const alphabet: Alphabet = alphabetTA.value.length === 0 ? [] : alphabetTA.value.split(',').map(char => char.trim());
    const states: AState[] = statesTA.value.length === 0 ? [] : statesTA.value.split(',').map(stateName => makeAState(stateName.trim()));
    const acceptingStates: AState[] = acceptingTA.value.length === 0 ? [] : acceptingTA.value.split(',').map(stateName => makeAState(stateName.trim()));
    const initialState: AState | undefined = initialTA.value.length === 0 ? undefined : makeAState(initialTA.value.trim());
    const transitions: ATransition[] = transitionsTA.value.replace(/\s+/g, "").length === 0 ? [] :
        transitionsTA.value.replace(/\s+/g, "").split('/').map(transition => {
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
    const canvas = document.getElementById("dfa-canv") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    errorOut.textContent = "";

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    try {
        const dfa = createDFA();
        drawAutomata(dfa, canvas, ctx);
    } catch (error) {
        errorOut.textContent = (error instanceof Error) ? error.message.toUpperCase() : "unknown error";
    }
}

function randomDFA() : void {
    const generateNum = (lower: number, upper: number) : number => 
        Math.floor(lower + Math.random() * (upper - lower + 1));

    var allLetters = "abcdefghijklmnopqrstuvwxyz";

    const alphabet: Alphabet = Array.from({length: generateNum(1, allLetters.length)}, () => {
        const index = generateNum(0, allLetters.length - 1);
        const char = allLetters[index];
        
        allLetters = allLetters.replace(char, '');

        return char;
    });

    alphabetTA.value = alphabet.join(",");

    const states: AState[] = Array.from({ length: generateNum(1, 8) }, (_, k) => makeAState("q" + k));

    statesTA.value = states.map(s => s.name).join(",");

    const acceptingStates: AState[] = states.filter(_ => 0.5 <= Math.random());

    acceptingTA.value = acceptingStates.map(s => s.name).join(",");

    const initialState: AState = states[generateNum(0, states.length - 1)];

    initialTA.value = initialState.name;

    const transitions: ATransition[] = Array.from({length: generateNum(0, Math.pow(states.length, 2) - 1)}, () => 
        makeATransition(
            states[generateNum(0, states.length - 1)], 
            alphabet[generateNum(0, alphabet.length - 1)], 
            states[generateNum(0, states.length - 1)]));

    const transitionSet: ATransition[] = removeDuplicates(transitions, (f, s) => f.src === s.src && f.char === s.char);

    transitionsTA.value = transitionSet.map(t => `${t.src.name},${t.char},${t.dest.name}`).join(" / ");

    const errorOut = document.getElementById("error-out") as HTMLOutputElement;
    const canvas = document.getElementById("dfa-canv") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    errorOut.textContent = "";

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    try {
        const dfa = makeDFA(alphabet, states, acceptingStates, initialState, transitionSet);
        drawAutomata(dfa, canvas, ctx);
    } catch (error) {
        errorOut.textContent = (error instanceof Error) ? error.message.toUpperCase() : "unknown error";
    }
}

const submitButton = document.getElementById("submit-button") as HTMLButtonElement;
const randomButton = document.getElementById("random-button") as HTMLButtonElement;

submitButton.addEventListener("click", submit);
randomButton.addEventListener("click", randomDFA);
