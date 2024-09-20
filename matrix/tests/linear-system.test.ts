import { Matrix } from "../src/matrix";
import { Vector } from "../src/vector";

describe ("Linear System", () => {
    it ("should solve a 2x2 linear system", () => {
        const A = new Matrix([
            [2, 1],
            [1, 1]
        ]);

        const b = Vector.columnVector([1, 1]);

        const x = A.solveLinearSystem(b);

        expect(x.length).toBe(1);

        expect(x[0][0]).toBe(0);
        expect(x[0][1].equals(Vector.columnVector([0, 1])));
    });

    it ("should solve a 3x3 linear system", () => {
        const A = new Matrix([
            [2, 1, 1],
            [1, 1, 1],
            [1, 1, 2]
        ]);

        const b = Vector.columnVector([1, 1, 1]);

        const x = A.solveLinearSystem(b);

        expect(x.length).toBe(1);

        expect(x[0][0]).toBe(0);
        expect(x[0][1].equals(Vector.columnVector([0, 1, 0])));
    });

    it ("should return empty when trying to solve an unsolvable linear system", () => {
        const A = new Matrix([
            [1, 1],
            [1, 1]
        ]);

        const b = Vector.columnVector([1, 2]);

        expect(A.solveLinearSystem(b)).toEqual([]);
    });

    it ("should solve a 1x2 linear system", () => {
        const A = new Matrix([
            [1, 1]
        ]);

        const b = Vector.columnVector([1]);

        const x = A.solveLinearSystem(b);

        expect(x.length).toBe(2);

        expect(x[0][0]).toBe(0);
        expect(x[0][1].equals(Vector.columnVector([1, 0])));

        expect(x[1][0]).toBe(2);
        expect(x[1][1].equals(Vector.columnVector([-1, 1])));
    });
});