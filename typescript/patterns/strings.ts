// Common String Functions and Patterns in TypeScript

// ============================================
// 1. STRING BASICS
// ============================================

// Length
const stringLength = () => {
    const str = "Hello World";
    console.log(str.length); // 11
};

// Access characters
const accessCharacters = () => {
    const str = "Hello";
    console.log(str[0]); // 'H'
    console.log(str.charAt(0)); // 'H'
    console.log(str.charAt(10)); // '' (empty string if out of bounds)

    // Character code
    console.log(str.charCodeAt(0)); // 72 (ASCII code for 'H')
};

// ============================================
// 2. STRING SEARCHING
// ============================================

// indexOf - find first occurrence
const indexOfExample = () => {
    const str = "Hello World World";
    console.log(str.indexOf('World')); // 6
    console.log(str.indexOf('world')); // -1 (case sensitive)
    console.log(str.indexOf('World', 7)); // 12 (search from index 7)
};

// lastIndexOf - find last occurrence
const lastIndexOfExample = () => {
    const str = "Hello World World";
    console.log(str.lastIndexOf('World')); // 12
};

// includes - check if substring exists
const includesExample = () => {
    const str = "Hello World";
    console.log(str.includes('World')); // true
    console.log(str.includes('world')); // false (case sensitive)
};

// startsWith - check if string starts with substring
const startsWithExample = () => {
    const str = "Hello World";
    console.log(str.startsWith('Hello')); // true
    console.log(str.startsWith('World')); // false
    console.log(str.startsWith('World', 6)); // true (check from index 6)
};

// endsWith - check if string ends with substring
const endsWithExample = () => {
    const str = "Hello World";
    console.log(str.endsWith('World')); // true
    console.log(str.endsWith('Hello')); // false
};

// search - search with regex
const searchExample = () => {
    const str = "Hello World 123";
    console.log(str.search(/\d+/)); // 12 (finds first digit)
    console.log(str.search(/xyz/)); // -1 (not found)
};

// ============================================
// 3. STRING EXTRACTION
// ============================================

// slice - extract substring
const sliceExample = () => {
    const str = "Hello World";
    console.log(str.slice(0, 5)); // 'Hello'
    console.log(str.slice(6)); // 'World'
    console.log(str.slice(-5)); // 'World' (negative index from end)
    console.log(str.slice(-5, -1)); // 'Worl'
};

// substring - similar to slice but doesn't accept negative indices
const substringExample = () => {
    const str = "Hello World";
    console.log(str.substring(0, 5)); // 'Hello'
    console.log(str.substring(6)); // 'World'
    console.log(str.substring(-5)); // 'Hello World' (treats negative as 0)
};

// substr - extract from index with length (deprecated)
const substrExample = () => {
    const str = "Hello World";
    console.log(str.substr(6, 5)); // 'World' (start at 6, length 5)
};

// ============================================
// 4. STRING MODIFICATION
// ============================================

// replace - replace first occurrence
const replaceExample = () => {
    const str = "Hello World World";
    console.log(str.replace('World', 'JavaScript')); // 'Hello JavaScript World'
    console.log(str.replace(/World/g, 'JS')); // 'Hello JS JS' (replace all with regex)
};

// replaceAll - replace all occurrences
const replaceAllExample = () => {
    const str = "Hello World World";
    console.log(str.replaceAll('World', 'JavaScript')); // 'Hello JavaScript JavaScript'
};

// toLowerCase / toUpperCase
const caseConversion = () => {
    const str = "Hello World";
    console.log(str.toLowerCase()); // 'hello world'
    console.log(str.toUpperCase()); // 'HELLO WORLD'
};

// trim - remove whitespace from both ends
const trimExample = () => {
    const str = "   Hello World   ";
    console.log(str.trim()); // 'Hello World'
    console.log(str.trimStart()); // 'Hello World   '
    console.log(str.trimEnd()); // '   Hello World'
};

// padStart / padEnd - add padding
const padExample = () => {
    const str = "5";
    console.log(str.padStart(3, '0')); // '005'
    console.log(str.padEnd(3, '0')); // '500'

    const price = "99";
    console.log(price.padStart(5, '$')); // '$$$99'
};

// repeat - repeat string n times
const repeatExample = () => {
    const str = "Ha";
    console.log(str.repeat(3)); // 'HaHaHa'
    console.log('-'.repeat(20)); // '--------------------'
};

// ============================================
// 5. STRING SPLITTING AND JOINING
// ============================================

// split - string to array
const splitExample = () => {
    const str = "Hello World JavaScript";
    console.log(str.split(' ')); // ['Hello', 'World', 'JavaScript']
    console.log(str.split('')); // ['H', 'e', 'l', 'l', 'o', ' ', 'W', ...]
    console.log(str.split(' ', 2)); // ['Hello', 'World'] (limit to 2)

    // Split by regex
    const csv = "apple,banana;orange|grape";
    console.log(csv.split(/[,;|]/)); // ['apple', 'banana', 'orange', 'grape']
};

// join - array to string (array method)
const joinExample = () => {
    const words = ['Hello', 'World', 'JavaScript'];
    console.log(words.join(' ')); // 'Hello World JavaScript'
    console.log(words.join('-')); // 'Hello-World-JavaScript'
    console.log(words.join('')); // 'HelloWorldJavaScript'
};

// ============================================
// 6. STRING COMPARISON
// ============================================

// Equality comparison
const stringEquality = () => {
    const str1 = "Hello";
    const str2 = "Hello";
    const str3: string = "hello";

    console.log(str1 === str2); // true
    console.log(str1 === str3); // false
    console.log(str1.toLowerCase() === str3.toLowerCase()); // true
};

// localeCompare - compare strings alphabetically
const localeCompareExample = () => {
    const str1 = "apple";
    const str2 = "banana";

    console.log(str1.localeCompare(str2)); // -1 (str1 comes before str2)
    console.log(str2.localeCompare(str1)); // 1 (str2 comes after str1)
    console.log(str1.localeCompare(str1)); // 0 (equal)
};

// ============================================
// 7. STRING TEMPLATE LITERALS
// ============================================

// Template literals
const templateLiterals = () => {
    const name = "Alice";
    const age = 25;

    // Basic interpolation
    console.log(`My name is ${name} and I am ${age} years old`);

    // Expressions
    console.log(`Next year I'll be ${age + 1}`);

    // Multi-line
    const multiLine = `
        Line 1
        Line 2
        Line 3
    `;
    console.log(multiLine);
};

// Tagged templates
const taggedTemplates = () => {
    const tag = (strings: TemplateStringsArray, ...values: any[]) => {
        console.log('Strings:', strings);
        console.log('Values:', values);
        return strings.reduce((result, str, i) => {
            return result + str + (values[i] || '');
        }, '');
    };

    const name = "Alice";
    const age = 25;
    const result = tag`Name: ${name}, Age: ${age}`;
    console.log(result);
};

// ============================================
// 8. REGULAR EXPRESSIONS
// ============================================

// match - find matches
const matchExample = () => {
    const str = "The year is 2024 and next year is 2025";

    // Without 'g' flag - returns first match with details
    console.log(str.match(/\d+/)); // ['2024', index: 12, input: '...', groups: undefined]

    // With 'g' flag - returns all matches
    console.log(str.match(/\d+/g)); // ['2024', '2025']
};

// matchAll - get all matches with details
const matchAllExample = () => {
    const str = "test1 test2 test3";
    const matches = [...str.matchAll(/test(\d)/g)];

    matches.forEach(match => {
        console.log(`Full match: ${match[0]}, Group: ${match[1]}, Index: ${match.index}`);
    });
    // Full match: test1, Group: 1, Index: 0
    // Full match: test2, Group: 2, Index: 6
    // Full match: test3, Group: 3, Index: 12
};

// test - check if pattern exists
const testExample = () => {
    const pattern = /\d+/;
    console.log(pattern.test("Hello 123")); // true
    console.log(pattern.test("Hello")); // false
};

// exec - execute search
const execExample = () => {
    const pattern = /(\d+)/g;
    const str = "Year 2024 and 2025";

    let match;
    while ((match = pattern.exec(str)) !== null) {
        console.log(`Found ${match[0]} at index ${match.index}`);
    }
};

// ============================================
// 9. COMMON STRING PATTERNS IN DSA
// ============================================

// Reverse a string
const reverseString = (str: string): string => {
    return str.split('').reverse().join('');
};

const reverseStringExample = () => {
    console.log(reverseString("hello")); // "olleh"
};

// Check if palindrome
const isPalindrome = (str: string): boolean => {
    const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
    return cleaned === cleaned.split('').reverse().join('');
};

const isPalindromeExample = () => {
    console.log(isPalindrome("A man, a plan, a canal: Panama")); // true
    console.log(isPalindrome("race a car")); // false
};

// Count vowels
const countVowels = (str: string): number => {
    const matches = str.match(/[aeiou]/gi);
    return matches ? matches.length : 0;
};

const countVowelsExample = () => {
    console.log(countVowels("Hello World")); // 3
};

// Anagram check
const isAnagram = (str1: string, str2: string): boolean => {
    const normalize = (s: string) => s.toLowerCase().replace(/[^a-z]/g, '').split('').sort().join('');
    return normalize(str1) === normalize(str2);
};

const isAnagramExample = () => {
    console.log(isAnagram("listen", "silent")); // true
    console.log(isAnagram("hello", "world")); // false
};

// Character frequency counter
const charFrequency = (str: string): Record<string, number> => {
    const freq: Record<string, number> = {};
    for (const char of str) {
        freq[char] = (freq[char] || 0) + 1;
    }
    return freq;
};

const charFrequencyExample = () => {
    console.log(charFrequency("hello")); // { h: 1, e: 1, l: 2, o: 1 }
};

// First non-repeating character
const firstNonRepeatingChar = (str: string): string | null => {
    const freq = charFrequency(str);

    for (const char of str) {
        if (freq[char] === 1) {
            return char;
        }
    }

    return null;
};

const firstNonRepeatingCharExample = () => {
    console.log(firstNonRepeatingChar("leetcode")); // 'l'
    console.log(firstNonRepeatingChar("loveleetcode")); // 'v'
};

// Longest substring without repeating characters
const longestSubstringWithoutRepeating = (str: string): number => {
    let maxLength = 0;
    let start = 0;
    const charIndex = new Map<string, number>();

    for (let end = 0; end < str.length; end++) {
        const char = str[end];

        if (charIndex.has(char) && charIndex.get(char)! >= start) {
            start = charIndex.get(char)! + 1;
        }

        charIndex.set(char, end);
        maxLength = Math.max(maxLength, end - start + 1);
    }

    return maxLength;
};

const longestSubstringExample = () => {
    console.log(longestSubstringWithoutRepeating("abcabcbb")); // 3 ('abc')
    console.log(longestSubstringWithoutRepeating("bbbbb")); // 1 ('b')
    console.log(longestSubstringWithoutRepeating("pwwkew")); // 3 ('wke')
};

// String compression
const compressString = (str: string): string => {
    if (str.length === 0) return str;

    let compressed = '';
    let count = 1;

    for (let i = 1; i <= str.length; i++) {
        if (i < str.length && str[i] === str[i - 1]) {
            count++;
        } else {
            compressed += str[i - 1] + count;
            count = 1;
        }
    }

    return compressed.length < str.length ? compressed : str;
};

const compressStringExample = () => {
    console.log(compressString("aabcccccaaa")); // 'a2b1c5a3'
    console.log(compressString("abcd")); // 'abcd' (no compression)
};

// ============================================
// 10. STRING MANIPULATION PATTERNS
// ============================================

// Capitalize first letter
const capitalizeFirst = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

const capitalizeFirstExample = () => {
    console.log(capitalizeFirst("hello world")); // 'Hello world'
};

// Capitalize each word
const capitalizeWords = (str: string): string => {
    return str.split(' ').map(word => capitalizeFirst(word)).join(' ');
};

const capitalizeWordsExample = () => {
    console.log(capitalizeWords("hello world")); // 'Hello World'
};

// camelCase to snake_case
const camelToSnake = (str: string): string => {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
};

const camelToSnakeExample = () => {
    console.log(camelToSnake("helloWorldExample")); // 'hello_world_example'
};

// snake_case to camelCase
const snakeToCamel = (str: string): string => {
    return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
};

const snakeToCamelExample = () => {
    console.log(snakeToCamel("hello_world_example")); // 'helloWorldExample'
};

// kebab-case to camelCase
const kebabToCamel = (str: string): string => {
    return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
};

const kebabToCamelExample = () => {
    console.log(kebabToCamel("hello-world-example")); // 'helloWorldExample'
};

// Truncate string
const truncate = (str: string, maxLength: number, suffix = '...'): string => {
    if (str.length <= maxLength) return str;
    return str.slice(0, maxLength - suffix.length) + suffix;
};

const truncateExample = () => {
    console.log(truncate("This is a very long string", 15)); // 'This is a ve...'
};

// Remove duplicates from string
const removeDuplicates = (str: string): string => {
    return [...new Set(str)].join('');
};

const removeDuplicatesExample = () => {
    console.log(removeDuplicates("hello")); // 'helo'
};

// ============================================
// 11. STRING VALIDATION PATTERNS
// ============================================

// Check if string is email
const isEmail = (str: string): boolean => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(str);
};

const isEmailExample = () => {
    console.log(isEmail("test@example.com")); // true
    console.log(isEmail("invalid-email")); // false
};

// Check if string is URL
const isURL = (str: string): boolean => {
    const urlPattern = /^https?:\/\/.+/;
    return urlPattern.test(str);
};

const isURLExample = () => {
    console.log(isURL("https://example.com")); // true
    console.log(isURL("not-a-url")); // false
};

// Check if string contains only digits
const isNumeric = (str: string): boolean => {
    return /^\d+$/.test(str);
};

const isNumericExample = () => {
    console.log(isNumeric("12345")); // true
    console.log(isNumeric("123a5")); // false
};

// Check if string contains only letters
const isAlpha = (str: string): boolean => {
    return /^[a-zA-Z]+$/.test(str);
};

const isAlphaExample = () => {
    console.log(isAlpha("Hello")); // true
    console.log(isAlpha("Hello123")); // false
};

// ============================================
// 12. ADVANCED STRING ALGORITHMS
// ============================================

// KMP Pattern Matching
const kmpSearch = (text: string, pattern: string): number[] => {
    const positions: number[] = [];

    // Build LPS (Longest Prefix Suffix) array
    const buildLPS = (pat: string): number[] => {
        const lps = new Array(pat.length).fill(0);
        let len = 0;
        let i = 1;

        while (i < pat.length) {
            if (pat[i] === pat[len]) {
                len++;
                lps[i] = len;
                i++;
            } else {
                if (len !== 0) {
                    len = lps[len - 1];
                } else {
                    lps[i] = 0;
                    i++;
                }
            }
        }
        return lps;
    };

    const lps = buildLPS(pattern);
    let i = 0; // text index
    let j = 0; // pattern index

    while (i < text.length) {
        if (text[i] === pattern[j]) {
            i++;
            j++;
        }

        if (j === pattern.length) {
            positions.push(i - j);
            j = lps[j - 1];
        } else if (i < text.length && text[i] !== pattern[j]) {
            if (j !== 0) {
                j = lps[j - 1];
            } else {
                i++;
            }
        }
    }

    return positions;
};

const kmpSearchExample = () => {
    console.log(kmpSearch("ABABDABACDABABCABAB", "ABABCABAB")); // [10]
};

// Longest Common Substring
const longestCommonSubstring = (str1: string, str2: string): string => {
    const m = str1.length;
    const n = str2.length;
    const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

    let maxLength = 0;
    let endIndex = 0;

    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (str1[i - 1] === str2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
                if (dp[i][j] > maxLength) {
                    maxLength = dp[i][j];
                    endIndex = i;
                }
            }
        }
    }

    return str1.substring(endIndex - maxLength, endIndex);
};

const longestCommonSubstringExample = () => {
    console.log(longestCommonSubstring("ABABC", "BABCA")); // 'BABC'
};

// Levenshtein Distance (Edit Distance)
const levenshteinDistance = (str1: string, str2: string): number => {
    const m = str1.length;
    const n = str2.length;
    const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;

    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (str1[i - 1] === str2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                dp[i][j] = 1 + Math.min(
                    dp[i - 1][j],     // delete
                    dp[i][j - 1],     // insert
                    dp[i - 1][j - 1]  // replace
                );
            }
        }
    }

    return dp[m][n];
};

const levenshteinDistanceExample = () => {
    console.log(levenshteinDistance("kitten", "sitting")); // 3
    console.log(levenshteinDistance("hello", "hallo")); // 1
};

// ============================================
// EXPORT ALL EXAMPLES
// ============================================

export {
    stringLength,
    accessCharacters,
    indexOfExample,
    lastIndexOfExample,
    includesExample,
    startsWithExample,
    endsWithExample,
    searchExample,
    sliceExample,
    substringExample,
    substrExample,
    replaceExample,
    replaceAllExample,
    caseConversion,
    trimExample,
    padExample,
    repeatExample,
    splitExample,
    joinExample,
    stringEquality,
    localeCompareExample,
    templateLiterals,
    taggedTemplates,
    matchExample,
    matchAllExample,
    testExample,
    execExample,
    reverseString,
    reverseStringExample,
    isPalindrome,
    isPalindromeExample,
    countVowels,
    countVowelsExample,
    isAnagram,
    isAnagramExample,
    charFrequency,
    charFrequencyExample,
    firstNonRepeatingChar,
    firstNonRepeatingCharExample,
    longestSubstringWithoutRepeating,
    longestSubstringExample,
    compressString,
    compressStringExample,
    capitalizeFirst,
    capitalizeFirstExample,
    capitalizeWords,
    capitalizeWordsExample,
    camelToSnake,
    camelToSnakeExample,
    snakeToCamel,
    snakeToCamelExample,
    kebabToCamel,
    kebabToCamelExample,
    truncate,
    truncateExample,
    removeDuplicates,
    removeDuplicatesExample,
    isEmail,
    isEmailExample,
    isURL,
    isURLExample,
    isNumeric,
    isNumericExample,
    isAlpha,
    isAlphaExample,
    kmpSearch,
    kmpSearchExample,
    longestCommonSubstring,
    longestCommonSubstringExample,
    levenshteinDistance,
    levenshteinDistanceExample
};
