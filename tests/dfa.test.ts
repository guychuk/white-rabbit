import * as automata from "../automata";
import * as helpers from "../helpers";

describe("Modulo DFAs", () => {
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

    it("should accept strings iff #a in them is divisible by 7", () => {
        const states = Array.from({ length: 7 }, (_, i) => automata.makeAState("q" + i));

        const alphabet = automata.makeAlphabet("ab");

        const transitions = states.map((curr, index) => 
            automata.makeATransition("a", curr, states[(index + 1) % 7]));

        const dfa = automata.makeDFA(alphabet, states, [states[0]], states[0], transitions);

        for (var count = 0; count < 100; count++){
            const word = 'a'.repeat(count);

            expect(automata.runWordOnDFA(dfa, word)).toBe(count % 7 === 0);
        }
    });
});

describe("Counting", () => {
    it("should count different characters within the last 2", () => {
        const s = automata.makeAState("s");
        const q0 = automata.makeAState("q0");
        const q1 = automata.makeAState("q1");
        const q00 = automata.makeAState("q00");
        const q01 = automata.makeAState("q01");
        const q10 = automata.makeAState("q10");
        const q11 = automata.makeAState("q11");
        const c1 = automata.makeAState("c1");
        const c2 = automata.makeAState("c2");
        const qacc = automata.makeAState("qacc");

        const alphabet = automata.makeAlphabet("012#");

        const dfa = automata.makeDFA(
            alphabet, [s, q0, q1, q00, q01, q10, q11, c1, c2, qacc], [qacc], s, [
                automata.makeATransition('0', s, q0),
                automata.makeATransition('1', s, q1),

                automata.makeATransition('0', q0, q00),
                automata.makeATransition('1', q0, q01),

                automata.makeATransition('0', q1, q10),
                automata.makeATransition('1', q1, q11),

                automata.makeATransition('0', q00, q00),
                automata.makeATransition('1', q00, q01),
                automata.makeATransition('#', q00, c1),

                automata.makeATransition('0', q11, q10),
                automata.makeATransition('1', q11, q11),
                automata.makeATransition('#', q11, c1),

                automata.makeATransition('0', q01, q10),
                automata.makeATransition('1', q01, q11),
                automata.makeATransition('#', q01, c2),

                automata.makeATransition('0', q10, q00),
                automata.makeATransition('1', q10, q01),
                automata.makeATransition('#', q10, c2),

                automata.makeATransition('1', c1, qacc),
                automata.makeATransition('2', c2, qacc)
            ]
        );

        // accept
        ["000#1", "00#1", "10#2", "010#2", "110011001#2", "000111000111#1"]
            .forEach(word => expect(automata.runWordOnDFA(dfa, word)).toBeTruthy());

        // reject
        ["", "#2", "11#2", "000#2", "11#", "00#01#2", "00001#1"]
            .forEach(word => expect(automata.runWordOnDFA(dfa, word)).toBeFalsy());
    });

    it("should count different characters in a string up to 2", () => {
        const s = automata.makeAState("s");
        const q0 = automata.makeAState("q0");
        const q1 = automata.makeAState("q1");
        const q01 = automata.makeAState("q01");
        const c0 = automata.makeAState("c0");
        const c1 = automata.makeAState("c1");
        const c2 = automata.makeAState("c2");
        const qacc = automata.makeAState("qacc");

        const alphabet = automata.makeAlphabet("012#");

        const dfa = automata.makeDFA(
            alphabet, [s, q0, q1, q01, c0, c1, c2, qacc], [qacc], s, [
                automata.makeATransition('0', s, q0),
                automata.makeATransition('1', s, q1),
                automata.makeATransition('#', s, c0),
                automata.makeATransition('0', q0, q0),
                automata.makeATransition('1', q0, q01),
                automata.makeATransition('#', q0, c1),
                automata.makeATransition('1', q1, q1),
                automata.makeATransition('0', q1, q01),
                automata.makeATransition('#', q1, c1),
                automata.makeATransition('0', q01, q01),
                automata.makeATransition('1', q01, q01),
                automata.makeATransition('#', q01, c2),
                automata.makeATransition('0', c0, qacc),
                automata.makeATransition('1', c1, qacc),
                automata.makeATransition('2', c2, qacc)
            ]
        );

        // acccept
        ["#0", "0#1", "1#1", "000#1", "11#1", "0001#2", "0001110001#2"]
            .forEach(word => expect(automata.runWordOnDFA(dfa, word)).toBeTruthy());

        // reject
        ["", "#2", "1#0", "000#2", "11#0", "00#01#2", "00001#"]
            .forEach(word => expect(automata.runWordOnDFA(dfa, word)).toBeFalsy());
    });
});
