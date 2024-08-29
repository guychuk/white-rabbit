import { Matrix } from "../src/matrix";
import { Complex } from "../src/complex";

describe("Basic Matrix Operations", () => {
    it ("should calculate the transpose of matrices", () => {
        expect(new Matrix([
            [1, 2],
            [3, 4]
        ]).transpose().equals(new Matrix([
            [1, 3],
            [2, 4]
        ]))).toBeTruthy();

        expect(new Matrix([
            [1, 2, 3],
            [4, 5, 6]
        ]).transpose().equals(new Matrix([
            [1, 4],
            [2, 5],
            [3, 6]
        ]))).toBeTruthy();

        expect(new Matrix([
            [Complex.fromCartesian(1, 1), Complex.fromCartesian(2, 2)],
            [Complex.fromCartesian(3, 3), Complex.fromCartesian(4, 4)]
        ]).transpose().equals(new Matrix([
            [Complex.fromCartesian(1, 1), Complex.fromCartesian(3, 3)],
            [Complex.fromCartesian(2, 2), Complex.fromCartesian(4, 4)]
        ]))).toBeTruthy();
    });

    it ("should calculate the conjugate of matrices", () => {
        expect(new Matrix([
            [Complex.fromCartesian(1, 1), Complex.fromCartesian(2, 2)],
            [Complex.fromCartesian(3, 3), Complex.fromCartesian(4, 4)]
        ]).conjugate().equals(new Matrix([
            [Complex.fromCartesian(1, -1), Complex.fromCartesian(2, -2)],
            [Complex.fromCartesian(3, -3), Complex.fromCartesian(4, -4)]
        ]))).toBeTruthy();

        expect(new Matrix([
            [Complex.fromCartesian(0, 1)]
        ]).conjugate().equals(new Matrix([
            [Complex.fromCartesian(0, -1)]
        ]))).toBeTruthy();
    });

    it ("should calculate the conjugate transpose of matrices", () => {
        expect(new Matrix([
            [Complex.fromCartesian(1, 1), Complex.fromCartesian(2, 2)],
            [Complex.fromCartesian(3, 3), Complex.fromCartesian(4, 4)]
        ]).conjugateTranspose().equals(new Matrix([
            [Complex.fromCartesian(1, -1), Complex.fromCartesian(3, -3)],
            [Complex.fromCartesian(2, -2), Complex.fromCartesian(4, -4)]
        ]))).toBeTruthy();

        expect(new Matrix([
            [Complex.fromCartesian(0, 1)]
        ]).conjugateTranspose().equals(new Matrix([
            [Complex.fromCartesian(0, -1)]
        ]))).toBeTruthy();
    });

    it ("should calculate the trace of matrices", () => {
        expect(new Matrix([
            [1, 2],
            [3, 4]
        ]).trace().equals(5)).toBeTruthy();

        expect(new Matrix([
            [Complex.fromCartesian(1, 1), Complex.fromCartesian(2, 2)],
            [Complex.fromCartesian(3, 3), Complex.fromCartesian(4, 4)]
        ]).trace().equals(Complex.fromCartesian(5, 5))).toBeTruthy();

        expect(new Matrix([
            [Complex.fromCartesian(1, 1), Complex.fromCartesian(2, 2), Complex.fromCartesian(3, 3)],
            [Complex.fromCartesian(4, 4), Complex.fromCartesian(5, 5), Complex.fromCartesian(6, 6)],
            [Complex.fromCartesian(7, 7), Complex.fromCartesian(8, 8), Complex.fromCartesian(9, 9)]
        ]).trace().equals(Complex.fromCartesian(15, 15))).toBeTruthy();
    });

    it ("should calculate the minor of matrices", () => {
        expect(new Matrix([
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9]
        ]).minor(0, 0).equals(new Matrix([
            [5, 6],
            [8, 9]
        ]))).toBeTruthy();

        expect(new Matrix([
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9]
        ]).minor(1, 1).equals(new Matrix([
            [1, 3],
            [7, 9]
        ]))).toBeTruthy();
    });

    it ("should calculate the determinant of matrices", () => {
        expect(new Matrix([
            [1, 2],
            [3, 4]
        ]).determinant().equals(-2)).toBeTruthy();

        expect(new Matrix([
            [Complex.fromCartesian(1, 1), Complex.fromCartesian(2, 2)],
            [Complex.fromCartesian(3, 3), Complex.fromCartesian(4, 4)]
        ]).determinant().equals(Complex.fromCartesian(0, -4))).toBeTruthy();

        expect(new Matrix([
            [Complex.fromCartesian(1, 1), Complex.fromCartesian(2, 2), Complex.fromCartesian(3, 3)],
            [Complex.fromCartesian(4, 4), Complex.fromCartesian(5, 5), Complex.fromCartesian(6, 6)],
            [Complex.fromCartesian(7, 7), Complex.fromCartesian(8, 8), Complex.fromCartesian(9, 9)]
        ]).determinant().equals(0)).toBeTruthy();
    });

    it ("should calculate the inverse of matrices", () => {
        expect(new Matrix([
            [1, 2],
            [3, 4]
        ]).inverse().equals(new Matrix([
            [-2, 1],
            [1.5, -0.5]
        ]))).toBeTruthy();

        expect(new Matrix([
            [Complex.fromCartesian(1, 1), Complex.fromCartesian(2, 2)],
            [Complex.fromCartesian(3, 3), Complex.fromCartesian(4, 4)]
        ]).inverse().equals(new Matrix([
            [Complex.fromCartesian(-1, 1), Complex.fromCartesian(1/2, -1/2)],
            [Complex.fromCartesian(3/4, -3/4), Complex.fromCartesian(-1/4, 1/4)]
        ]))).toBeTruthy();

        expect(() => new Matrix([
            [Complex.fromCartesian(1, 1), Complex.fromCartesian(2, 2), Complex.fromCartesian(3, 3)],
            [Complex.fromCartesian(4, 4), Complex.fromCartesian(5, 5), Complex.fromCartesian(6, 6)],
            [Complex.fromCartesian(7, 7), Complex.fromCartesian(8, 8), Complex.fromCartesian(9, 9)]
        ]).inverse()).toThrow();
    });

    it ("should multiply a matrix with its inverse to get the identity matrix", () => {
        const A = new Matrix([
            [1, 2],
            [3, 4]
        ]);

        const AInverse = A.inverse();

        expect(A.multiply(AInverse).isIdentity()).toBeTruthy();

        const B = new Matrix([
            [Complex.fromCartesian(1, 1), Complex.fromCartesian(2, 2)],
            [Complex.fromCartesian(3, 3), Complex.fromCartesian(4, 4)]
        ]);

        const BInverse = B.inverse();

        expect(B.multiply(BInverse).isIdentity()).toBeTruthy();

        const C = new Matrix([
            [1, 2, -1],
            [2, 1, 2],
            [-1, 2, 1]
        ]);

        const CInverse = C.inverse();

        expect(C.multiply(CInverse).isIdentity()).toBeTruthy();
    });
});
