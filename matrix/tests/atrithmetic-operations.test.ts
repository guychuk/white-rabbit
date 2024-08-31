import { Matrix } from "../src/matrix";
import { Complex } from "../src/complex";

describe("Real Matrices", () => {
    it ("should add two matrices", () => {
        const m1 = new Matrix([
            [0, 1, 2],
            [1, 2, 0],
            [0, 2, 1]
        ]);
        const m2 = new Matrix([
            [1, 1, 1],
            [2, 2, 2],
            [3, 3, 3]
        ]);

        expect(m1.add(m2).equals(new Matrix([
            [1, 2, 3],
            [3, 4, 2],
            [3, 5, 4]
        ]))).toBeTruthy();
    });

    it ("should subtract two matrices", () => {
        const m1 = new Matrix([
            [0, 1, 2],
            [1, 2, 0],
            [0, 2, 1]
        ]);

        const m2 = new Matrix([
            [1, 1, 1],
            [2, 2, 2],
            [3, 3, 3]
        ]);

        expect(m1.subtract(m2).equals(new Matrix([
            [-1, 0, 1],
            [-1, 0, -2],
            [-3, -1, -2]
        ]))).toBeTruthy();
    });

    it ("should multiply a matrix by a scalar", () => {
        const m = new Matrix([
            [1, 2, 3, 4],
            [0, 0, 8, 9],
            [5, 7, 8, 1]
        ]);

        expect(m.multiplyByScalar(Complex.fromCartesian(10, 0)).equals(new Matrix([
            [10, 20, 30, 40],
            [ 0,  0, 80, 90],
            [50, 70, 80, 10]
        ]))).toBeTruthy();
    });

    it ("should add a scalar to a square matrix", () => {
        const m = new Matrix([
            [3, 2],
            [0, 0]
        ]);

        expect(m.addScalar(Complex.fromCartesian(2, 0)).equals(new Matrix([
            [5, 4],
            [2, 2]
        ]))).toBeTruthy();
    });

    it("should multiply two matrices", () => {
        const m1 = new Matrix([
            [1, 2, 3],
            [4, 5, 6]
        ]);

        const m2 = new Matrix([
            [7, 8],
            [9, 10],
            [11, 12]
        ]);

        expect(m1.multiply(m2).equals(new Matrix([
            [58, 64],
            [139, 154]
        ]))).toBeTruthy();
    });

    it ("should raise a matrix to a power", () => {
        const m = new Matrix([
            [1, 2],
            [3, 4]
        ]);

        expect(m.power(5).equals(new Matrix([
            [1069, 1558],
            [2337, 3406]
        ]))).toBeTruthy();
    });
});

describe("Complex Matrices", () => {
    it ("should add two matrices", () => {
        const m1 = new Matrix([
            [Complex.fromCartesian(0, 0), Complex.fromCartesian(1, 0), Complex.fromCartesian(2, 0)],
            [Complex.fromCartesian(0, 1), Complex.fromCartesian(1, 1), Complex.fromCartesian(2, 1)],
            [Complex.fromCartesian(0, 2), Complex.fromCartesian(1, 2), Complex.fromCartesian(2, 2)]
        ]);

        expect(m1.add(m1.transpose()).equals(new Matrix([
            [Complex.fromCartesian(0, 0), Complex.fromCartesian(1, 1), Complex.fromCartesian(2, 2)],
            [Complex.fromCartesian(1, 1), Complex.fromCartesian(2, 2), Complex.fromCartesian(3, 3)],
            [Complex.fromCartesian(2, 2), Complex.fromCartesian(3, 3), Complex.fromCartesian(4, 4)]
        ]))).toBeTruthy();
    });

    it ("should subtract two matrices", () => {
        const m1 = new Matrix([
            [Complex.fromCartesian(0, 0), Complex.fromCartesian(1, 0), Complex.fromCartesian(2, 0)],
            [Complex.fromCartesian(0, 1), Complex.fromCartesian(1, 1), Complex.fromCartesian(2, 1)],
            [Complex.fromCartesian(0, 2), Complex.fromCartesian(1, 2), Complex.fromCartesian(2, 2)]
        ]);

        expect(m1.subtract(m1.transpose()).equals(new Matrix([
            [Complex.fromCartesian(0, 0), Complex.fromCartesian(1, -1), Complex.fromCartesian(2, -2)],
            [Complex.fromCartesian(-1, 1), Complex.fromCartesian(0, 0), Complex.fromCartesian(1, -1)],
            [Complex.fromCartesian(-2, 2), Complex.fromCartesian(-1, 1), Complex.fromCartesian(0, 0)]
        ]))).toBeTruthy();
    });

    it ("should multiply a matrix by a scalar", () => {
        const m1 = new Matrix([
            [Complex.fromCartesian(0, 0), Complex.fromCartesian(1, 0), Complex.fromCartesian(2, 0)],
            [Complex.fromCartesian(0, 1), Complex.fromCartesian(1, 1), Complex.fromCartesian(2, 1)],
            [Complex.fromCartesian(0, 2), Complex.fromCartesian(1, 2), Complex.fromCartesian(2, 2)]
        ]);

        expect(m1.multiplyByScalar(Complex.fromCartesian(2, 0)).equals(new Matrix([
            [Complex.fromCartesian(0, 0), Complex.fromCartesian(2, 0), Complex.fromCartesian(4, 0)],
            [Complex.fromCartesian(0, 2), Complex.fromCartesian(2, 2), Complex.fromCartesian(4, 2)],
            [Complex.fromCartesian(0, 4), Complex.fromCartesian(2, 4), Complex.fromCartesian(4, 4)]
        ]))).toBeTruthy();
    });

    it ("should add a scalar to a square matrix", () => {
        const m1 = new Matrix([
            [Complex.fromCartesian(0, 0), Complex.fromCartesian(1, 0), Complex.fromCartesian(2, 0)],
            [Complex.fromCartesian(0, 1), Complex.fromCartesian(1, 1), Complex.fromCartesian(2, 1)],
            [Complex.fromCartesian(0, 2), Complex.fromCartesian(1, 2), Complex.fromCartesian(2, 2)]
        ]);

        expect(m1.addScalar(Complex.fromCartesian(2, 0)).equals(new Matrix([
            [Complex.fromCartesian(2, 0), Complex.fromCartesian(3, 0), Complex.fromCartesian(4, 0)],
            [Complex.fromCartesian(2, 1), Complex.fromCartesian(3, 1), Complex.fromCartesian(4, 1)],
            [Complex.fromCartesian(2, 2), Complex.fromCartesian(3, 2), Complex.fromCartesian(4, 2)]
        ]))).toBeTruthy();
    });

    it("should multiply two matrices", () => {
        const m1 = new Matrix([
            [Complex.fromCartesian(1, 1), Complex.fromCartesian(2, 2), Complex.fromCartesian(3, 3)],
            [Complex.fromCartesian(4, 4), Complex.fromCartesian(5, 5), Complex.fromCartesian(6, 6)]
        ]);

        const m2 = new Matrix([
            [Complex.fromCartesian(7, 7), Complex.fromCartesian(8, 8)],
            [Complex.fromCartesian(9, 9), Complex.fromCartesian(10, 10)],
            [Complex.fromCartesian(11, 11), Complex.fromCartesian(12, 12)]
        ]);

        expect(m1.multiply(m2).equals(new Matrix([
            [Complex.fromCartesian(0, 116), Complex.fromCartesian(0, 128)],
            [Complex.fromCartesian(0, 278), Complex.fromCartesian(0, 308)]
        ]))).toBeTruthy();
    });

    it ("should raise a matrix to a power", () => {
        const m = new Matrix([
            [Complex.fromCartesian(1, 1), Complex.fromCartesian(2, 2)],
            [Complex.fromCartesian(3, 3), Complex.fromCartesian(4, 4)]
        ]);

        expect(m.power(3).equals(new Matrix([
            [Complex.fromCartesian(-74, 74), Complex.fromCartesian(-108, 108)],
            [Complex.fromCartesian(-162, 162), Complex.fromCartesian(-236, 236)]
        ]))).toBeTruthy();
    });
});
