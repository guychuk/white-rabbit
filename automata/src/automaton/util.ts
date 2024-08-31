export function isSubset<T>(sub: Set<T>, sup: Set<T>) : boolean {
    for (let item of sub)
        if (!sup.has(item))
            return false;

    return true;
}

export function randomInteger(lower: number, upper: number) : number {
    return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export function flipCoin(p: number) : boolean {
    return Math.random() <= p;
}

export function randomElements<T>(population: Iterable<T>, count: number) : T[] {
    const arr = Array.from(population);
    const chosen: T[] = [];
    var current;

    while (chosen.length < count && arr.length > 0){
        current = randomInteger(0, arr.length - 1);
        chosen.push(arr[current]);
        arr.splice(current, 1);
    }

    return chosen;
}
