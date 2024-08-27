import { Complex } from "./complex";

export class Matrix {
    matrix: Complex[][];

    constructor(matrix: (number | Complex)[][]) {
        if (!Matrix.isMatrix(matrix))
            throw new Error("Invalid matrix");

        this.matrix = matrix.map(row => row.map(item => item instanceof Complex ? item : new Complex(item, 0)));
    }

    get rows() {
        return this.matrix.length;
    }

    get columns() {
        return this.matrix[0].length;
    }

    get(row: number, column: number) {
        return this.matrix[row][column];
    }

    getRow(row: number) {
        return this.matrix[row];
    }

    getColumn(column: number) {
        return this.matrix.map(row => row[column]);
    }

    set(row: number, column: number, value: Complex) {
        this.matrix[row][column] = value;
    }

    sameSize(other: Matrix) {
        return this.rows === other.rows && this.columns === other.columns;
    }

    equals(other: Matrix) {
        return this.sameSize(other) && this.matrix.every((row, rindex) => 
            row.every((item, cindex) => item.equals(other.matrix[rindex][cindex])));
    }

    // matrix types

    isSquare() {
        return this.rows === this.columns;
    }

    isSymmetric() {
        return this.equals(this.transpose());
    }

    isSkewSymmetric() {
        return this.equals(this.transpose().multiplyByScalar(new Complex(-1, 0)));
    }

    // matrix operations

    transpose() : Matrix{
        return new Matrix(this.matrix[0].map((_, ci) => this.matrix.map((_, ri) => this.matrix[ri][ci])));
    }

    // scalar operations

    multiplyByScalar(scalar: Complex) {
        return new Matrix(this.matrix.map(row => row.map(item => item.multiply(scalar))));
    }

    divideByScalar(scalar: Complex) {
        return new Matrix(this.matrix.map(row => row.map(item => item.divide(scalar))));
    }

    addScalar(scalar: Complex) {
        if (!this.isSquare())
            throw new Error("cannot add a scalar to a non-square matrix");

        return new Matrix(this.matrix.map(row => row.map(item => item.add(scalar))));
    }

    subtractScalar(scalar: Complex) {
        return this.addScalar(scalar.multiply(new Complex(-1, 0)));
    }

    // matrix arithmetic operations

    add(other: Matrix) {
        if (!this.sameSize(other))
            throw new Error("cannot add matrices with different dimensions");

        return new Matrix(this.matrix.map((_, ri) => _.map((c, ci) => c.add(other.matrix[ri][ci]))));
    }

    subtract(other: Matrix) {
        return this.add(other.multiplyByScalar(new Complex(-1, 0)));
    }

    canMultiply(other: Matrix) {
        return this.columns === other.rows;
    }

    multiply(other: Matrix) {
        if (!this.canMultiply(other))
            throw new Error("cannot multiply matrices with incompatible dimensions");

        return new Matrix(this.getColumn(0).map((_, i) => // for each row 
            other.getRow(0).map((_, j) => // we want to make a a new row with the same number of columns as the other matrix
                this.getRow(0).reduce((acc, _, k) => // k from 0 to the number of columns in the first matrix
                    acc.add(this.get(i, k).multiply(other.get(k, j))), new Complex(0, 0)))));
    }

    // helper methods

    private static isMatrix(mtx: (number | Complex)[][]) {
        const m = mtx.length;   // rows

        if (m === 0)
            return false;

        const n = mtx[0].length;

        return n > 0 && mtx.every(row => row.length === n);
    }
}
