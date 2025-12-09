Below is a **compact but powerful Jotai cheatsheet** tailored for real-world React projects (like the multi-component debugging scenarios you often build).
You can skim it quickly during interviews.

---

# 🧪 **JOTAI CHEATSHEET — 2025 Edition**

---

## 🎯 **Core Concepts**

| Concept            | Meaning                                                |
| ------------------ | ------------------------------------------------------ |
| **Atom**           | A unit of state, like a tiny global variable.          |
| **Primitive atom** | Holds a raw value (`atom(0)` / `atom({})`).            |
| **Derived atom**   | Computes value from other atoms.                       |
| **Writable atom**  | Has a write function → side effects, async, API calls. |
| **Selector atom**  | Read-only derived state.                               |
| **Async atom**     | Returns a Promise → suspended until resolved.          |

---

# 🧱 **1. Primitive Atoms**

```ts
import { atom } from "jotai";

export const countAtom = atom(0);
```

**Usage in a component**

```tsx
const [count, setCount] = useAtom(countAtom);
```

---

# 🔄 **2. Derived (Read-Only) Atoms**

```ts
export const doubleAtom = atom((get) => get(countAtom) * 2);
```

Component:

```tsx
const double = useAtomValue(doubleAtom);
```

---

# ✏️ **3. Writable Derived Atoms**

```ts
export const incrementAtom = atom(
  (get) => get(countAtom),
  (get, set) => set(countAtom, get(countAtom) + 1)
);
```

Use:

```tsx
const [, inc] = useAtom(incrementAtom);
```

---

# 🛠️ **4. Async Atoms**

### **Fetch data on read (auto-suspends)**

```ts
export const userAtom = atom(async () => {
  const res = await fetch("/api/user");
  return res.json();
});
```

Usage:

```tsx
const user = useAtomValue(userAtom);  // automatically suspends if wrapped in <Suspense>
```

---

# 🌊 **5. Read/Write Async Atoms (API calls)**

```ts
export const saveUserAtom = atom(
  null,
  async (_get, _set, newUser) => {
    await fetch("/api/user", {
      method: "POST",
      body: JSON.stringify(newUser)
    });
  }
);
```

---

# 🏗️ **6. Atom Families (Dynamic Atoms)**

Great for lists, tables, dynamic forms:

```ts
import { atomFamily } from "jotai/utils";

export const itemAtom = atomFamily((id) =>
  atom({ id, done: false })
);
```

Usage:

```tsx
const [item, setItem] = useAtom(itemAtom(id));
```

---

# 📦 **7. Atoms With Storage (LocalStorage, etc.)**

```ts
import { atomWithStorage } from "jotai/utils";

export const themeAtom = atomWithStorage("theme", "light");
```

---

# 🧰 **8. Resettable Atoms**

```ts
import { atomWithReset } from "jotai/utils";

export const filterAtom = atomWithReset("");
```

Reset:

```tsx
const [, reset] = useResetAtom(filterAtom);
reset();
```

---

# 🪝 **9. Hooks Overview**

| Hook                 | Meaning                                  |
| -------------------- | ---------------------------------------- |
| `useAtom(atom)`      | Read + Write                             |
| `useAtomValue(atom)` | Read only                                |
| `useSetAtom(atom)`   | Write only                               |
| `useResetAtom(atom)` | Reset atoms created with `atomWithReset` |

---

# 🧩 **10. Multiple Components Sharing State**

**AppState.js**

```ts
export const cartAtom = atom([]);
export const cartCountAtom = atom((get) => get(cartAtom).length);
```

**Component A**

```tsx
const [cart, setCart] = useAtom(cartAtom);
```

**Component B**

```tsx
const count = useAtomValue(cartCountAtom);
```

---

# 🧹 **11. Debugging Jotai**

### Log atom changes:

```ts
import { atom } from "jotai";

export const debugAtom = atom(
  (get) => get(countAtom),
  (get, set, update) => {
    console.log("count before", get(countAtom));
    set(countAtom, update);
    console.log("count after", get(countAtom));
  }
);
```

### Use the Jotai DevTools:

```
npm i jotai-devtools
```

---

# 🔥 **12. Advanced: Split Atom**

For arrays → return atom for each item.

```ts
import { splitAtom } from "jotai/utils";

export const todosAtom = atom([
  { id: 1, text: "A" },
  { id: 2, text: "B" }
]);

export const todoAtomsAtom = splitAtom(todosAtom);
```

Usage:

```tsx
const [todoAtoms] = useAtom(todoAtomsAtom);
const [todo, setTodo] = useAtom(todoAtoms[i]);
```

---

# 🧠 **13. Jotai Debug Interview Tips**

1. **“Stale reads”** → Ensure derived atoms use `get` **inside** atom function.
2. **Infinite re-render loops** → Writable atom modification must come from event handlers, not inside render.
3. **Async atoms require Suspense** — or wrap with manual loading states.
4. **Split atoms preserve reference identity**, great for list updates without re-rendering entire arrays.
5. **Atom families** help avoid stale snapshots when mapping dynamic lists.

---

# 🚀 Want a full mock interview with a buggy multi-component Jotai project?

I can generate:

* A broken 3–4 component app
* Bugs like stale derived atoms, async race conditions, inconsistent family atoms
* Interview-style debugging questions
* “Fix this code” tasks

Just say **“generate the Jotai debugging project”**.
