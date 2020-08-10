"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function findDuplicate(arr) {
    const sorted_arr = arr.slice().sort();
    const results = [];
    for (let i = 0; i < sorted_arr.length - 1; i++) {
        if (sorted_arr[i + 1] === sorted_arr[i]) {
            results.push(sorted_arr[i]);
        }
    }
    return results;
}
exports.findDuplicate = findDuplicate;
//# sourceMappingURL=findDuplicate.js.map