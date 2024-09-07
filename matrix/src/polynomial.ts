import { Complex, Scalar } from "./complex";

export class Polynomial {
    polynomial: Map<number, Complex>;  // Map from power to coefficient

    private constructor(polynomial: Map<number, Scalar>) {
        this.polynomial = new Map(Array.from(polynomial.entries())
            .filter(([_, value]) => !Complex.fromScalar(value).equals(0))
                .map(([key, value]) => 
                    [key, Complex.fromScalar(value)]));
    }

    static fromArray(polynomial: [number, Scalar][]): Polynomial {
        return new Polynomial(new Map(polynomial));
    }

    static fromMap(polynomial: Map<number, Scalar>): Polynomial {
        return new Polynomial(polynomial);
    }

    degree() : number {
        let deg: number = Number.NEGATIVE_INFINITY;

        for (const [power, coefficient] of this.polynomial.entries()) {
            if (coefficient.equals(0)) {
                this.polynomial.delete(power);
            } else if (power > deg) {
                deg = power;
            }
        }

        return deg;
    }

    addScalar(value: Scalar): Polynomial {
        return this.add(Polynomial.fromArray([[0, value]]));
    }

    add(other: Polynomial): Polynomial {
        const result = Polynomial.fromMap(this.polynomial);

        for (const [power, coefficient] of other.polynomial.entries()) {
            const currentCoefficient = result.polynomial.get(power) || Complex.fromCartesian(0, 0);
            const newCoefficient = currentCoefficient.add(coefficient);

            if (!newCoefficient.equals(0)) {
                result.polynomial.set(power, newCoefficient);
            } else {
                result.polynomial.delete(power);
            }
        }

        return result;
    }

    subtractScalar(value: Scalar): Polynomial {
        return this.subtract(Polynomial.fromArray([[0, value]]));
    }

    subtract(other: Polynomial): Polynomial {
        const result = Polynomial.fromMap(this.polynomial);

        for (const [power, coefficient] of other.polynomial.entries()) {
            const currentCoefficient = result.polynomial.get(power) || Complex.fromCartesian(0, 0);
            const newCoefficient = currentCoefficient.subtract(coefficient);

            if (!newCoefficient.equals(0)) {
                result.polynomial.set(power, newCoefficient);
            } else {
                result.polynomial.delete(power);
            }
        }

        return result;
    }

    multiplyScalar(value: Scalar, usePolar: boolean = true): Polynomial {
        return this.multiply(Polynomial.fromArray([[0, value]]), usePolar);
    }

    multiply(other: Polynomial, usePolar: boolean = true): Polynomial {
        const result = Polynomial.fromArray([]);

        for (const [power1, coefficient1] of this.polynomial.entries()) {
            for (const [power2, coefficient2] of other.polynomial.entries()) {
                const power = power1 + power2;
                const currentCoefficient = result.polynomial.get(power) || Complex.fromCartesian(0, 0);
                const newCoefficient = currentCoefficient.add(coefficient1.multiply(coefficient2, usePolar));

                if (!newCoefficient.equals(0)) {
                    result.polynomial.set(power, newCoefficient);
                } else {
                    result.polynomial.delete(power);
                }
            }
        }

        return result;
    }

    divideScalar(value: Scalar, usePolar: boolean = true): Polynomial {
        return this.multiplyScalar(Complex.fromScalar(value).reciprocal(usePolar), usePolar);
    }

    divide(other: Polynomial, usePolar: boolean = true): Polynomial {
        if (other.isZero()){
            throw new Error('Division by zero');
        }

        const result = Polynomial.fromArray([]);
        var dividend = Polynomial.fromMap(this.polynomial), divisor = Polynomial.fromMap(other.polynomial);
        var dividendDeg = dividend.degree(), divisorDeg = divisor.degree();

        while (dividendDeg >= divisorDeg) {
            divisor = divisor.multiply(Polynomial.fromArray([[dividendDeg - divisorDeg, 1]]), usePolar);
            
            const ratio = dividend.polynomial.get(dividendDeg)!.divide(divisor.polynomial.get(dividendDeg)!, usePolar);

            dividend = dividend.subtract(divisor.multiplyScalar(ratio, usePolar));

            result.polynomial.set(dividendDeg - divisorDeg, ratio);

            divisor = Polynomial.fromMap(other.polynomial);

            dividendDeg = dividend.degree();
        }

        return result;
    }

    substitute(value: Scalar, usePolar: boolean = true): Complex {
        return Array.from(this.polynomial.entries())
            .map(([power, coefficient]) => coefficient.multiply(Complex.fromScalar(value).power(power, usePolar), usePolar))
            .reduce((acc, val) => acc.add(val), Complex.zero);
    }

    /**
     * Finds the roots of this polynomial, using the Durand-Kerner method.
     * @param usePolar Whether to use the polar form to calculate the roots. Default is true.
     * @param e The maximum error allowed. Default is e-9.
     * @param iterations The maximum number of iterations allowed. Default is 10^6.
     * @returns An array of complex numbers that are the roots of this polynomial.
     */
    findRoots(usePolar: boolean = true, e: number = 9, iterations: number = Math.pow(10, 6)) : Complex[] {
        var n: number = this.degree();

        // base cases

        if (n <= 0){
            return [];
        } else if (n === 1){
            return [this.polynomial.get(0)!.multiply(-1, usePolar)];
        }

        // not a base case

        var guesses: Complex[] = Complex.one.roots(n);

        var closeEnough: boolean;

        var roots: Complex[] = [];

        var current: Polynomial = Polynomial.fromMap(this.polynomial);

        do {
            // deflate

            const newRoots: Complex[] = guesses.filter(guess => current.substitute(guess).equals(0));
        
            if (newRoots.length > 0) {
                current = newRoots.reduce((deflated: Polynomial, root) => 
                    deflated.divide(Polynomial.makeLinearMonic(root), usePolar), current);

                n -= newRoots.length;

                roots = roots.concat(newRoots);
                
                guesses = Complex.one.roots(n);

                closeEnough = false;
            } else {
                // find new roots

                var nextGuesses: Complex[] = guesses.map((guess, i) => 
                    guess.subtract(
                        current.substitute(guess, usePolar).divide(
                            guesses.reduce((denominator, curr, j) => 
                                i !== j ? denominator.multiply(guess.subtract(curr), usePolar) : denominator, Complex.one), usePolar)));
                
                closeEnough = nextGuesses.every((guess, i) => guess.equals(guesses[i], e));

                guesses = nextGuesses;
            }
        } while (n > 1 && !closeEnough && --iterations);

        if (n > 1){
            return roots.concat(guesses);
        } else if (n === 1){
            return roots.concat([current.polynomial.get(0)!.multiply(-1, usePolar)]);
        }

        return roots;
    }

    static makeLinearMonic(x: Scalar, usePolar: boolean = true) { 
        return Polynomial.fromArray([[1, 1], [0, Complex.fromScalar(x).multiply(-1, usePolar)]]);
    }

    static makeConstant(x: Scalar) {
        return Polynomial.fromArray([[0, x]]);
    }

    isZero(){
        return this.degree() === Number.NEGATIVE_INFINITY;
    }

    toString(): string {
        const result = Array.from(this.polynomial.keys()).sort((a, b) => b - a)
            .map((key) => {
                const value = this.polynomial.get(key)!;

                if (key === 0) {
                    return `(${value.toString()})`;
                } else if (key === 1) {
                    return `(${value.toString()})x`;
                } // else

                return `(${value.toString()})x^${key}`;
            }).join(' + ');

        return result === '' ? '0' : result;
    }
}
