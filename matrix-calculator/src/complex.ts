export class Complex {
    real: number;
    imaginary: number;

    constructor(real: number, imaginary: number) {
        this.real = real;
        this.imaginary = imaginary;
    }

    // arithmetic operations

    add(other: Complex) : Complex {
        return new Complex(this.real + other.real, this.imaginary + other.imaginary);
    }

    subtract(other: Complex) : Complex {
        return new Complex(this.real - other.real, this.imaginary - other.imaginary);
    }

    multiply(other: Complex) : Complex {
        return new Complex(this.real * other.real - this.imaginary * other.imaginary, this.real * other.imaginary + this.imaginary * other.real);
    }

    divide(other: Complex) : Complex {
        const denominator = Math.pow(other.real, 2) + Math.pow(other.imaginary, 2);

        const numerator = this.multiply(other.conjugate());

        return new Complex(numerator.real / denominator, numerator.imaginary / denominator);
    }

    reciprocal() : Complex {
        return new Complex(1, 0).divide(this);
    }

    // other operations

    conjugate() : Complex {
        return new Complex(this.real, -1 * this.imaginary);
    }

    absoluteValue() : number {
        return Math.sqrt(Math.pow(this.real, 2) + Math.pow(this.imaginary, 2));
    }

    equals(other: Complex) : boolean {
        return this.real === other.real && this.imaginary === other.imaginary;
    }

    // properties

    isReal() : boolean {
        return this.imaginary === 0;
    }

    isPureImaginary() : boolean {
        return this.real === 0;
    }

    toString() : string {
        return `${this.real} + ${this.imaginary}i`;
    }
}
