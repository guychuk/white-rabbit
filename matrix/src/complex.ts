import { roundNum } from "./util";

export type Scalar = number | Complex;

/** The number of decimal places to round the real and imaginary parts of a complex number to. */
const comparisonPrecision: number = 12;
const storagePrecision: number = 16;

/**
 * A class representing a complex number.
 * @note The class is immutable.
 */
export class Complex {
    private _real: number;
    private _imag: number;

    // polar form (not fixed!)
    private _rad: number;
    private _theta: number;

    constructor(c: [number, number], polarForm: boolean = false) {
        if (polarForm){
            const [r, t] = c;

            this._rad = roundNum(r, storagePrecision);
            this._theta = roundNum(t, storagePrecision);

            this._real = roundNum(r * Math.cos(t), storagePrecision);
            this._imag = roundNum(r * Math.sin(t), storagePrecision);
        } else {
            const [re, im] = c;

            this._real = re;
            this._imag = im;

            this._rad = roundNum(Math.sqrt(Math.pow(re, 2) + Math.pow(im, 2)), storagePrecision);
            this._theta = roundNum(Math.atan2(im, re), storagePrecision);
        }
    }

    // makers

    static fromReal(n: number) : Complex {
        return new Complex([n, 0]);
    }

    static fromScalar(x: Scalar) : Complex {
        return x instanceof Complex ? x : Complex.fromReal(x);
    }

    static readonly one = new Complex([1, 0]);

    static readonly zero = new Complex([0, 0]);

    static readonly negOne = new Complex([-1, 0]);

    static readonly i = new Complex([0, 1]);

    static readonly negi = new Complex([0, -1]);

    // getters
    
    get real() : number {
        return this._real;
    }

    get imaginary() : number {
        return this._imag;
    }

    get r() : number {
        return this._rad;
    }

    get theta() : number {
        return this._theta;
    }

    get cartesian() : [number, number] {
        return [this._real, this._imag];
    }

    get polar() : [number, number] {
        return [this._rad, this._theta];
    }

    // arithmetic operations

    /**
     * Adds a complex number to this complex number.
     * @param other The complex number to add.
     * @returns A new complex number that is the sum of this complex number and the other complex number.
     */
    add(other: Scalar) : Complex {
        const otherComplex = Complex.fromScalar(other);

        return new Complex([this.real + otherComplex.real, this.imaginary + otherComplex.imaginary]);
    }

    /**
     * Subtracts a complex number from this complex number.
     * @param other The complex number to subtract.
     * @returns A new complex number that is the difference between this complex number and the other complex number.
     */
    subtract(other: Scalar) : Complex {
        const otherComplex = Complex.fromScalar(other);
        
        return new Complex([this.real - otherComplex.real, this.imaginary - otherComplex.imaginary]);
    }

    /**
     * Multiplies this complex number by another complex number.
     * @param other The complex number to multiply by.
     * @param usePolar Whether to use the polar form to calculate the product.
     * @returns A new complex number that is the product of this complex number and the other complex number.
     */
    multiply(other: Scalar, usePolar: boolean = true) : Complex {
        const otherComplex = Complex.fromScalar(other);

        if (!usePolar){
            return new Complex([this.real * otherComplex.real - this.imaginary * otherComplex.imaginary, 
                this.real * otherComplex.imaginary + this.imaginary * otherComplex.real]);
        }

        return new Complex([this.r * otherComplex.r, this.theta + otherComplex.theta], true);
    }

    /**
     * Divides this complex number by another complex number.
     * @param other The complex number to divide by.
     * @param usePolar Whether to use the polar form to calculate the quotient.
     * @returns A new complex number that is the quotient of this complex number and the other complex number.
     */
    divide(other: Scalar, usePolar: boolean = true) : Complex {
        const otherComplex = Complex.fromScalar(other);

        if (!usePolar){
            return new Complex([
                (this.real * otherComplex.real + this.imaginary * otherComplex.imaginary) / 
                    (Math.pow(otherComplex.real, 2) + Math.pow(otherComplex.imaginary, 2)),
                (this.imaginary * otherComplex.real - this.real * otherComplex.imaginary) / 
                    (Math.pow(otherComplex.real, 2) + Math.pow(otherComplex.imaginary, 2))
            ]);
        }
        
        return new Complex([this.r / otherComplex.r, this.theta - otherComplex.theta], true);
    }

    /** 
     * @param usePolar Whether to use the polar form to calculate the multiplicative inverse.
     * @returns The multiplicative inverse of this complex number. 
     */
    reciprocal(usePolar: boolean = true) : Complex {
        if (!usePolar){
            return new Complex([this.real / (Math.pow(this.real, 2) + Math.pow(this.imaginary, 2)),
                -1 * this.imaginary / (Math.pow(this.real, 2) + Math.pow(this.imaginary, 2))]);
        }

        return new Complex([1 / this._rad, -1 * this._theta], true);
    }

    /**
     * Raises this complex number to the power of n.
     * @param n The power to raise this complex number to, an integer.
     * @param usePolar Whether to use the polar form to calculate the power.
     * @returns A new complex number that is this complex number raised to the power of n.
     */
    power(n: number, usePolar: boolean = true) : Complex {
        if (!Number.isInteger(n))
            throw new Error("The power must be an integer.");

        if (!usePolar){
            let result = Complex.one;

            for (let i = 0; i < Math.abs(n); i++){
                result = result.multiply(this, false);
            }

            return n > 0 ? result : result.reciprocal(usePolar);
        }

        return new Complex([Math.pow(this._rad, n), n * this._theta], true);
    }

    roots(n: number) : Complex[]{
        return Array.from({ length: n }, (_, k) => 
            new Complex([Math.pow(this.r, 1/n), (this.theta + 2 * k * Math.PI) / n], true));
    }

    // other operations

    /** @returns The complex conjugate of this complex number. */
    conjugate() : Complex {
        return new Complex([this._real, -1 * this._imag]);
    }

    /** @returns The absolute value of this complex number. */
    absoluteValue() : number {
        return this._rad;
    }

    /**
     * Compares this complex number to another complex number.
     * @param other the other complex number to compare.
     * @param p the precision.
     * @returns true if the real and imaginary parts of this complex number are equal to the real and imaginary parts of the other complex number, false otherwise. 
     */
    equals(other: Scalar, p: number = comparisonPrecision) : boolean {
        const otherComplex = Complex.fromScalar(other);
        
        return roundNum(this.real, p) === roundNum(otherComplex.real, p) && 
            roundNum(this.imaginary, p) === roundNum(otherComplex.imaginary, p);
    }

    // properties

    isReal() : boolean {
        return roundNum(this.imaginary, comparisonPrecision) === 0;
    }

    isZero() : boolean {
        return this.equals(0);
    }

    isPureImaginary() : boolean {
        return roundNum(this.real, comparisonPrecision) === 0;
    }

    // others

    toString(p: number = comparisonPrecision) : string {
        if (this.isReal()){
            return roundNum(this.real, p).toString();
        }

        if (this.isPureImaginary()){
            if (this.equals(Complex.i))
                return 'i'
            if (this.equals(Complex.negi))
                return '-i'

            return `${roundNum(this.imaginary, p)}i`;
        }

        if (roundNum(this.imaginary, comparisonPrecision) === 1){
            return `${roundNum(this.real, p)} + i`;
        } else if (roundNum(this.imaginary, comparisonPrecision) === -1){
            return `${roundNum(this.real, p)} - i`;
        }

        if (this.imaginary < 0)
            return `${roundNum(this.real, p)} - ${roundNum(-this.imaginary, p)}i`

        return `${roundNum(this.real, p)} + ${roundNum(this.imaginary, p)}i`
    }

    /**
     * Rounds the real and imaginary parts of this complex number to the specified number of decimal places.
     * @param digits The number of decimal places to round to.
     * @returns A new complex number with the real and imaginary parts rounded to the specified number of decimal places.
     */
    toFixed(digits: number = comparisonPrecision) : Complex {
        return new Complex([roundNum(this._real, digits), roundNum(this._imag, digits)]);
    }

    copy() : Complex {
        return new Complex([this.real, this.imaginary]);
    }
}
