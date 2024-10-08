import { Complex } from "../src/complex";
import { Matrix } from "../src/matrix";

describe("Real Matrix Diagonalization", () => {
    it ("should diagonalize a 2x2 matrix", () => {        
        const m = new Matrix([
            [5, 4],
            [2, 3]
        ]);

        const [U, D] = m.diagonalize();

        expect(D.isDiagonal()).toBeTruthy();
        expect(U.isInvertible()).toBeTruthy();
        expect(U.multiply(D.multiply(U.inverse())).equals(m)).toBeTruthy();
    });

    it ("should diagonalize a 3x3 matrix", () => {
        const m = new Matrix([
            [7, 1, 0],
            [0, 5, 0],
            [0, 0, 3]
        ]);

        const [U, D] = m.diagonalize();

        expect(D.isDiagonal()).toBeTruthy();
        expect(U.isInvertible()).toBeTruthy();
        expect(U.multiply(D.multiply(U.inverse())).equals(m)).toBeTruthy();
    });

    it ("should diagonalize a 4x4 matrix", () => {
        const m = new Matrix([
            [1, 2, 0, 0],
            [0, 3, 0, 0],
            [0, 0, 5, 1],
            [0, 0, 0, 0]
        ]);

        const [U, D] = m.diagonalize();

        expect(D.isDiagonal()).toBeTruthy();
        expect(U.isInvertible()).toBeTruthy();
        expect(U.multiply(D.multiply(U.inverse())).equals(m)).toBeTruthy();
    });

    it ("should throw an error when trying to diagonalize a non-diagonalizable matrix", () => {
        const m = new Matrix([
            [2,  1],
            [0,  2]
        ]);

        expect(() => m.diagonalize()).toThrow();
    });
});

describe("Complex Matrix Diagonalization", () => {
    it ("should diagonalize a 2x2 matrix", () => {        
        const m = new Matrix([
            [new Complex([2, 1]), 1],
            [0, new Complex([3, -1])]
        ]);

        const [U, D] = m.diagonalize();

        expect(D.isDiagonal()).toBeTruthy();
        expect(U.isInvertible()).toBeTruthy();
        expect(U.multiply(D.multiply(U.inverse())).equals(m)).toBeTruthy();
    });

    it ("should diagonalize a 3x3 matrix", () => {
        const m = new Matrix([
            [new Complex([1, 2]), 0, 0],
            [0, new Complex([-1, 1]), 1],
            [0, 0, new Complex([2, -2])]
        ]);

        const [U, D] = m.diagonalize();

        expect(D.isDiagonal()).toBeTruthy();
        expect(U.isInvertible()).toBeTruthy();
        expect(U.multiply(D.multiply(U.inverse())).equals(m)).toBeTruthy();
    });

    it ("should diagonalize a 4x4 matrix", () => {
        const m = new Matrix([
            [3, 1, 0, 0],
            [0, new Complex([-2, 1]), 0, 0],
            [0, 0, new Complex([1, -1]), 0],
            [0, 0, 0, new Complex([4, 2])]
        ]);

        const [U, D] = m.diagonalize();

        expect(D.isDiagonal()).toBeTruthy();
        expect(U.isInvertible()).toBeTruthy();
        expect(U.multiply(D.multiply(U.inverse())).equals(m)).toBeTruthy();
    });

    it ("should throw an error when trying to diagonalize a non-diagonalizable matrix", () => {
        const m = new Matrix([
            [2,  new Complex([0, 1])],
            [0,  2]
        ]);

        expect(() => m.diagonalize()).toThrow();
    });
});
