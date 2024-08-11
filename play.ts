import * as automata from "./automata"
import * as helpers from "./helpers";

const q0 = automata.makeAState("q0")
const q1 = automata.makeAState("q1")
const q2 = automata.makeAState("q2")
const q3 = automata.makeAState("q3")
const q4 = automata.makeAState("q4")

const nfa = automata.makeNFA(automata.makeAlphabet("ab"), [q0, q1, q2, q3, q4], [q3], q0, [
    automata.makeATransition("b", q0, q1),
    automata.makeATransition("b", q0, q2),
    automata.makeATransition("a", q1, q3),
    automata.makeATransition("b", q2, q1),
    automata.makeATransition("b", q2, q3),
    automata.makeATransition("b", q2, q4)
]);

console.log(automata.isAcceptedByNFA(nfa, "a"))
console.log(automata.isAcceptedByNFA(nfa, "ba"))
console.log(automata.isAcceptedByNFA(nfa, "bba"))
console.log(automata.isAcceptedByNFA(nfa, "bbba"))
console.log(automata.isAcceptedByNFA(nfa, "bbb"))
console.log(automata.isAcceptedByNFA(nfa, "bb"))
