// Helper Functions - Advanced Patterns

// ============================================
// 1. GROUP BY IMPLEMENTATIONS
// ============================================

/**
 * Manual Group By - Group array items by a key using reduce
 */
function manualGroupBy<T, K extends string | number>(
    array: T[],
    keyGetter: (item: T) => K
): Record<K, T[]> {
    return array.reduce((result, item) => {
        const key = keyGetter(item);
        if (!result[key]) {
            result[key] = [];
        }
        result[key].push(item);
        return result;
    }, {} as Record<K, T[]>);
}

// Example usage
const manualGroupByExample = () => {
    const people = [
        { name: 'Alice', age: 25, department: 'Engineering' },
        { name: 'Bob', age: 30, department: 'Sales' },
        { name: 'Charlie', age: 25, department: 'Engineering' },
        { name: 'David', age: 30, department: 'Sales' },
        { name: 'Eve', age: 35, department: 'Engineering' }
    ];

    // Group by age
    const byAge = manualGroupBy(people, person => person.age);
    console.log('Grouped by age:', byAge);
    /*
    {
        25: [{ name: 'Alice', ... }, { name: 'Charlie', ... }],
        30: [{ name: 'Bob', ... }, { name: 'David', ... }],
        35: [{ name: 'Eve', ... }]
    }
    */

    // Group by department
    const byDept = manualGroupBy(people, person => person.department);
    console.log('Grouped by department:', byDept);
};

/**
 * Using Object.groupBy (ES2024 - Modern JavaScript)
 * Note: This is a newer feature, check browser/Node.js compatibility
 */
const objectGroupByExample = () => {
    const sales = [
        { product: 'Laptop', amount: 1200, region: 'North' },
        { product: 'Phone', amount: 800, region: 'South' },
        { product: 'Laptop', amount: 1300, region: 'North' },
        { product: 'Tablet', amount: 600, region: 'South' },
        { product: 'Phone', amount: 850, region: 'North' }
    ];

    // Using Object.groupBy (native method)
    // @ts-ignore - Object.groupBy is ES2024, might not be in all TypeScript versions yet
    const byRegion = Object.groupBy(sales, item => item.region);
    console.log('Grouped by region:', byRegion);
    /*
    {
        North: [{ product: 'Laptop', ... }, { product: 'Laptop', ... }, { product: 'Phone', ... }],
        South: [{ product: 'Phone', ... }, { product: 'Tablet', ... }]
    }
    */

    // @ts-ignore
    const byProduct = Object.groupBy(sales, item => item.product);
    console.log('Grouped by product:', byProduct);
    /*
    {
        Laptop: [{ product: 'Laptop', ... }, { product: 'Laptop', ... }],
        Phone: [{ product: 'Phone', ... }, { product: 'Phone', ... }],
        Tablet: [{ product: 'Tablet', ... }]
    }
    */
};

// ============================================
// 2. REDUCE EXAMPLES
// ============================================

/**
 * Example 1: Sum and Average
 */
const reduceExample1 = () => {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    // Sum
    const sum = numbers.reduce((acc, num) => acc + num, 0);
    console.log('Sum:', sum); // 55

    // Average
    const avg = numbers.reduce((acc, num, _, arr) => {
        acc += num;
        return acc;
    }, 0) / numbers.length;
    console.log('Average:', avg); // 5.5

    // Min and Max
    const min = numbers.reduce((acc, num) => Math.min(acc, num), Infinity);
    const max = numbers.reduce((acc, num) => Math.max(acc, num), -Infinity);
    console.log('Min:', min, 'Max:', max); // Min: 1 Max: 10
};

/**
 * Example 2: Flatten nested arrays
 */
const reduceExample2 = () => {
    const nested = [[1, 2], [3, 4], [5, 6, 7], [8, 9]];

    const flattened = nested.reduce((acc, arr) => acc.concat(arr), []);
    console.log('Flattened:', flattened);
    // [1, 2, 3, 4, 5, 6, 7, 8, 9]

    // Deep flatten
    const deepNested = [1, [2, [3, [4, 5]]], 6];
    const deepFlatten = (arr: any[]): any[] => {
        return arr.reduce((acc, item) => {
            return acc.concat(Array.isArray(item) ? deepFlatten(item) : item);
        }, []);
    };
    console.log('Deep flattened:', deepFlatten(deepNested));
    // [1, 2, 3, 4, 5, 6]
};

/**
 * Example 3: Count occurrences
 */
const reduceExample3 = () => {
    const fruits = ['apple', 'banana', 'apple', 'orange', 'banana', 'apple'];

    const count = fruits.reduce((acc, fruit) => {
        acc[fruit] = (acc[fruit] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    console.log('Count:', count);
    // { apple: 3, banana: 2, orange: 1 }
};

/**
 * Example 4: Transform array to object
 */
const reduceExample4 = () => {
    const users = [
        { id: 1, name: 'Alice', email: 'alice@example.com' },
        { id: 2, name: 'Bob', email: 'bob@example.com' },
        { id: 3, name: 'Charlie', email: 'charlie@example.com' }
    ];

    // Array to object by id
    const usersById = users.reduce((acc, user) => {
        acc[user.id] = user;
        return acc;
    }, {} as Record<number, typeof users[0]>);
    console.log('Users by ID:', usersById);

    // Create lookup map
    const emailToName = users.reduce((acc, user) => {
        acc[user.email] = user.name;
        return acc;
    }, {} as Record<string, string>);
    console.log('Email to name:', emailToName);
};

/**
 * Example 5: Remove duplicates
 */
const reduceExample5 = () => {
    const numbers = [1, 2, 3, 2, 4, 3, 5, 1, 6];

    const unique = numbers.reduce((acc, num) => {
        if (!acc.includes(num)) {
            acc.push(num);
        }
        return acc;
    }, [] as number[]);
    console.log('Unique:', unique); // [1, 2, 3, 4, 5, 6]
};

/**
 * Example 6: Create ranges or chunks
 */
const reduceExample6 = () => {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    // Chunk into groups of 3
    const chunks = numbers.reduce((acc, num, index) => {
        const chunkIndex = Math.floor(index / 3);
        if (!acc[chunkIndex]) {
            acc[chunkIndex] = [];
        }
        acc[chunkIndex].push(num);
        return acc;
    }, [] as number[][]);
    console.log('Chunks:', chunks);
    // [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
};

/**
 * Example 7: Pipe functions together
 */
const reduceExample7 = () => {
    const add5 = (x: number) => x + 5;
    const multiply3 = (x: number) => x * 3;
    const subtract2 = (x: number) => x - 2;

    const functions = [add5, multiply3, subtract2];

    // Compose using reduce (left to right)
    const pipe = <T>(value: T, fns: ((val: any) => any)[]) => {
        return fns.reduce((acc, fn) => fn(acc), value);
    };

    const result = pipe(10, functions);
    console.log('Piped result:', result); // ((10 + 5) * 3) - 2 = 43
};

/**
 * Example 8: Build complex data structures
 */
const reduceExample8 = () => {
    const transactions = [
        { type: 'income', amount: 1000, category: 'salary' },
        { type: 'expense', amount: 200, category: 'food' },
        { type: 'expense', amount: 150, category: 'transport' },
        { type: 'income', amount: 500, category: 'freelance' },
        { type: 'expense', amount: 300, category: 'food' }
    ];

    const summary = transactions.reduce((acc, transaction) => {
        // Track total income and expenses
        if (transaction.type === 'income') {
            acc.totalIncome += transaction.amount;
        } else {
            acc.totalExpense += transaction.amount;
        }

        // Track by category
        if (!acc.byCategory[transaction.category]) {
            acc.byCategory[transaction.category] = 0;
        }
        acc.byCategory[transaction.category] += transaction.amount;

        // Calculate balance
        acc.balance = acc.totalIncome - acc.totalExpense;

        return acc;
    }, {
        totalIncome: 0,
        totalExpense: 0,
        balance: 0,
        byCategory: {} as Record<string, number>
    });

    console.log('Summary:', summary);
    /*
    {
        totalIncome: 1500,
        totalExpense: 650,
        balance: 850,
        byCategory: { salary: 1000, food: 500, transport: 150, freelance: 500 }
    }
    */
};

/**
 * Example 9: Filter and Map combined
 */
const reduceExample9 = () => {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    // Get even numbers and double them (using reduce instead of filter + map)
    const evenDoubled = numbers.reduce((acc, num) => {
        if (num % 2 === 0) {
            acc.push(num * 2);
        }
        return acc;
    }, [] as number[]);
    console.log('Even doubled:', evenDoubled); // [4, 8, 12, 16, 20]
};

/**
 * Example 10: Reverse a string or array
 */
const reduceExample10 = () => {
    const str = "hello";

    const reversed = str.split('').reduce((acc, char) => char + acc, '');
    console.log('Reversed:', reversed); // "olleh"

    const numbers = [1, 2, 3, 4, 5];
    const reversedArr = numbers.reduce((acc, num) => [num, ...acc], [] as number[]);
    console.log('Reversed array:', reversedArr); // [5, 4, 3, 2, 1]
};

// ============================================
// 3. DYNAMIC OBJECT CREATION
// ============================================

/**
 * Example 1: Build object from array of keys
 */
const dynamicObject1 = () => {
    const keys = ['name', 'age', 'email'];
    const defaultValue = null;

    const obj = keys.reduce((acc, key) => {
        acc[key] = defaultValue;
        return acc;
    }, {} as Record<string, any>);
    console.log('Object from keys:', obj);
    // { name: null, age: null, email: null }
};

/**
 * Example 2: Build object with computed properties
 */
const dynamicObject2 = () => {
    const fields = ['firstName', 'lastName', 'email', 'age'];
    const values = ['Alice', 'Smith', 'alice@example.com', 25];

    const user = fields.reduce((acc, field, index) => {
        acc[field] = values[index];
        return acc;
    }, {} as Record<string, any>);
    console.log('User object:', user);
    // { firstName: 'Alice', lastName: 'Smith', email: 'alice@example.com', age: 25 }
};

/**
 * Example 3: Create object with dynamic keys
 */
function createDynamicObject<T extends Record<string, any>>(
    template: Array<[string | ((data: T) => string), any | ((data: T) => any)]>,
    data: T
): Record<string, any> {
    return template.reduce((acc, [keyOrFn, valueOrFn]) => {
        const key = typeof keyOrFn === 'function' ? keyOrFn(data) : keyOrFn;
        const value = typeof valueOrFn === 'function' ? valueOrFn(data) : valueOrFn;
        acc[key] = value;
        return acc;
    }, {} as Record<string, any>);
}

// Example usage
const dynamicObject3 = () => {
    const userData = { firstName: 'Alice', lastName: 'Smith', age: 25 };

    const result = createDynamicObject([
        ['name', (data: typeof userData) => `${data.firstName} ${data.lastName}`],
        ['isAdult', (data: typeof userData) => data.age >= 18],
        ['category', (data: typeof userData) => data.age < 30 ? 'young' : 'senior'],
        [(data: typeof userData) => `user_${data.firstName.toLowerCase()}`, true]
    ], userData);

    console.log('Dynamic object:', result);
    // {
    //   name: 'Alice Smith',
    //   isAdult: true,
    //   category: 'young',
    //   user_alice: true
    // }
};

/**
 * Example 4: Build nested objects dynamically
 */
function setNestedProperty(obj: any, path: string, value: any): void {
    const keys = path.split('.');
    const lastKey = keys.pop()!;

    const target = keys.reduce((acc, key) => {
        if (!acc[key]) {
            acc[key] = {};
        }
        return acc[key];
    }, obj);

    target[lastKey] = value;
}

// Example usage
const dynamicObject4 = () => {
    const obj: any = {};

    setNestedProperty(obj, 'user.profile.name', 'Alice');
    setNestedProperty(obj, 'user.profile.age', 25);
    setNestedProperty(obj, 'user.settings.theme', 'dark');
    setNestedProperty(obj, 'user.settings.notifications', true);

    console.log('Nested object:', JSON.stringify(obj, null, 2));
    /*
    {
      user: {
        profile: { name: 'Alice', age: 25 },
        settings: { theme: 'dark', notifications: true }
      }
    }
    */
};

/**
 * Example 5: Object from configuration array
 */
const dynamicObject5 = () => {
    const config = [
        { key: 'apiUrl', value: 'https://api.example.com' },
        { key: 'timeout', value: 5000 },
        { key: 'retries', value: 3 },
        { key: 'debug', value: true }
    ];

    const settings = config.reduce((acc, { key, value }) => {
        acc[key] = value;
        return acc;
    }, {} as Record<string, any>);

    console.log('Settings:', settings);
    // { apiUrl: '...', timeout: 5000, retries: 3, debug: true }
};

/**
 * Example 6: Conditional object properties
 */
function createObjectWithConditions<T>(conditions: Array<[boolean, string, T]>): Record<string, T> {
    return conditions.reduce((acc, [condition, key, value]) => {
        if (condition) {
            acc[key] = value;
        }
        return acc;
    }, {} as Record<string, T>);
}

// Example usage
const dynamicObject6 = () => {
    const isAdmin = true;
    const isPremium = false;
    const isVerified = true;

    const user = createObjectWithConditions<any>([
        [true, 'id', 123],
        [true, 'name', 'Alice'],
        [isAdmin, 'adminLevel', 5],
        [isPremium, 'premiumTier', 'gold'],
        [isVerified, 'verified', true]
    ]);

    console.log('Conditional user:', user);
    // { id: 123, name: 'Alice', adminLevel: 5, verified: true }
};

/**
 * Example 7: Merge multiple objects dynamically
 */
function deepMerge(...objects: Record<string, any>[]): Record<string, any> {
    return objects.reduce((acc, obj) => {
        Object.keys(obj).forEach(key => {
            if (obj[key] && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
                acc[key] = deepMerge(acc[key] || {}, obj[key]);
            } else {
                acc[key] = obj[key];
            }
        });
        return acc;
    }, {});
}

// Example usage
const dynamicObject7 = () => {
    const obj1 = { a: 1, b: { c: 2 } };
    const obj2 = { b: { d: 3 }, e: 4 };
    const obj3 = { f: 5, b: { g: 6 } };

    const merged = deepMerge(obj1, obj2, obj3);
    console.log('Deep merged:', merged);
    // { a: 1, b: { c: 2, d: 3, g: 6 }, e: 4, f: 5 }
};

/**
 * Example 8: Generate object with computed keys from array
 */
const dynamicObject8 = () => {
    const users = [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
        { id: 3, name: 'Charlie' }
    ];

    // Create lookup object with dynamic keys
    const userLookup = users.reduce((acc, user) => {
        acc[`user_${user.id}`] = user.name;
        acc[`name_${user.name.toLowerCase()}`] = user.id;
        return acc;
    }, {} as Record<string, string | number>);

    console.log('User lookup:', userLookup);
    // { user_1: 'Alice', name_alice: 1, user_2: 'Bob', name_bob: 2, ... }
};

/**
 * Example 9: Object factory with defaults
 */
function createObjectWithDefaults<T extends Record<string, any>>(
    defaults: T,
    overrides: Partial<T> = {}
): T {
    return Object.keys(defaults).reduce((acc, key) => {
        acc[key] = key in overrides ? overrides[key] : defaults[key];
        return acc;
    }, {} as any);
}

// Example usage
const dynamicObject9 = () => {
    const defaultUser = {
        name: 'Guest',
        age: 0,
        email: '',
        isActive: false
    };

    const user1 = createObjectWithDefaults(defaultUser, { name: 'Alice', age: 25 });
    const user2 = createObjectWithDefaults(defaultUser, { email: 'bob@example.com', isActive: true });

    console.log('User 1:', user1);
    // { name: 'Alice', age: 25, email: '', isActive: false }
    console.log('User 2:', user2);
    // { name: 'Guest', age: 0, email: 'bob@example.com', isActive: true }
};

/**
 * Example 10: Transform object keys
 */
function transformObjectKeys<T extends Record<string, any>>(
    obj: T,
    transformer: (key: string) => string
): Record<string, any> {
    return Object.keys(obj).reduce((acc, key) => {
        const newKey = transformer(key);
        acc[newKey] = obj[key];
        return acc;
    }, {} as Record<string, any>);
}

// Example usage
const dynamicObject10 = () => {
    const user = {
        first_name: 'Alice',
        last_name: 'Smith',
        email_address: 'alice@example.com'
    };

    // Convert snake_case to camelCase
    const camelCaseUser = transformObjectKeys(user, key =>
        key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
    );

    console.log('CamelCase user:', camelCaseUser);
    // { firstName: 'Alice', lastName: 'Smith', emailAddress: 'alice@example.com' }
};

// ============================================
// EXPORT ALL FUNCTIONS
// ============================================

export {
    // Group By
    manualGroupBy,
    manualGroupByExample,
    objectGroupByExample,

    // Reduce Examples
    reduceExample1,
    reduceExample2,
    reduceExample3,
    reduceExample4,
    reduceExample5,
    reduceExample6,
    reduceExample7,
    reduceExample8,
    reduceExample9,
    reduceExample10,

    // Dynamic Object Creation
    dynamicObject1,
    dynamicObject2,
    createDynamicObject,
    dynamicObject3,
    setNestedProperty,
    dynamicObject4,
    dynamicObject5,
    createObjectWithConditions,
    dynamicObject6,
    deepMerge,
    dynamicObject7,
    dynamicObject8,
    createObjectWithDefaults,
    dynamicObject9,
    transformObjectKeys,
    dynamicObject10
};
