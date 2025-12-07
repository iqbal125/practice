# TypeScript Interview Questions and Answers

## Basic Level Questions

### 1. What is TypeScript?
TypeScript is a statically typed superset of JavaScript developed by Microsoft that compiles to plain JavaScript. It adds optional static typing, classes, interfaces, and other features to JavaScript, enabling developers to write more robust and maintainable code. TypeScript helps catch errors at compile-time rather than runtime.

### 2. What are the main benefits of using TypeScript?
- **Type Safety**: Catches type-related errors during development
- **Better IDE Support**: Enhanced IntelliSense, auto-completion, and refactoring
- **Modern JavaScript Features**: Supports latest ECMAScript features
- **Code Readability**: Types serve as inline documentation
- **Refactoring**: Safer and easier code refactoring
- **Early Bug Detection**: Catches errors at compile-time
- **Better Collaboration**: Clear contracts between different parts of code
- **JavaScript Compatibility**: All JavaScript code is valid TypeScript

### 3. What are the basic types in TypeScript?
```typescript
// Primitive types
let isDone: boolean = false;
let decimal: number = 10;
let color: string = "blue";
let notSure: any = 4;
let unusable: void = undefined;
let u: undefined = undefined;
let n: null = null;

// Array types
let list: number[] = [1, 2, 3];
let genericArray: Array<number> = [1, 2, 3];

// Tuple
let tuple: [string, number] = ["hello", 10];

// Enum
enum Color {
  Red,
  Green,
  Blue
}
let c: Color = Color.Green;

// Unknown
let value: unknown = 4;
value = "maybe a string";
value = false;

// Never
function error(message: string): never {
  throw new Error(message);
}
```

### 4. What is the difference between `interface` and `type`?
```typescript
// Interface
interface User {
  name: string;
  age: number;
}

// Interface can be extended
interface Employee extends User {
  employeeId: number;
}

// Interface can be implemented
class Person implements User {
  name: string;
  age: number;
  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
}

// Type alias
type UserType = {
  name: string;
  age: number;
};

// Type can create union types
type Status = "active" | "inactive" | "pending";

// Type can create intersection types
type AdminUser = User & {
  isAdmin: boolean;
};

// Type can create utility types
type ReadonlyUser = Readonly<User>;
```

Key differences:
- Interfaces can be extended and implemented
- Interfaces support declaration merging
- Types can create unions, intersections, and mapped types
- Types can alias primitives, unions, and tuples

### 5. What is type inference in TypeScript?
Type inference is TypeScript's ability to automatically deduce types when they're not explicitly specified:

```typescript
// TypeScript infers the type as string
let message = "Hello World";

// TypeScript infers the return type as number
function add(a: number, b: number) {
  return a + b;
}

// TypeScript infers array type
let numbers = [1, 2, 3]; // number[]

// TypeScript infers object type
let user = {
  name: "John",
  age: 30
}; // { name: string; age: number; }

// Contextual typing
window.addEventListener("click", (e) => {
  // TypeScript knows e is MouseEvent
  console.log(e.button);
});
```

## Intermediate Level Questions

### 6. Explain Union and Intersection Types
```typescript
// Union Types (OR)
type StringOrNumber = string | number;

let value: StringOrNumber;
value = "hello"; // OK
value = 123;     // OK
// value = true; // Error

function printId(id: string | number) {
  if (typeof id === "string") {
    console.log(id.toUpperCase());
  } else {
    console.log(id.toFixed(2));
  }
}

// Intersection Types (AND)
interface Colorful {
  color: string;
}

interface Circle {
  radius: number;
}

type ColorfulCircle = Colorful & Circle;

let cc: ColorfulCircle = {
  color: "red",
  radius: 42
};

// Practical example
type Admin = {
  name: string;
  privileges: string[];
};

type Employee = {
  name: string;
  startDate: Date;
};

type ElevatedEmployee = Admin & Employee;

const e1: ElevatedEmployee = {
  name: "Max",
  privileges: ["create-server"],
  startDate: new Date()
};
```

### 7. What are Generics in TypeScript?
Generics provide a way to create reusable components that work with multiple types:

```typescript
// Generic function
function identity<T>(arg: T): T {
  return arg;
}

let output1 = identity<string>("myString");
let output2 = identity<number>(100);

// Generic interface
interface GenericIdentityFn<T> {
  (arg: T): T;
}

// Generic class
class GenericNumber<T> {
  zeroValue: T;
  add: (x: T, y: T) => T;
  
  constructor(zero: T, addFn: (x: T, y: T) => T) {
    this.zeroValue = zero;
    this.add = addFn;
  }
}

let myGenericNumber = new GenericNumber<number>(0, (x, y) => x + y);

// Generic constraints
interface Lengthwise {
  length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length);
  return arg;
}

// loggingIdentity(3); // Error
loggingIdentity("hello"); // OK
loggingIdentity([1, 2, 3]); // OK
loggingIdentity({ length: 10, value: 3 }); // OK

// Generic with multiple types
function pair<T, U>(first: T, second: U): [T, U] {
  return [first, second];
}

const result = pair<string, number>("hello", 42);
```

### 8. Explain Type Guards and Type Narrowing
```typescript
// typeof type guard
function padLeft(value: string, padding: string | number) {
  if (typeof padding === "number") {
    return " ".repeat(padding) + value;
  }
  if (typeof padding === "string") {
    return padding + value;
  }
}

// instanceof type guard
class Bird {
  fly() {
    console.log("flying");
  }
}

class Fish {
  swim() {
    console.log("swimming");
  }
}

function move(pet: Bird | Fish) {
  if (pet instanceof Bird) {
    pet.fly();
  } else {
    pet.swim();
  }
}

// in operator type guard
interface Car {
  drive(): void;
}

interface Boat {
  sail(): void;
}

function operate(vehicle: Car | Boat) {
  if ("drive" in vehicle) {
    vehicle.drive();
  } else {
    vehicle.sail();
  }
}

// Custom type guard (type predicate)
interface Cat {
  meow(): void;
}

interface Dog {
  bark(): void;
}

function isCat(pet: Cat | Dog): pet is Cat {
  return (pet as Cat).meow !== undefined;
}

function makeSound(pet: Cat | Dog) {
  if (isCat(pet)) {
    pet.meow();
  } else {
    pet.bark();
  }
}

// Discriminated unions
interface Square {
  kind: "square";
  size: number;
}

interface Rectangle {
  kind: "rectangle";
  width: number;
  height: number;
}

interface Circle {
  kind: "circle";
  radius: number;
}

type Shape = Square | Rectangle | Circle;

function area(shape: Shape): number {
  switch (shape.kind) {
    case "square":
      return shape.size * shape.size;
    case "rectangle":
      return shape.width * shape.height;
    case "circle":
      return Math.PI * shape.radius ** 2;
  }
}
```

### 9. What are Utility Types in TypeScript?
```typescript
interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

// Partial - Makes all properties optional
type PartialTodo = Partial<Todo>;
// Same as: { title?: string; description?: string; completed?: boolean; }

// Required - Makes all properties required
type RequiredTodo = Required<PartialTodo>;

// Readonly - Makes all properties readonly
type ReadonlyTodo = Readonly<Todo>;

// Pick - Creates type with subset of properties
type TodoPreview = Pick<Todo, "title" | "completed">;
// Same as: { title: string; completed: boolean; }

// Omit - Creates type with properties omitted
type TodoInfo = Omit<Todo, "completed">;
// Same as: { title: string; description: string; }

// Record - Creates object type with specified keys and values
type PageInfo = Record<"home" | "about" | "contact", { title: string }>;

// Exclude - Excludes types from union
type T0 = Exclude<"a" | "b" | "c", "a">; // "b" | "c"

// Extract - Extracts types from union
type T1 = Extract<"a" | "b" | "c", "a" | "f">; // "a"

// NonNullable - Excludes null and undefined
type T2 = NonNullable<string | number | undefined | null>; // string | number

// ReturnType - Gets return type of function
function f() {
  return { x: 10, y: 20 };
}
type P = ReturnType<typeof f>; // { x: number; y: number; }

// Parameters - Gets parameter types as tuple
function greet(name: string, age: number) {
  return `Hello ${name}, you are ${age}`;
}
type GreetParams = Parameters<typeof greet>; // [string, number]

// Awaited - Unwraps Promise type
type A = Awaited<Promise<string>>; // string
type B = Awaited<Promise<Promise<number>>>; // number
```

### 10. Explain the `keyof` and `typeof` operators
```typescript
// keyof operator - gets keys of a type
interface Person {
  name: string;
  age: number;
  location: string;
}

type PersonKeys = keyof Person; // "name" | "age" | "location"

function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const person: Person = {
  name: "Alice",
  age: 30,
  location: "NYC"
};

const name = getProperty(person, "name"); // string
const age = getProperty(person, "age"); // number
// const invalid = getProperty(person, "invalid"); // Error

// typeof operator - gets type of a value
let s = "hello";
let n: typeof s; // string

const user = {
  name: "John",
  age: 30,
  isAdmin: true
};

type User = typeof user; // { name: string; age: number; isAdmin: boolean; }

// Combining keyof and typeof
const colors = {
  red: "#ff0000",
  green: "#00ff00",
  blue: "#0000ff"
} as const;

type Colors = keyof typeof colors; // "red" | "green" | "blue"
```

### 11. What are Index Signatures and Mapped Types?
```typescript
// Index Signatures
interface StringDictionary {
  [key: string]: string;
}

let dict: StringDictionary = {
  name: "John",
  email: "john@example.com",
  // age: 30 // Error: Type 'number' is not assignable to type 'string'
};

// Index signature with multiple types
interface MixedDictionary {
  [key: string]: string | number;
  length: number; // OK, matches index signature
  name: string;    // OK, matches index signature
}

// Mapped Types
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

type Optional<T> = {
  [P in keyof T]?: T[P];
};

// Template literal types with mapped types
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

interface Person {
  name: string;
  age: number;
}

type PersonGetters = Getters<Person>;
// { getName: () => string; getAge: () => number; }

// Conditional mapped types
type NullableProperties<T> = {
  [K in keyof T]: T[K] | null;
};

// Remove readonly modifier
type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

// Remove optional modifier
type Concrete<T> = {
  [P in keyof T]-?: T[P];
};
```

## Advanced Level Questions

### 12. Explain Conditional Types
```typescript
// Basic conditional type
type IsString<T> = T extends string ? true : false;

type A = IsString<string>;  // true
type B = IsString<number>;  // false

// Conditional type with generics
type TypeName<T> = 
  T extends string ? "string" :
  T extends number ? "number" :
  T extends boolean ? "boolean" :
  T extends undefined ? "undefined" :
  T extends Function ? "function" :
  "object";

type T0 = TypeName<string>;  // "string"
type T1 = TypeName<"a">;     // "string"
type T2 = TypeName<true>;    // "boolean"
type T3 = TypeName<() => void>;  // "function"

// Distributive conditional types
type ToArray<T> = T extends any ? T[] : never;
type StrArrOrNumArr = ToArray<string | number>; // string[] | number[]

// Infer keyword in conditional types
type GetReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

type Fn = () => number;
type RetType = GetReturnType<Fn>; // number

// Extract array element type
type ArrayElementType<T> = T extends (infer E)[] ? E : T;
type Item = ArrayElementType<string[]>; // string
type Item2 = ArrayElementType<number>; // number

// Extract promise type
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;
type Unwrapped = UnwrapPromise<Promise<string>>; // string

// Complex conditional type example
type FunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];

type FunctionProperties<T> = Pick<T, FunctionPropertyNames<T>>;

interface Part {
  id: number;
  name: string;
  subparts: Part[];
  updatePart(newName: string): void;
  removePart(): void;
}

type PartFunctions = FunctionPropertyNames<Part>; // "updatePart" | "removePart"
```

### 13. What are Template Literal Types?
```typescript
// Basic template literal types
type World = "world";
type Greeting = `hello ${World}`; // "hello world"

// Union types in template literals
type Color = "red" | "green" | "blue";
type Quantity = "one" | "two" | "three";
type SeussFish = `${Quantity | Color} fish`;
// "one fish" | "two fish" | "three fish" | "red fish" | "green fish" | "blue fish"

// Uppercase/Lowercase manipulation
type Greeting2 = "Hello World";
type ShoutyGreeting = Uppercase<Greeting2>; // "HELLO WORLD"
type QuietGreeting = Lowercase<Greeting2>; // "hello world"
type CapitalizedGreeting = Capitalize<Lowercase<Greeting2>>; // "Hello world"

// Practical example with event handlers
type PropEventSource<T> = {
  on<K extends string & keyof T>
    (eventName: `${K}Changed`, callback: (newValue: T[K]) => void): void;
};

declare function makeWatchedObject<T>(obj: T): T & PropEventSource<T>;

const person = makeWatchedObject({
  firstName: "Homer",
  age: 42
});

person.on("firstNameChanged", (newName) => {
  console.log(`New name is ${newName.toUpperCase()}`);
});

// person.on("firstNameChanged", (newAge) => {
//   console.log(newAge); // Error: Argument is string, not number
// });

// Template literal with mapped types
type CSSProperties = {
  padding: number;
  margin: number;
};

type CSSPropertyNames<T> = {
  [K in keyof T as `${string & K}Px`]: T[K];
};

type PixelProperties = CSSPropertyNames<CSSProperties>;
// { paddingPx: number; marginPx: number; }
```

### 14. Explain Declaration Merging
```typescript
// Interface declaration merging
interface User {
  name: string;
}

interface User {
  age: number;
}

// Merged to:
// interface User {
//   name: string;
//   age: number;
// }

const user: User = {
  name: "John",
  age: 30
};

// Function and namespace merging
function buildLabel(name: string): string {
  return buildLabel.prefix + name + buildLabel.suffix;
}

namespace buildLabel {
  export let suffix = "";
  export let prefix = "Hello, ";
}

buildLabel.suffix = "!";
console.log(buildLabel("Sam")); // "Hello, Sam!"

// Class and namespace merging
class Album {
  label: Album.AlbumLabel;
  constructor(label: Album.AlbumLabel) {
    this.label = label;
  }
}

namespace Album {
  export class AlbumLabel {
    constructor(public name: string) {}
  }
}

// Module augmentation
declare module "express" {
  interface Request {
    user?: {
      id: string;
      email: string;
    };
  }
}

// Global augmentation
declare global {
  interface Window {
    myCustomProperty: string;
  }
}

window.myCustomProperty = "Hello";
```

### 15. What are Decorators in TypeScript?
```typescript
// Note: Decorators are experimental and require enabling in tsconfig.json
// "experimentalDecorators": true

// Class decorator
function sealed(constructor: Function) {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
}

@sealed
class BugReport {
  type = "report";
  title: string;
  
  constructor(t: string) {
    this.title = t;
  }
}

// Method decorator
function enumerable(value: boolean) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    descriptor.enumerable = value;
  };
}

class Greeter {
  greeting: string;
  constructor(message: string) {
    this.greeting = message;
  }
  
  @enumerable(false)
  greet() {
    return "Hello, " + this.greeting;
  }
}

// Property decorator
function format(formatString: string) {
  return function (target: any, propertyKey: string) {
    let value = target[propertyKey];
    
    const getter = function () {
      return `${formatString} ${value}`;
    };
    
    const setter = function (newVal: string) {
      value = newVal;
    };
    
    Object.defineProperty(target, propertyKey, {
      get: getter,
      set: setter,
      enumerable: true,
      configurable: true
    });
  };
}

class User {
  @format("User:")
  name: string;
  
  constructor(name: string) {
    this.name = name;
  }
}

// Parameter decorator
function required(
  target: any,
  propertyName: string,
  parameterIndex: number
) {
  let existingRequiredParameters: number[] = 
    Reflect.getOwnMetadata("required", target, propertyName) || [];
  existingRequiredParameters.push(parameterIndex);
  Reflect.defineMetadata(
    "required",
    existingRequiredParameters,
    target,
    propertyName
  );
}

class Calculator {
  add(@required a: number, b: number) {
    return a + b;
  }
}
```

### 16. Explain `abstract` classes and methods
```typescript
abstract class Animal {
  abstract makeSound(): void;
  abstract readonly numberOfLegs: number;
  
  move(): void {
    console.log("Moving...");
  }
}

// Cannot instantiate abstract class
// const animal = new Animal(); // Error

class Dog extends Animal {
  readonly numberOfLegs = 4;
  
  makeSound(): void {
    console.log("Woof!");
  }
  
  wagTail(): void {
    console.log("Wagging tail");
  }
}

class Snake extends Animal {
  readonly numberOfLegs = 0;
  
  makeSound(): void {
    console.log("Hiss!");
  }
}

const dog = new Dog();
dog.makeSound(); // "Woof!"
dog.move(); // "Moving..."

// Abstract class as type
function makeAnimalSound(animal: Animal) {
  animal.makeSound();
  animal.move();
}

makeAnimalSound(dog); // OK
makeAnimalSound(new Snake()); // OK
```

### 17. What is the `infer` keyword and how is it used?
```typescript
// Extract function return type
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : any;

type Func = () => string;
type FuncReturn = ReturnType<Func>; // string

// Extract array/tuple types
type Unpacked<T> = T extends (infer U)[] ? U :
                   T extends (...args: any[]) => infer U ? U :
                   T extends Promise<infer U> ? U :
                   T;

type T0 = Unpacked<string[]>; // string
type T1 = Unpacked<() => string>; // string
type T2 = Unpacked<Promise<string>>; // string
type T3 = Unpacked<Promise<string>[]>; // Promise<string>

// Extract component props
type ComponentProps<T> = T extends React.ComponentType<infer P> ? P : never;

// Extract constructor parameters
type ConstructorParameters<T> = T extends new (...args: infer P) => any ? P : never;

class MyClass {
  constructor(a: string, b: number) {}
}

type MyClassParams = ConstructorParameters<typeof MyClass>; // [string, number]

// Pattern matching with infer
type FirstArgument<T> = T extends (first: infer F, ...args: any[]) => any ? F : never;

type Callback = (name: string, age: number) => void;
type FirstArg = FirstArgument<Callback>; // string

// Multiple infer positions
type Tail<T extends readonly any[]> = T extends readonly [any, ...infer Rest] ? Rest : [];

type T4 = Tail<[1, 2, 3, 4]>; // [2, 3, 4]
```

### 18. How do you handle `this` type in TypeScript?
```typescript
// Fluent interface pattern
class Calculator {
  private value = 0;
  
  add(n: number): this {
    this.value += n;
    return this;
  }
  
  multiply(n: number): this {
    this.value *= n;
    return this;
  }
  
  getValue(): number {
    return this.value;
  }
}

const result = new Calculator()
  .add(5)
  .multiply(3)
  .add(10)
  .getValue(); // 25

// Polymorphic this types
class BasicCalculator {
  protected value = 0;
  
  add(n: number): this {
    this.value += n;
    return this;
  }
  
  currentValue(): number {
    return this.value;
  }
}

class ScientificCalculator extends BasicCalculator {
  sin(): this {
    this.value = Math.sin(this.value);
    return this;
  }
}

const calc = new ScientificCalculator()
  .add(1)
  .sin()
  .add(1);

// this parameter in functions
interface UIElement {
  addClickListener(onclick: (this: void, e: Event) => void): void;
}

class Handler {
  info: string;
  
  onClickBad(this: Handler, e: Event) {
    // this has type Handler here
    this.info = e.type;
  }
  
  onClickGood = (e: Event) => {
    // Arrow function captures this
    this.info = e.type;
  }
}

// ThisType utility
type ObjectDescriptor<D, M> = {
  data?: D;
  methods?: M & ThisType<D & M>;
};

function makeObject<D, M>(desc: ObjectDescriptor<D, M>): D & M {
  let data: object = desc.data || {};
  let methods: object = desc.methods || {};
  return { ...data, ...methods } as D & M;
}

let obj = makeObject({
  data: { x: 0, y: 0 },
  methods: {
    moveBy(dx: number, dy: number) {
      this.x += dx; // this has type D & M
      this.y += dy;
    }
  }
});
```

### 19. What are Assertion Functions and Type Predicates?
```typescript
// Type predicates
function isString(value: unknown): value is string {
  return typeof value === "string";
}

function example(value: string | number) {
  if (isString(value)) {
    console.log(value.toUpperCase()); // value is string here
  } else {
    console.log(value.toFixed(2)); // value is number here
  }
}

// Assertion functions
function assert(condition: any, msg?: string): asserts condition {
  if (!condition) {
    throw new Error(msg || "Assertion failed");
  }
}

function processValue(value: string | null) {
  assert(value !== null, "Value cannot be null");
  // value is string here (null is removed from type)
  console.log(value.toUpperCase());
}

// Type assertion with specific type
function assertIsString(value: unknown): asserts value is string {
  if (typeof value !== "string") {
    throw new Error("Value must be a string");
  }
}

function handleValue(value: unknown) {
  assertIsString(value);
  // value is string from here on
  console.log(value.length);
}

// Assertion function with type narrowing
function assertIsDefined<T>(value: T): asserts value is NonNullable<T> {
  if (value === undefined || value === null) {
    throw new Error(`Expected value to be defined, but received ${value}`);
  }
}

function getLength(str?: string) {
  assertIsDefined(str);
  return str.length; // str is definitely string, not string | undefined
}

// Custom error class with assertion
class ApiError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
  }
}

function assertSuccessResponse<T>(
  response: { ok: boolean; data?: T; error?: string }
): asserts response is { ok: true; data: T } {
  if (!response.ok || !response.data) {
    throw new ApiError(400, response.error || "Request failed");
  }
}
```

### 20. Explain Module Systems in TypeScript
```typescript
// ES6 Modules (recommended)
// math.ts
export function add(a: number, b: number): number {
  return a + b;
}

export const PI = 3.14159;

export default class Calculator {
  // ...
}

// main.ts
import Calculator, { add, PI } from "./math";
import * as math from "./math";
import { add as addition } from "./math";

// CommonJS modules
// utils.js
module.exports = {
  formatDate: (date: Date) => date.toISOString()
};

// or
exports.formatDate = (date: Date) => date.toISOString();

// main.ts
const utils = require("./utils");
// or with types
import utils = require("./utils");

// AMD modules
define(["require", "exports"], function (require, exports) {
  exports.doSomething = function () {
    // ...
  };
});

// UMD modules
(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports"], factory);
  } else if (typeof exports === "object") {
    factory(exports);
  } else {
    factory((root.MyModule = {}));
  }
}(this, function (exports) {
  exports.doSomething = function () {
    // ...
  };
}));

// Namespace/Internal modules
namespace Validation {
  export interface StringValidator {
    isAcceptable(s: string): boolean;
  }
  
  export class ZipCodeValidator implements StringValidator {
    isAcceptable(s: string) {
      return s.length === 5;
    }
  }
}

// Triple-slash directives
/// <reference path="node.d.ts"/>
/// <reference types="node" />

// Module resolution
// Classic vs Node resolution strategy
// tsconfig.json
{
  "compilerOptions": {
    "moduleResolution": "node", // or "classic"
    "baseUrl": "./src",
    "paths": {
      "@utils/*": ["utils/*"],
      "@components/*": ["components/*"]
    }
  }
}
```

## TypeScript Configuration Questions

### 21. What are the important `tsconfig.json` options?
```json
{
  "compilerOptions": {
    // Type Checking
    "strict": true,                    // Enable all strict type checking options
    "noImplicitAny": true,             // Error on expressions with 'any' type
    "strictNullChecks": true,          // Enable strict null checks
    "strictFunctionTypes": true,       // Strict checking of function types
    "strictBindCallApply": true,       // Strict 'bind', 'call', and 'apply'
    "strictPropertyInitialization": true, // Strict property initialization
    "noImplicitThis": true,            // Error on 'this' with 'any' type
    "alwaysStrict": true,              // Parse in strict mode
    
    // Module Resolution
    "module": "esnext",                // Module code generation
    "moduleResolution": "node",        // Module resolution strategy
    "baseUrl": "./src",                // Base directory for resolving modules
    "paths": {                         // Path mapping
      "@/*": ["*"]
    },
    "esModuleInterop": true,           // Enables emit interoperability
    "allowSyntheticDefaultImports": true, // Allow default imports
    
    // Emit
    "target": "es2020",                // ECMAScript target version