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

        expect(m.multiplyByScalar(new Complex([10, 0])).equals(new Matrix([
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

        expect(m.addScalar(new Complex([2, 0])).equals(new Matrix([
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
            [new Complex([0, 0]), new Complex([1, 0]), new Complex([2, 0])],
            [new Complex([0, 1]), new Complex([1, 1]), new Complex([2, 1])],
            [new Complex([0, 2]), new Complex([1, 2]), new Complex([2, 2])]
        ]);

        expect(m1.add(m1.transpose()).equals(new Matrix([
            [new Complex([0, 0]), new Complex([1, 1]), new Complex([2, 2])],
            [new Complex([1, 1]), new Complex([2, 2]), new Complex([3, 3])],
            [new Complex([2, 2]), new Complex([3, 3]), new Complex([4, 4])]
        ]))).toBeTruthy();
    });

    it ("should subtract two matrices", () => {
        const m1 = new Matrix([
            [new Complex([0, 0]), new Complex([1, 0]), new Complex([2, 0])],
            [new Complex([0, 1]), new Complex([1, 1]), new Complex([2, 1])],
            [new Complex([0, 2]), new Complex([1, 2]), new Complex([2, 2])]
        ]);

        expect(m1.subtract(m1.transpose()).equals(new Matrix([
            [new Complex([0, 0]), new Complex([1, -1]), new Complex([2, -2])],
            [new Complex([-1, 1]), new Complex([0, 0]), new Complex([1, -1])],
            [new Complex([-2, 2]), new Complex([-1, 1]), new Complex([0, 0])]
        ]))).toBeTruthy();
    });

    it ("should multiply a matrix by a scalar", () => {
        const m1 = new Matrix([
            [new Complex([0, 0]), new Complex([1, 0]), new Complex([2, 0])],
            [new Complex([0, 1]), new Complex([1, 1]), new Complex([2, 1])],
            [new Complex([0, 2]), new Complex([1, 2]), new Complex([2, 2])]
        ]);

        expect(m1.multiplyByScalar(new Complex([2, 0])).equals(new Matrix([
            [new Complex([0, 0]), new Complex([2, 0]), new Complex([4, 0])],
            [new Complex([0, 2]), new Complex([2, 2]), new Complex([4, 2])],
            [new Complex([0, 4]), new Complex([2, 4]), new Complex([4, 4])]
        ]))).toBeTruthy();
    });

    it ("should add a scalar to a square matrix", () => {
        const m1 = new Matrix([
            [new Complex([0, 0]), new Complex([1, 0]), new Complex([2, 0])],
            [new Complex([0, 1]), new Complex([1, 1]), new Complex([2, 1])],
            [new Complex([0, 2]), new Complex([1, 2]), new Complex([2, 2])]
        ]);

        expect(m1.addScalar(new Complex([2, 0])).equals(new Matrix([
            [new Complex([2, 0]), new Complex([3, 0]), new Complex([4, 0])],
            [new Complex([2, 1]), new Complex([3, 1]), new Complex([4, 1])],
            [new Complex([2, 2]), new Complex([3, 2]), new Complex([4, 2])]
        ]))).toBeTruthy();
    });

    it("should multiply two matrices", () => {
        const m1 = new Matrix([
            [new Complex([1, 1]), new Complex([2, 2]), new Complex([3, 3])],
            [new Complex([4, 4]), new Complex([5, 5]), new Complex([6, 6])]
        ]);

        const m2 = new Matrix([
            [new Complex([7, 7]), new Complex([8, 8])],
            [new Complex([9, 9]), new Complex([10, 10])],
            [new Complex([11, 11]), new Complex([12, 12])]
        ]);

        expect(m1.multiply(m2).equals(new Matrix([
            [new Complex([0, 116]), new Complex([0, 128])],
            [new Complex([0, 278]), new Complex([0, 308])]
        ]))).toBeTruthy();
    });

    it ("should raise a matrix to a power", () => {
        const m = new Matrix([
            [new Complex([1, 1]), new Complex([2, 2])],
            [new Complex([3, 3]), new Complex([4, 4])]
        ]);

        expect(m.power(3).equals(new Matrix([
            [new Complex([-74, 74]), new Complex([-108, 108])],
            [new Complex([-162, 162]), new Complex([-236, 236])]
        ]))).toBeTruthy();
    });
});
