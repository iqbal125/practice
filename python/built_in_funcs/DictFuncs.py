

import copy
from collections import defaultdict, Counter, OrderedDict

user = {"user_name": "Alice", "user_age": 30}

print(user.get("user_name"))

# ============================================
# Common Dictionary Functions in Python
# ============================================

# 1. Basic Dictionary Operations
# ============================================

# Creating dictionaries
dict1 = {"name": "John", "age": 25, "city": "NYC"}
dict2 = dict(name="Jane", age=28, city="LA")
dict3 = dict.fromkeys(["a", "b", "c"], 0)  # Creates dict with default values
print(f"dict.fromkeys: {dict3}")

# 2. Accessing Values
# ============================================

# get() - safe way to access values (returns None if key doesn't exist)
name = dict1.get("name")
country = dict1.get("country", "USA")  # with default value
print(f"get(): {name}, {country}")

# Direct access (raises KeyError if key doesn't exist)
age = dict1["age"]

# 3. Adding/Updating Values
# ============================================

# update() - merge dictionaries
dict1.update({"country": "USA", "age": 26})
print(f"update(): {dict1}")

# setdefault() - add key only if it doesn't exist
dict1.setdefault("occupation", "Engineer")
dict1.setdefault("name", "Bob")  # Won't change existing value
print(f"setdefault(): {dict1}")

# 4. Removing Items
# ============================================

sample_dict = {"a": 1, "b": 2, "c": 3, "d": 4}

# pop() - remove and return value
value = sample_dict.pop("b")
print(f"pop(): removed {value}, dict: {sample_dict}")

# pop() with default
value = sample_dict.pop("z", "Not Found")
print(f"pop() with default: {value}")

# popitem() - remove and return last key-value pair
sample_dict["e"] = 5
key, val = sample_dict.popitem()
print(f"popitem(): removed ({key}, {val})")

# del - remove specific key
del sample_dict["c"]
print(f"del: {sample_dict}")

# clear() - remove all items
temp_dict = {"x": 1, "y": 2}
temp_dict.clear()
print(f"clear(): {temp_dict}")

# 5. Checking Keys/Values
# ============================================

check_dict = {"apple": 5, "banana": 3, "orange": 7}

# in operator - check if key exists
print(f"'apple' in dict: {'apple' in check_dict}")
print(f"'grape' in dict: {'grape' in check_dict}")

# keys() - get all keys
print(f"keys(): {list(check_dict.keys())}")

# values() - get all values
print(f"values(): {list(check_dict.values())}")

# items() - get all key-value pairs
print(f"items(): {list(check_dict.items())}")

# 6. Dictionary Iteration
# ============================================

print("\nIteration examples:")
# Iterate over keys
for key in check_dict:
    print(f"Key: {key}")

# Iterate over values
for value in check_dict.values():
    print(f"Value: {value}")

# Iterate over key-value pairs
for key, value in check_dict.items():
    print(f"{key}: {value}")

# 7. Dictionary Comprehension
# ============================================

# Create dict from list
numbers = [1, 2, 3, 4, 5]
squared = {num: num**2 for num in numbers}
print(f"\nDict comprehension (squared): {squared}")

# Filter dictionary
filtered = {k: v for k, v in check_dict.items() if v > 4}
print(f"Filtered dict: {filtered}")

# Transform values
uppercase_keys = {k.upper(): v for k, v in check_dict.items()}
print(f"Uppercase keys: {uppercase_keys}")

# 8. Copying Dictionaries
# ============================================

original = {"a": 1, "b": 2}

# Shallow copy
copy1 = original.copy()
copy2 = dict(original)
print(f"Shallow copies: {copy1}, {copy2}")

# Deep copy (for nested dicts)
nested = {"a": {"b": 1}}
deep_copied = copy.deepcopy(nested)

# 9. Merging Dictionaries
# ============================================

dict_a = {"a": 1, "b": 2}
dict_b = {"c": 3, "d": 4}
dict_c = {"a": 10, "e": 5}

# Using update()
merged1 = dict_a.copy()
merged1.update(dict_b)
print(f"Merge with update(): {merged1}")

# Using ** unpacking (Python 3.5+)
merged2 = {**dict_a, **dict_b, **dict_c}
print(f"Merge with unpacking: {merged2}")

# Using | operator (Python 3.9+)
merged3 = dict_a | dict_b | dict_c
print(f"Merge with | operator: {merged3}")

# 10. Advanced Operations
# ============================================

# len() - get number of items
print(f"\nlen(): {len(check_dict)}")

# sorted() - get sorted keys
sorted_keys = sorted(check_dict.keys())
print(f"sorted keys: {sorted_keys}")

# sorted by values
sorted_by_value = dict(sorted(check_dict.items(), key=lambda x: x[1]))
print(f"sorted by value: {sorted_by_value}")

# max/min by values
max_key = max(check_dict, key=check_dict.get)
min_key = min(check_dict, key=check_dict.get)
print(f"max key: {max_key}, min key: {min_key}")

# all() and any()
bool_dict = {"a": True, "b": True, "c": False}
print(f"all values True: {all(bool_dict.values())}")
print(f"any value True: {any(bool_dict.values())}")

# 11. Dictionary with Default Values
# ============================================

# defaultdict with list
dd_list = defaultdict(list)
dd_list["fruits"].append("apple")
dd_list["fruits"].append("banana")
print(f"\ndefaultdict(list): {dict(dd_list)}")

# defaultdict with int (useful for counting)
dd_int = defaultdict(int)
words = ["apple", "banana", "apple", "cherry", "banana", "apple"]
for word in words:
    dd_int[word] += 1
print(f"defaultdict(int) for counting: {dict(dd_int)}")

# 12. Counter - for counting hashable objects
# ============================================

counter = Counter(words)
print(f"\nCounter: {counter}")
print(f"Most common: {counter.most_common(2)}")

# 13. OrderedDict (maintains insertion order)
# ============================================

# Note: Regular dicts maintain order in Python 3.7+, but OrderedDict has additional methods
od = OrderedDict()
od["first"] = 1
od["second"] = 2
od["third"] = 3

# move_to_end()
od.move_to_end("first")
print(f"\nOrderedDict after move_to_end: {od}")

# 14. Useful Dictionary Patterns
# ============================================

# Invert dictionary (swap keys and values)
original_dict = {"a": 1, "b": 2, "c": 3}
inverted = {v: k for k, v in original_dict.items()}
print(f"\nInverted dict: {inverted}")

# Group by condition
data = [("apple", 5), ("banana", 3), ("cherry", 8), ("date", 2)]
grouped = {}
for item, value in data:
    if value > 4:
        grouped.setdefault("high", []).append(item)
    else:
        grouped.setdefault("low", []).append(item)
print(f"Grouped dict: {grouped}")

# Merge with custom logic
def merge_with_sum(dict1, dict2):
    result = dict1.copy()
    for key, value in dict2.items():
        result[key] = result.get(key, 0) + value
    return result

d1 = {"a": 1, "b": 2}
d2 = {"b": 3, "c": 4}
merged_sum = merge_with_sum(d1, d2)
print(f"Merged with sum: {merged_sum}")