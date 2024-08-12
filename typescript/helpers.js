export const isSubArray = (arr, sub, comp) => sub.reduce((acc, curr) => acc && (arr.findIndex(item => comp(curr, item)) > -1), true);
export const removeDuplicates = (arr, comp) => arr.filter((item, index) => (arr.findIndex(other => comp(item, other)) === index));
export const checkDuplicates = (arr, comp) => arr.reduce((dup, curr, index) => dup || (arr.findIndex(other => comp(curr, other)) !== index), false);
