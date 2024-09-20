import { Complex, Scalar } from "./complex";
import { Matrix } from "./matrix";

export enum VectorType {
    ROW,
    COLUMN
}

export class Vector {
    private _vector: Complex[];
    private _type: VectorType;

    constructor(vector: Scalar[], type: VectorType) {
        this._vector = vector.map(e => Complex.fromScalar(e));
        this._type = type;
    }

    static rowVector(vector: Scalar[]): Vector {
        return new Vector(vector, VectorType.ROW);
    }

    static columnVector(vector: Scalar[]): Vector {
        return new Vector(vector, VectorType.COLUMN);
    }

    get vectorType(): VectorType {
        return this._type
    }

    get length(): number {
        return this._vector.length;
    }

    get(index: number): Complex {
        return this._vector[index];
    }

    set(index: number, value: Complex): void {
        this._vector[index] = value;
    }

    asMatrix(): Matrix {
        return this.vectorType === VectorType.ROW ? new Matrix([this._vector]) : new Matrix(this._vector.map(e => [e]));
    }

    static fromMatrix(matrix: Matrix): Vector {
        if (matrix.rows === 1) {
            return new Vector(matrix.getRow(0), VectorType.ROW);
        } else if (matrix.columns === 1) {
            return new Vector(matrix.getColumn(0), VectorType.COLUMN);
        } else {
            throw new Error("Matrix must have only one row or one column");
        }
    }

    static zero(length: number, type: VectorType): Vector {
        return new Vector(Array(length).fill(0), type);
    }

    sameDimension(other: Vector): boolean {
        return this.length === other.length && (this.length === 1 || this.vectorType === other.vectorType);
    }

    equals(other: Vector): boolean {
        return this._vector.every((e, i) => e.equals(other.get(i)));
    }

    transpose(): Vector {
        return new Vector(this._vector, this.vectorType === VectorType.ROW ? VectorType.COLUMN : VectorType.ROW);
    }

    conjugate(): Vector {
        return new Vector(this._vector.map(e => e.conjugate()), this.vectorType);
    }

    conjugateTranspose(): Vector {
        return this.transpose().conjugate();
    }

    multiplyScalar(scalar: Scalar): Vector {
        return new Vector(this._vector.map(e => e.multiply(scalar)), this.vectorType);
    }

    add(other: Vector): Vector {
        if (!this.sameDimension(other)) {
            throw new Error("Vectors must have the same dimension");
        }

        return new Vector(this._vector.map((e, i) => e.add(other.get(i))), this.vectorType);
    }

    subtract(other: Vector): Vector {
        if (!this.sameDimension(other)) {
            throw new Error("Vectors must have the same dimension");
        }

        return new Vector(this._vector.map((e, i) => e.subtract(other.get(i))), this.vectorType);
    }

    dot(other: Vector, usePolar: boolean = true): Complex {
        if (this.length !== other.length || (this.length !== 1 && this.vectorType !== other.vectorType)) {
            throw new Error("wrong dimensions");
        }

        return this._vector.reduce((acc, e, i) => acc.add(e.multiply(other.get(i).conjugate(), usePolar)), Complex.zero);
    }

    norm2(): number {
        return Math.sqrt(this.dot(this).real);
    }

    normalized(): Vector {
        if (this.isZero()) {
            throw new Error("Cannot normalize the zero vector");
        }

        return this.multiplyScalar(1 / this.norm2());
    }

    isReal(): boolean {
        return this._vector.every(e => e.isReal());
    }

    isZero(): boolean {
        return this._vector.every(e => e.isZero());
    }

    isPerpendicular(other: Vector): boolean {
        return this.dot(other).isZero();
    }

    static linearlyIndependentSet(vectors: Vector[]): boolean {
        if (vectors.length < 2) {
            return true;
        }

        const matrix = new Matrix(vectors.map(e => e._vector));

        return matrix.rank() === vectors.length;
    }

    static gramSchmidt(vectors: Vector[], normalize: boolean = false): Vector[] {
        if (vectors.length === 0) {
            return [];
        }

        const orthogonalVectors = [normalize ? vectors[0].normalized() : vectors[0]];

        for (let vector of vectors.slice(1)) {
            let projection = orthogonalVectors.reduce((acc, curr) =>
                acc.add(normalize ? curr.multiplyScalar(vector.dot(curr)) :
                    curr.multiplyScalar(vector.dot(curr).divide(curr.dot(curr)))),
                Vector.zero(vector.length, vector.vectorType));

            if (!vector.equals(projection)) {
                orthogonalVectors.push(vector.subtract(projection).normalized());
            }
        }

        return orthogonalVectors;
    }

    static complementBasis(vectors: Vector[], usePolar: boolean = true): Vector[] {
        const mtx = vectors[0]._type === VectorType.ROW ? Matrix.joinVectors(vectors) : Matrix.joinVectors(vectors).transpose();

        const sol = mtx.solveHomogenousLinearSystem(usePolar);

        const complements: Vector[] = [];

        for (let pair of sol) {
            if (pair[0] != 0) {
                const v = Vector.zero(vectors[0].length, vectors[0].vectorType);
                v.set(pair[0] - 1, Complex.one);

                complements.push(v);
            }
        }

        return vectors.concat(complements);
    }

    pad(length: number, scalar: Scalar = 0): Vector {
        if (this.length > length) {
            return this.copy();
        }

        return new Vector(this._vector.concat(Array(length - this.length).fill(scalar)), this.vectorType);
    }

    copy(): Vector {
        return new Vector(this._vector.map(e => e.copy()), this.vectorType);
    }

    toString(): string {
        if (this.vectorType === VectorType.ROW) {
            return `( ${this._vector.map(e => e.toString()).join(", ")} )`;
        }
        return `( ${this._vector.map(e => e.toString()).join(", ")} )^T`
    }

    static removeLinearDependence(vectors: Vector[]): Vector[] {
        // create a matrix out of the vectors

        const mtx = Matrix.joinVectors(vectors);

        // reduce the matrix to row echelon form

        const reduced = mtx.RREF();

        // get the pivot columns

        const pivots: number[] = [];

        for (let i = 0; i < reduced.rows; i++) {
            const column = reduced.getRow(i).findIndex(item => item.equals(1));

            if (column < 0) {
                break;
            }

            pivots.push(column);
        }

        return vectors.filter((_, i) => pivots.indexOf(i) >= 0);
    }
}