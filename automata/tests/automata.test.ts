import { NFA, DFA } from "../src/automaton/automaton"

describe("DFA Test", () => {
    describe("Valid DFAs", () => {
        // DFAs from https://www.javatpoint.com/examples-of-deterministic-finite-automata

        it ("should accept those string which starts with 1 and ends with 0", () => {
            const automaton = DFA.create("01", ["q0", "q1", "q2"], ["q2"], "q0", [
                ["q0", '1', "q1"],
                ["q1", '0', "q2"],
                ["q1", '1', "q1"],
                ["q2", '0', "q2"],
                ["q2", '1', "q1"]
            ]);

            expect(automaton.acceptsWord("")).toBeFalsy();
            expect(automaton.acceptsWord("0")).toBeFalsy();
            expect(automaton.acceptsWord("1")).toBeFalsy();
            expect(automaton.acceptsWord("10")).toBeTruthy();
            expect(automaton.acceptsWord("11")).toBeFalsy();
            expect(automaton.acceptsWord("100")).toBeTruthy();
            expect(automaton.acceptsWord("101")).toBeFalsy();
            expect(automaton.acceptsWord("110")).toBeTruthy();
            expect(automaton.acceptsWord("111")).toBeFalsy();
        });

        it ("should accept the only input 101", () => {
            const automaton = DFA.create("01", ["q0", "q1", "q2", "q3"], ["q3"], "q0", [
                ["q0", '1', "q1"],
                ["q1", '0', "q2"],
                ["q2", '1', "q3"]
            ]);

            expect(automaton.acceptsWord("")).toBeFalsy();
            expect(automaton.acceptsWord("0")).toBeFalsy();
            expect(automaton.acceptsWord("1")).toBeFalsy();
            expect(automaton.acceptsWord("01")).toBeFalsy();
            expect(automaton.acceptsWord("10")).toBeFalsy();
            expect(automaton.acceptsWord("11")).toBeFalsy();
            expect(automaton.acceptsWord("100")).toBeFalsy();
            expect(automaton.acceptsWord("101")).toBeTruthy();
            expect(automaton.acceptsWord("110")).toBeFalsy();
            expect(automaton.acceptsWord("111")).toBeFalsy();
        });

        it ("should accept even number of 0's and even number of 1's", () => {
            const automaton = DFA.create("01", ["q0", "q1", "q2", "q3"], ["q0"], "q0", [
                ["q0", '0', "q1"],
                ["q0", '1', "q3"],
                ["q1", '0', "q0"],
                ["q1", '1', "q2"],
                ["q2", '0', "q3"],
                ["q2", '1', "q1"],
                ["q3", '0', "q2"],
                ["q3", '1', "q0"]
            ]);

            expect(automaton.acceptsWord("")).toBeTruthy();
            expect(automaton.acceptsWord("0")).toBeFalsy();
            expect(automaton.acceptsWord("1")).toBeFalsy();
            expect(automaton.acceptsWord("01")).toBeFalsy();
            expect(automaton.acceptsWord("10")).toBeFalsy();
            expect(automaton.acceptsWord("11")).toBeTruthy();
            expect(automaton.acceptsWord("100")).toBeFalsy();
            expect(automaton.acceptsWord("101")).toBeFalsy();
            expect(automaton.acceptsWord("110")).toBeFalsy();
            expect(automaton.acceptsWord("111")).toBeFalsy();
            expect(automaton.acceptsWord("1000")).toBeFalsy();
            expect(automaton.acceptsWord("1001")).toBeTruthy();
            expect(automaton.acceptsWord("1010")).toBeTruthy();
            expect(automaton.acceptsWord("1011")).toBeFalsy();
            expect(automaton.acceptsWord("1100")).toBeTruthy();
            expect(automaton.acceptsWord("1101")).toBeFalsy();
            expect(automaton.acceptsWord("1110")).toBeFalsy();
            expect(automaton.acceptsWord("1111")).toBeTruthy();
        });

        it ("should accept the set of all strings with three consecutive 0's", () => {
            const automaton = DFA.create("01", ["q0", "q1", "q2", "q3"], ["q3"], "q0", [
                ["q0", '0', "q1"],
                ["q0", '1', "q0"],
                ["q1", '0', "q2"],
                ["q2", '0', "q3"],
                ["q3", '0', "q1"],
                ["q3", '1', "q3"]
            ]);

            expect(automaton.acceptsWord("")).toBeFalsy();
            expect(automaton.acceptsWord("0")).toBeFalsy();
            expect(automaton.acceptsWord("10")).toBeFalsy();
            expect(automaton.acceptsWord("100")).toBeFalsy();
            expect(automaton.acceptsWord("1000")).toBeTruthy();
            expect(automaton.acceptsWord("1001")).toBeFalsy();
            expect(automaton.acceptsWord("10000")).toBeFalsy();
            expect(automaton.acceptsWord("10001")).toBeTruthy();
            expect(automaton.acceptsWord("10010")).toBeFalsy();
            expect(automaton.acceptsWord("10011")).toBeFalsy();
            expect(automaton.acceptsWord("10100")).toBeFalsy();
            expect(automaton.acceptsWord("11000")).toBeTruthy();
        });

        it ("should accept the strings with an even number of 0's followed by single 1", () => {
            const automaton = DFA.create("01", ["q0", "q1", "q2"], ["q2"], "q0", [
                ["q0", '0', "q1"],
                ["q0", '1', "q2"],
                ["q1", '0', "q0"]
            ]);

            expect(automaton.acceptsWord("")).toBeFalsy();
            expect(automaton.acceptsWord("1")).toBeTruthy();
            expect(automaton.acceptsWord("000")).toBeFalsy();
            expect(automaton.acceptsWord("001")).toBeTruthy();
            expect(automaton.acceptsWord("010")).toBeFalsy();
            expect(automaton.acceptsWord("011")).toBeFalsy();
            expect(automaton.acceptsWord("100")).toBeFalsy();
            expect(automaton.acceptsWord("101")).toBeFalsy();
            expect(automaton.acceptsWord("110")).toBeFalsy();
            expect(automaton.acceptsWord("111")).toBeFalsy();
            expect(automaton.acceptsWord("1000")).toBeFalsy();
            expect(automaton.acceptsWord("1001")).toBeFalsy();
            expect(automaton.acceptsWord("00001")).toBeTruthy();
        });
    });

    describe("Invalid DFAs", () => {

        it ("should throw an error about non-determinism", () => {
            expect(() => {
                const automaton = DFA.create("01", ["q0", "q1"], ["q0"], "q0", [
                    ["q0", '1', "q1"],
                    ["q1", '0', "q0"],
                    ["q1", '0', "q1"]
                ]);
            }).toThrow();
        });

        it ("should throw an error epsilon transition (illegal character)", () => {
            expect(() => {
                const automaton = DFA.create("01", ["q0", "q1"], ["q0"], "q0", [
                    ["q0", '1', "q1"],
                    ["q1", '', "q1"]
                ]);
            }).toThrow();
        });
    });
});

describe("NFA Test", () => {
    describe("Valid NFAs", () => {
        describe("No epsilon transitions", () => {
            // NFAs from https://www.javatpoint.com/examples-of-non-deterministic-finite-automata

            it ("should accept all string ending with 01", () => {
                const automaton = NFA.create("01", ["q0", "q1", "q2"], ["q2"], "q0", [
                    ["q0", '0', "q0"],
                    ["q0", '0', "q1"],
                    ["q0", '1', "q0"],
                    ["q1", '1', "q2"]
                ]);

                expect(automaton.acceptsWord("")).toBeFalsy();
                expect(automaton.acceptsWord("0")).toBeFalsy();
                expect(automaton.acceptsWord("1")).toBeFalsy();
                expect(automaton.acceptsWord("01")).toBeTruthy();
                expect(automaton.acceptsWord("10")).toBeFalsy();
                expect(automaton.acceptsWord("11")).toBeFalsy();
                expect(automaton.acceptsWord("100")).toBeFalsy();
                expect(automaton.acceptsWord("101")).toBeTruthy();
                expect(automaton.acceptsWord("110")).toBeFalsy();
                expect(automaton.acceptsWord("111")).toBeFalsy();
            });

            it ("should accept strings in which double '1' is followed by double '0'", () => {
                const automaton = NFA.create("01", ["q0", "q1", "q2", "q3", "q4"], ["q4"], "q0", [
                    ["q0", '0', "q0"],
                    ["q0", '1', "q0"],
                    ["q0", '1', "q1"],
                    ["q1", '1', "q2"],
                    ["q2", '0', "q3"],
                    ["q3", '0', "q4"],
                    ["q4", '0', "q4"],
                    ["q4", '1', "q4"]
                ]);

                expect(automaton.acceptsWord("")).toBeFalsy();
                expect(automaton.acceptsWord("0")).toBeFalsy();
                expect(automaton.acceptsWord("10")).toBeFalsy();
                expect(automaton.acceptsWord("11")).toBeFalsy();
                expect(automaton.acceptsWord("100")).toBeFalsy();
                expect(automaton.acceptsWord("110")).toBeFalsy();
                expect(automaton.acceptsWord("1100")).toBeTruthy();
                expect(automaton.acceptsWord("110011")).toBeTruthy();
                expect(automaton.acceptsWord("11001100")).toBeTruthy();
                expect(automaton.acceptsWord("01100011")).toBeTruthy();
                expect(automaton.acceptsWord("01100110")).toBeTruthy();
                expect(automaton.acceptsWord("01110110")).toBeFalsy();
            });

            it ("should accept all the string contain a substring 1110", () => {
                const automaton = NFA.create("01", ["q0", "q1", "q2", "q3", "q4"], ["q4"], "q0", [
                    ["q0", '0', "q0"],
                    ["q0", '1', "q0"],
                    ["q0", '1', "q1"],
                    ["q1", '1', "q2"],
                    ["q2", '1', "q3"],
                    ["q3", '0', "q4"],
                    ["q4", '0', "q4"],
                    ["q4", '1', "q4"]
                ]);

                expect(automaton.acceptsWord("")).toBeFalsy();
                expect(automaton.acceptsWord("0")).toBeFalsy();
                expect(automaton.acceptsWord("1")).toBeFalsy();
                expect(automaton.acceptsWord("10")).toBeFalsy();
                expect(automaton.acceptsWord("11")).toBeFalsy();
                expect(automaton.acceptsWord("111")).toBeFalsy();
                expect(automaton.acceptsWord("1000")).toBeFalsy();
                expect(automaton.acceptsWord("1110")).toBeTruthy();
                expect(automaton.acceptsWord("101110")).toBeTruthy();
                expect(automaton.acceptsWord("1011")).toBeFalsy();
                expect(automaton.acceptsWord("1100")).toBeFalsy();
                expect(automaton.acceptsWord("1101")).toBeFalsy();
                expect(automaton.acceptsWord("01110")).toBeTruthy();
            });

            it ("should accept all string in which the third symbol from the right end is always 0", () => {
                const automaton = NFA.create("01", ["q0", "q1", "q2", "q3"], ["q3"], "q0", [
                    ["q0", '0', "q0"],
                    ["q0", '1', "q0"],
                    ["q0", '0', "q1"],
                    ["q1", '0', "q2"],
                    ["q1", '1', "q2"],
                    ["q2", '0', "q3"],
                    ["q2", '1', "q3"]
                ]);

                expect(automaton.acceptsWord("")).toBeFalsy();
                expect(automaton.acceptsWord("0")).toBeFalsy();
                expect(automaton.acceptsWord("10")).toBeFalsy();
                expect(automaton.acceptsWord("100")).toBeFalsy();
                expect(automaton.acceptsWord("1000")).toBeTruthy();
                expect(automaton.acceptsWord("1001")).toBeTruthy();
                expect(automaton.acceptsWord("1010")).toBeTruthy();
                expect(automaton.acceptsWord("1011")).toBeTruthy();
                expect(automaton.acceptsWord("1100")).toBeFalsy();
                expect(automaton.acceptsWord("1101")).toBeFalsy();
                expect(automaton.acceptsWord("1110")).toBeFalsy();
                expect(automaton.acceptsWord("1111")).toBeFalsy();
            });
        });

        describe("With epsilon transitions", () => {
            it ("should accept all strings of the form 0^k where k is a multiple of 2 or 3", () => {
                const automaton = NFA.create("0", ["q0", "q1", "q2", "q3", "q4", "q5"], ["q1", "q3"], "q0", [
                    ["q0", '', "q1"],
                    ["q0", '', "q3"],
                    ["q1", '0', "q2"],
                    ["q2", '0', "q1"],
                    ["q3", '0', "q4"],
                    ["q4", '0', "q5"],
                    ["q5", '0', "q3"]
                ]);

                expect(automaton.acceptsWord("")).toBeTruthy();
                expect(automaton.acceptsWord("0")).toBeFalsy();
                expect(automaton.acceptsWord("00")).toBeTruthy();
                expect(automaton.acceptsWord("000")).toBeTruthy();
                expect(automaton.acceptsWord("0000")).toBeTruthy();
                expect(automaton.acceptsWord("00000")).toBeFalsy();
                expect(automaton.acceptsWord("000000")).toBeTruthy();
                expect(automaton.acceptsWord("0000000")).toBeFalsy();
                expect(automaton.acceptsWord("00000000")).toBeTruthy();
                expect(automaton.acceptsWord("000000000")).toBeTruthy();
                expect(automaton.acceptsWord("0000000000")).toBeTruthy();
            });

            it ("should accept all strings of the form a+", () => {
                const automaton = NFA.create("ab", ["q0", "q1", "q2", "q3"], ["q3"], "q0", [
                    ["q0", '', "q1"],
                    ["q1", 'a', "q2"],
                    ["q2", '', "q1"],
                    ["q2", '', "q3"]
                ]);

                expect(automaton.acceptsWord("")).toBeFalsy();
                expect(automaton.acceptsWord("a")).toBeTruthy();
                expect(automaton.acceptsWord("aa")).toBeTruthy();
                expect(automaton.acceptsWord("aaa")).toBeTruthy();
                expect(automaton.acceptsWord("aaaa")).toBeTruthy();
                expect(automaton.acceptsWord("aaaab")).toBeFalsy();
                expect(automaton.acceptsWord("aaaaaa")).toBeTruthy();
                expect(automaton.acceptsWord("bbbbbbb")).toBeFalsy();
            });

            it ("should accept all strings of the form a* and it has epsilon transitions everywhere", () => {
                const automaton = NFA.create("ab", ["q0", "q1"], ["q1"], "q0", [
                    ["q0", '', "q1"],
                    ["q0", 'a', "q1"],
                    ["q1", '', "q0"]
                ]);

                expect(automaton.acceptsWord("")).toBeTruthy();
                expect(automaton.acceptsWord("a")).toBeTruthy();
                expect(automaton.acceptsWord("aa")).toBeTruthy();
                expect(automaton.acceptsWord("aaa")).toBeTruthy();
                expect(automaton.acceptsWord("aaaa")).toBeTruthy();
                expect(automaton.acceptsWord("aaaab")).toBeFalsy();
                expect(automaton.acceptsWord("aaaaaa")).toBeTruthy();
                expect(automaton.acceptsWord("bbbbbbb")).toBeFalsy();
            });

            it ("should accept all strings of the form (ab)*", () => {
                const automaton = NFA.create("ab", ["q0", "q1", "q2"], ["q0"], "q0", [
                    ["q0", 'a', "q1"],
                    ["q1", 'b', "q2"],
                    ["q2", '', "q0"]
                ]);

                expect(automaton.acceptsWord("")).toBeTruthy();
                expect(automaton.acceptsWord("a")).toBeFalsy();
                expect(automaton.acceptsWord("aa")).toBeFalsy();
                expect(automaton.acceptsWord("aab")).toBeFalsy();
                expect(automaton.acceptsWord("abab")).toBeTruthy();
                expect(automaton.acceptsWord("ab")).toBeTruthy();
                expect(automaton.acceptsWord("ababaa")).toBeFalsy();
                expect(automaton.acceptsWord("ababab")).toBeTruthy();
            });
        });
    });

    describe("Invalid NFAs", () => {
        it ("should throw an error about unknown destination", () => {
            expect(() => {
                const automaton = NFA.create("01", ["q0", "q1"], ["q0"], "q0", [
                    ["q0", '0', "q0"],
                    ["q0", '1', "q0"],
                    ["q0", '1', "q1"],
                    ["q1", '1', "q2"]
                ]);
            }).toThrow();
        });

        it ("should throw an error about unknown accepting state", () => {
            expect(() => {
                const automaton = NFA.create("01", ["q0", "q1"], ["q2"], "q0", [
                    ["q0", '0', "q0"],
                    ["q0", '1', "q0"],
                    ["q0", '1', "q1"],
                    ["q1", '1', "q1"]
                ]);
            }).toThrow();
        });
    });
});

