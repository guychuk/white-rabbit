import { Alphabet, AState, makeAState, makeDFA, makeATransition, ATransition, DFA, runWordOnDFA, isAcceptingState } from "../typescript/automata.js"
import { colorState, drawAutomata } from "./fa-drawer.js"
import { removeDuplicates } from "../typescript/helpers.js";

const alphabetTA  = document.getElementById("alphabet-in") as HTMLTextAreaElement;
const statesTA = document.getElementById("states-in") as HTMLTextAreaElement;
const acceptingTA = document.getElementById("accepting-in") as HTMLTextAreaElement;
const initialTA = document.getElementById("initial-in") as HTMLTextAreaElement;
const transitionsTA = document.getElementById("transitions-in") as HTMLTextAreaElement;
const inputTA = document.getElementById("input-in") as HTMLTextAreaElement;
const errorOut = document.getElementById("error-out") as HTMLOutputElement;
const delayIN = document.getElementById("delay") as HTMLInputElement;
const canvas = document.getElementById("dfa-canv") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

const acceptedColor = "green", rejectedColor = "red", midColor = "blue";

const clearCanvas = () => ctx.clearRect(0, 0, canvas.width, canvas.height);

const reset = () => {
    errorOut.textContent = "";
    clearCanvas(); 
};

const generateNum = (lower: number, upper: number) : number => 
    Math.floor(lower + Math.random() * (upper - lower + 1));

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

/**
 * Read the DFA from the textboxes and draw it.
 */
function submit(): void {    
    reset();

    try {
        const dfa = createDFA();
        drawAutomata(dfa, canvas, ctx);
    } catch (error) {
        errorOut.textContent = (error instanceof Error) ? error.message.toUpperCase() : "unknown error";
    }
}

/**
 * Generate a random DFA and draw it.
 */
function randomDFA() : void {
    var allLetters = "abcdefghijklmnopqrstuvwxyz";

    const alphabet: Alphabet = Array.from({length: generateNum(1, allLetters.length)}, () => {
        const index = generateNum(0, allLetters.length - 1);
        const char = allLetters[index];
        
        allLetters = allLetters.replace(char, '');

        return char;
    });

    const states: AState[] = Array.from({ length: generateNum(1, 8) }, (_, k) => makeAState("q" + k));

    const acceptingStates: AState[] = states.filter(_ => 0.5 <= Math.random());

    const initialState: AState = states[generateNum(0, states.length - 1)];

    const transitions: ATransition[] = Array.from({length: generateNum(0, Math.pow(states.length, 2) - 1)}, () => 
        makeATransition(
            states[generateNum(0, states.length - 1)], 
            alphabet[generateNum(0, alphabet.length - 1)], 
            states[generateNum(0, states.length - 1)]));

    const transitionSet: ATransition[] = removeDuplicates(transitions, (f, s) => f.src === s.src && f.char === s.char);

    reset();

    try {
        const dfa = makeDFA(alphabet, states, acceptingStates, initialState, transitionSet);

        drawAutomata(dfa, canvas, ctx);

        alphabetTA.value = alphabet.join(",");
        statesTA.value = states.map(s => s.name).join(",");
        acceptingTA.value = acceptingStates.map(s => s.name).join(",");
        initialTA.value = initialState.name;
        transitionsTA.value = transitionSet.map(t => `${t.src.name},${t.char},${t.dest.name}`).join(" / ");
    } catch (error) {
        errorOut.textContent = (error instanceof Error) ? error.message.toUpperCase() : "unknown error";
    }
}

function randomWord() {
    const alphabet: Alphabet = alphabetTA.value.length === 0 ? [] : 
        alphabetTA.value.split(',').map(char => char.trim());
    
    inputTA.value = Array.from({length: generateNum(0, 10)}, () => 
        alphabet[generateNum(0, alphabet.length - 1)]).join("");
}

function runInputOnDFANoDelay() : void {
    reset();

    try {
        const dfa = createDFA();

        const word = inputTA.value.trim();
        
        const endState = runWordOnDFA(dfa, word);

        drawAutomata(dfa, canvas, ctx);

        if (endState === undefined)
            errorOut.textContent = "The word got stuck";
        else if (isAcceptingState(dfa, endState))
            colorState(canvas, ctx, acceptedColor, endState, dfa);
        else
            colorState(canvas, ctx, rejectedColor, endState, dfa);

    } catch (error) {
        errorOut.textContent = (error instanceof Error) ? error.message.toUpperCase() : "unknown error";
    }
}

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function runStepByStepInputOnDFA() {
    const time = parseInt(delayIN.value);

    if (time === 0){
        runInputOnDFANoDelay();
        return;
    }

    reset();

    try {
        const dfa = createDFA();
        const word = inputTA.value.trim();

        drawAutomata(dfa, canvas, ctx);

        var state = dfa.initialState;
        var doneGood = true;

        // color the initial state

        colorState(canvas, ctx, midColor, state, dfa);
        await sleep(time);

        for (const char of word)
        {
            clearCanvas();
            drawAutomata(dfa, canvas, ctx);

            colorState(canvas, ctx, "black", state, dfa);

            const endState = runWordOnDFA(dfa, char, false, state);

            if (endState === undefined){
                errorOut.textContent = "The word got stuck";
                doneGood = false;
                break;
            }
            
            colorState(canvas, ctx, midColor, endState, dfa);
            await sleep(time);
            state = endState;
        }

        clearCanvas();
        drawAutomata(dfa, canvas, ctx);

        if (doneGood){
            if (isAcceptingState(dfa, state))
                colorState(canvas, ctx, acceptedColor, state, dfa);
            else
                colorState(canvas, ctx, rejectedColor, state, dfa);
        }

    } catch (error) {
        errorOut.textContent = (error instanceof Error) ? error.message.toUpperCase() : "unknown error";
    }
}

const submitButton = document.getElementById("submit-button") as HTMLButtonElement;
const randomButton = document.getElementById("random-button") as HTMLButtonElement;
const runButton = document.getElementById("run-button") as HTMLButtonElement;
const randWordButton = document.getElementById("randword-button") as HTMLButtonElement;

submitButton.addEventListener("click", submit);
randomButton.addEventListener("click", randomDFA);
runButton.addEventListener("click", runStepByStepInputOnDFA);
randWordButton.addEventListener("click", randomWord);
