/* eslint-disable */
/**
 * Returns `true` if the objects are equal, `false` otherwise.
 *
 * @param {object} obj1 - Object 1 to compare.
 * @param {object} obj2 - Object 2 to compare.
 * @returns {boolean} If the objects are field by field and value by value equals.
 */
export const shallowEquality = (obj1: Record<string, any>, obj2: Record<string, any>): boolean => {
    if (!!obj1 && !!obj2) {
        // Get the keys (fields) of both objects
        const keys1 = Object.keys(obj1);
        const keys2 = Object.keys(obj2);
        // Check if the number of keys is the same
        if (keys1?.length !== keys2?.length) {
            return false;
        }
        // Iterate through the keys
        for (const key of keys1) {
            // Check if the corresponding field values are equal
            if (obj1[key] !== obj2[key]) {
                return false;
            }
        }
        // If all fields are equal, return true
        return true;
    }
    // If any of the objects is null or undefined, we return false
    return false;
};

/**
 * Returns `true` if the objects are equal excluding the fields passed in excludeFields string[], `false` otherwise.
 *
 * @param {object} obj1 - Object 1 to compare.
 * @param {object} obj2 - Object 2 to compare.
 * @param {string[]} excludeFields - Fields array to exclude value from the check.
 * @returns {boolean} If the objects are field by field and value by value equals, excluding the fields passed in excludeFields string[].
 */
export const shallowEqualityExcludingFields = (obj1: Record<string, any>, obj2: Record<string, any>, excludeFields: string[]): boolean => {
    if (!!obj1 && !!obj2) {
        if (excludeFields?.length) {
            const first = { ...obj1 };
            const second = { ...obj2 };
            // Excluding fields before checking
            excludeFields.forEach(field => {
                first.hasOwnProperty(field) && delete first[field];
                second.hasOwnProperty(field) && delete second[field];
            });
            return shallowEquality(first, second);
        }
        // Checking without removing fields
        return shallowEquality(obj1, obj2);
    }
    // If any of the objects is null or undefined, we return false
    return false;
};
