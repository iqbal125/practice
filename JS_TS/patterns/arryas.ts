// Common Array Functions and Patterns in TypeScript

// ============================================
// 1. forEach vs map - KEY DIFFERENCES
// ============================================

/*
 * forEach vs map:
 * 
 * forEach:
 * - Returns: undefined (no return value)
 * - Purpose: Execute side effects (logging, updating external variables, DOM manipulation)
 * - Cannot chain: You cannot chain other array methods after forEach
 * - Cannot break: Cannot stop iteration early (except by throwing an error)
 * 
 * map:
 * - Returns: New array with transformed elements
 * - Purpose: Transform data and create a new array
 * - Can chain: You can chain .filter(), .sort(), etc. after map
 * - Functional: Doesn't mutate the original array
 * 
 * Rule of thumb: Use map when you need the results, use forEach for side effects only
 */

// forEach - iterate without returning anything
const forEachExample = () => {
    const nums = [1, 2, 3, 4, 5];

    // forEach returns undefined
    const result = nums.forEach((num, index) => {
        console.log(`Index ${index}: ${num}`);
    });
    console.log(result); // undefined

    // Common use case: updating external state or DOM
    let sum = 0;
    nums.forEach(num => {
        sum += num; // Side effect: modifying external variable
    });
    console.log(sum); // 15
};

// map - transform each element and return new array
const mapExample = () => {
    const nums = [1, 2, 3, 4, 5];

    // map returns a new array
    const doubled = nums.map(num => num * 2);
    console.log(doubled); // [2, 4, 6, 8, 10]
    console.log(nums); // [1, 2, 3, 4, 5] - original unchanged

    // Can chain methods
    const result = nums
        .map(num => num * 2)
        .filter(num => num > 5)
        .reduce((sum, num) => sum + num, 0);
    console.log(result); // 30 (6 + 8 + 10)
};

// When you might use map incorrectly
const mapMisuse = () => {
    const nums = [1, 2, 3, 4, 5];

    // ❌ BAD: Using map just for side effects (ignoring return value)
    nums.map(num => console.log(num)); // Creates unnecessary array

    // ✅ GOOD: Use forEach for side effects
    nums.forEach(num => console.log(num));

    // ❌ BAD: Using forEach when you need the result
    const doubled: number[] = [];
    nums.forEach(num => doubled.push(num * 2)); // Imperative style

    // ✅ GOOD: Use map when you need transformed array
    const doubledBetter = nums.map(num => num * 2); // Declarative style
};

// Performance note
const performanceNote = () => {
    const nums = Array.from({ length: 1000000 }, (_, i) => i);

    // Both have similar O(n) time complexity
    // map is slightly slower because it creates a new array
    // But the difference is negligible for most use cases

    console.time('forEach');
    let sum = 0;
    nums.forEach(num => sum += num);
    console.timeEnd('forEach');

    console.time('map');
    const doubled = nums.map(num => num * 2);
    console.timeEnd('map');
};

// ============================================
// 2. OTHER TRANSFORMATION PATTERNS
// ============================================

// for...of - clean iteration
const forOfExample = () => {
    const nums = [1, 2, 3, 4, 5];
    for (const num of nums) {
        console.log(num);
    }
};

// flatMap - map and flatten in one step
const flatMapExample = () => {
    const nums = [1, 2, 3];
    const result = nums.flatMap(num => [num, num * 2]);
    console.log(result); // [1, 2, 2, 4, 3, 6]
};

// ============================================
// 3. FILTERING PATTERNS
// ============================================

// filter - keep elements that match condition
const filterExample = () => {
    const nums = [1, 2, 3, 4, 5, 6];
    const evens = nums.filter(num => num % 2 === 0);
    console.log(evens); // [2, 4, 6]
};

// find - get first element that matches
const findExample = () => {
    const users = [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
        { id: 3, name: 'Charlie' }
    ];
    const user = users.find(u => u.id === 2);
    console.log(user); // { id: 2, name: 'Bob' }
};

// findIndex - get index of first match
const findIndexExample = () => {
    const nums = [10, 20, 30, 40];
    const index = nums.findIndex(num => num > 25);
    console.log(index); // 2
};

// ============================================
// 4. AGGREGATION PATTERNS
// ============================================

// reduce - aggregate to single value
const reduceExample = () => {
    const nums = [1, 2, 3, 4, 5];
    const sum = nums.reduce((acc, num) => acc + num, 0);
    console.log(sum); // 15
};

// reduce for grouping
const groupByExample = () => {
    const people = [
        { name: 'Alice', age: 25 },
        { name: 'Bob', age: 30 },
        { name: 'Charlie', age: 25 }
    ];

    const grouped = people.reduce((acc, person) => {
        const key = person.age;
        if (!acc[key]) acc[key] = [];
        acc[key].push(person);
        return acc;
    }, {} as Record<number, typeof people>);

    console.log(grouped);
    // { 25: [{name: 'Alice', age: 25}, {name: 'Charlie', age: 25}], 30: [{name: 'Bob', age: 30}] }
};

// ============================================
// 5. TESTING PATTERNS
// ============================================

// every - check if all elements match
const everyExample = () => {
    const nums = [2, 4, 6, 8];
    const allEven = nums.every(num => num % 2 === 0);
    console.log(allEven); // true
};

// some - check if any element matches
const someExample = () => {
    const nums = [1, 3, 5, 6];
    const hasEven = nums.some(num => num % 2 === 0);
    console.log(hasEven); // true
};

// includes - check if array contains value
const includesExample = () => {
    const fruits = ['apple', 'banana', 'orange'];
    console.log(fruits.includes('banana')); // true
};

// ============================================
// 6. SORTING PATTERNS
// ============================================

// sort - ascending numbers
const sortAscending = () => {
    const nums = [3, 1, 4, 1, 5, 9];
    nums.sort((a, b) => a - b);
    console.log(nums); // [1, 1, 3, 4, 5, 9]
};

// sort - descending numbers
const sortDescending = () => {
    const nums = [3, 1, 4, 1, 5, 9];
    nums.sort((a, b) => b - a);
    console.log(nums); // [9, 5, 4, 3, 1, 1]
};

// sort - objects by property
const sortObjects = () => {
    const people = [
        { name: 'Charlie', age: 25 },
        { name: 'Alice', age: 30 },
        { name: 'Bob', age: 20 }
    ];
    people.sort((a, b) => a.age - b.age);
    console.log(people);
};

// ============================================
// 7. ARRAY MANIPULATION
// ============================================

// slice - extract portion (non-mutating)
const sliceExample = () => {
    const nums = [1, 2, 3, 4, 5];
    const middle = nums.slice(1, 4);
    console.log(middle); // [2, 3, 4]
    console.log(nums); // [1, 2, 3, 4, 5] - original unchanged
};

// splice - add/remove elements (mutating)
const spliceExample = () => {
    const nums = [1, 2, 3, 4, 5];
    const removed = nums.splice(2, 2, 99, 100); // at index 2, remove 2, add 99 and 100
    console.log(nums); // [1, 2, 99, 100, 5]
    console.log(removed); // [3, 4]
};

// concat - combine arrays
const concatExample = () => {
    const arr1 = [1, 2];
    const arr2 = [3, 4];
    const combined = arr1.concat(arr2);
    console.log(combined); // [1, 2, 3, 4]
};

// spread operator - modern way to combine
const spreadExample = () => {
    const arr1 = [1, 2];
    const arr2 = [3, 4];
    const combined = [...arr1, ...arr2];
    console.log(combined); // [1, 2, 3, 4]
};

// ============================================
// 8. FLATTENING PATTERNS
// ============================================

// flat - flatten nested arrays
const flatExample = () => {
    const nested = [1, [2, 3], [4, [5, 6]]];
    console.log(nested.flat()); // [1, 2, 3, 4, [5, 6]]
    console.log(nested.flat(2)); // [1, 2, 3, 4, 5, 6]
};

// ============================================
// 9. CONVERSION PATTERNS
// ============================================

// join - array to string
const joinExample = () => {
    const words = ['Hello', 'World'];
    console.log(words.join(' ')); // "Hello World"
    console.log(words.join('-')); // "Hello-World"
};

// Array.from - create array from iterable
const arrayFromExample = () => {
    const str = 'hello';
    const chars = Array.from(str);
    console.log(chars); // ['h', 'e', 'l', 'l', 'o']

    // With mapping function
    const nums = Array.from({ length: 5 }, (_, i) => i + 1);
    console.log(nums); // [1, 2, 3, 4, 5]
};

// ============================================
// 10. COMMON DSA PATTERNS
// ============================================

// Two Pointers - from both ends
const twoPointersExample = (arr: number[]): boolean => {
    let left = 0;
    let right = arr.length - 1;

    while (left < right) {
        // Do something with arr[left] and arr[right]
        left++;
        right--;
    }
    return true;
};

// Sliding Window - fixed size
const slidingWindowFixed = (arr: number[], k: number): number[] => {
    const result: number[] = [];
    let windowSum = 0;

    // Initialize first window
    for (let i = 0; i < k; i++) {
        windowSum += arr[i];
    }
    result.push(windowSum);

    // Slide the window
    for (let i = k; i < arr.length; i++) {
        windowSum = windowSum - arr[i - k] + arr[i];
        result.push(windowSum);
    }

    return result;
};

// Sliding Window - variable size
const slidingWindowVariable = (arr: number[], target: number): number => {
    let left = 0;
    let currentSum = 0;
    let minLength = Infinity;

    for (let right = 0; right < arr.length; right++) {
        currentSum += arr[right];

        while (currentSum >= target) {
            minLength = Math.min(minLength, right - left + 1);
            currentSum -= arr[left];
            left++;
        }
    }

    return minLength === Infinity ? 0 : minLength;
};

// Prefix Sum Pattern
const prefixSumExample = (arr: number[]): number[] => {
    const prefix: number[] = [arr[0]];

    for (let i = 1; i < arr.length; i++) {
        prefix[i] = prefix[i - 1] + arr[i];
    }

    return prefix;
};

// Get range sum using prefix sum
const getRangeSum = (prefix: number[], left: number, right: number): number => {
    if (left === 0) return prefix[right];
    return prefix[right] - prefix[left - 1];
};

// Frequency Counter Pattern
const frequencyCounter = (arr: number[]): Map<number, number> => {
    const freq = new Map<number, number>();

    for (const num of arr) {
        freq.set(num, (freq.get(num) || 0) + 1);
    }

    return freq;
};

// Multiple Pointers - moving in same direction
const multiplePointers = (arr: number[]): number => {
    let slow = 0;
    let fast = 0;

    while (fast < arr.length) {
        // Fast pointer explores
        if (arr[fast] !== arr[slow]) {
            slow++;
            arr[slow] = arr[fast];
        }
        fast++;
    }

    return slow + 1; // Number of unique elements
};

// ============================================
// 11. UTILITY PATTERNS
// ============================================

// Remove duplicates (using Set)
const removeDuplicates = (arr: number[]): number[] => {
    return [...new Set(arr)];
};

// Find min/max
const findMinMax = (arr: number[]): { min: number; max: number } => {
    return {
        min: Math.min(...arr),
        max: Math.max(...arr)
    };
};

// Chunk array into smaller arrays
const chunkArray = <T>(arr: T[], size: number): T[][] => {
    const chunks: T[][] = [];
    for (let i = 0; i < arr.length; i += size) {
        chunks.push(arr.slice(i, i + size));
    }
    return chunks;
};

// Rotate array right by k positions
const rotateArray = (arr: number[], k: number): number[] => {
    k = k % arr.length;
    return [...arr.slice(-k), ...arr.slice(0, -k)];
};

// Binary Search (on sorted array)
const binarySearch = (arr: number[], target: number): number => {
    let left = 0;
    let right = arr.length - 1;

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);

        if (arr[mid] === target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }

    return -1; // Not found
};

// ============================================
// EXPORT ALL EXAMPLES
// ============================================

export {
    forEachExample,
    forOfExample,
    mapExample,
    flatMapExample,
    filterExample,
    findExample,
    findIndexExample,
    reduceExample,
    groupByExample,
    everyExample,
    someExample,
    includesExample,
    sortAscending,
    sortDescending,
    sortObjects,
    sliceExample,
    spliceExample,
    concatExample,
    spreadExample,
    flatExample,
    joinExample,
    arrayFromExample,
    twoPointersExample,
    slidingWindowFixed,
    slidingWindowVariable,
    prefixSumExample,
    getRangeSum,
    frequencyCounter,
    multiplePointers,
    removeDuplicates,
    findMinMax,
    chunkArray,
    rotateArray,
    binarySearch
};
