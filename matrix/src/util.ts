import { Complex } from "./complex";

export function fixed(num: number, digits: number = 12): number {
    return Number(num.toFixed(digits));
}

export function round(num: number, precision: number = 12, epsilon: number = 1e-6): number {
    const rounded = parseFloat(num.toPrecision(precision));
    const nearestInt = Math.round(rounded);

    if (Math.abs(rounded - nearestInt) < epsilon)
        return nearestInt;

    return rounded;
}

export function removeDuplicates<T>(arr: T[], comp: (a: T, b: T) => boolean){
    // keep only those elements whose first occurrence is themselves
    return arr.filter((item, i) => 
        i === arr.findIndex((other) => comp(item, other)));
}
