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
