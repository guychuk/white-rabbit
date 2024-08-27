import { Complex } from "../src/complex";

describe("Complex Numbers Operations", () => {
    it ("should calculate the complex conjugate", () => {
        expect(new Complex(0, 0).conjugate().equals(new Complex(0, 0)));
        expect(new Complex(1, 4).conjugate().equals(new Complex(1, -4)));
        expect(new Complex(2, 3).conjugate().equals(new Complex(2, -3)));
        expect(new Complex(3, 2).conjugate().equals(new Complex(3, -2)));
        expect(new Complex(4, 1).conjugate().equals(new Complex(4, -1)));
    });
});

describe("Complex Numbers Arithmetics", () => {
    it ("should add complex numbers", () => {
        expect(new Complex(0, 0).add(new Complex(0, 0)).equals(new Complex(0, 0))).toBeTruthy();
        expect(new Complex(1, 4).add(new Complex(2, 3)).equals(new Complex(3, 7))).toBeTruthy();
        expect(new Complex(2, 3).add(new Complex(3, 2)).equals(new Complex(5, 5))).toBeTruthy();
        expect(new Complex(0, 2).add(new Complex(4, 1)).equals(new Complex(7, 3))).toBeFalsy();
        expect(new Complex(0, 1).add(new Complex(1, 4)).equals(new Complex(5, 5))).toBeFalsy();
    });

    it ("should subtract complex numbers", () => {
        expect(new Complex(1, 0).subtract(new Complex(0, 0)).equals(new Complex(1, 0))).toBeTruthy();
        expect(new Complex(1, 4).subtract(new Complex(2, 3)).equals(new Complex(-1, 1))).toBeTruthy();
        expect(new Complex(2, 2).subtract(new Complex(3, 2)).equals(new Complex(-1, 0))).toBeTruthy();
        expect(new Complex(3, 2).subtract(new Complex(4, 1)).equals(new Complex(-1, 2))).toBeFalsy();
        expect(new Complex(4, 1).subtract(new Complex(1, 4)).equals(new Complex(3, -2))).toBeFalsy();
    });

    it ("should multiply complex numbers", () => {
        expect(new Complex(0, 0).multiply(new Complex(0, 0)).equals(new Complex(0, 0))).toBeTruthy();
        expect(new Complex(1, 4).multiply(new Complex(2, 3)).equals(new Complex(-10, 11))).toBeTruthy();
        expect(new Complex(2, 0).multiply(new Complex(3, 2)).equals(new Complex(0, 13))).toBeFalsy();
        expect(new Complex(3, 2).multiply(new Complex(4, 1)).equals(new Complex(10, 11))).toBeTruthy();
        expect(new Complex(4, 0).multiply(new Complex(1, 4)).equals(new Complex(0, 17))).toBeFalsy();
    });

    it ("should divide complex numbers", () => {
        expect(new Complex(-10, 11).divide(new Complex(2, 3)).equals(new Complex(1, 4))).toBeTruthy();
        expect(new Complex(0, 13).divide(new Complex(3, 2)).equals(new Complex(2, 3))).toBeTruthy();
        expect(new Complex(10, 11).divide(new Complex(4, 1)).equals(new Complex(3, 2))).toBeTruthy();
        expect(new Complex(0, 16).divide(new Complex(1, 4)).equals(new Complex(4, 1))).toBeFalsy();
        expect(new Complex(8, 0).divide(new Complex(4, 0)).equals(new Complex(2, 0))).toBeTruthy();
        expect(new Complex(0, 8).divide(new Complex(0, 4)).equals(new Complex(2, 0))).toBeTruthy();
        expect(new Complex(8, 0).divide(new Complex(2, 0)).equals(new Complex(-4, 0))).toBeFalsy();
    });

    it ("should calculate the absolute value of a complex number", () => {
        expect(new Complex(0, 0).absoluteValue()).toEqual(0);
        expect(new Complex(3, 4).absoluteValue()).toEqual(5);
        expect(new Complex(4, 3).absoluteValue()).toEqual(5);
        expect(new Complex(20, 21).absoluteValue()).toEqual(29);
        expect(new Complex(5, 12).absoluteValue()).toEqual(13);
    });
});
