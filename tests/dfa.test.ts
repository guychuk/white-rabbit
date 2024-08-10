import * as automata from "../automata";
import * as helpers from "../helpers";

describe("DFA for {#a % 3 = 0}", () => {
    it("should accept strings iff #a in them is divisible by 3", () => {
        const q0 = automata.makeAState("q0");
        const q1 = automata.makeAState("q1");
        const q2 = automata.makeAState("q2");

        const alphabet = automata.makeAlphabet("a");

        const dfa = automata.makeDFA(alphabet, [q0, q1, q2], [q0], q0, [
            automata.makeATransition('a', q0, q1),
            automata.makeATransition('a', q1, q2),
            automata.makeATransition('a', q2, q0)
        ])

        for (var count = 0; count < 100; count++){
            const word = 'a'.repeat(count);

            expect(automata.runWordOnDFA(dfa, word)).toBe(count % 3 === 0);
        }
    });
});
