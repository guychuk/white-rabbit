import { Complex, Scalar } from "./complex";
import { EliminationIterator } from "./elimination-iterator";

export class Matrix {
    private matrix: Complex[][];

    constructor(matrix: Scalar[][]) {
        if (!Matrix.isMatrix(matrix))
            throw new Error("Invalid matrix");

        this.matrix = matrix.map(row => row.map(cell => Complex.fromScalar(cell)));
    }

    // geters

    get rows() : number {
        return this.getColumn(0).length;
    }

    get columns() : number {
        return this.getRow(0).length;
    }

    get(row: number, column: number) : Complex {
        return this.matrix[row][column];
    }

    getRow(row: number) : Complex[] {
        return this.matrix[row].slice();
    }

    getColumn(column: number) : Complex[] {
        return this.matrix.map(row => row[column]);
    }

    // setters

    set(row: number, column: number, value: Scalar) : void{
        this.matrix[row][column] = Complex.fromScalar(value);
    }

    setRow(row: number, values: Scalar[]) : void {
        if (values.length !== this.columns)
            throw new Error("Invalid row size");

        this.matrix[row].forEach((_, i) => this.matrix[row][i] = Complex.fromScalar(values[i]));
    }

    setColumn(column: number, values: Scalar[]) : void {
        if (values.length !== this.rows)
            throw new Error("Invalid column size");

        this.matrix.forEach((_, i) => this.matrix[i][column] = Complex.fromScalar(values[i]));
    }

    static scalar(value: Scalar, size: number) : Matrix {
        return new Matrix(Array.from({length: size}, (_, i) => 
            Array.from({length: size}, (_, j) => i === j ? value : 0)));
    }

    static identity(size: number) : Matrix {
        return Matrix.scalar(1, size);
    }

    static zero(size: number) : Matrix {
        return Matrix.scalar(0, size);
    }

    sameSize(other: Matrix) {
        return this.rows === other.rows && this.columns === other.columns;
    }

    equals(other: Matrix) {
        return this.sameSize(other) && this.matrix.every((row, ri) => 
            row.every((item, ci) => item.equals(other.get(ri, ci))));
    }

    // matrix operations

    transpose() : Matrix{
        return new Matrix(this.getRow(0).map((_, ci) => this.matrix.map((_, ri) => this.get(ri, ci))));
    }

    conjugate() : Matrix {
        return new Matrix(this.matrix.map(row => row.map(cell => cell.conjugate())));
    }

    conjugateTranspose() : Matrix {
        return this.transpose().conjugate();
    }

    trace() : Complex{
        if (!this.isSquare())
            throw new Error("cannot calculate the trace of a non-square matrix");

        return this.matrix.reduce((acc, row, index) => acc.add(row[index]), Complex.zero);
    }

    minor(row: number, column: number) : Matrix {
        return new Matrix(this.matrix.filter((_, ri) => ri !== row).map(row => row.filter((_, ci) => ci !== column)));
    }

    determinant() : Complex{
        if (!this.isSquare())
            throw new Error("cannot calculate the determinant of a non-square matrix");

        if (this.rows === 1)
            return this.get(0, 0);

        const sign = [Complex.one, Complex.minusOne];

        return this.getRow(0).reduce((acc, curr, i) => 
            acc.add(sign[i % 2].multiply(curr.multiply(this.minor(0, i).determinant()))),
            Complex.zero);
    };

    // scalar operations

    multiplyByScalar(scalar: Scalar) : Matrix {
        return new Matrix(this.matrix.map(row => row.map(item => item.multiply(scalar))));
    }

    addScalar(scalar: Scalar) : Matrix {
        if (!this.isSquare())
            throw new Error("cannot add a scalar to a non-square matrix");

        return new Matrix(this.matrix.map(row => row.map(item => item.add(scalar))));
    }

    // matrix arithmetic operations

    add(other: Matrix) : Matrix {
        if (!this.sameSize(other))
            throw new Error("cannot add matrices with different dimensions");

        return new Matrix(this.matrix.map((_, ri) => _.map((c, ci) => c.add(other.get(ri, ci)))));
    }

    subtract(other: Matrix) : Matrix {
        return this.add(other.multiplyByScalar(Complex.minusOne));
    }

    canMultiply(other: Matrix) : boolean {
        return this.columns === other.rows;
    }

    multiply(other: Matrix) : Matrix {
        if (!this.canMultiply(other))
            throw new Error("cannot multiply matrices with incompatible dimensions");

        return new Matrix(this.getColumn(0).map((_, i) => // for each row 
            other.getRow(0).map((_, j) => // we want to make a a new row with the same number of columns as the other matrix
                this.getRow(0).reduce((acc, _, k) => // k from 0 to the number of columns in the first matrix
                    acc.add(this.get(i, k).multiply(other.get(k, j))), Complex.zero))));
    }

    power(n: number) : Matrix {
        if (!this.isSquare())
            throw new Error("cannot raise a non-square matrix to a power");

        if (n === 0)
            return Matrix.identity(this.rows);

        if (n < 0)
            throw new Error("cannot raise a matrix to a negative power");

        return Array.from({length: n - 1}, () => this).reduce((acc: Matrix, _) => acc.multiply(this), this);
    }

    // row operations

    swapRows(i: number, j: number) : void {
        const temp = this.getRow(i);

        this.setRow(i, this.getRow(j));
        this.setRow(j, temp);
    }

    multiplyRow(row: number, scalar: Scalar) : void {
        this.setRow(row, this.getRow(row).map(cell => cell.multiply(scalar)));
    }

    addRow(i: number, j: number, scalar: Scalar) : void {
        this.setRow(i, this.getRow(i).map((cell, k) => cell.add(this.get(j, k).multiply(scalar))));
    }

    gaussEliminationIterator() : EliminationIterator {
        return new EliminationIterator(this);
    }

    reducedRowEchelonForm() : Matrix {
        const iterator = this.gaussEliminationIterator();

        for (const m of iterator)
            continue;

        return iterator.next().value;
    }

    // fields

    isReal() : boolean {
        return this.matrix.every(row => row.every(cell => cell.isReal()));
    }

    // matrix types

    isSquare() : boolean {
        return this.rows === this.columns;
    }

    isSymmetric() : boolean {
        return this.isReal() && this.equals(this.transpose());
    }

    isSkewSymmetric() : boolean {
        return this.isReal() && this.equals(this.transpose().multiplyByScalar(-1));
    }

    isHermitian() : boolean {
        return this.equals(this.conjugateTranspose());
    }

    isSkewHermitian() : boolean {
        return this.equals(this.conjugateTranspose().multiplyByScalar(-1));
    }

    isDiagonal() : boolean {
        return this.isSquare() && this.matrix.every((row, i) => 
            row.every((cell, j) => i === j || cell.equals(Complex.zero)));
    }

    isInvertible() : boolean {
        return this.isSquare() && !this.determinant().equals(0);
    }

    isUpperTriangular() : boolean {
        return this.matrix.every((row, i) => row.every((cell, j) => i <= j || cell.equals(0)));
    }

    isLowerTriangular() : boolean {
        return this.matrix.every((row, i) => row.every((cell, j) => i >= j || cell.equals(0)));
    }

    isTriangular() : boolean {
        return this.isUpperTriangular() || this.isLowerTriangular();
    }

    // helper methods

    copy() : Matrix {
        return new Matrix(this.matrix.map(row => row.map(cell => Complex.fromScalar(cell))));
    }

    toString() : string {
        const p = this.matrix.flat().reduce((acc, curr) => Math.max(acc, curr.toString().length), 0) + 2;
        const divider = " | ";
        const line = "-".repeat((p * this.columns) + (divider.length * (this.columns - 1)) + 2);

        return (line + "\n") + 
            this.matrix.map(row => 
                ("|" + row.map(cell => (" ".repeat((p - cell.toString().length) / 2) + cell.toString()).padEnd(p))
                    .join(divider)) + "|").join("\n" + line + "\n") +
            "\n" + line;
    }

    private static isMatrix(mtx: Scalar[][]) : boolean {
        const m = mtx.length;   // rows

        if (m === 0)
            return false;

        const n = mtx[0].length;

        return n > 0 && mtx.every(row => row.length === n);
    }
}
