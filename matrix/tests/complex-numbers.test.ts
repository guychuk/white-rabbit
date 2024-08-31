import { Complex } from "../src/complex";

describe("Complex Numbers Operations", () => {
    it ("should calculate the complex conjugate", () => {
        expect(Complex.fromCartesian(0, 0).conjugate().equals(Complex.fromCartesian(0, 0)));
        expect(Complex.fromCartesian(1, 4).conjugate().equals(Complex.fromCartesian(1, -4)));
        expect(Complex.fromCartesian(2, 3).conjugate().equals(Complex.fromCartesian(2, -3)));
        expect(Complex.fromCartesian(3, 2).conjugate().equals(Complex.fromCartesian(3, -2)));
        expect(Complex.fromCartesian(4, 1).conjugate().equals(Complex.fromCartesian(4, -1)));
    });
});

describe("Complex Numbers Arithmetics", () => {
    it ("should add complex numbers", () => {
        expect(Complex.fromCartesian(0, 0).add(0).equals(Complex.fromCartesian(0, 0))).toBeTruthy();
        expect(Complex.fromCartesian(1, 4).add(1).equals(Complex.fromCartesian(2, 4))).toBeTruthy();
        expect(Complex.fromCartesian(2, 3).add(Complex.fromCartesian(3, 2)).equals(Complex.fromCartesian(5, 5))).toBeTruthy();
        expect(Complex.fromCartesian(0, 2).add(Complex.fromCartesian(4, 1)).equals(Complex.fromCartesian(7, 3))).toBeFalsy();
        expect(Complex.fromCartesian(0, 1).add(Complex.fromCartesian(1, 4)).equals(Complex.fromCartesian(5, 5))).toBeFalsy();
    });

    it ("should subtract complex numbers", () => {
        expect(Complex.fromCartesian(1, 0).subtract(0).equals(Complex.fromCartesian(1, 0))).toBeTruthy();
        expect(Complex.fromCartesian(1, 4).subtract(1).equals(Complex.fromCartesian(0, 4))).toBeTruthy();
        expect(Complex.fromCartesian(2, 2).subtract(Complex.fromCartesian(3, 2)).equals(Complex.fromCartesian(-1, 0))).toBeTruthy();
        expect(Complex.fromCartesian(3, 2).subtract(Complex.fromCartesian(4, 1)).equals(Complex.fromCartesian(-1, 2))).toBeFalsy();
        expect(Complex.fromCartesian(4, 1).subtract(Complex.fromCartesian(1, 4)).equals(Complex.fromCartesian(3, -2))).toBeFalsy();
    });

    it ("should multiply complex numbers", () => {
        expect(Complex.fromCartesian(0, 0).multiply(Complex.fromCartesian(0, 0), false).equals(Complex.fromCartesian(0, 0))).toBeTruthy();
        expect(Complex.fromCartesian(1, 4).multiply(Complex.fromCartesian(2, 3), false).equals(Complex.fromCartesian(-10, 11))).toBeTruthy();
        expect(Complex.fromCartesian(2, 0).multiply(Complex.fromCartesian(3, 2), false).equals(Complex.fromCartesian(0, 13))).toBeFalsy();
        expect(Complex.fromCartesian(3, 2).multiply(-3, false).equals(Complex.fromCartesian(-9, -6))).toBeTruthy();
        expect(Complex.fromCartesian(4, 0).multiply(5, false).equals(Complex.fromCartesian(19, 0))).toBeFalsy();
    });

    it ("should calculate the power of a complex number", () => {
        expect(Complex.fromCartesian(0, 0).power(0, false).equals(Complex.fromCartesian(1, 0))).toBeTruthy();
        expect(Complex.fromCartesian(1, 4).power(2, false).equals(Complex.fromCartesian(-15, 8))).toBeTruthy();
        expect(Complex.fromCartesian(2, 3).power(3, false).equals(Complex.fromCartesian(-46, 9))).toBeTruthy();
        expect(Complex.fromCartesian(3, 2).power(4, false).equals(Complex.fromCartesian(-119, 120))).toBeTruthy();
        expect(Complex.fromCartesian(4, 1).power(5, false).equals(Complex.fromCartesian(404, 1121))).toBeTruthy();
    });

    it ("should divide complex numbers", () => {
        expect(Complex.fromCartesian(-10, 11).divide(Complex.fromCartesian(2, 3), false).equals(Complex.fromCartesian(1, 4))).toBeTruthy();
        expect(Complex.fromCartesian(0, 13).divide(Complex.fromCartesian(3, 2), false).equals(Complex.fromCartesian(2, 3))).toBeTruthy();
        expect(Complex.fromCartesian(10, 11).divide(Complex.fromCartesian(4, 1), false).equals(Complex.fromCartesian(3, 2))).toBeTruthy();
        expect(Complex.fromCartesian(0, 16).divide(Complex.fromCartesian(1, 4), false).equals(Complex.fromCartesian(4, 1))).toBeFalsy();
        expect(Complex.fromCartesian(8, 0).divide(4, false).equals(Complex.fromCartesian(2, 0))).toBeTruthy();
        expect(Complex.fromCartesian(0, 8).divide(Complex.fromCartesian(0, 4), false).equals(Complex.fromCartesian(2, 0))).toBeTruthy();
        expect(Complex.fromCartesian(8, 0).divide(2, false).equals(Complex.fromCartesian(-4, 0))).toBeFalsy();
    });

    it ("should calculate the reciprocal of a complex number", () => {
        expect(Complex.fromCartesian(1, 0).reciprocal(false).equals(Complex.fromCartesian(1, 0))).toBeTruthy();
        expect(Complex.fromCartesian(1, 4).reciprocal(false).equals(Complex.fromCartesian(1 / 17, -4 / 17))).toBeTruthy();
        expect(Complex.fromCartesian(2, 3).reciprocal(false).equals(Complex.fromCartesian(2 / 13, -3 / 13))).toBeTruthy();
        expect(Complex.fromCartesian(3, 2).reciprocal(false).equals(Complex.fromCartesian(3 / 13, -2 / 13))).toBeTruthy();
        expect(Complex.fromCartesian(4, 1).reciprocal(false).equals(Complex.fromCartesian(4 / 17, -1 / 17))).toBeTruthy();
    });

    it ("should calculate the absolute value of a complex number", () => {
        expect(Complex.fromCartesian(0, 0).absoluteValue()).toEqual(0);
        expect(Complex.fromCartesian(3, 4).absoluteValue()).toEqual(5);
        expect(Complex.fromCartesian(4, 3).absoluteValue()).toEqual(5);
        expect(Complex.fromCartesian(20, 21).absoluteValue()).toEqual(29);
        expect(Complex.fromCartesian(5, 12).absoluteValue()).toEqual(13);
    });
});

describe("Complex Numbers Polar Form", () => {
    it ("should calculate the polar form of a complex number", () => {
        expect(Complex.fromCartesian(0, 0).polar).toEqual([0, 0]);
        expect(Complex.fromCartesian(1, 0).polar).toEqual([1, 0]);
        expect(Complex.fromCartesian(0, 1).polar).toEqual([1, Math.PI / 2]);
        expect(Complex.fromCartesian(-1, 0).polar).toEqual([1, Math.PI]);
        expect(Complex.fromCartesian(0, -1).polar).toEqual([1, -Math.PI / 2]);
        expect(Complex.fromCartesian(1, 1).polar).toEqual([Math.sqrt(2), Math.PI / 4]);
        expect(Complex.fromCartesian(-1, -1).polar).toEqual([Math.sqrt(2), -3 * Math.PI / 4]);
        expect(Complex.fromCartesian(1, -1).polar).toEqual([Math.sqrt(2), -Math.PI / 4]);
        expect(Complex.fromCartesian(-1, 1).polar).toEqual([Math.sqrt(2), 3 * Math.PI / 4]);
    });

    it ("should create complex numbers from polar form", () => {
        expect(Complex.fromPolar(0, 0).equals(0)).toBeTruthy();
        expect(Complex.fromPolar(1, 0).equals(1)).toBeTruthy();
        expect(Complex.fromPolar(1, Math.PI / 2).equals(Complex.fromCartesian(0, 1))).toBeTruthy();
        expect(Complex.fromPolar(1, Math.PI).equals(-1)).toBeTruthy();
        expect(Complex.fromPolar(1, -Math.PI / 2).equals(Complex.fromCartesian(0, -1))).toBeTruthy();
        expect(Complex.fromPolar(Math.sqrt(2), Math.PI / 4).equals(Complex.fromCartesian(1, 1))).toBeTruthy();
        expect(Complex.fromPolar(Math.sqrt(2), -3 * Math.PI / 4).equals(Complex.fromCartesian(-1, -1))).toBeTruthy();
        expect(Complex.fromPolar(Math.sqrt(2), -Math.PI / 4).equals(Complex.fromCartesian(1, -1))).toBeTruthy();
        expect(Complex.fromPolar(Math.sqrt(2), 3 * Math.PI / 4).equals(Complex.fromCartesian(-1, 1))).toBeTruthy();
    });

    it ("should multiply complex numbers using polar form", () => {
        expect(Complex.fromCartesian(0, 0).multiply(Complex.fromCartesian(0, 0)).equals(Complex.fromCartesian(0, 0))).toBeTruthy();
        expect(Complex.fromCartesian(1, 4).multiply(Complex.fromCartesian(2, 3)).equals(Complex.fromCartesian(-10, 11))).toBeTruthy();
        expect(Complex.fromCartesian(2, 0).multiply(Complex.fromCartesian(3, 2)).equals(Complex.fromCartesian(0, 13))).toBeFalsy();
        expect(Complex.fromCartesian(3, 2).multiply(-3).equals(Complex.fromCartesian(-9, -6))).toBeTruthy();
        expect(Complex.fromCartesian(4, 0).multiply(5).equals(Complex.fromCartesian(19, 0))).toBeFalsy();
    });

    it ("should calculate the power of a complex number using polar form", () => {
        expect(Complex.fromCartesian(0, 0).power(0).equals(Complex.fromCartesian(1, 0))).toBeTruthy();
        expect(Complex.fromCartesian(1, 4).power(2).equals(Complex.fromCartesian(-15, 8))).toBeTruthy();
        expect(Complex.fromCartesian(2, 3).power(3).equals(Complex.fromCartesian(-46, 9))).toBeTruthy();
        expect(Complex.fromCartesian(3, 2).power(4).equals(Complex.fromCartesian(-119, 120))).toBeTruthy();
        expect(Complex.fromCartesian(4, 1).power(5).equals(Complex.fromCartesian(404, 1121))).toBeTruthy();
    });

    it ("should divide complex numbers using polar form", () => {
        expect(Complex.fromCartesian(-10, 11).divide(Complex.fromCartesian(2, 3)).equals(Complex.fromCartesian(1, 4))).toBeTruthy();
        expect(Complex.fromCartesian(0, 13).divide(Complex.fromCartesian(3, 2)).equals(Complex.fromCartesian(2, 3))).toBeTruthy();
        expect(Complex.fromCartesian(10, 11).divide(Complex.fromCartesian(4, 1)).equals(Complex.fromCartesian(3, 2))).toBeTruthy();
        expect(Complex.fromCartesian(0, 16).divide(Complex.fromCartesian(1, 4)).equals(Complex.fromCartesian(4, 1))).toBeFalsy();
        expect(Complex.fromCartesian(8, 0).divide(4).equals(Complex.fromCartesian(2, 0))).toBeTruthy();
        expect(Complex.fromCartesian(0, 8).divide(Complex.fromCartesian(0, 4)).equals(Complex.fromCartesian(2, 0))).toBeTruthy();
        expect(Complex.fromCartesian(8, 0).divide(2).equals(Complex.fromCartesian(-4, 0))).toBeFalsy();
    });

    it ("should calculate the reciprocal of a complex number using polar form", () => {
        expect(Complex.fromCartesian(1, 0).reciprocal().equals(Complex.fromCartesian(1, 0))).toBeTruthy();
        expect(Complex.fromCartesian(1, 4).reciprocal().equals(Complex.fromCartesian(1 / 17, -4 / 17))).toBeTruthy();
        expect(Complex.fromCartesian(2, 3).reciprocal().equals(Complex.fromCartesian(2 / 13, -3 / 13))).toBeTruthy();
        expect(Complex.fromCartesian(3, 2).reciprocal().equals(Complex.fromCartesian(3 / 13, -2 / 13))).toBeTruthy();
        expect(Complex.fromCartesian(4, 1).reciprocal().equals(Complex.fromCartesian(4 / 17, -1 / 17))).toBeTruthy();
    });
});
