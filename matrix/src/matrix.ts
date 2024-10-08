import { Complex, Scalar } from "./complex";
import { EliminationIterator, RowOperation, RowOperationType, RowOperationResult } from "./elimination-iterator";
import { Polynomial } from "./polynomial";
import { removeDuplicates } from "./util";
import { Vector, VectorType } from "./vector";

export class Matrix {
    private matrix: Complex[][];

    constructor(matrix: Scalar[][]) {
        if (!Matrix.isMatrix(matrix))
            throw new Error("Invalid matrix");

        this.matrix = matrix.map(row => row.map(cell => Complex.fromScalar(cell)));
    }

    // getters

    get rows(): number {
        return this.getColumn(0).length;
    }

    get columns(): number {
        return this.getRow(0).length;
    }

    get(row: number, column: number): Complex {
        return this.matrix[row][column];
    }

    getRow(row: number): Complex[] {
        return this.matrix[row].slice();
    }

    getColumn(column: number): Complex[] {
        return this.matrix.map(row => row[column]);
    }

    // setters

    set(row: number, column: number, value: Scalar): void {
        this.matrix[row][column] = Complex.fromScalar(value);
    }

    setRow(row: number, values: Scalar[]): void {
        if (values.length !== this.columns)
            throw new Error("Invalid row size");

        this.matrix[row].forEach((_, i) => this.matrix[row][i] = Complex.fromScalar(values[i]));
    }

    setColumn(column: number, values: Scalar[]): void {
        if (values.length !== this.rows)
            throw new Error("Invalid column size");

        this.matrix.forEach((_, i) => this.matrix[i][column] = Complex.fromScalar(values[i]));
    }

    static scalar(value: Scalar, size: number): Matrix {
        return new Matrix(Array.from({ length: size }, (_, i) =>
            Array.from({ length: size }, (_, j) => i === j ? value : 0)));
    }

    static identity(size: number): Matrix {
        return Matrix.scalar(1, size);
    }

    static zero(size: number): Matrix {
        return Matrix.scalar(0, size);
    }

    static diag(items: Scalar[]): Matrix {
        return new Matrix(items.map((item, i) => items.map((_, j) => i === j ? item : 0)));
    }

    sameSize(other: Matrix) {
        return this.rows === other.rows && this.columns === other.columns;
    }

    equals(other: Matrix) {
        return this.sameSize(other) && this.matrix.every((row, ri) =>
            row.every((item, ci) => item.equals(other.get(ri, ci))));
    }

    // matrix operations

    transpose(): Matrix {
        return new Matrix(this.getRow(0).map((_, ci) => this.matrix.map((_, ri) => this.get(ri, ci))));
    }

    conjugate(): Matrix {
        return new Matrix(this.matrix.map(row => row.map(cell => cell.conjugate())));
    }

    conjugateTranspose(): Matrix {
        return this.transpose().conjugate();
    }

    trace(): Complex {
        if (!this.isSquare())
            throw new Error("cannot calculate the trace of a non-square matrix");

        return this.matrix.reduce((acc, row, index) => acc.add(row[index]), Complex.zero);
    }


    minor(row: number, column: number): Matrix {
        return new Matrix(this.matrix.filter((_, ri) => ri !== row).map(row => row.filter((_, ci) => ci !== column)));
    }

    /**
     * Calculates the determinant of the matrix.
     * @param usePolar Whether to use the polar form of the complex numbers to calculate the determinant.
     * @returns the determinant of the matrix.
     */
    determinant(usePolar: boolean = true): Complex {
        if (!this.isSquare())
            throw new Error("cannot calculate the determinant of a non-square matrix");

        if (this.rows === 1)
            return this.get(0, 0);

        const sign = [1, -1];

        return this.getRow(0).reduce((acc, curr, i) =>
            acc.add(curr.multiply(this.minor(0, i).determinant()).multiply(sign[i % 2], usePolar)),
            Complex.zero);
    };

    characteristicPolynomial(usePolar: boolean = true): Polynomial {
        if (!this.isSquare())
            throw new Error("cannot calculate the characteristic polynomial of a non-square matrix");

        if (this.rows === 1)
            return Polynomial.makeLinearMonic(this.get(0, 0));

        const polyMatrix = this.matrix.map((row, i) => row.map((cell, j) =>
            i === j ? Polynomial.makeLinearMonic(cell) : Polynomial.makeConstant(cell.multiply(-1, usePolar))));

        // calculate the determinant of the matrix of polynomials

        const minor = (pmtx: Polynomial[][], row: number, column: number): Polynomial[][] =>
            pmtx.filter((_, i) => i !== row).map(row => row.filter((_, j) => j !== column));

        const det = (pmtx: Polynomial[][]): Polynomial => {
            if (pmtx.length === 1)
                return pmtx[0][0];

            const sign = [1, -1];

            return pmtx[0].reduce((acc, curr, i) =>
                acc.add(curr.multiplyScalar(sign[i % 2], usePolar).multiply(det(minor(pmtx, 0, i)), usePolar)),
                Polynomial.makeConstant(0));
        }

        return det(polyMatrix);
    }

    eigenvalues(usePolar: boolean = true): Complex[] {
        return this.characteristicPolynomial().findRoots(usePolar, 6, 9, 1000);
    }

    singularValues(usePolar: boolean = true): number[] {
        if (this.rows < this.columns) {
            return this.multiply(this.conjugateTranspose()).eigenvalues(usePolar).map(c => Math.sqrt(c.real));
        }

        return this.conjugateTranspose().multiply(this).eigenvalues(usePolar).map(c => Math.sqrt(c.real));
    }

    /**
     * Diagonalize the matrix.
     * @param usePolar 
     * @returns two matrices U and D s.t. U is invertible, D is diagonal and M = UDU^-1.
     */
    diagonalize(usePolar: boolean = true): [Matrix, Matrix] {
        if (!this.isSquare())
            throw new Error("cannot diagonalize a non-square matrix");

        if (this.isDiagonal()) {
            return [Matrix.identity(this.rows), this.copy()];
        }

        const polyMatrix = this.matrix.map((row, i) => row.map((cell, j) =>
            i === j ? Polynomial.makeLinearMonic(cell) : Polynomial.makeConstant(cell.multiply(-1, usePolar))));

        const eig = this.eigenvalues();

        const eigSet = removeDuplicates(eig, (a, b) => a.equals(b));

        const u: Vector[] = [];

        // find the nullity space for each eigenvalue and check if Am == Gm

        for (let val of eigSet) {
            const algebraic = eig.filter(e => e.equals(val)).length;

            // substitute

            const mtx = new Matrix(polyMatrix.map(row => row.map(cell => cell.substitute(val, usePolar))));

            const nullity = mtx.solveHomogenousLinearSystem(usePolar);

            const geometric = nullity.length - 1;

            if (geometric < algebraic) {
                throw new Error("not diagonalizable");
            }
            else {
                u.push(...nullity.slice(1).map(pair => pair[1]));
            }
        }

        const U = Matrix.joinVectors(u);

        return [U, Matrix.diag(eig)];
    }

    // ! this works but not always, needs a fix
    svd(usePolar: boolean = true): [Matrix, Matrix, Matrix] {
        const singularValues = this.singularValues(usePolar).sort((a, b) => b - a);   // descending order

        const Sigma = new Matrix(this.getColumn(0).map((_, i) =>
            this.getRow(0).map((_, j) =>
                i == j ? singularValues[i] : 0)));

        // V

        const AHA = this.conjugateTranspose().multiply(this, usePolar);

        const [AHA_U, AHA_D] = AHA.diagonalize(usePolar);

        const eigenvectors = new Map<number, Vector[]>();

        var currentSet = [Vector.columnVector(AHA_U.getColumn(0))];
        var currentEigenvalue = AHA_D.get(0, 0);

        for (let i = 1; i < AHA.rows; i++) {
            if (AHA_D.get(i, i).equals(currentEigenvalue)) {
                currentSet.push(Vector.columnVector(AHA_U.getColumn(i)));
            } else {
                // make orthonormal basis
                const orthonormal = Vector.gramSchmidt(currentSet, true);
                eigenvectors.set(currentEigenvalue.real, orthonormal);

                // reset
                currentSet = [Vector.columnVector(AHA_U.getColumn(i))];
                currentEigenvalue = AHA_D.get(i, i);
            }
        }

        // last eigenvalue
        const orthonormal = Vector.gramSchmidt(currentSet, true);
        eigenvectors.set(currentEigenvalue.real, orthonormal);

        const VColumns: Vector[] = [];

        const WColumns: Vector[] = [];

        const eigenvalues = removeDuplicates(AHA.eigenvalues(), (a, b) => a.equals(b)).sort((a, b) => b.real - a.real);

        for (let eigenvalue of eigenvalues) {
            const vectors = eigenvectors.get(eigenvalue.real)!;

            VColumns.push(...vectors);

            if (eigenvalue.real > 0) {
                WColumns.push(...vectors.map(v => this.multiplyByVector(v).multiplyScalar(1 / Math.sqrt(eigenvalue.real))));
            }
        }

        const V = Matrix.joinVectors(VColumns);

        // W

        const WColumnsComplete = Vector.complementBasis(WColumns, usePolar);

        const W = Matrix.joinVectors(WColumnsComplete);

        return [W, Sigma, V.conjugateTranspose()];
    }

    inverse(): Matrix {
        if (!this.isSquare()) {
            throw new Error("cannot calculate the inverse of a non-square matrix");
        }

        const it = this.RREFIterator();

        const id = Matrix.identity(this.rows);

        for (const m of it) {
            id.rowOperation(m.operation);
        }

        const result: RowOperationResult = it.next().value;

        if (!result.matrix.isIdentity()) {
            throw new Error("matrix is not invertible");
        }

        return id;
    }

    // scalar operations

    multiplyByScalar(scalar: Scalar, usePolar: boolean = true): Matrix {
        return new Matrix(this.matrix.map(row => row.map(item => item.multiply(scalar, usePolar))));
    }

    multiplyByVector(vector: Vector): Vector {
        if (this.columns !== vector.length)
            throw new Error("cannot multiply a matrix by a vector with incompatible dimensions");

        return Array.from({ length: this.columns }, (_, i) =>
            Vector.columnVector(this.getColumn(i)).multiplyScalar(vector.get(i))).reduce((acc, curr) =>
                acc.add(curr), Vector.zero(this.rows, VectorType.COLUMN));
    }

    addScalar(scalar: Scalar): Matrix {
        if (!this.isSquare())
            throw new Error("cannot add a scalar to a non-square matrix");

        return new Matrix(this.matrix.map(row => row.map(item => item.add(scalar))));
    }

    // matrix arithmetic operations

    add(other: Matrix): Matrix {
        if (!this.sameSize(other))
            throw new Error("cannot add matrices with different dimensions");

        return new Matrix(this.matrix.map((_, ri) => _.map((c, ci) => c.add(other.get(ri, ci)))));
    }

    subtract(other: Matrix): Matrix {
        if (!this.sameSize(other))
            throw new Error("cannot subtract matrices with different dimensions");

        return new Matrix(this.matrix.map((_, ri) => _.map((c, ci) => c.subtract(other.get(ri, ci)))));
    }

    canMultiply(other: Matrix): boolean {
        return this.columns === other.rows;
    }

    multiply(other: Matrix, usePolar: boolean = true): Matrix {
        if (!this.canMultiply(other))
            throw new Error("cannot multiply matrices with incompatible dimensions");

        return new Matrix(this.getColumn(0).map((_, i) => // for each row 
            other.getRow(0).map((_, j) => // we want to make a a new row with the same number of columns as the other matrix
                this.getRow(0).reduce((acc, _, k) => // k from 0 to the number of columns in the first matrix
                    acc.add(this.get(i, k).multiply(other.get(k, j), usePolar)), Complex.zero))));
    }

    power(n: number, usePolar: boolean = true): Matrix {
        if (!this.isSquare())
            throw new Error("cannot raise a non-square matrix to a power");

        if (n === 0)
            return Matrix.identity(this.rows);

        if (n < 0)
            throw new Error("cannot raise a matrix to a negative power");

        if (this.isDiagonal()) {
            return new Matrix(this.matrix.map((row, i) => row.map((cell, j) => i === j ? cell.power(n, usePolar) : 0)));
        }

        try {
            const [U, D] = this.diagonalize(usePolar);

            return U.multiply(D.power(n, usePolar).multiply(U.inverse(), usePolar), usePolar);
        } finally {
            return Array.from({ length: n - 1 }, () => this).reduce((acc: Matrix, _) => acc.multiply(this, usePolar), this);
        }
    }

    // row operations

    /**
     * Swaps two rows in the matrix, in place.
     * @param i the first row.
     * @param j the second row.
     */
    swapRows(i: number, j: number): void {
        const temp = this.getRow(i);

        this.setRow(i, this.getRow(j));
        this.setRow(j, temp);
    }

    /**
     * Multiplies a row by a scalar, in place.
     * @param row the row to multiply.
     * @param scalar the scalar to multiply by.
     * @param usePolar whether to use the polar form of the complex numbers to calculate the result.
     */
    multiplyRow(row: number, scalar: Scalar, usePolar: boolean = true): void {
        this.setRow(row, this.getRow(row).map(cell => cell.multiply(scalar, usePolar)));
    }

    /**
     * Adds a scalar multiple of one row to another row, in place.
     * @param i the row to add to.
     * @param j the row to add.
     * @param scalar the scalar to multiply the row by.
     */
    addRow(i: number, j: number, scalar: Scalar): void {
        this.setRow(i, this.getRow(i).map((cell, k) => cell.add(this.get(j, k).multiply(scalar))));
    }

    RREFIterator(usePolar: boolean = true): EliminationIterator {
        return new EliminationIterator(this, usePolar);
    }

    /**
     * @returns the reduced row echelon form of the matrix.
     */
    RREF(usePolar: boolean = true): Matrix {
        const iterator = this.RREFIterator(usePolar);

        for (const m of iterator)
            continue;

        return iterator.next().value.matrix;
    }

    /**
     * Reduces the matrix to its reduced row echelon form, in place.
     */
    reduceToRREF(usePolar: boolean = true): void {
        this.matrix = this.RREF(usePolar).matrix;
    }

    /**
     * Performs a row operation on the matrix.
     * @param operation the row operation to perform.
     * @note this method modifies the matrix in place.
     */
    rowOperation(operation: RowOperation, usePolar: boolean = true): void {
        switch (operation.type) {
            case RowOperationType.Swap:
                this.swapRows(operation.row1, operation.row2);
                break;
            case RowOperationType.Multiply:
                this.multiplyRow(operation.row, operation.scalar, usePolar);
                break;
            case RowOperationType.Add:
                this.addRow(operation.row1, operation.row2, operation.scalar);
                break;
            case RowOperationType.None:
                break;
        }
    }

    rowOperationSequence(operations: RowOperation[], usePolar: boolean = true): void {
        operations.forEach(op => this.rowOperation(op, usePolar));
    }

    solveHomogenousLinearSystem(usePolar: boolean = true): [number, Vector][] {
        return this.solveLinearSystem(Vector.zero(this.rows, VectorType.COLUMN), usePolar);
    }

    solveLinearSystem(sol: Vector, usePolar: boolean = true): [number, Vector][] {
        if (sol.length != this.rows) {
            throw new Error("incorrect size of solutions vector");
        }

        // first, reduce

        const it = this.RREFIterator(usePolar);

        const bMatrix = sol.asMatrix();

        for (const m of it) {
            bMatrix.rowOperation(m.operation, usePolar);
        }

        const A: Matrix = (it.next().value as RowOperationResult).matrix;

        const b = Vector.columnVector(bMatrix.getColumn(0));

        // check for consistency

        if (A.matrix.some((row, i) => !(b.get(i).isZero()) && row.every(cell => cell.isZero()))) {
            return [];
        }

        // find the bound variables (pivot columns)

        const bound: number[] = [];

        for (let i = 0; i < A.rows; i++) {
            const column = A.getRow(i).findIndex(item => item.equals(1));

            if (column < 0) {
                break;
            }

            bound.push(column);
        }

        const res: Scalar[][] = Array.from({ length: A.columns }, (_, i) => {
            const index = bound.indexOf(i);

            if (index < 0) {
                // free variable
                return Array.from({ length: A.columns }, (_, j) => j === i ? 1 : 0);
            }

            // bound variable
            return A.getRow(index).map((c, j) => j === i ? 0 : c.multiply(-1, usePolar));
        });

        const vectors = new Matrix(res);

        const paddedB = b.pad(vectors.columns);

        const bPair: [number, Vector] = [0, paddedB];

        const solution: [number, Vector][] = [];

        for (let i = 0; i < vectors.columns; i++) {
            const column = Vector.columnVector(vectors.getColumn(i));

            if (!column.isZero()) {
                solution.push([i + 1, column]);
            }
        }

        return [bPair].concat(solution);
    }

    rank(usePolar: boolean = true): number {
        const reduced = this.RREF(usePolar);

        for (let i = 0; i < this.rows; i++) {
            if (reduced.getRow(i).every(num => num.isZero())) {
                return i;
            }
        }

        return this.rows;
    }

    // fields

    isReal(): boolean {
        return this.matrix.every(row => row.every(cell => cell.isReal()));
    }

    // matrix types

    isSquare(): boolean {
        return this.rows === this.columns;
    }

    isSymmetric(): boolean {
        return this.isReal() && this.equals(this.transpose());
    }

    isSkewSymmetric(): boolean {
        return this.isReal() && this.equals(this.transpose().multiplyByScalar(-1));
    }

    isHermitian(): boolean {
        return this.equals(this.conjugateTranspose());
    }

    isSkewHermitian(): boolean {
        return this.equals(this.conjugateTranspose().multiplyByScalar(-1));
    }

    isDiagonal(): boolean {
        return this.isSquare() && this.matrix.every((row, i) =>
            row.every((cell, j) => i === j || cell.equals(Complex.zero)));
    }

    isInvertible(usePolar: boolean = true): boolean {
        return this.isSquare() && !this.determinant(usePolar).equals(0);
    }

    isUpperTriangular(): boolean {
        return this.matrix.every((row, i) => row.every((cell, j) => i <= j || cell.equals(0)));
    }

    isLowerTriangular(): boolean {
        return this.matrix.every((row, i) => row.every((cell, j) => i >= j || cell.equals(0)));
    }

    isTriangular(): boolean {
        return this.isUpperTriangular() || this.isLowerTriangular();
    }

    isIdentity(): boolean {
        return this.equals(Matrix.identity(this.rows));
    }

    isNormal(): boolean {
        return this.multiply(this.conjugateTranspose()).equals(this.conjugateTranspose().multiply(this));
    }

    isRowVector(): boolean {
        return this.rows === 1;
    }

    isColumnVector(): boolean {
        return this.columns === 1;
    }

    isVector(): boolean {
        return this.isRowVector() || this.isColumnVector();
    }

    isZeroVector(): boolean {
        return (this.isRowVector() && this.getRow(0).every(cell => cell.isZero())) ||
            (this.isColumnVector() && this.getColumn(0).every(cell => cell.isZero()));
    }

    // helper methods

    leftJoin(other: Matrix): Matrix {
        if (this.rows !== other.rows)
            throw new Error("cannot join matrices with different number of rows");

        return new Matrix(this.matrix.map((row, i) => row.concat(other.getRow(i))));
    }

    rightJoin(other: Matrix): Matrix {
        if (this.rows !== other.rows)
            throw new Error("cannot join matrices with different number of rows");

        return new Matrix(this.matrix.map((row, i) => other.getRow(i).concat(row)));
    }

    topJoin(other: Matrix): Matrix {
        if (this.columns !== other.columns)
            throw new Error("cannot join matrices with different number of columns");

        return new Matrix(this.matrix.concat(other.matrix));
    }

    static joinVectors(vectors: Vector[]): Matrix {
        if (vectors.length === 0)
            throw new Error("cannot join empty vectors");

        if (vectors.some(v => v.length !== vectors[0].length || (v.vectorType !== vectors[0].vectorType && v.length > 1)))
            throw new Error("cannot join vectors with different dimensions");

        if (vectors[0].vectorType === VectorType.ROW)
            return new Matrix(vectors.map(v => v.asMatrix().getRow(0)));

        return new Matrix(vectors.map(v => v.asMatrix().getColumn(0))).transpose();
    }

    bottomJoin(other: Matrix): Matrix {
        if (this.columns !== other.columns)
            throw new Error("cannot join matrices with different number of columns");

        return new Matrix(other.matrix.concat(this.matrix));
    }

    copy(): Matrix {
        return new Matrix(this.matrix.map(row => row.map(cell => Complex.fromScalar(cell))));
    }

    toString(): string {
        const p = this.matrix.flat().reduce((acc, curr) => Math.max(acc, curr.toString().length), 0) + 2;
        const divider = " | ";
        const line = "-".repeat((p * this.columns) + (divider.length * (this.columns - 1)) + 2);

        return (line + "\n") +
            this.matrix.map(row =>
                ("|" + row.map(cell => (" ".repeat((p - cell.toString().length) / 2) + cell.toString()).padEnd(p))
                    .join(divider)) + "|").join("\n" + line + "\n") +
            "\n" + line;
    }

    private static isMatrix(mtx: Scalar[][]): boolean {
        const m = mtx.length;   // rows

        if (m === 0)
            return false;

        const n = mtx[0].length;

        return n > 0 && mtx.every(row => row.length === n);
    }
}

export function printLinearSystemSolutions(sol: [number, Complex[]][]) {
    console.log(`(${sol[0][1].map(c => c.toString()).join(", ")})` + (sol.length === 1 ? "" : " +"));

    console.log(sol.slice(1).map(e => `x_${e[0]} (${e[1].map(c => c.toString()).join(", ")})`).join(" +\n"));
}
