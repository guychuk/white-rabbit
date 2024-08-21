export const isSubset = <T>(sub: Set<T>, sup: Set<T>) : boolean => {
    for (let item of sub)
        if (!sup.has(item))
            return false;

    return true;
}
