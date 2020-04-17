/*

This code is actually from https://github.com/segment-boneyard/hash-mod but due to compilation and type issues I brought it in.

 */

/**
 * Return the integer hash of a `string`.
 *
 * http://stackoverflow.com/questions/2624192/good-hash-function-for-strings
 *
 * @param {String} string
 * @returns {Number}
 */
export const integerHash = (string: string) => (`${string}`).split('').reduce((memo, item) => (memo * 31 * item.charCodeAt(0)) % 982451653, 7);

/**
 * Returns a `hashMod` function that will return an integer hash of a string
 * modded by `buckets`.
 *
 * @param {Number} buckets
 * @return {Function}
 */

export const hashMod = (buckets = 100) => (string: string) => integerHash(string) % buckets;
