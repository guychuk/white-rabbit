import { DFA, NFA } from "./automaton/automaton";
import { generateAutomaton, generateWord, valueToCleanArray } from "./web/automata-util";
import * as Drawer from "./web/automata-drawer";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;

const randomAutomatonButton = document.getElementById("random-automaton") as HTMLButtonElement;
const submitAutomatonButton = document.getElementById("submit") as HTMLButtonElement;
const randomWordButton = document.getElementById("random-word") as HTMLButtonElement;
const runButton = document.getElementById("run") as HTMLButtonElement;
const resetButton = document.getElementById("reset") as HTMLButtonElement;

const determinismCheckbox = document.getElementById("determinism") as HTMLInputElement;
const delayTextBox = document.getElementById("delay") as HTMLInputElement;

const inputAlphabet = document.getElementById("alphabet") as HTMLTextAreaElement;
const inputStates = document.getElementById("states") as HTMLTextAreaElement;
const inputAcceptingStates = document.getElementById("acceptingStates") as HTMLTextAreaElement;
const inputInitialState = document.getElementById("initialState") as HTMLTextAreaElement;
const inputTransitions = document.getElementById("transitions") as HTMLTextAreaElement;
const inputWord = document.getElementById("word") as HTMLTextAreaElement;

const outputError = document.getElementById("error") as HTMLOutputElement;
const outputNoErrors = document.getElementById("no-errors") as HTMLOutputElement;
const outputAccepted = document.getElementById("good-result") as HTMLOutputElement;
const outputRejected = document.getElementById("bad-result") as HTMLOutputElement;

var currentAutomaton: NFA | undefined = undefined;
var statesPositions: Map<string, {x: number, y: number}> | undefined = undefined;

let sleepTimeoutId: ReturnType<typeof setTimeout> | undefined;

function resetDisplay(){
    outputError.style.display = "none";
    outputAccepted.style.display = "none";
    outputRejected.style.display = "none";
    outputNoErrors.style.display = "block";
    Drawer.clearCanvas(canvas);
}

function resetClick(){
    if (sleepTimeoutId !== undefined) {
        clearTimeout(sleepTimeoutId);
        sleepTimeoutId = undefined;
    }

    resetDisplay();
    inputAlphabet.value = "";
    inputStates.value = "";
    inputAcceptingStates.value = "";
    inputInitialState.value = "";
    inputTransitions.value = "";
    inputWord.value = "";
    currentAutomaton = undefined;
    statesPositions = undefined;
}

function writeCurrentAutomaton(){
    if (currentAutomaton === undefined){
        throw new Error("no automaton to write");
    }

    inputAlphabet.value = [...currentAutomaton.alphabet].join(", ");
    inputStates.value = [...currentAutomaton.states].join(", ");
    inputAcceptingStates.value = [...currentAutomaton.acceptingStates].join(", ");
    inputInitialState.value = currentAutomaton.initialState;

    const transitionsStrings: string[] = [];

    for (const [source, transitions] of currentAutomaton.transitions){
        for (const [char, destinations] of transitions){
            for (const destination of destinations){
                transitionsStrings.push(`${source}, ${char}, ${destination}`);
            }
        }
    }

    inputTransitions.value = transitionsStrings.join(" / ");
}

function readAutomaton() : NFA {
    const alphabet = valueToCleanArray(inputAlphabet.value, ",");
    const states = valueToCleanArray(inputStates.value, ",");
    const acceptingStates = valueToCleanArray(inputAcceptingStates.value, ",");
    const initialState = inputInitialState.value.trim();
    const transitions = valueToCleanArray(inputTransitions.value, "/").map(transition => transition.split(","));

    if (determinismCheckbox.checked)
        return DFA.create(alphabet, states, acceptingStates, initialState, transitions);
    else
        return NFA.create(alphabet, states, acceptingStates, initialState, transitions);
}

function submitAutomatonClick() {
    resetDisplay();

    try{
        currentAutomaton = readAutomaton();
        statesPositions = Drawer.drawAutomaton(canvas, currentAutomaton);
    } catch(e){
        outputError.value = (e instanceof Error) ? e.message : "unknown error";
        outputError.style.display = "block";    // show errors
        outputNoErrors.style.display = "none"; 
        currentAutomaton = undefined;
        statesPositions = undefined;
    } finally {
        inputWord.value = "";
    }
}

function randomAutomatonClick(){
    resetDisplay();

    currentAutomaton = generateAutomaton(determinismCheckbox.checked);

    writeCurrentAutomaton();

    statesPositions = Drawer.drawAutomaton(canvas, currentAutomaton);

    inputWord.value = "";
}

function randomWordClick(){
    const alphabet = valueToCleanArray(inputAlphabet.value, ",");

    inputWord.value = generateWord(alphabet);
}

function sleep(ms: number) {
    return new Promise(resolve => {
        sleepTimeoutId = setTimeout(resolve, ms);
    });
}

async function runWordClick(){
    // const sleep = (t: number) => new Promise(resolve => setTimeout(resolve, delay));
    const input = inputWord.value.trim();

    submitAutomatonClick();

    if (currentAutomaton === undefined || statesPositions === undefined){
        return;
    }

    const delay = parseInt(delayTextBox.value); // ms

    var pos = statesPositions.get(currentAutomaton.initialState);

    if (pos === undefined){
        throw new Error("cannot find initial state's position");
    }

    inputWord.value = input;

    const it = currentAutomaton.iteratorForWord(input);

    // color the initial state
    Drawer.drawState(canvas, "blue", pos.x, pos.y, currentAutomaton.initialState, currentAutomaton);

    await sleep(delay);

    while (!it.next().done) {
        // draw the automata again

        Drawer.clearCanvas(canvas);
        Drawer.drawAutomaton(canvas, currentAutomaton);
        
        // color the current states
        for (const state of it.getStates()){
            pos = statesPositions.get(state);

            if (pos === undefined){
                throw new Error("cannot find state's position");
            }

            Drawer.drawState(canvas, "red", pos.x, pos.y, state, currentAutomaton);
        }

        await sleep(delay);
    } 

    // leave only accepting states colored

    Drawer.clearCanvas(canvas);
    Drawer.drawAutomaton(canvas, currentAutomaton);

    var accepted: boolean = false;
        
    for (const state of it.getStates()){
        if (currentAutomaton.acceptingStates.has(state)){
            pos = statesPositions.get(state);

            if (pos === undefined){
                throw new Error("cannot find state's position");
            }

            accepted = true;
            Drawer.drawState(canvas, "green", pos.x, pos.y, state, currentAutomaton);
        }
    }

    if (accepted){
        outputAccepted.style.display = 'block';
    } else {
        outputRejected.style.display = 'block';
    }
}

randomAutomatonButton.addEventListener("click", randomAutomatonClick);
submitAutomatonButton.addEventListener("click", submitAutomatonClick);
randomWordButton.addEventListener("click", randomWordClick);
runButton.addEventListener("click", runWordClick);
resetButton.addEventListener("click", resetClick);
