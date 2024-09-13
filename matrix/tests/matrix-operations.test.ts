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
            [new Complex([1, 1]), new Complex([2, 2])],
            [new Complex([3, 3]), new Complex([4, 4])]
        ]).transpose().equals(new Matrix([
            [new Complex([1, 1]), new Complex([3, 3])],
            [new Complex([2, 2]), new Complex([4, 4])]
        ]))).toBeTruthy();
    });

    it ("should calculate the conjugate of matrices", () => {
        expect(new Matrix([
            [new Complex([1, 1]), new Complex([2, 2])],
            [new Complex([3, 3]), new Complex([4, 4])]
        ]).conjugate().equals(new Matrix([
            [new Complex([1, -1]), new Complex([2, -2])],
            [new Complex([3, -3]), new Complex([4, -4])]
        ]))).toBeTruthy();

        expect(new Matrix([
            [new Complex([0, 1])]
        ]).conjugate().equals(new Matrix([
            [new Complex([0, -1])]
        ]))).toBeTruthy();
    });

    it ("should calculate the conjugate transpose of matrices", () => {
        expect(new Matrix([
            [new Complex([1, 1]), new Complex([2, 2])],
            [new Complex([3, 3]), new Complex([4, 4])]
        ]).conjugateTranspose().equals(new Matrix([
            [new Complex([1, -1]), new Complex([3, -3])],
            [new Complex([2, -2]), new Complex([4, -4])]
        ]))).toBeTruthy();

        expect(new Matrix([
            [new Complex([0, 1])]
        ]).conjugateTranspose().equals(new Matrix([
            [new Complex([0, -1])]
        ]))).toBeTruthy();
    });

    it ("should calculate the trace of matrices", () => {
        expect(new Matrix([
            [1, 2],
            [3, 4]
        ]).trace().equals(5)).toBeTruthy();

        expect(new Matrix([
            [new Complex([1, 1]), new Complex([2, 2])],
            [new Complex([3, 3]), new Complex([4, 4])]
        ]).trace().equals(new Complex([5, 5]))).toBeTruthy();

        expect(new Matrix([
            [new Complex([1, 1]), new Complex([2, 2]), new Complex([3, 3])],
            [new Complex([4, 4]), new Complex([5, 5]), new Complex([6, 6])],
            [new Complex([7, 7]), new Complex([8, 8]), new Complex([9, 9])]
        ]).trace().equals(new Complex([15, 15]))).toBeTruthy();
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
            [new Complex([1, 1]), new Complex([2, 2])],
            [new Complex([3, 3]), new Complex([4, 4])]
        ]).determinant().equals(new Complex([0, -4]))).toBeTruthy();

        expect(new Matrix([
            [new Complex([1, 1]), new Complex([2, 2]), new Complex([3, 3])],
            [new Complex([4, 4]), new Complex([5, 5]), new Complex([6, 6])],
            [new Complex([7, 7]), new Complex([8, 8]), new Complex([9, 9])]
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
            [new Complex([1, 1]), new Complex([2, 2])],
            [new Complex([3, 3]), new Complex([4, 4])]
        ]).inverse().equals(new Matrix([
            [new Complex([-1, 1]), new Complex([1/2, -1/2])],
            [new Complex([3/4, -3/4]), new Complex([-1/4, 1/4])]
        ]))).toBeTruthy();

        expect(() => new Matrix([
            [new Complex([1, 1]), new Complex([2, 2]), new Complex([3, 3])],
            [new Complex([4, 4]), new Complex([5, 5]), new Complex([6, 6])],
            [new Complex([7, 7]), new Complex([8, 8]), new Complex([9, 9])]
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
            [new Complex([1, 1]), new Complex([2, 2])],
            [new Complex([3, 3]), new Complex([4, 4])]
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
