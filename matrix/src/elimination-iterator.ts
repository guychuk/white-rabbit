import { Scalar } from "./complex";
import { Matrix } from "./matrix";

export enum RowOperationType {
    Swap,
    Add,
    Multiply,
    None
}

export type SwapOperation = { type: RowOperationType.Swap, row1: number, row2: number };

export type AddOperation = { type: RowOperationType.Add, row1: number, row2: number, scalar: Scalar };

export type MultiplyOperation = { type: RowOperationType.Multiply, row: number, scalar: Scalar };

export type NoneOperation = { type: RowOperationType.None };

export type RowOperation = SwapOperation | AddOperation | MultiplyOperation | NoneOperation;

export type RowOperationResult = { matrix: Matrix, operation: RowOperation };

export const makeSwapOperation = (row1: number, row2: number) : SwapOperation => {
    return { type: RowOperationType.Swap, row1: row1, row2: row2 };
}

export const makeAddOperation = (row1: number, row2: number, scalar: Scalar) : AddOperation => {
    return { type: RowOperationType.Add, row1: row1, row2: row2, scalar: scalar };
}

export const makeMultiplyOperation = (row: number, scalar: Scalar) : MultiplyOperation => {
    return { type: RowOperationType.Multiply, row: row, scalar: scalar };
}

export const makeNoneOperation = () : NoneOperation => {
    return { type: RowOperationType.None };
}

export const makeRowOperationResult = (matrix: Matrix, operation: RowOperation) : RowOperationResult => {
    return { matrix: matrix.copy(), operation: operation };
}

export const rowOperationToString = (operation: RowOperation) : string => {
    switch (operation.type){
        case RowOperationType.Swap:
            return `R${operation.row1 + 1} <-> R${operation.row2 + 1}`;
        case RowOperationType.Add:
            return `(${operation.scalar.toString()}) * R${operation.row2 + 1} + R${operation.row1 + 1} -> R${operation.row1 + 1}`;
        case RowOperationType.Multiply:
            return `(${operation.scalar.toString()}) * R${operation.row + 1} -> R${operation.row + 1}`;
        case RowOperationType.None:
            return "-";
    }
}

export const rowOperationResultToString = (result: RowOperationResult) : string => {
    const operationString = rowOperationToString(result.operation);

    const matrixString = result.matrix.toString();

    const lineLength = matrixString.indexOf("\n");

    const diff = (lineLength - operationString.length) / 2;

    const leftPadding = " ".repeat(diff > 0 ? diff : 0);

    return "-".repeat(lineLength) + "\n" + leftPadding + operationString + "\n" + matrixString;
}

/**
 * An iterator that performs Gaussian elimination on a matrix.
 * It returns the matrix after each row operation, and the operation that was performed.
 */
export class EliminationIterator implements IterableIterator<RowOperationResult> {
    private matrix: Matrix;
    private row: number;    // never going back!
    private column: number; // never going back!
    public pivots: [number, number][]; // (row, column)
    private done: boolean;
    private eliminatingBelow: boolean;
    private eliminatingAbove: boolean;
    private movingUp: boolean;
    private usedRows: number;

    /**
     * Build a new Gaussian elimination iterator.
     * @param matrix The matrix to perform Gaussian elimination on.
     * @note The matrix will be copied, so the original matrix will not be modified.
     */
    constructor(matrix: Matrix) {
        this.matrix = matrix.copy();
        this.row = -1;
        this.column = -1;
        this.pivots = [];
        this.done = false;
        this.eliminatingBelow = false;
        this.eliminatingAbove = false
        this.movingUp = false;
        this.usedRows = 0;
    }

    [Symbol.iterator](): IterableIterator<RowOperationResult> {
        return this;
    }

    next(): IteratorResult<RowOperationResult, any> {
        if (this.done){
            return { value: makeRowOperationResult(this.matrix, makeNoneOperation()), done: true };
        }

        if (this.movingUp){
            this.movingUp = false;
            this.eliminatingBelow = true;

            const moveOperation = this.moveUp();

            if (moveOperation.type === RowOperationType.Swap){
                return { value: makeRowOperationResult(this.matrix, moveOperation), done: false };
            }
        }

        if (this.eliminatingBelow){
            // try to eliminate the next row

            const eliminateOperation = this.eliminateColumnBelow();

            this.eliminatingBelow = eliminateOperation.type === RowOperationType.Add;

            if (this.eliminatingBelow){
                return { value: makeRowOperationResult(this.matrix, eliminateOperation), done: false };
            }
        }

        while (!this.eliminatingAbove && this.findPivot()){
            const normaOperation = this.normalizeRow();

            if (normaOperation.type === RowOperationType.Multiply){                
                this.movingUp = true;
                return { value: makeRowOperationResult(this.matrix, normaOperation), done: false };
            }

            // try to move the pivot upwards

            const moveOperation = this.moveUp();

            if (moveOperation.type === RowOperationType.Swap){
                return { value: makeRowOperationResult(this.matrix, moveOperation), done: false };
            }

            // try to eliminate the next row

            const eliminateOperation = this.eliminateColumnBelow();

            this.eliminatingBelow = eliminateOperation.type === RowOperationType.Add;

            if (this.eliminatingBelow){
                return { value: makeRowOperationResult(this.matrix, eliminateOperation), done: false };
            }
        }

        this.eliminatingAbove = true;

        // that was the last pivot

        while (this.eliminatingAbove){
            const eliminateOperation = this.eliminateColumnAbove();

            this.eliminatingAbove = eliminateOperation.type === RowOperationType.Add;

            if (this.eliminatingAbove){
                return { value: makeRowOperationResult(this.matrix, eliminateOperation), done: false };
            }
        }

        // done!

        this.done = true;

        return { value: makeRowOperationResult(this.matrix, makeNoneOperation()), done: true };
    }

    /**
     * Find the next pivot.
     * @returns true if a pivot was found, false otherwise.
     */
    private findPivot() : boolean {
        for (let c = this.column + 1; c < this.matrix.columns; c++){
            for (let r = this.row + 1; r < this.matrix.rows; r++){
                if (!this.matrix.get(r, c).equals(0)){
                    this.row = r;
                    this.column = c;
                    this.pivots.push([r, c]);

                    return true;
                }
            }
        }

        return false;
    }

    /**
     * Normalize the pivot's row.
     * @returns true if the pivot got normalized, false if it was already 1.
     */
    private normalizeRow() : MultiplyOperation | NoneOperation {
        if (this.matrix.get(this.row, this.column).equals(1)){
            return makeNoneOperation();
        }

        const operation = makeMultiplyOperation(this.row, this.matrix.get(this.row, this.column).reciprocal());

        this.matrix.multiplyRow(this.row, operation.scalar);

        return operation;
    }

    /**
     * Eliminate non-zeros in the same column as the pivot and below it.
     * @pre the pivot's value is 1.
     * @returns true if eliminated a row, false otherwise.
     */
    private eliminateColumnBelow() : AddOperation | NoneOperation {
        for (let r = this.row + 1; r < this.matrix.rows; r++){
            if (!this.matrix.get(r, this.column).equals(0)){
                const operation = makeAddOperation(r, this.row, this.matrix.get(r, this.column).multiply(-1));

                this.matrix.addRow(r, this.row, operation.scalar);

                return operation;
            }
        }

        return makeNoneOperation();
    }

    /**
     * Eliminate non-zeros in the same column as the pivot and above it.
     * @pre the pivot's value is 1.
     * @returns true if eliminated a row and there are more rows to check, false otherwise.
     */
    private eliminateColumnAbove() : AddOperation | NoneOperation {
        if (this.pivots.length === 0){
            return makeNoneOperation();
        }

        let r: number = -1;

        while (r === -1){
            // find the next cell to eliminate
            for (r = this.row - 1; 0 <= r; r--){
                if (!this.matrix.get(r, this.column).equals(0)){
                    const operation = makeAddOperation(r, this.row, this.matrix.get(r, this.column).multiply(-1));

                    this.matrix.addRow(r, this.row, operation.scalar);

                    // eliminate the cell
                    
                    if (r === 0){
                        // no more cells to eliminate in this column
                        this.pivots.pop();

                        if (this.pivots.length > 0){
                            // move to the next pivot
                            [this.row, this.column] = this.pivots[this.pivots.length - 1];
                        }
                    }

                    return operation;
                }
            }

            // no more cells to eliminate in this column
            this.pivots.pop();
    
            if (this.pivots.length > 0){
                // move to the next pivot

                [this.row, this.column] = this.pivots[this.pivots.length - 1];
                r = -1;
            } else {
                return makeNoneOperation();
            }
        }

        return makeNoneOperation();    // will not happen
    }

    /**
     * Move the pivot upwards.
     * @returns a swap operation if the pivot was moved, a none operation otherwise.
     */
    private moveUp() : SwapOperation | NoneOperation {
        if (this.row === this.usedRows){
            this.usedRows++;
            return makeNoneOperation();
        }

        const operation = makeSwapOperation(this.row, this.usedRows);

        this.matrix.swapRows(this.row, this.usedRows);

        this.row = this.usedRows;

        this.pivots[this.usedRows][0] = this.usedRows;

        this.usedRows++;

        return operation
    }
}
