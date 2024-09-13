import { Complex } from "./complex";

export function fixed(num: number, digits: number = 12): number {
    return Number(num.toFixed(digits));
}

export function roundNum(num: number, precision: number = 12){
    return Number(num.toFixed(precision));
}

export function removeDuplicates<T>(arr: T[], comp: (a: T, b: T) => boolean){
    // keep only those elements whose first occurrence is themselves
    return arr.filter((item, i) => 
        i === arr.findIndex((other) => comp(item, other)));
}
