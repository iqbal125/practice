In Python, a **2D array traversal** means visiting each element in a 2D list (a list of lists) — typically row by row, or sometimes column by column or in a custom order.

Here’s a breakdown with examples:

---

### 🧩 Basic Example (Row-wise Traversal)

```python
matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]

# Row-wise traversal
for row in matrix:
    for element in row:
        print(element, end=' ')
```

**Output:**

```
1 2 3 4 5 6 7 8 9
```

Explanation:

* The outer loop iterates over each row (a list).
* The inner loop iterates over each element in that row.

---

### 🔁 Using Indexes

If you need the row and column indices:

```python
for i in range(len(matrix)):           # row index
    for j in range(len(matrix[i])):    # column index
        print(f"matrix[{i}][{j}] = {matrix[i][j]}")
```

---

### 🧮 Column-wise Traversal

If you want to go column by column:

```python
rows = len(matrix)
cols = len(matrix[0])

for j in range(cols):
    for i in range(rows):
        print(matrix[i][j], end=' ')
```

**Output:**

```
1 4 7 2 5 8 3 6 9
```

---

### ⚙️ Using `enumerate()` (Pythonic Style)

```python
for i, row in enumerate(matrix):
    for j, val in enumerate(row):
        print(f"Value at ({i},{j}) = {val}")
```

---

### 🚀 Advanced Traversal Examples

**Diagonal traversal:**

```python
n = len(matrix)
for i in range(n):
    print(matrix[i][i])  # main diagonal
```

**Reverse order:**

```python
for row in reversed(matrix):
    for val in reversed(row):
        print(val, end=' ')
```

---

Would you like me to show **how to flatten a 2D array** or **perform specific traversals** (like spiral, zigzag, diagonal sum, etc.) next?


Great! Let’s go step-by-step through the **most common advanced 2D array traversals** in Python — with clear examples you can run right away.

---

## 🧮 1. Flatten a 2D Array

Turn a 2D array into a 1D list.

### Method 1 – Simple nested loops

```python
matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]

flattened = []
for row in matrix:
    for val in row:
        flattened.append(val)

print(flattened)
```

**Output:**

```
[1, 2, 3, 4, 5, 6, 7, 8, 9]
```

### Method 2 – List comprehension

```python
flattened = [val for row in matrix for val in row]
```

---

## 🌀 2. Spiral Traversal (Clockwise)

Go around the edges and move inward, like reading a spiral.

```python
matrix = [
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 12],
    [13, 14, 15, 16]
]

result = []
top, bottom, left, right = 0, len(matrix) - 1, 0, len(matrix[0]) - 1

while top <= bottom and left <= right:
    # Traverse top row
    for j in range(left, right + 1):
        result.append(matrix[top][j])
    top += 1

    # Traverse right column
    for i in range(top, bottom + 1):
        result.append(matrix[i][right])
    right -= 1

    # Traverse bottom row
    if top <= bottom:
        for j in range(right, left - 1, -1):
            result.append(matrix[bottom][j])
        bottom -= 1

    # Traverse left column
    if left <= right:
        for i in range(bottom, top - 1, -1):
            result.append(matrix[i][left])
        left += 1

print(result)
```

**Output:**

```
[1, 2, 3, 4, 8, 12, 16, 15, 14, 13, 9, 5, 6, 7, 11, 10]
```

---

## ⚡ 3. Zigzag Traversal (Row Alternating)

Go left to right on one row, then right to left on the next.

```python
matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]

zigzag = []
for i, row in enumerate(matrix):
    if i % 2 == 0:
        zigzag.extend(row)
    else:
        zigzag.extend(reversed(row))

print(zigzag)
```

**Output:**

```
[1, 2, 3, 6, 5, 4, 7, 8, 9]
```

---

## 🔺 4. Diagonal Traversal

Print elements from top-left to bottom-right diagonals.

```python
matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]

n = len(matrix)
diagonals = []

for d in range(2 * n - 1):
    for i in range(max(0, d - n + 1), min(n, d + 1)):
        j = d - i
        diagonals.append(matrix[i][j])

print(diagonals)
```

**Output:**

```
[1, 2, 4, 3, 5, 7, 6, 8, 9]
```

---

Would you like me to show **visual diagrams** of these traversals next (so you can see the order step-by-step), or go into **algorithm explanations (time/space complexity)**?


Perfect — let’s dive deep into **Spiral Traversal (Clockwise)** for a 2D array (matrix) in Python.

---

## 🌀 Spiral Traversal Explained

**Goal:**
Visit every element of a matrix in a **clockwise spiral** — starting from the top-left corner, moving right, then down, then left, then up, and repeat until all elements are visited.

---

### 📘 Example Matrix

Let’s take:

```python
matrix = [
    [1,  2,  3,  4],
    [5,  6,  7,  8],
    [9,  10, 11, 12],
    [13, 14, 15, 16]
]
```

We want the output to be:

```
[1, 2, 3, 4, 8, 12, 16, 15, 14, 13, 9, 5, 6, 7, 11, 10]
```

---

## 🧩 Algorithm Logic (Step-by-Step)

We maintain **four boundaries**:

* `top` → first row index
* `bottom` → last row index
* `left` → first column index
* `right` → last column index

We traverse in **this order**:

1. Left → Right  (along `top` row)
2. Top → Bottom  (along `right` column)
3. Right → Left  (along `bottom` row)
4. Bottom → Top  (along `left` column)

After each traversal:

* Move `top` down
* Move `right` left
* Move `bottom` up
* Move `left` right

And continue until all boundaries cross.

---

### 🧠 Code Implementation

```python
def spiral_traversal(matrix):
    result = []
    if not matrix:
        return result

    top, bottom = 0, len(matrix) - 1
    left, right = 0, len(matrix[0]) - 1

    while top <= bottom and left <= right:
        # 1️⃣ Traverse top row
        for j in range(left, right + 1):
            result.append(matrix[top][j])
        top += 1

        # 2️⃣ Traverse right column
        for i in range(top, bottom + 1):
            result.append(matrix[i][right])
        right -= 1

        # 3️⃣ Traverse bottom row (if still within bounds)
        if top <= bottom:
            for j in range(right, left - 1, -1):
                result.append(matrix[bottom][j])
            bottom -= 1

        # 4️⃣ Traverse left column (if still within bounds)
        if left <= right:
            for i in range(bottom, top - 1, -1):
                result.append(matrix[i][left])
            left += 1

    return result


# Example usage:
matrix = [
    [1,  2,  3,  4],
    [5,  6,  7,  8],
    [9,  10, 11, 12],
    [13, 14, 15, 16]
]

print(spiral_traversal(matrix))
```

---

### ✅ Output

```
[1, 2, 3, 4, 8, 12, 16, 15, 14, 13, 9, 5, 6, 7, 11, 10]
```

---

## 🧩 Time & Space Complexity

| Metric               | Value      | Explanation                          |
| -------------------- | ---------- | ------------------------------------ |
| **Time Complexity**  | `O(m × n)` | Each element is visited exactly once |
| **Space Complexity** | `O(m × n)` | For storing the result list          |

---

## 🧭 Visual Diagram

```
Initial boundaries:
top=0, bottom=3, left=0, right=3

1 →  2 →  3 →  4
↓             ↓
5   6   7   8
↓             ↓
9  10  11  12
↓             ↓
13 ← 14 ← 15 ← 16
```

Then move inward:

```
top=1, bottom=2, left=1, right=2

6 → 7
↓   ↓
10 ← 11
```

Combine all steps → spiral order.

---

Would you like me to show how to **reverse the spiral direction (counter-clockwise)** or **visualize each iteration step-by-step** in a printed grid (like an animation in console)?
