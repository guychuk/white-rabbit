import { Complex } from "../src/complex";

describe("Complex Numbers Operations", () => {
    it ("should calculate the complex conjugate", () => {
        expect(new Complex([0, 0]).conjugate().equals(new Complex([0, 0])));
        expect(new Complex([1, 4]).conjugate().equals(new Complex([1, -4])));
        expect(new Complex([2, 3]).conjugate().equals(new Complex([2, -3])));
        expect(new Complex([3, 2]).conjugate().equals(new Complex([3, -2])));
        expect(new Complex([4, 1]).conjugate().equals(new Complex([4, -1])));
    });
});

describe("Complex Numbers Arithmetics", () => {
    it ("should add complex numbers", () => {
        expect(new Complex([0, 0]).add(0).equals(new Complex([0, 0]))).toBeTruthy();
        expect(new Complex([1, 4]).add(1).equals(new Complex([2, 4]))).toBeTruthy();
        expect(new Complex([2, 3]).add(new Complex([3, 2])).equals(new Complex([5, 5]))).toBeTruthy();
        expect(new Complex([0, 2]).add(new Complex([4, 1])).equals(new Complex([7, 3]))).toBeFalsy();
        expect(new Complex([0, 1]).add(new Complex([1, 4])).equals(new Complex([5, 5]))).toBeFalsy();
    });

    it ("should subtract complex numbers", () => {
        expect(new Complex([1, 0]).subtract(0).equals(new Complex([1, 0]))).toBeTruthy();
        expect(new Complex([1, 4]).subtract(1).equals(new Complex([0, 4]))).toBeTruthy();
        expect(new Complex([2, 2]).subtract(new Complex([3, 2])).equals(new Complex([-1, 0]))).toBeTruthy();
        expect(new Complex([3, 2]).subtract(new Complex([4, 1])).equals(new Complex([-1, 2]))).toBeFalsy();
        expect(new Complex([4, 1]).subtract(new Complex([1, 4])).equals(new Complex([3, -2]))).toBeFalsy();
    });

    it ("should calculate the power of a complex number", () => {
        expect(new Complex([0, 0]).power(0, false).equals(new Complex([1, 0]))).toBeTruthy();
        expect(new Complex([1, 4]).power(2, false).equals(new Complex([-15, 8]))).toBeTruthy();
        expect(new Complex([2, 3]).power(3, false).equals(new Complex([-46, 9]))).toBeTruthy();
        expect(new Complex([3, 2]).power(4, false).equals(new Complex([-119, 120]))).toBeTruthy();
        expect(new Complex([4, 1]).power(5, false).equals(new Complex([404, 1121]))).toBeTruthy();
    });

    it ("should multiply complex numbers", () => {
        expect(new Complex([0, 0]).multiply(new Complex([0, 0]), false).equals(new Complex([0, 0]))).toBeTruthy();
        expect(new Complex([1, 4]).multiply(new Complex([2, 3]), false).equals(new Complex([-10, 11]))).toBeTruthy();
        expect(new Complex([2, 0]).multiply(new Complex([3, 2]), false).equals(new Complex([0, 13]))).toBeFalsy();
        expect(new Complex([3, 2]).multiply(-3, false).equals(new Complex([-9, -6]))).toBeTruthy();
        expect(new Complex([4, 0]).multiply(5, false).equals(new Complex([19, 0]))).toBeFalsy();
    });

    it ("should divide complex numbers", () => {
        expect(new Complex([-10, 11]).divide(new Complex([2, 3]), false).equals(new Complex([1, 4]))).toBeTruthy();
        expect(new Complex([0, 13]).divide(new Complex([3, 2]), false).equals(new Complex([2, 3]))).toBeTruthy();
        expect(new Complex([10, 11]).divide(new Complex([4, 1]), false).equals(new Complex([3, 2]))).toBeTruthy();
        expect(new Complex([0, 16]).divide(new Complex([1, 4]), false).equals(new Complex([4, 1]))).toBeFalsy();
        expect(new Complex([8, 0]).divide(4, false).equals(new Complex([2, 0]))).toBeTruthy();
        expect(new Complex([0, 8]).divide(new Complex([0, 4]), false).equals(new Complex([2, 0]))).toBeTruthy();
        expect(new Complex([8, 0]).divide(2, false).equals(new Complex([-4, 0]))).toBeFalsy();
    });

    it ("should calculate the reciprocal of a complex number", () => {
        expect(new Complex([1, 0]).reciprocal(false).equals(new Complex([1, 0]))).toBeTruthy();
        expect(new Complex([1, 4]).reciprocal(false).equals(new Complex([1 / 17, -4 / 17]))).toBeTruthy();
        expect(new Complex([2, 3]).reciprocal(false).equals(new Complex([2 / 13, -3 / 13]))).toBeTruthy();
        expect(new Complex([3, 2]).reciprocal(false).equals(new Complex([3 / 13, -2 / 13]))).toBeTruthy();
        expect(new Complex([4, 1]).reciprocal(false).equals(new Complex([4 / 17, -1 / 17]))).toBeTruthy();
    });

    it ("should calculate the absolute value of a complex number", () => {
        expect(new Complex([0, 0]).absoluteValue()).toEqual(0);
        expect(new Complex([3, 4]).absoluteValue()).toEqual(5);
        expect(new Complex([4, 3]).absoluteValue()).toEqual(5);
        expect(new Complex([20, 21]).absoluteValue()).toEqual(29);
        expect(new Complex([5, 12]).absoluteValue()).toEqual(13);
    });
});

describe("Complex Numbers Polar Form", () => {
    it ("should calculate the polar form of a complex number", () => {
        expect(new Complex([0, 0]).polar).toEqual([0, 0]);
        expect(new Complex([1, 0]).polar).toEqual([1, 0]);
        expect(new Complex([0, 1]).polar).toEqual([1, Math.PI / 2]);
        expect(new Complex([-1, 0]).polar).toEqual([1, Math.PI]);
        expect(new Complex([0, -1]).polar).toEqual([1, -Math.PI / 2]);
        expect(new Complex([1, 1]).polar).toEqual([Math.sqrt(2), Math.PI / 4]);
        expect(new Complex([-1, -1]).polar).toEqual([Math.sqrt(2), -3 * Math.PI / 4]);
        expect(new Complex([1, -1]).polar).toEqual([Math.sqrt(2), -Math.PI / 4]);
        expect(new Complex([-1, 1]).polar).toEqual([Math.sqrt(2), 3 * Math.PI / 4]);
    });

    it ("should create complex numbers from polar form", () => {
        expect(new Complex([0, 0], true).equals(0)).toBeTruthy();
        expect(new Complex([1, 0], true).equals(1)).toBeTruthy();
        expect(new Complex([1, Math.PI / 2], true).equals(new Complex([0, 1]))).toBeTruthy();
        expect(new Complex([1, Math.PI], true).equals(-1)).toBeTruthy();
        expect(new Complex([1, -Math.PI / 2], true).equals(new Complex([0, -1]))).toBeTruthy();
        expect(new Complex([Math.sqrt(2), Math.PI / 4], true).equals(new Complex([1, 1]))).toBeTruthy();
        expect(new Complex([Math.sqrt(2), -3 * Math.PI / 4], true).equals(new Complex([-1, -1]))).toBeTruthy();
        expect(new Complex([Math.sqrt(2), -Math.PI / 4], true).equals(new Complex([1, -1]))).toBeTruthy();
        expect(new Complex([Math.sqrt(2), 3 * Math.PI / 4], true).equals(new Complex([-1, 1]))).toBeTruthy();
    });

    it ("should multiply complex numbers using polar form", () => {
        expect(new Complex([0, 0]).multiply(new Complex([0, 0])).equals(new Complex([0, 0]))).toBeTruthy();
        expect(new Complex([1, 4]).multiply(new Complex([2, 3])).equals(new Complex([-10, 11]))).toBeTruthy();
        expect(new Complex([2, 0]).multiply(new Complex([3, 2])).equals(new Complex([0, 13]))).toBeFalsy();
        expect(new Complex([3, 2]).multiply(-3).equals(new Complex([-9, -6]))).toBeTruthy();
        expect(new Complex([4, 0]).multiply(5).equals(new Complex([19, 0]))).toBeFalsy();
    });

    it ("should calculate the power of a complex number using polar form", () => {
        expect(new Complex([0, 0]).power(0).equals(new Complex([1, 0]))).toBeTruthy();
        expect(new Complex([1, 4]).power(2).equals(new Complex([-15, 8]))).toBeTruthy();
        expect(new Complex([2, 3]).power(3).equals(new Complex([-46, 9]))).toBeTruthy();
        expect(new Complex([3, 2]).power(4).equals(new Complex([-119, 120]))).toBeTruthy();
        expect(new Complex([4, 1]).power(5).equals(new Complex([404, 1121]))).toBeTruthy();
    });

    it ("should divide complex numbers using polar form", () => {
        expect(new Complex([-10, 11]).divide(new Complex([2, 3])).equals(new Complex([1, 4]))).toBeTruthy();
        expect(new Complex([0, 13]).divide(new Complex([3, 2])).equals(new Complex([2, 3]))).toBeTruthy();
        expect(new Complex([10, 11]).divide(new Complex([4, 1])).equals(new Complex([3, 2]))).toBeTruthy();
        expect(new Complex([0, 16]).divide(new Complex([1, 4])).equals(new Complex([4, 1]))).toBeFalsy();
        expect(new Complex([8, 0]).divide(4).equals(new Complex([2, 0]))).toBeTruthy();
        expect(new Complex([0, 8]).divide(new Complex([0, 4])).equals(new Complex([2, 0]))).toBeTruthy();
        expect(new Complex([8, 0]).divide(2).equals(new Complex([-4, 0]))).toBeFalsy();
    });

    it ("should calculate the reciprocal of a complex number using polar form", () => {
        expect(new Complex([1, 0]).reciprocal().equals(new Complex([1, 0]))).toBeTruthy();
        expect(new Complex([1, 4]).reciprocal().equals(new Complex([1 / 17, -4 / 17]))).toBeTruthy();
        expect(new Complex([2, 3]).reciprocal().equals(new Complex([2 / 13, -3 / 13]))).toBeTruthy();
        expect(new Complex([3, 2]).reciprocal().equals(new Complex([3 / 13, -2 / 13]))).toBeTruthy();
        expect(new Complex([4, 1]).reciprocal().equals(new Complex([4 / 17, -1 / 17]))).toBeTruthy();
    });
});
