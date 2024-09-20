import { Complex } from "../src/complex";
import { Matrix } from "../src/matrix";
import { Vector, VectorType } from "../src/vector";

describe("Vectors", () => {
    it ("should create a row vector from an array", () => {
        const vector = Vector.rowVector([1, 2, 3]);

        expect(vector.length).toBe(3);
        expect(vector.vectorType).toBe(VectorType.ROW);
        expect(vector.get(0).equals(1)).toBe(true);
        expect(vector.get(1).equals(2)).toBe(true);
        expect(vector.get(2).equals(3)).toBe(true);
    });

    it ("should create a column vector from an array", () => {
        const vector = Vector.columnVector([1, 2, 3]);

        expect(vector.length).toBe(3);
        expect(vector.vectorType).toBe(VectorType.COLUMN);
        expect(vector.get(0).equals(1)).toBe(true);
        expect(vector.get(1).equals(2)).toBe(true);
        expect(vector.get(2).equals(3)).toBe(true);
    });

    it ("should create a row vector from a matrix", () => {
        const matrix = new Matrix([
            [1, 2, 3]
        ]);

        const vector = Vector.fromMatrix(matrix);

        expect(vector.length).toBe(3);
        expect(vector.vectorType).toBe(VectorType.ROW);
        expect(vector.get(0).equals(1)).toBe(true);
        expect(vector.get(1).equals(2)).toBe(true);
        expect(vector.get(2).equals(3)).toBe(true);
    });

    it ("should convert a column vector to a matrix", () => {
        const vector = Vector.columnVector([1, 2, 3]);

        const matrix = vector.asMatrix();

        expect(matrix.rows).toBe(3);
        expect(matrix.columns).toBe(1);
        expect(matrix.get(0, 0).equals(1)).toBe(true);
        expect(matrix.get(1, 0).equals(2)).toBe(true);
        expect(matrix.get(2, 0).equals(3)).toBe(true);
    });

    it ("should add two vectors", () => {
        const vector1 = Vector.rowVector([1, 2, 3]);
        const vector2 = Vector.rowVector([4, 5, 6]);

        const sum = vector1.add(vector2);

        expect(sum.length).toBe(3);
        expect(sum.vectorType).toBe(VectorType.ROW);
        expect(sum.get(0).equals(5)).toBe(true);
        expect(sum.get(1).equals(7)).toBe(true);
        expect(sum.get(2).equals(9)).toBe(true);
    });

    it ("should subtract two vectors", () => {
        const vector1 = Vector.rowVector([1, 2, 3]);
        const vector2 = Vector.rowVector([4, 5, 6]);

        const difference = vector1.subtract(vector2);

        expect(difference.length).toBe(3);
        expect(difference.vectorType).toBe(VectorType.ROW);
        expect(difference.get(0).equals(-3)).toBe(true);
        expect(difference.get(1).equals(-3)).toBe(true);
        expect(difference.get(2).equals(-3)).toBe(true);
    });

    it ("should calculate the dot product of two vectors", () => {
        const vector1 = Vector.rowVector([1, 2, 3]);
        const vector2 = Vector.rowVector([4, 5, 6]);

        const dotProduct = vector1.dot(vector2);

        expect(dotProduct.real).toBe(32);
        expect(dotProduct.imaginary).toBe(0);
    });

    it ("should check if two vectors are perpendicular", () => {
        const vector1 = Vector.rowVector([1, 0, 0]);
        const vector2 = Vector.rowVector([0, 1, 0]);

        expect(vector1.isPerpendicular(vector2)).toBe(true);

        const vector3 = Vector.rowVector([1, 1, 0]);
        const vector4 = Vector.rowVector([1, -1, 0]);

        expect(vector3.isPerpendicular(vector4)).toBe(true);

        const vector5 = Vector.rowVector([1, Complex.i, 0]);
        const vector6 = Vector.rowVector([1, Complex.negi, 0]);

        expect(vector5.isPerpendicular(vector6)).toBe(true);

        const vector7 = Vector.rowVector([1, 0, 0]);
        const vector8 = Vector.rowVector([1, 1, 0]);

        expect(vector7.isPerpendicular(vector8)).toBe(false);
    });

    it ("should calculate the norm of a vector", () => {
        const vector = Vector.rowVector([1, 2, 3]);

        expect(vector.norm2()).toBe(Math.sqrt(14));

        const zeroVector = Vector.rowVector([0, 0, 0]);

        expect(zeroVector.norm2()).toBe(0);
    });

    it ("should normalize a vector", () => {
        const vector = Vector.rowVector([1, 2, 3]);

        const normalized = vector.normalized();

        expect(normalized.norm2()).toBe(1);
    });

    it ("should check if a set of vectors is linearly independent", () => {
        const vector1 = Vector.columnVector([1, 4, 0]);
        const vector2 = Vector.columnVector([10, 2, 1]);
        const vector3 = Vector.columnVector([-5, 0, 6]);

        expect(Vector.linearlyIndependentSet([vector1, vector2, vector3])).toBe(true);

        const vector4 = Vector.columnVector([1, 4, 0]);
        const vector5 = Vector.columnVector([10, 2, 1]);
        const vector6 = Vector.columnVector([new Complex([2, 2]), new Complex([8, 8]), 0]);

        expect(Vector.linearlyIndependentSet([vector4, vector5, vector6])).toBe(false);
    });
});
