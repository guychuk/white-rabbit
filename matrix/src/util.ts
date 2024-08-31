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

