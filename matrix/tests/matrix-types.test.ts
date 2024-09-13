import { Matrix } from "../src/matrix";
import { Complex } from "../src/complex";

describe("Matrix Types", () => {
    it("should check if a matrix is a square matrix", () => {
        expect(new Matrix([
            [1, 2],
            [3, 4]
        ]).isSquare()).toBeTruthy();

        expect(new Matrix([
            [1, 2, 3],
            [4, 5, 6]
        ]).isSquare()).toBeFalsy();

        expect(new Matrix([
            [new Complex([1, 1]), new Complex([2, 2])],
            [new Complex([3, 3]), new Complex([4, 4])]
        ]).isSquare()).toBeTruthy();

        expect(new Matrix([
            [new Complex([1, 1]), new Complex([2, 2]), new Complex([3, 3])],
            [new Complex([4, 4]), new Complex([5, 5]), new Complex([6, 6])]
        ]).isSquare()).toBeFalsy();
    });

    it("should check if a matrix is symmetric", () => {
        expect(new Matrix([
            [1, 2],
            [2, 1]
        ]).isSymmetric()).toBeTruthy();

        expect(new Matrix([
            [1, 2],
            [3, 4]
        ]).isSymmetric()).toBeFalsy();

        expect(new Matrix([
            [new Complex([1, 1]), new Complex([2, 2])],
            [new Complex([2, 2]), new Complex([1, 1])]
        ]).isSymmetric()).toBeFalsy();
    });

    it("should check if a matrix is skew symmetric", () => {
        expect(new Matrix([
            [0, 2],
            [-2, 0]
        ]).isSkewSymmetric()).toBeTruthy();

        expect(new Matrix([
            [1, 2],
            [3, 4]
        ]).isSkewSymmetric()).toBeFalsy();

        expect(new Matrix([
            [new Complex([0, 1]), new Complex([2, 2])],
            [new Complex([-2, 2]), new Complex([0, 1])]
        ]).isSkewSymmetric()).toBeFalsy();
    });

    it("should check if a matrix is diagonal", () => {
        expect(new Matrix([
            [1, 0],
            [0, 1]
        ]).isDiagonal()).toBeTruthy();

        expect(new Matrix([
            [1, 2],
            [3, 4]
        ]).isDiagonal()).toBeFalsy();
    });

    it("should check if a matrix is hermitian", () => {
        expect(new Matrix([
            [new Complex([1, 0]), new Complex([2, 2])],
            [new Complex([2, -2]), new Complex([1, 0])]
        ]).isHermitian()).toBeTruthy();

        expect(new Matrix([
            [new Complex([1, 0]), new Complex([2, 2])],
            [new Complex([2, 2]), new Complex([1, 0])]
        ]).isHermitian()).toBeFalsy();

        expect(new Matrix([
            [1, 2],
            [3, 4]
        ]).isHermitian()).toBeFalsy();

        expect(new Matrix([
            [1, 2],
            [2, 4]
        ]).isHermitian()).toBeTruthy();
    });

    it("should check if a matrix is skew hermitian", () => {
        expect(new Matrix([
            [new Complex([0, 0]), new Complex([2, 2])],
            [new Complex([-2, 2]), new Complex([0, 0])]
        ]).isSkewHermitian()).toBeTruthy();

        expect(new Matrix([
            [new Complex([0, 0]), new Complex([2, 2])],
            [new Complex([2, 2]), new Complex([0, 0])]
        ]).isSkewHermitian()).toBeFalsy();

        expect(new Matrix([
            [1, 2],
            [3, 4]
        ]).isSkewHermitian()).toBeFalsy();

        expect(new Matrix([
            [1, 2],
            [-2, 4]
        ]).isSkewHermitian()).toBeFalsy();
    });

    it("should check if a matrix is diagonal", () => {
        expect(new Matrix([
            [1, 0],
            [0, 1]
        ]).isDiagonal()).toBeTruthy();

        expect(new Matrix([
            [1, 2],
            [3, 4]
        ]).isDiagonal()).toBeFalsy();

        expect(new Matrix([
            [new Complex([1, 1]), new Complex([0, 0])],
            [new Complex([0, 0]), new Complex([1, 1])]
        ]).isDiagonal()).toBeTruthy();

        expect(new Matrix([
            [new Complex([1, 1]), new Complex([0, 0])],
            [new Complex([0, 0]), new Complex([1, 0])]
        ]).isDiagonal()).toBeTruthy();
    });

    it("should check if a matrix is upper triangular", () => {
        expect(new Matrix([
            [1, 2],
            [0, 4]
        ]).isUpperTriangular()).toBeTruthy();

        expect(new Matrix([
            [1, 2],
            [3, 4]
        ]).isUpperTriangular()).toBeFalsy();

        expect(new Matrix([
            [new Complex([1, 1]), new Complex([2, 2])],
            [new Complex([0, 0]), new Complex([4, 4])]
        ]).isUpperTriangular()).toBeTruthy();

        expect(new Matrix([
            [new Complex([1, 1]), new Complex([2, 2])],
            [new Complex([3, 3]), new Complex([4, 4])]
        ]).isUpperTriangular()).toBeFalsy();
    });

    it("should check if a matrix is lower triangular", () => {
        expect(new Matrix([
            [1, 0],
            [3, 4]
        ]).isLowerTriangular()).toBeTruthy();

        expect(new Matrix([
            [1, 2],
            [3, 4]
        ]).isLowerTriangular()).toBeFalsy();

        expect(new Matrix([
            [new Complex([1, 1]), new Complex([0, 0])],
            [new Complex([3, 3]), new Complex([4, 4])]
        ]).isLowerTriangular()).toBeTruthy();

        expect(new Matrix([
            [new Complex([1, 1]), new Complex([2, 2])],
            [new Complex([3, 3]), new Complex([4, 4])]
        ]).isLowerTriangular()).toBeFalsy();
    });

    it("should check if a matrix is an identity matrix", () => {
        expect(new Matrix([
            [1, 0],
            [0, 1]
        ]).isIdentity()).toBeTruthy();

        expect(new Matrix([
            [1, 2],
            [3, 4]
        ]).isIdentity()).toBeFalsy();

        expect(new Matrix([
            [new Complex([1, 0]), new Complex([0, 0])],
            [new Complex([0, 0]), new Complex([1, 0])]
        ]).isIdentity()).toBeTruthy();

        expect(new Matrix([
            [new Complex([1, 0]), new Complex([0, 0])],
            [new Complex([0, 0]), new Complex([1, 1])]
        ]).isIdentity()).toBeFalsy();
    });

    it("should check if a matrix is invertible", () => {
        expect(new Matrix([
            [1, 0],
            [0, 1]
        ]).isInvertible()).toBeTruthy();

        expect(new Matrix([
            [1, 2],
            [3, 4]
        ]).isInvertible()).toBeTruthy();

        expect(new Matrix([
            [1, 2],
            [2, 4]
        ]).isInvertible()).toBeFalsy();

        expect(new Matrix([
            [new Complex([1, 1]), new Complex([0, 0])],
            [new Complex([0, 0]), new Complex([1, 1])]
        ]).isInvertible()).toBeTruthy();

        expect(new Matrix([
            [new Complex([0, 1]), new Complex([0, 0])],
            [new Complex([0, 0]), new Complex([0, 0])]
        ]).isInvertible()).toBeFalsy();
    });

    it("should check if a matrix is normal", () => {
        expect(new Matrix([
            [1, 2],
            [3, 4]
        ]).isNormal()).toBeFalsy();

        expect(new Matrix([
            [1, 2],
            [2, 4]
        ]).isNormal()).toBeTruthy();
    });
});
