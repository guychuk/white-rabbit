import { round } from "./util";

export type Scalar = number | Complex;

/** The number of decimal places to round the real and imaginary parts of a complex number to. */
const precision: number = 12;
const epsilonPow: number = 9;
const epsilon: number = Number("1e-" + epsilonPow);

/**
 * A class representing a complex number.
 * @note The class is immutable.
 */
export class Complex {
    private _re: number;
    private _im: number;

    // polar form (not fixed!)
    private _r: number;
    private _t: number; // theta

    private constructor(real: number, imaginary: number) {
        this._re = round(real, precision, epsilon);
        this._im = round(imaginary, precision, epsilon);

        this._r = Math.sqrt(Math.pow(this._re, 2) + Math.pow(this._im, 2));
        this._t = Math.atan2(this._im, this._re);
    }

    // makers

    static fromCartesian(real: number, imaginary: number) : Complex {
        return new Complex(real, imaginary);
    }

    static fromPolar(r: number, theta: number) : Complex {
        const c = round(Math.cos(theta), precision);
        const s = round(Math.sin(theta), precision);

        return Complex.fromCartesian(r * c, r * s);
    }

    static fromReal(n: number) : Complex {
        return Complex.fromCartesian(n, 0);
    }

    static fromScalar(x: Scalar) : Complex {
        return x instanceof Complex ? x : Complex.fromReal(x);
    }

    static readonly one = Complex.fromCartesian(1, 0);

    static readonly zero = Complex.fromCartesian(0, 0);

    static readonly minusOne = Complex.fromCartesian(-1, 0);

    static readonly i = Complex.fromCartesian(0, 1);

    // getters
    
    get real() : number {
        return this._re;
    }

    get imaginary() : number {
        return this._im;
    }

    get r() : number {
        return this._r;
    }

    get theta() : number {
        return this._t;
    }

    get cartesian() : [number, number] {
        return [this._re, this._im];
    }

    get polar() : [number, number] {
        return [this._r, this._t];
    }

    // arithmetic operations

    /**
     * Adds a complex number to this complex number.
     * @param other The complex number to add.
     * @returns A new complex number that is the sum of this complex number and the other complex number.
     */
    add(other: Scalar) : Complex {
        const otherComplex = Complex.fromScalar(other);

        return Complex.fromCartesian(this.real + otherComplex.real, this.imaginary + otherComplex.imaginary);
    }

    /**
     * Subtracts a complex number from this complex number.
     * @param other The complex number to subtract.
     * @returns A new complex number that is the difference between this complex number and the other complex number.
     */
    subtract(other: Scalar) : Complex {
        const otherComplex = Complex.fromScalar(other);
        
        return Complex.fromCartesian(this.real - otherComplex.real, this.imaginary - otherComplex.imaginary);
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
            return Complex.fromCartesian(
                this.real * otherComplex.real - this.imaginary * otherComplex.imaginary, 
                this.real * otherComplex.imaginary + this.imaginary * otherComplex.real
            );
        }

        return Complex.fromPolar(this.r * otherComplex.r, this.theta + otherComplex.theta);
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
            return Complex.fromCartesian(
                (this.real * otherComplex.real + this.imaginary * otherComplex.imaginary) / 
                    (Math.pow(otherComplex.real, 2) + Math.pow(otherComplex.imaginary, 2)),
                (this.imaginary * otherComplex.real - this.real * otherComplex.imaginary) / 
                    (Math.pow(otherComplex.real, 2) + Math.pow(otherComplex.imaginary, 2))
            );
        }
        
        return Complex.fromPolar(this.r / otherComplex.r, this.theta - otherComplex.theta);
    }

    /** 
     * @param usePolar Whether to use the polar form to calculate the multiplicative inverse.
     * @returns The multiplicative inverse of this complex number. 
     */
    reciprocal(usePolar: boolean = true) : Complex {
        if (!usePolar){
            return Complex.fromCartesian(this.real / (Math.pow(this.real, 2) + Math.pow(this.imaginary, 2)),
                -1 * this.imaginary / (Math.pow(this.real, 2) + Math.pow(this.imaginary, 2)));
        }

        return Complex.fromPolar(1 / this._r, -1 * this._t);
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

        return Complex.fromPolar(Math.pow(this._r, n), n * this._t);
    }

    roots(n: number) : Complex[]{
        return Array.from({ length: n }, (_, k) => 
            Complex.fromPolar(Math.pow(this.r, 1/n), (this.theta + 2 * k * Math.PI) / n));
    }

    // other operations

    /** @returns The complex conjugate of this complex number. */
    conjugate() : Complex {
        return Complex.fromCartesian(this._re, -1 * this._im);
    }

    /** @returns The absolute value of this complex number. */
    absoluteValue() : number {
        return this._r;
    }

    /**
     * Compares this complex number to another complex number.
     * @param other the other complex number to compare.
     * @param e the precision.
     * @returns true if the real and imaginary parts of this complex number are equal to the real and imaginary parts of the other complex number, false otherwise. 
     */
    equals(other: Scalar, e: number = epsilonPow) : boolean {
        const otherComplex = Complex.fromScalar(other);
        
        return this.real.toPrecision(e) == otherComplex.real.toPrecision(e) && 
            this.imaginary.toPrecision(e) == otherComplex.imaginary.toPrecision(e);
    }

    // properties

    isReal() : boolean {
        return this._im === 0;
    }

    isZero() : boolean {
        return this._r === 0;
    }

    isPureImaginary() : boolean {
        return this._re === 0;
    }

    // others

    toString() : string {
        return `${this._re} + ${this._im}i`;
    }

    /**
     * Rounds the real and imaginary parts of this complex number to the specified number of decimal places.
     * @param digits The number of decimal places to round to.
     * @returns A new complex number with the real and imaginary parts rounded to the specified number of decimal places.
     */
    toRound(digits: number = precision) : Complex {
        return Complex.fromCartesian(round(this._re, digits,epsilon), round(this._im, digits,epsilon));
    }
}
