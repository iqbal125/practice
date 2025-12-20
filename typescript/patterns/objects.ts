// Common Object Functions and Patterns in TypeScript

// ============================================
// 1. OBJECT CREATION PATTERNS
// ============================================

// Object literal
const objectLiteral = () => {
    const person = {
        name: 'Alice',
        age: 25,
        city: 'New York'
    };
    console.log(person);
};

// Object constructor
const objectConstructor = () => {
    const person: any = new Object();
    person.name = 'Bob';
    person.age = 30;
    console.log(person);
};

// Object.create() - create with prototype
const objectCreate = () => {
    const personPrototype = {
        greet(this: { name: string }): string {
            return `Hello, I'm ${this.name}`;
        }
    };

    const person: any = Object.create(personPrototype);
    person.name = 'Charlie';
    console.log(person.greet()); // "Hello, I'm Charlie"
};// ============================================
// 2. OBJECT.KEYS, VALUES, ENTRIES
// ============================================

// Object.keys() - get array of keys
const objectKeys = () => {
    const user = { id: 1, name: 'Alice', email: 'alice@example.com' };
    const keys = Object.keys(user);
    console.log(keys); // ['id', 'name', 'email']

    // Iterate over keys
    Object.keys(user).forEach(key => {
        console.log(`${key}: ${user[key as keyof typeof user]}`);
    });
};

// Object.values() - get array of values
const objectValues = () => {
    const user = { id: 1, name: 'Alice', email: 'alice@example.com' };
    const values = Object.values(user);
    console.log(values); // [1, 'Alice', 'alice@example.com']
};

// Object.entries() - get array of [key, value] pairs
const objectEntries = () => {
    const user = { id: 1, name: 'Alice', email: 'alice@example.com' };
    const entries = Object.entries(user);
    console.log(entries); // [['id', 1], ['name', 'Alice'], ['email', 'alice@example.com']]

    // Iterate over entries
    Object.entries(user).forEach(([key, value]) => {
        console.log(`${key}: ${value}`);
    });
};

// Object.fromEntries() - create object from entries
const objectFromEntries = () => {
    const entries: [string, any][] = [['id', 1], ['name', 'Alice'], ['email', 'alice@example.com']];
    const user = Object.fromEntries(entries);
    console.log(user); // { id: 1, name: 'Alice', email: 'alice@example.com' }
};

// ============================================
// 3. OBJECT COPYING AND MERGING
// ============================================

// Shallow copy - spread operator
const shallowCopySpread = () => {
    const original = { name: 'Alice', age: 25, hobbies: ['reading', 'coding'] };
    const copy = { ...original };

    copy.name = 'Bob'; // Doesn't affect original
    copy.hobbies.push('gaming'); // DOES affect original (nested reference)

    console.log(original.name); // 'Alice'
    console.log(original.hobbies); // ['reading', 'coding', 'gaming'] - modified!
};

// Shallow copy - Object.assign()
const shallowCopyAssign = () => {
    const original = { name: 'Alice', age: 25 };
    const copy = Object.assign({}, original);
    console.log(copy); // { name: 'Alice', age: 25 }
};

// Deep copy - JSON method (limitations apply)
const deepCopyJSON = () => {
    const original = { name: 'Alice', age: 25, hobbies: ['reading', 'coding'] };
    const copy = JSON.parse(JSON.stringify(original));

    copy.hobbies.push('gaming');
    console.log(original.hobbies); // ['reading', 'coding'] - not affected

    // Limitations: loses functions, undefined, Date objects, etc.
};

// Deep copy - structuredClone (modern method)
const deepCopyStructured = () => {
    const original = {
        name: 'Alice',
        age: 25,
        hobbies: ['reading', 'coding'],
        date: new Date()
    };

    const copy = structuredClone(original);
    copy.hobbies.push('gaming');

    console.log(original.hobbies); // ['reading', 'coding'] - not affected
    console.log(copy.date instanceof Date); // true - Date preserved
};

// Merge objects - spread operator
const mergeObjects = () => {
    const obj1 = { a: 1, b: 2 };
    const obj2 = { b: 3, c: 4 };
    const merged = { ...obj1, ...obj2 }; // obj2 overwrites obj1
    console.log(merged); // { a: 1, b: 3, c: 4 }
};

// Merge objects - Object.assign()
const mergeObjectsAssign = () => {
    const obj1 = { a: 1, b: 2 };
    const obj2 = { b: 3, c: 4 };
    const merged = Object.assign({}, obj1, obj2);
    console.log(merged); // { a: 1, b: 3, c: 4 }
};

// ============================================
// 4. OBJECT PROPERTY CHECKS
// ============================================

// in operator - check if property exists
const inOperator = () => {
    const user = { name: 'Alice', age: 25 };
    console.log('name' in user); // true
    console.log('email' in user); // false
};

// hasOwnProperty - check own property (not inherited)
const hasOwnPropertyCheck = () => {
    const user = { name: 'Alice', age: 25 };
    console.log(user.hasOwnProperty('name')); // true
    console.log(user.hasOwnProperty('toString')); // false (inherited from Object.prototype)
};

// Object.hasOwn() - modern alternative to hasOwnProperty
const objectHasOwn = () => {
    const user = { name: 'Alice', age: 25 };
    console.log(Object.hasOwn(user, 'name')); // true
    console.log(Object.hasOwn(user, 'toString')); // false
};

// ============================================
// 5. OBJECT PROPERTY MANIPULATION
// ============================================

// Delete property
const deleteProperty = () => {
    const user: any = { name: 'Alice', age: 25, email: 'alice@example.com' };
    delete user.email;
    console.log(user); // { name: 'Alice', age: 25 }
};

// Add/update property dynamically
const dynamicProperty = () => {
    const user: Record<string, any> = { name: 'Alice' };
    const propertyName = 'age';

    // Add using bracket notation
    user[propertyName] = 25;

    // Add using computed property name
    const key = 'email';
    const updatedUser = { ...user, [key]: 'alice@example.com' };

    console.log(updatedUser);
};

// Object.defineProperty - define with descriptors
const defineProperty = () => {
    const user: any = {};

    Object.defineProperty(user, 'name', {
        value: 'Alice',
        writable: false,    // Cannot be changed
        enumerable: true,   // Shows up in for...in and Object.keys()
        configurable: false // Cannot be deleted or reconfigured
    });

    user.name = 'Bob'; // Fails silently (throws in strict mode)
    console.log(user.name); // 'Alice'
};

// ============================================
// 6. OBJECT TRANSFORMATION PATTERNS
// ============================================

// Map object values
const mapObjectValues = () => {
    const prices = { apple: 1, banana: 2, orange: 3 };

    const doubled = Object.fromEntries(
        Object.entries(prices).map(([key, value]) => [key, value * 2])
    );

    console.log(doubled); // { apple: 2, banana: 4, orange: 6 }
};

// Filter object by condition
const filterObject = () => {
    const user = { name: 'Alice', age: 25, email: 'alice@example.com', password: '1234' };

    const filtered = Object.fromEntries(
        Object.entries(user).filter(([key]) => key !== 'password')
    );

    console.log(filtered); // { name: 'Alice', age: 25, email: 'alice@example.com' }
};

// Reduce object to single value
const reduceObject = () => {
    const scores = { math: 90, science: 85, english: 92 };

    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
    const avgScore = totalScore / Object.keys(scores).length;

    console.log(totalScore); // 267
    console.log(avgScore); // 89
};

// Group array to object
const groupArrayToObject = () => {
    const people = [
        { name: 'Alice', age: 25 },
        { name: 'Bob', age: 30 },
        { name: 'Charlie', age: 25 }
    ];

    const groupedByAge = people.reduce((acc, person) => {
        const key = person.age;
        if (!acc[key]) acc[key] = [];
        acc[key].push(person);
        return acc;
    }, {} as Record<number, typeof people>);

    console.log(groupedByAge);
    // { 25: [{name: 'Alice', age: 25}, {name: 'Charlie', age: 25}], 30: [{name: 'Bob', age: 30}] }
};

// ============================================
// 7. OBJECT COMPARISON
// ============================================

// Shallow equality
const shallowEquality = () => {
    const obj1 = { a: 1, b: 2 };
    const obj2 = { a: 1, b: 2 };

    console.log(obj1 === obj2); // false (different references)

    // Manual shallow comparison
    const isShallowEqual = (o1: any, o2: any) => {
        const keys1 = Object.keys(o1);
        const keys2 = Object.keys(o2);

        if (keys1.length !== keys2.length) return false;

        return keys1.every(key => o1[key] === o2[key]);
    };

    console.log(isShallowEqual(obj1, obj2)); // true
};

// Deep equality
const deepEquality = () => {
    const obj1 = { a: 1, b: { c: 2 } };
    const obj2 = { a: 1, b: { c: 2 } };

    const isDeepEqual = (o1: any, o2: any): boolean => {
        if (o1 === o2) return true;

        if (typeof o1 !== 'object' || typeof o2 !== 'object' || o1 == null || o2 == null) {
            return false;
        }

        const keys1 = Object.keys(o1);
        const keys2 = Object.keys(o2);

        if (keys1.length !== keys2.length) return false;

        return keys1.every(key => isDeepEqual(o1[key], o2[key]));
    };

    console.log(isDeepEqual(obj1, obj2)); // true
};

// ============================================
// 8. OBJECT FREEZING AND SEALING
// ============================================

// Object.freeze() - make immutable
const freezeObject = () => {
    const user = Object.freeze({ name: 'Alice', age: 25 });

    // @ts-ignore - demonstrating that these operations fail
    user.age = 30; // Fails silently (throws in strict mode)
    // @ts-ignore
    delete user.name; // Fails silently

    console.log(user); // { name: 'Alice', age: 25 }
    console.log(Object.isFrozen(user)); // true
};// Object.seal() - prevent add/delete but allow modification
const sealObject = () => {
    const user: any = Object.seal({ name: 'Alice', age: 25 });

    user.age = 30; // Works
    delete user.name; // Fails silently
    user.email = 'alice@example.com'; // Fails silently

    console.log(user); // { name: 'Alice', age: 30 }
    console.log(Object.isSealed(user)); // true
};// Object.preventExtensions() - prevent adding properties
const preventExtensions = () => {
    const user: any = { name: 'Alice', age: 25 };
    Object.preventExtensions(user);

    user.age = 30; // Works
    delete user.name; // Works
    user.email = 'alice@example.com'; // Fails silently

    console.log(user); // { age: 30 }
    console.log(Object.isExtensible(user)); // false
};

// ============================================
// 9. OBJECT DESTRUCTURING PATTERNS
// ============================================

// Basic destructuring
const basicDestructuring = () => {
    const user = { name: 'Alice', age: 25, email: 'alice@example.com' };

    const { name, age } = user;
    console.log(name, age); // 'Alice' 25
};

// Destructuring with renaming
const destructuringRename = () => {
    const user = { name: 'Alice', age: 25 };

    const { name: userName, age: userAge } = user;
    console.log(userName, userAge); // 'Alice' 25
};

// Destructuring with defaults
const destructuringDefaults = () => {
    const user: { name: string; age?: number } = { name: 'Alice' };

    const { name, age = 18 } = user;
    console.log(name, age); // 'Alice' 18
};// Nested destructuring
const nestedDestructuring = () => {
    const user = {
        name: 'Alice',
        address: {
            city: 'New York',
            country: 'USA'
        }
    };

    const { name, address: { city } } = user;
    console.log(name, city); // 'Alice' 'New York'
};

// Rest operator in destructuring
const restDestructuring = () => {
    const user = { name: 'Alice', age: 25, email: 'alice@example.com', password: '1234' };

    const { password, ...publicUser } = user;
    console.log(publicUser); // { name: 'Alice', age: 25, email: 'alice@example.com' }
};

// ============================================
// 10. COMMON DSA PATTERNS WITH OBJECTS
// ============================================

// Hash Map / Dictionary pattern
const hashMapPattern = () => {
    const nums = [1, 2, 3, 2, 1, 4, 5, 4];

    // Count frequency
    const frequency: Record<number, number> = {};
    for (const num of nums) {
        frequency[num] = (frequency[num] || 0) + 1;
    }

    console.log(frequency); // { 1: 2, 2: 2, 3: 1, 4: 2, 5: 1 }
};

// Using Map (better than object for some cases)
const mapPattern = () => {
    const map = new Map<string, number>();

    map.set('apple', 1);
    map.set('banana', 2);

    console.log(map.get('apple')); // 1
    console.log(map.has('banana')); // true
    console.log(map.size); // 2

    // Iterate
    map.forEach((value, key) => {
        console.log(`${key}: ${value}`);
    });

    // Convert to object
    const obj = Object.fromEntries(map);
    console.log(obj); // { apple: 1, banana: 2 }
};

// Two Sum using hash map
const twoSum = (nums: number[], target: number): number[] | null => {
    const map: Record<number, number> = {};

    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (complement in map) {
            return [map[complement], i];
        }
        map[nums[i]] = i;
    }

    return null;
};

const twoSumExample = () => {
    console.log(twoSum([2, 7, 11, 15], 9)); // [0, 1]
};

// Memoization pattern
const memoize = <T extends (...args: any[]) => any>(fn: T): T => {
    const cache: Record<string, any> = {};

    return ((...args: any[]) => {
        const key = JSON.stringify(args);
        if (key in cache) {
            console.log('From cache:', key);
            return cache[key];
        }

        const result = fn(...args);
        cache[key] = result;
        return result;
    }) as T;
};

const memoizeExample = () => {
    const slowFunction = (n: number): number => {
        console.log('Computing for', n);
        return n * 2;
    };

    const memoized = memoize(slowFunction);

    console.log(memoized(5)); // Computing for 5, returns 10
    console.log(memoized(5)); // From cache, returns 10
};

// ============================================
// 11. OBJECT UTILITY FUNCTIONS
// ============================================

// Pick - select specific properties
const pickProperties = <T extends object, K extends keyof T>(
    obj: T,
    keys: K[]
): Pick<T, K> => {
    return keys.reduce((acc, key) => {
        if (key in obj) {
            acc[key] = obj[key];
        }
        return acc;
    }, {} as Pick<T, K>);
};

const pickExample = () => {
    const user = { name: 'Alice', age: 25, email: 'alice@example.com', password: '1234' };
    const publicUser = pickProperties(user, ['name', 'email']);
    console.log(publicUser); // { name: 'Alice', email: 'alice@example.com' }
};

// Omit - exclude specific properties
const omitProperties = <T extends object, K extends keyof T>(
    obj: T,
    keys: K[]
): Omit<T, K> => {
    const result = { ...obj };
    keys.forEach(key => delete result[key]);
    return result;
};

const omitExample = () => {
    const user = { name: 'Alice', age: 25, email: 'alice@example.com', password: '1234' };
    const publicUser = omitProperties(user, ['password']);
    console.log(publicUser); // { name: 'Alice', age: 25, email: 'alice@example.com' }
};

// Invert object (swap keys and values)
const invertObject = (obj: Record<string, string>): Record<string, string> => {
    return Object.fromEntries(
        Object.entries(obj).map(([key, value]) => [value, key])
    );
};

const invertExample = () => {
    const obj = { a: '1', b: '2', c: '3' };
    const inverted = invertObject(obj);
    console.log(inverted); // { '1': 'a', '2': 'b', '3': 'c' }
};

// Flatten nested object
const flattenObject = (obj: any, prefix = ''): Record<string, any> => {
    return Object.keys(obj).reduce((acc, key) => {
        const newKey = prefix ? `${prefix}.${key}` : key;

        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
            Object.assign(acc, flattenObject(obj[key], newKey));
        } else {
            acc[newKey] = obj[key];
        }

        return acc;
    }, {} as Record<string, any>);
};

const flattenExample = () => {
    const nested = {
        name: 'Alice',
        address: {
            city: 'New York',
            country: 'USA'
        },
        contact: {
            email: 'alice@example.com',
            phone: {
                mobile: '123-456',
                home: '789-012'
            }
        }
    };

    const flattened = flattenObject(nested);
    console.log(flattened);
    // {
    //   name: 'Alice',
    //   'address.city': 'New York',
    //   'address.country': 'USA',
    //   'contact.email': 'alice@example.com',
    //   'contact.phone.mobile': '123-456',
    //   'contact.phone.home': '789-012'
    // }
};

// ============================================
// EXPORT ALL EXAMPLES
// ============================================

export {
    objectLiteral,
    objectConstructor,
    objectCreate,
    objectKeys,
    objectValues,
    objectEntries,
    objectFromEntries,
    shallowCopySpread,
    shallowCopyAssign,
    deepCopyJSON,
    deepCopyStructured,
    mergeObjects,
    mergeObjectsAssign,
    inOperator,
    hasOwnPropertyCheck,
    objectHasOwn,
    deleteProperty,
    dynamicProperty,
    defineProperty,
    mapObjectValues,
    filterObject,
    reduceObject,
    groupArrayToObject,
    shallowEquality,
    deepEquality,
    freezeObject,
    sealObject,
    preventExtensions,
    basicDestructuring,
    destructuringRename,
    destructuringDefaults,
    nestedDestructuring,
    restDestructuring,
    hashMapPattern,
    mapPattern,
    twoSum,
    twoSumExample,
    memoize,
    memoizeExample,
    pickProperties,
    pickExample,
    omitProperties,
    omitExample,
    invertObject,
    invertExample,
    flattenObject,
    flattenExample
};
