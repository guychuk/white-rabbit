export const isSubArray = <T>(arr: T[], sub: T[], comp: (f: T, s: T) => boolean): boolean =>
    sub.reduce((acc: boolean, curr) => acc && (arr.findIndex(item => comp(curr, item)) > -1), true);

export const removeDuplicates = <T>(arr: T[], comp: (f: T, s: T) => boolean): T[] =>
    arr.filter((item, index) => (arr.findIndex(other => comp(item, other)) === index));

export const checkDuplicates = <T>(arr: T[], comp: (f: T, s: T) => boolean): boolean =>
    arr.reduce((dup: boolean, curr, index) => 
        dup || (arr.findIndex(other => comp(curr, other)) !== index), false);
