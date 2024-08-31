import { Matrix } from "../src/matrix";
import { Complex, Scalar } from "../src/complex";
import { makeAddOperation, makeMultiplyOperation, makeSwapOperation } from "../src/elimination-iterator";

describe("Row Operations", () => {
    it ("should swap two rows", () => {
        const m1 = new Matrix([
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9]
        ]);

        m1.swapRows(0, 2);

        expect(m1.equals(new Matrix([
            [7, 8, 9],
            [4, 5, 6],
            [1, 2, 3]
        ]))).toBeTruthy();
    });

    it ("should multiply a row by a scalar", () => {
        const m1 = new Matrix([
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9]
        ]);

        m1.multiplyRow(1, 2);

        expect(m1.equals(new Matrix([
            [1, 2, 3],
            [8, 10, 12],
            [7, 8, 9]
        ]))).toBeTruthy();
    });

    it ("should add a multiple of one row to another row", () => {
        const m1 = new Matrix([
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9]
        ]);

        m1.addRow(0, 1, 1);

        expect(m1.equals(new Matrix([
            [5, 7, 9],
            [4, 5, 6],
            [7, 8, 9]
        ]))).toBeTruthy();
    });
});

describe("Row Operations using RowOperation Type", () => {
    it ("should swap two rows", () => {
        const m1 = new Matrix([
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9]
        ]);

        m1.rowOperation(makeSwapOperation(0, 2));

        expect(m1.equals(new Matrix([
            [7, 8, 9],
            [4, 5, 6],
            [1, 2, 3]
        ]))).toBeTruthy();
    });

    it ("should multiply a row by a scalar", () => {
        const m1 = new Matrix([
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9]
        ]);

        m1.rowOperation(makeMultiplyOperation(1, 2));

        expect(m1.equals(new Matrix([
            [1, 2, 3],
            [8, 10, 12],
            [7, 8, 9]
        ]))).toBeTruthy();
    });

    it ("should add a multiple of one row to another row", () => {
        const m1 = new Matrix([
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9]
        ]);

        m1.rowOperation(makeAddOperation(0, 1, 1));

        expect(m1.equals(new Matrix([
            [5, 7, 9],
            [4, 5, 6],
            [7, 8, 9]
        ]))).toBeTruthy();
    });

    it ("should perform multiple row operations", () => {
        const m1 = new Matrix([
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9]
        ]);

        const operations = [
            makeSwapOperation(0, 2),
            makeMultiplyOperation(1, 2),
            makeAddOperation(0, 1, 1)
        ];

        m1.rowOperationSequence(operations);

        expect(m1.equals(new Matrix([
            [15, 18, 21],
            [8, 10, 12],
            [1, 2, 3]
        ]))).toBeTruthy();
    });
});

describe("Guassian Elimination", () => {
    it ("should perform Gaussian Elimination", () => {
        const m1 = new Matrix([
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9]
        ]);

        const rref1 = m1.RREF();

        expect(rref1.equals(new Matrix([
            [1, 0, -1],
            [0, 1, 2],
            [0, 0, 0]
        ]))).toBeTruthy();

        const m2 = new Matrix([
            [1, 2, 3, 4],
            [5, 6, 7, 8],
            [9, 10, 11, 12]
        ]);

        const rref2 = m2.RREF();

        expect(rref2.equals(new Matrix([
            [1, 0, -1, -2],
            [0, 1, 2, 3],
            [0, 0, 0, 0]
        ]))).toBeTruthy();

        const m3 = new Matrix([
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9],
            [10, 11, 12]
        ]);

        const rref3 = m3.RREF();

        expect(rref3.equals(new Matrix([
            [1, 0, -1],
            [0, 1, 2],
            [0, 0, 0],
            [0, 0, 0]
        ]))).toBeTruthy();

        const m4 = Matrix.scalar(3, 3);

        const rref4 = m4.RREF();

        expect(rref4.equals(Matrix.identity(3))).toBeTruthy();

        const m5 = Matrix.scalar(0, 4);

        const rref5 = m5.RREF();

        expect(rref5.equals(Matrix.zero(4))).toBeTruthy();
    });
});
