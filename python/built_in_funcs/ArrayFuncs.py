
import copy
from functools import reduce
from itertools import groupby, chain
from collections import Counter, deque

nums = [10, 20, 30, 90, 80, 40, 50]


def getIndexAndValue(nums):
    for i, value in enumerate(nums):
        print(f"{i} index {value} value")


def sort_nums(nums):
    sorted_nums = sorted(nums)
    return sorted_nums



def square_num(nums):
    squared = list(map(lambda x: x * 2, nums))
    return squared

def filter_by_twenty(nums):
    filtered_list = list(filter(lambda x: x % 20 == 0, nums))
    return filtered_list

print(any(i % 20 == 0 for i in nums))
print(all(i % 20 == 0 for i in nums))
print(filter_by_twenty(nums))

# ============================================
# Common List Functions in Python
# ============================================

# 1. Creating Lists
# ============================================

# Various ways to create lists
list1 = [1, 2, 3, 4, 5]
list2 = list(range(1, 6))
list3 = [0] * 5  # Create list with repeated values
list4 = list("hello")  # Create from string
print(f"Create from range: {list2}")
print(f"Repeated values: {list3}")
print(f"From string: {list4}")

# 2. Adding Elements
# ============================================

# append() - add single element to end
fruits = ["apple", "banana"]
fruits.append("cherry")
print(f"\nappend(): {fruits}")

# extend() - add multiple elements
fruits.extend(["date", "elderberry"])
print(f"extend(): {fruits}")

# insert() - add element at specific index
fruits.insert(1, "apricot")
print(f"insert(): {fruits}")

# + operator - concatenate lists
combined = [1, 2] + [3, 4]
print(f"Concatenate: {combined}")

# 3. Removing Elements
# ============================================

sample = [1, 2, 3, 4, 5, 3, 6]

# remove() - remove first occurrence of value
sample_copy = sample.copy()
sample_copy.remove(3)
print(f"\nremove(3): {sample_copy}")

# pop() - remove and return element at index (default: last)
sample_copy = sample.copy()
popped = sample_copy.pop()  # Remove last
print(f"pop() last: {popped}, list: {sample_copy}")

popped_index = sample_copy.pop(1)  # Remove at index
print(f"pop(1): {popped_index}, list: {sample_copy}")

# del - remove element(s) by index or slice
sample_copy = sample.copy()
del sample_copy[0]
print(f"del [0]: {sample_copy}")

del sample_copy[1:3]
print(f"del [1:3]: {sample_copy}")

# clear() - remove all elements
sample_copy = sample.copy()
sample_copy.clear()
print(f"clear(): {sample_copy}")

# 4. Accessing Elements
# ============================================

numbers = [10, 20, 30, 40, 50, 60, 70]

# Indexing
print(f"\nFirst element: {numbers[0]}")
print(f"Last element: {numbers[-1]}")
print(f"Second to last: {numbers[-2]}")

# Slicing
print(f"First 3: {numbers[:3]}")
print(f"Last 3: {numbers[-3:]}")
print(f"Middle: {numbers[2:5]}")
print(f"Every other: {numbers[::2]}")
print(f"Reverse: {numbers[::-1]}")

# index() - find index of first occurrence
idx = numbers.index(40)
print(f"index(40): {idx}")

# count() - count occurrences
repeat_list = [1, 2, 3, 2, 4, 2, 5]
count = repeat_list.count(2)
print(f"count(2): {count}")

# 5. Sorting and Reversing
# ============================================

unsorted = [3, 1, 4, 1, 5, 9, 2, 6]

# sort() - sort in place
list_to_sort = unsorted.copy()
list_to_sort.sort()
print(f"\nsort() ascending: {list_to_sort}")

list_to_sort = unsorted.copy()
list_to_sort.sort(reverse=True)
print(f"sort() descending: {list_to_sort}")

# sorted() - return new sorted list
sorted_list = sorted(unsorted)
print(f"sorted(): {sorted_list}, original: {unsorted}")

# reverse() - reverse in place
list_to_reverse = [1, 2, 3, 4, 5]
list_to_reverse.reverse()
print(f"reverse(): {list_to_reverse}")

# reversed() - return reversed iterator
reversed_iter = list(reversed([1, 2, 3, 4, 5]))
print(f"reversed(): {reversed_iter}")

# Sort with key function
words = ["banana", "pie", "Washington", "book"]
sorted_by_length = sorted(words, key=len)
print(f"sorted by length: {sorted_by_length}")

sorted_case_insensitive = sorted(words, key=str.lower)
print(f"sorted case-insensitive: {sorted_case_insensitive}")

# 6. List Comprehensions
# ============================================

# Basic comprehension
squares = [x**2 for x in range(1, 6)]
print(f"\nSquares: {squares}")

# With condition
evens = [x for x in range(1, 11) if x % 2 == 0]
print(f"Evens: {evens}")

# With if-else
labels = ["even" if x % 2 == 0 else "odd" for x in range(1, 6)]
print(f"Labels: {labels}")

# Nested comprehension
matrix = [[i * j for j in range(1, 4)] for i in range(1, 4)]
print(f"Matrix: {matrix}")

# Flatten nested list
nested = [[1, 2], [3, 4], [5, 6]]
flattened = [item for sublist in nested for item in sublist]
print(f"Flattened: {flattened}")

# 7. Searching and Checking
# ============================================

check_list = [1, 2, 3, 4, 5]

# in operator
print(f"\n3 in list: {3 in check_list}")
print(f"10 in list: {10 in check_list}")

# any() - check if any element is True
print(f"any > 4: {any(x > 4 for x in check_list)}")

# all() - check if all elements are True
print(f"all > 0: {all(x > 0 for x in check_list)}")

# 8. Mathematical Operations
# ============================================

math_list = [1, 2, 3, 4, 5]

# sum() - sum of all elements
print(f"\nsum(): {sum(math_list)}")

# min() and max()
print(f"min(): {min(math_list)}")
print(f"max(): {max(math_list)}")

# len() - number of elements
print(f"len(): {len(math_list)}")

# Average
average = sum(math_list) / len(math_list)
print(f"average: {average}")

# 9. Copying Lists
# ============================================

original = [1, 2, 3, [4, 5]]

# Shallow copy - methods
copy1 = original.copy()
copy2 = original[:]
copy3 = list(original)
print("\nShallow copies work for simple lists")

# Deep copy - for nested lists
deep_copied = copy.deepcopy(original)
print(f"Deep copy: {deep_copied}")

# 10. List Iteration
# ============================================

iteration_list = ["a", "b", "c"]

print("\nIteration examples:")
# Basic iteration
for item in iteration_list:
    print(f"Item: {item}")

# With index using enumerate()
for idx, item in enumerate(iteration_list):
    print(f"Index {idx}: {item}")

# With enumerate starting from custom number
for idx, item in enumerate(iteration_list, start=1):
    print(f"Position {idx}: {item}")

# Iterate over multiple lists with zip()
list_a = [1, 2, 3]
list_b = ["a", "b", "c"]
for num, letter in zip(list_a, list_b):
    print(f"{num} -> {letter}")

# 11. Advanced List Functions
# ============================================

# map() - apply function to all elements
numbers_to_map = [1, 2, 3, 4, 5]
doubled = list(map(lambda x: x * 2, numbers_to_map))
print(f"\nmap() doubled: {doubled}")

# filter() - filter elements
filtered = list(filter(lambda x: x % 2 == 0, range(1, 11)))
print(f"filter() evens: {filtered}")

# reduce() - reduce list to single value
product = reduce(lambda x, y: x * y, [1, 2, 3, 4, 5])
print(f"reduce() product: {product}")

# 12. List Unpacking
# ============================================

# Basic unpacking
a, b, c = [1, 2, 3]
print(f"\nUnpack: a={a}, b={b}, c={c}")

# Extended unpacking
first, *middle, last = [1, 2, 3, 4, 5]
print(f"Extended unpack: first={first}, middle={middle}, last={last}")

# 13. Finding Elements
# ============================================

search_list = [10, 20, 30, 40, 50]

# Find first element matching condition
first_greater_25 = next((x for x in search_list if x > 25), None)
print(f"\nFirst > 25: {first_greater_25}")

# Find all elements matching condition
all_greater_25 = [x for x in search_list if x > 25]
print(f"All > 25: {all_greater_25}")

# Find index of element matching condition
try:
    idx = next(i for i, x in enumerate(search_list) if x > 25)
    print(f"Index of first > 25: {idx}")
except StopIteration:
    print("Not found")

# 14. List Aggregation with Counter
# ============================================

count_list = [1, 1, 2, 2, 2, 3, 3, 3, 3, 4]
counter = Counter(count_list)
print(f"\nCounter: {counter}")
print(f"Most common: {counter.most_common(2)}")

# 15. Removing Duplicates
# ============================================

with_dupes = [1, 2, 2, 3, 4, 4, 5]

# Using set (loses order in Python < 3.7)
unique_set = list(set(with_dupes))
print(f"\nUnique (set): {unique_set}")

# Preserving order
unique_ordered = list(dict.fromkeys(with_dupes))
print(f"Unique (ordered): {unique_ordered}")

# Using list comprehension
unique_comp = []
[unique_comp.append(x) for x in with_dupes if x not in unique_comp]
print(f"Unique (comprehension): {unique_comp}")

# 16. Splitting and Joining
# ============================================

# Join list elements into string
words_list = ["Hello", "World", "Python"]
joined = " ".join(words_list)
print(f"\nJoined: {joined}")

# Split string into list
sentence = "The quick brown fox"
split_list = sentence.split()
print(f"Split: {split_list}")

# 17. List Comparisons
# ============================================

list_a = [1, 2, 3]
list_b = [1, 2, 3]
list_c = [1, 2, 4]

print(f"\n[1,2,3] == [1,2,3]: {list_a == list_b}")
print(f"[1,2,3] == [1,2,4]: {list_a == list_c}")

# 18. Advanced Slicing Operations
# ============================================

slice_list = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

# Replace slice
slice_copy = slice_list.copy()
slice_copy[2:5] = [20, 30, 40]
print(f"\nReplace slice: {slice_copy}")

# Delete slice with step
slice_copy = slice_list.copy()
del slice_copy[::2]  # Delete every other element
print(f"Delete every other: {slice_copy}")

# 19. List as Stack (LIFO)
# ============================================

stack = []
stack.append(1)  # Push
stack.append(2)
stack.append(3)
print(f"\nStack: {stack}")
top = stack.pop()  # Pop
print(f"Popped: {top}, Stack: {stack}")

# 20. List as Queue (FIFO) - use deque for better performance
# ============================================

queue = deque([1, 2, 3])
queue.append(4)  # Enqueue
print(f"\nQueue: {list(queue)}")
first = queue.popleft()  # Dequeue
print(f"Dequeued: {first}, Queue: {list(queue)}")

# 21. Useful List Patterns
# ============================================

# Rotate list
def rotate_list(lst, n):
    return lst[n:] + lst[:n]

rotated = rotate_list([1, 2, 3, 4, 5], 2)
print(f"\nRotated by 2: {rotated}")

# Chunk list into smaller lists
def chunk_list(lst, size):
    return [lst[i:i + size] for i in range(0, len(lst), size)]

chunked = chunk_list([1, 2, 3, 4, 5, 6, 7, 8], 3)
print(f"Chunked: {chunked}")

# Transpose matrix
matrix_to_transpose = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
transposed = list(map(list, zip(*matrix_to_transpose)))
print(f"Transposed: {transposed}")

# Find intersection and difference
set_a = [1, 2, 3, 4, 5]
set_b = [4, 5, 6, 7, 8]
intersection = list(set(set_a) & set(set_b))
difference = list(set(set_a) - set(set_b))
print(f"Intersection: {intersection}")
print(f"Difference (a-b): {difference}")

# Group consecutive elements
grouped_data = [(k, list(g)) for k, g in groupby([1, 1, 2, 2, 2, 3, 4, 4])]
print(f"Grouped: {grouped_data}")

# Flatten deeply nested list
def flatten_deep(lst):
    result = []
    for item in lst:
        if isinstance(item, list):
            result.extend(flatten_deep(item))
        else:
            result.append(item)
    return result

deep_nested = [1, [2, [3, [4, 5]], 6], 7]
flattened_deep = flatten_deep(deep_nested)
print(f"Deep flattened: {flattened_deep}")

# Using chain for flattening
nested_lists = [[1, 2], [3, 4], [5, 6]]
flattened_chain = list(chain.from_iterable(nested_lists))
print(f"Flattened with chain: {flattened_chain}")

