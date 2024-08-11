import * as at from '../automata'

describe("DFA Test", () => {
    describe("Valid DFAs", () => {
        // DFAs from https://www.javatpoint.com/examples-of-deterministic-finite-automata

        it ("should accept those string which starts with 1 and ends with 0", () => {
            const states = ["q0", "q1", "q2"].map(state => at.makeAState(state));
            const transitions = [
                at.makeATransition(states[0], "1", states[1]),
                at.makeATransition(states[1], "0", states[2]),
                at.makeATransition(states[1], "1", states[1]),
                at.makeATransition(states[2], "0", states[2]),
                at.makeATransition(states[2], "1", states[1])
            ]
            const alphabet = at.makeAlphabet("01");
            const dfa = at.makeDFA(alphabet, states, [states[2]], states[0], transitions);

            expect(at.isAcceptedByDFA(dfa, "")).toBeFalsy();
            expect(at.isAcceptedByDFA(dfa, "0")).toBeFalsy();
            expect(at.isAcceptedByDFA(dfa, "1")).toBeFalsy();
            expect(at.isAcceptedByDFA(dfa, "01")).toBeFalsy();
            expect(at.isAcceptedByDFA(dfa, "10")).toBeTruthy();
            expect(at.isAcceptedByDFA(dfa, "11")).toBeFalsy();
            expect(at.isAcceptedByDFA(dfa, "100")).toBeTruthy();
            expect(at.isAcceptedByDFA(dfa, "101")).toBeFalsy();
            expect(at.isAcceptedByDFA(dfa, "110")).toBeTruthy();
            expect(at.isAcceptedByDFA(dfa, "111")).toBeFalsy();
        });

        it ("should accept the only input 101", () => {
            const states = ["q0", "q1", "q2", "q3"].map(state => at.makeAState(state));
            const transitions = [
                at.makeATransition(states[0], "1", states[1]),
                at.makeATransition(states[1], "0", states[2]),
                at.makeATransition(states[2], "1", states[3])
            ]
            const alphabet = at.makeAlphabet("01");
            const dfa = at.makeDFA(alphabet, states, [states[3]], states[0], transitions);

            expect(at.isAcceptedByDFA(dfa, "")).toBeFalsy();
            expect(at.isAcceptedByDFA(dfa, "0")).toBeFalsy();
            expect(at.isAcceptedByDFA(dfa, "1")).toBeFalsy();
            expect(at.isAcceptedByDFA(dfa, "01")).toBeFalsy();
            expect(at.isAcceptedByDFA(dfa, "10")).toBeFalsy();
            expect(at.isAcceptedByDFA(dfa, "11")).toBeFalsy();
            expect(at.isAcceptedByDFA(dfa, "100")).toBeFalsy();
            expect(at.isAcceptedByDFA(dfa, "101")).toBeTruthy();
            expect(at.isAcceptedByDFA(dfa, "110")).toBeFalsy();
            expect(at.isAcceptedByDFA(dfa, "111")).toBeFalsy();
        });

        it ("should accept even number of 0's and even number of 1's", () => {
            const states = ["q0", "q1", "q2", "q3"].map(state => at.makeAState(state));
            const transitions = [
                at.makeATransition(states[0], "0", states[1]),
                at.makeATransition(states[0], "1", states[3]),
                at.makeATransition(states[1], "0", states[0]),
                at.makeATransition(states[1], "1", states[2]),
                at.makeATransition(states[2], "0", states[3]),
                at.makeATransition(states[2], "1", states[1]),
                at.makeATransition(states[3], "0", states[2]),
                at.makeATransition(states[3], "1", states[0])
            ]
            const alphabet = at.makeAlphabet("01");
            const dfa = at.makeDFA(alphabet, states, [states[0]], states[0], transitions);

            expect(at.isAcceptedByDFA(dfa, "")).toBeTruthy();
            expect(at.isAcceptedByDFA(dfa, "0")).toBeFalsy();
            expect(at.isAcceptedByDFA(dfa, "1")).toBeFalsy();
            expect(at.isAcceptedByDFA(dfa, "01")).toBeFalsy();
            expect(at.isAcceptedByDFA(dfa, "10")).toBeFalsy();
            expect(at.isAcceptedByDFA(dfa, "11")).toBeTruthy();
            expect(at.isAcceptedByDFA(dfa, "100")).toBeFalsy();
            expect(at.isAcceptedByDFA(dfa, "101")).toBeFalsy();
            expect(at.isAcceptedByDFA(dfa, "110")).toBeFalsy();
            expect(at.isAcceptedByDFA(dfa, "111")).toBeFalsy();
            expect(at.isAcceptedByDFA(dfa, "1000")).toBeFalsy();
            expect(at.isAcceptedByDFA(dfa, "1001")).toBeTruthy();
            expect(at.isAcceptedByDFA(dfa, "1010")).toBeTruthy();
            expect(at.isAcceptedByDFA(dfa, "1011")).toBeFalsy();
            expect(at.isAcceptedByDFA(dfa, "1100")).toBeTruthy();
            expect(at.isAcceptedByDFA(dfa, "1101")).toBeFalsy();
            expect(at.isAcceptedByDFA(dfa, "1110")).toBeFalsy();
            expect(at.isAcceptedByDFA(dfa, "1111")).toBeTruthy();
        });

        it ("should accept the set of all strings with three consecutive 0's", () => {
            const states = ["q0", "q1", "q2", "q3"].map(state => at.makeAState(state));
            const transitions = [
                at.makeATransition(states[0], "0", states[1]),
                at.makeATransition(states[0], "1", states[0]),
                at.makeATransition(states[1], "0", states[2]),
                at.makeATransition(states[2], "0", states[3]),
                at.makeATransition(states[3], "0", states[1]),
                at.makeATransition(states[3], "1", states[3])
            ]
            const alphabet = at.makeAlphabet("01");
            const dfa = at.makeDFA(alphabet, states, [states[3]], states[0], transitions);

            expect(at.isAcceptedByDFA(dfa, "")).toBeFalsy();
            expect(at.isAcceptedByDFA(dfa, "0")).toBeFalsy();
            expect(at.isAcceptedByDFA(dfa, "10")).toBeFalsy();
            expect(at.isAcceptedByDFA(dfa, "100")).toBeFalsy();
            expect(at.isAcceptedByDFA(dfa, "1000")).toBeTruthy();
            expect(at.isAcceptedByDFA(dfa, "1001")).toBeFalsy();
            expect(at.isAcceptedByDFA(dfa, "10000")).toBeFalsy();
            expect(at.isAcceptedByDFA(dfa, "10001")).toBeTruthy();
            expect(at.isAcceptedByDFA(dfa, "10010")).toBeFalsy();
            expect(at.isAcceptedByDFA(dfa, "10011")).toBeFalsy();
            expect(at.isAcceptedByDFA(dfa, "10100")).toBeFalsy();
            expect(at.isAcceptedByDFA(dfa, "11000")).toBeTruthy();
        });

        it ("should accept the strings with an even number of 0's followed by single 1", () => {
            const states = ["q0", "q1", "q2"].map(state => at.makeAState(state));
            const transitions = [
                at.makeATransition(states[0], "0", states[1]),
                at.makeATransition(states[0], "1", states[2]),
                at.makeATransition(states[1], "0", states[0])
            ]
            const alphabet = at.makeAlphabet("01");
            const dfa = at.makeDFA(alphabet, states, [states[2]], states[0], transitions);

            expect(at.isAcceptedByDFA(dfa, "")).toBeFalsy();
            expect(at.isAcceptedByDFA(dfa, "1")).toBeTruthy();
            expect(at.isAcceptedByDFA(dfa, "000")).toBeFalsy();
            expect(at.isAcceptedByDFA(dfa, "001")).toBeTruthy();
            expect(at.isAcceptedByDFA(dfa, "010")).toBeFalsy();
            expect(at.isAcceptedByDFA(dfa, "011")).toBeFalsy();
            expect(at.isAcceptedByDFA(dfa, "100")).toBeFalsy();
            expect(at.isAcceptedByDFA(dfa, "101")).toBeFalsy();
            expect(at.isAcceptedByDFA(dfa, "110")).toBeFalsy();
            expect(at.isAcceptedByDFA(dfa, "111")).toBeFalsy();
            expect(at.isAcceptedByDFA(dfa, "1000")).toBeFalsy();
            expect(at.isAcceptedByDFA(dfa, "1001")).toBeFalsy();
            expect(at.isAcceptedByDFA(dfa, "00001")).toBeTruthy();
        });
    });

    describe("Invalid DFAs", () => {

        it ("should throw an error about non-determinism", () => {
            const states = ["q0", "q1"].map(state => at.makeAState(state));
            const transitions = [
                at.makeATransition(states[0], "1", states[1]),
                at.makeATransition(states[1], "0", states[0]),
                at.makeATransition(states[1], "0", states[1])
            ]
            const alphabet = at.makeAlphabet("01");

            expect(() => {
                at.makeDFA(alphabet, states, [states[0]], states[0], transitions);
            }).toThrow("non-deterministic transition function");
        });

        it ("should throw an error epsilon transition (illegal character)", () => {
            const states = ["q0", "q1"].map(state => at.makeAState(state));
            const transitions = [
                at.makeATransition(states[0], "1", states[1]),
                at.makeATransition(states[1], "", states[1])
            ]
            const alphabet = at.makeAlphabet("01");

            expect(() => {
                at.makeDFA(alphabet, states, [states[0]], states[0], transitions);
            }).toThrow("some transitions are from invalid characters");
        });
    });
});

describe("NFA Test", () => {
    describe("Valid NFAs", () => {
        describe("No epsilon transitions", () => {
            // DFAs from https://www.javatpoint.com/examples-of-non-deterministic-finite-automata

            it ("should accept all string ending with 01", () => {
                const states = ["q0", "q1", "q2"].map(state => at.makeAState(state));
                const transitions = [
                    at.makeATransition(states[0], "0", states[0]),
                    at.makeATransition(states[0], "0", states[1]),
                    at.makeATransition(states[0], "1", states[0]),
                    at.makeATransition(states[1], "1", states[2])
                ]
                const alphabet = at.makeAlphabet("01");
                const nfa = at.makeNFA(alphabet, states, [states[2]], states[0], transitions);

                expect(at.isAcceptedByNFA(nfa, "")).toBeFalsy();
                expect(at.isAcceptedByNFA(nfa, "0")).toBeFalsy();
                expect(at.isAcceptedByNFA(nfa, "1")).toBeFalsy();
                expect(at.isAcceptedByNFA(nfa, "01")).toBeTruthy();
                expect(at.isAcceptedByNFA(nfa, "10")).toBeFalsy();
                expect(at.isAcceptedByNFA(nfa, "11")).toBeFalsy();
                expect(at.isAcceptedByNFA(nfa, "100")).toBeFalsy();
                expect(at.isAcceptedByNFA(nfa, "101")).toBeTruthy();
                expect(at.isAcceptedByNFA(nfa, "110")).toBeFalsy();
                expect(at.isAcceptedByNFA(nfa, "111")).toBeFalsy();
            });

            it ("should accept strings in which double '1' is followed by double '0'", () => {
                const states = ["q0", "q1", "q2", "q3", "q4"].map(state => at.makeAState(state));
                const transitions = [
                    at.makeATransition(states[0], "0", states[0]),
                    at.makeATransition(states[0], "1", states[0]),
                    at.makeATransition(states[0], "1", states[1]),
                    at.makeATransition(states[1], "1", states[2]),
                    at.makeATransition(states[2], "0", states[3]),
                    at.makeATransition(states[3], "0", states[4]),
                    at.makeATransition(states[4], "0", states[4]),
                    at.makeATransition(states[4], "1", states[4])
                ]
                const alphabet = at.makeAlphabet("01");
                const nfa = at.makeNFA(alphabet, states, [states[4]], states[0], transitions);

                expect(at.isAcceptedByNFA(nfa, "")).toBeFalsy();
                expect(at.isAcceptedByNFA(nfa, "0")).toBeFalsy();
                expect(at.isAcceptedByNFA(nfa, "10")).toBeFalsy();
                expect(at.isAcceptedByNFA(nfa, "11")).toBeFalsy();
                expect(at.isAcceptedByNFA(nfa, "100")).toBeFalsy();
                expect(at.isAcceptedByNFA(nfa, "110")).toBeFalsy();
                expect(at.isAcceptedByNFA(nfa, "1100")).toBeTruthy();
                expect(at.isAcceptedByNFA(nfa, "110011")).toBeTruthy();
                expect(at.isAcceptedByNFA(nfa, "11001100")).toBeTruthy();
                expect(at.isAcceptedByNFA(nfa, "01100011")).toBeTruthy();
                expect(at.isAcceptedByNFA(nfa, "01100110")).toBeTruthy();
                expect(at.isAcceptedByNFA(nfa, "01110110")).toBeFalsy();
            });

            it ("should accept all the string contain a substring 1110", () => {
                const states = ["q0", "q1", "q2", "q3", "q4"].map(state => at.makeAState(state));
                const transitions = [
                    at.makeATransition(states[0], "0", states[0]),
                    at.makeATransition(states[0], "1", states[0]),
                    at.makeATransition(states[0], "1", states[1]),
                    at.makeATransition(states[1], "1", states[2]),
                    at.makeATransition(states[2], "1", states[3]),
                    at.makeATransition(states[3], "0", states[4]),
                    at.makeATransition(states[4], "0", states[4]),
                    at.makeATransition(states[4], "1", states[4])
                ]
                const alphabet = at.makeAlphabet("01");
                const nfa = at.makeNFA(alphabet, states, [states[4]], states[0], transitions);

                expect(at.isAcceptedByNFA(nfa, "")).toBeFalsy();
                expect(at.isAcceptedByNFA(nfa, "0")).toBeFalsy();
                expect(at.isAcceptedByNFA(nfa, "1")).toBeFalsy();
                expect(at.isAcceptedByNFA(nfa, "10")).toBeFalsy();
                expect(at.isAcceptedByNFA(nfa, "11")).toBeFalsy();
                expect(at.isAcceptedByNFA(nfa, "111")).toBeFalsy();
                expect(at.isAcceptedByNFA(nfa, "1000")).toBeFalsy();
                expect(at.isAcceptedByNFA(nfa, "1110")).toBeTruthy();
                expect(at.isAcceptedByNFA(nfa, "101110")).toBeTruthy();
                expect(at.isAcceptedByNFA(nfa, "1011")).toBeFalsy();
                expect(at.isAcceptedByNFA(nfa, "1100")).toBeFalsy();
                expect(at.isAcceptedByNFA(nfa, "1101")).toBeFalsy();
                expect(at.isAcceptedByNFA(nfa, "01110")).toBeTruthy();
            });

            it ("should accept all string in which the third symbol from the right end is always 0", () => {
                const states = ["q0", "q1", "q2", "q3"].map(state => at.makeAState(state));
                const transitions = [
                    at.makeATransition(states[0], "0", states[0]),
                    at.makeATransition(states[0], "1", states[0]),
                    at.makeATransition(states[0], "0", states[1]),
                    at.makeATransition(states[1], "0", states[2]),
                    at.makeATransition(states[1], "1", states[2]),
                    at.makeATransition(states[2], "0", states[3]),
                    at.makeATransition(states[2], "1", states[3])
                ]
                const alphabet = at.makeAlphabet("01");
                const nfa = at.makeNFA(alphabet, states, [states[3]], states[0], transitions);

                expect(at.isAcceptedByNFA(nfa, "")).toBeFalsy();
                expect(at.isAcceptedByNFA(nfa, "0")).toBeFalsy();
                expect(at.isAcceptedByNFA(nfa, "10")).toBeFalsy();
                expect(at.isAcceptedByNFA(nfa, "100")).toBeFalsy();
                expect(at.isAcceptedByNFA(nfa, "1000")).toBeTruthy();
                expect(at.isAcceptedByNFA(nfa, "1001")).toBeTruthy();
                expect(at.isAcceptedByNFA(nfa, "1010")).toBeTruthy();
                expect(at.isAcceptedByNFA(nfa, "1011")).toBeTruthy();
                expect(at.isAcceptedByNFA(nfa, "1100")).toBeFalsy();
                expect(at.isAcceptedByNFA(nfa, "1101")).toBeFalsy();
                expect(at.isAcceptedByNFA(nfa, "1110")).toBeFalsy();
                expect(at.isAcceptedByNFA(nfa, "1111")).toBeFalsy();
            });
        });

        describe("With epsilon transitions", () => {
            it ("should accept all strings of the form 0^k where k is a multiple of 2 or 3", () => {
                const states = ["q0", "q1", "q2", "q3", "q4", "q5"].map(state => at.makeAState(state));
                const transitions = [
                    at.makeATransition(states[0], "", states[1]),
                    at.makeATransition(states[0], "", states[3]),
                    at.makeATransition(states[1], "0", states[2]),
                    at.makeATransition(states[2], "0", states[1]),
                    at.makeATransition(states[3], "0", states[4]),
                    at.makeATransition(states[4], "0", states[5]),
                    at.makeATransition(states[5], "0", states[3])
                ]
                const alphabet = at.makeAlphabet("0");
                const nfa = at.makeNFA(alphabet, states, [states[1], states[3]], states[0], transitions);

                expect(at.isAcceptedByNFA(nfa, "")).toBeTruthy();
                expect(at.isAcceptedByNFA(nfa, "0")).toBeFalsy();
                expect(at.isAcceptedByNFA(nfa, "00")).toBeTruthy();
                expect(at.isAcceptedByNFA(nfa, "000")).toBeTruthy();
                expect(at.isAcceptedByNFA(nfa, "0000")).toBeTruthy();
                expect(at.isAcceptedByNFA(nfa, "00000")).toBeFalsy();
                expect(at.isAcceptedByNFA(nfa, "000000")).toBeTruthy();
                expect(at.isAcceptedByNFA(nfa, "0000000")).toBeFalsy();
                expect(at.isAcceptedByNFA(nfa, "00000000")).toBeTruthy();
                expect(at.isAcceptedByNFA(nfa, "000000000")).toBeTruthy();
                expect(at.isAcceptedByNFA(nfa, "0000000000")).toBeTruthy();
            });

            it ("should accept all strings of the form a+", () => {
                const states = ["q0", "q1", "q2", "q3"].map(state => at.makeAState(state));
                const transitions = [
                    at.makeATransition(states[0], "", states[1]),
                    at.makeATransition(states[1], "a", states[2]),
                    at.makeATransition(states[2], "", states[1]),
                    at.makeATransition(states[2], "", states[3])
                ]
                const alphabet = at.makeAlphabet("ab");
                const nfa = at.makeNFA(alphabet, states, [states[3]], states[0], transitions);

                expect(at.isAcceptedByNFA(nfa, "")).toBeFalsy();
                expect(at.isAcceptedByNFA(nfa, "a")).toBeTruthy();
                expect(at.isAcceptedByNFA(nfa, "aa")).toBeTruthy();
                expect(at.isAcceptedByNFA(nfa, "aaa")).toBeTruthy();
                expect(at.isAcceptedByNFA(nfa, "aaaa")).toBeTruthy();
                expect(at.isAcceptedByNFA(nfa, "aaaab")).toBeFalsy();
                expect(at.isAcceptedByNFA(nfa, "aaaaaa")).toBeTruthy();
                expect(at.isAcceptedByNFA(nfa, "bbbbbbb")).toBeFalsy();
            });
            it ("should accept all strings of the form a* and it has epsilon transitions everywhere", () => {
                const states = ["q0", "q1"].map(state => at.makeAState(state));
                const transitions = [
                    at.makeATransition(states[0], "", states[1]),
                    at.makeATransition(states[0], "a", states[1]),
                    at.makeATransition(states[1], "", states[0])
                ]
                const alphabet = at.makeAlphabet("ab");
                const nfa = at.makeNFA(alphabet, states, [states[1]], states[0], transitions);

                expect(at.isAcceptedByNFA(nfa, "")).toBeTruthy();
                expect(at.isAcceptedByNFA(nfa, "a")).toBeTruthy();
                expect(at.isAcceptedByNFA(nfa, "aa")).toBeTruthy();
                expect(at.isAcceptedByNFA(nfa, "aaa")).toBeTruthy();
                expect(at.isAcceptedByNFA(nfa, "aaaa")).toBeTruthy();
                expect(at.isAcceptedByNFA(nfa, "aaaab")).toBeFalsy();
                expect(at.isAcceptedByNFA(nfa, "aaaaaa")).toBeTruthy();
                expect(at.isAcceptedByNFA(nfa, "bbbbbbb")).toBeFalsy();
            });

            it ("should accept all strings of the form (ab)*", () => {
                const states = ["q0", "q1", "q2"].map(state => at.makeAState(state));
                const transitions = [
                    at.makeATransition(states[0], "a", states[1]),
                    at.makeATransition(states[1], "b", states[2]),
                    at.makeATransition(states[2], "", states[0])
                ]
                const alphabet = at.makeAlphabet("ab");
                const nfa = at.makeNFA(alphabet, states, [states[0]], states[0], transitions);

                expect(at.isAcceptedByNFA(nfa, "")).toBeTruthy();
                expect(at.isAcceptedByNFA(nfa, "a")).toBeFalsy();
                expect(at.isAcceptedByNFA(nfa, "aa")).toBeFalsy();
                expect(at.isAcceptedByNFA(nfa, "aab")).toBeFalsy();
                expect(at.isAcceptedByNFA(nfa, "abab")).toBeTruthy();
                expect(at.isAcceptedByNFA(nfa, "ab")).toBeTruthy();
                expect(at.isAcceptedByNFA(nfa, "ababaa")).toBeFalsy();
                expect(at.isAcceptedByNFA(nfa, "ababab")).toBeTruthy();
            });
        });
    });

    describe("Invalid NFAs", () => {
        it ("should throw an error about repeating character", () => {
            const states = ["q0", "q1"].map(state => at.makeAState(state));
            const transitions = [
                at.makeATransition(states[0], "1", states[1]),
                at.makeATransition(states[1], "0", states[2]),
            ]
            const alphabet = at.makeAlphabet("011");

            expect(() => {
                at.makeNFA(alphabet, states, [states[0]], states[0], transitions);
            }).toThrow("repeated characters in alphabet");
        });

        it ("should throw an error about repeating accepting states", () => {
            const states = ["q0", "q1"].map(state => at.makeAState(state));
            const transitions = [
                at.makeATransition(states[0], "1", states[1]),
                at.makeATransition(states[1], "0", states[2]),
            ]
            const alphabet = at.makeAlphabet("01");

            expect(() => {
                at.makeNFA(alphabet, states, [states[0], states[0]], states[0], transitions);
            }).toThrow("repeated accepting states");
        });
    });
});
