import { generateAutomaton } from "./automata-util";

const randomAutomatonButton = document.getElementById("random-button") as HTMLButtonElement;

function randomAutomatonClick(){
    const nfa = generateAutomaton(false);

    console.log(nfa);
}

randomAutomatonButton.addEventListener("click", randomAutomatonClick);
