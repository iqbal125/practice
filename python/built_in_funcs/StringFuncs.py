import re
from collections import Counter
from itertools import permutations
from string import Template

# ============================================
# Common String Functions in Python
# ============================================

# 1. Creating Strings
# ============================================

# Various ways to create strings
str1 = "Hello, World!"
str2 = 'Single quotes'
str3 = """Multi-line
string"""
str4 = str(123)  # Convert to string
print(f"From number: {str4}")

# 2. String Concatenation and Repetition
# ============================================

# Concatenation
first = "Hello"
last = "World"
combined = first + " " + last
print(f"\nConcatenation: {combined}")

# Repetition
repeated = "Python! " * 3
print(f"Repetition: {repeated}")

# Join - best for multiple strings
words = ["Python", "is", "awesome"]
sentence = " ".join(words)
print(f"Join: {sentence}")

# f-strings (Python 3.6+)
name = "Alice"
age = 30
formatted = f"{name} is {age} years old"
print(f"f-string: {formatted}")

# format() method
formatted2 = "{} is {} years old".format(name, age)
print(f"format(): {formatted2}")

# 3. String Case Conversion
# ============================================

text = "Python Programming"

print(f"\nOriginal: {text}")
print(f"lower(): {text.lower()}")
print(f"upper(): {text.upper()}")
print(f"capitalize(): {text.capitalize()}")
print(f"title(): {text.title()}")
print(f"swapcase(): {text.swapcase()}")

# casefold() - more aggressive lowercase (for comparisons)
print(f"casefold(): {text.casefold()}")

# 4. String Searching
# ============================================

search_text = "The quick brown fox jumps over the lazy dog"

# find() - returns index or -1
index = search_text.find("fox")
print(f"\nfind('fox'): {index}")
print(f"find('cat'): {search_text.find('cat')}")

# rfind() - find from right
print(f"rfind('o'): {search_text.rfind('o')}")

# index() - returns index or raises ValueError
try:
    idx = search_text.index("fox")
    print(f"index('fox'): {idx}")
except ValueError:
    print("Not found")

# count() - count occurrences
print(f"count('o'): {search_text.count('o')}")

# in operator - check if substring exists
print(f"'fox' in text: {'fox' in search_text}")
print(f"'cat' in text: {'cat' in search_text}")

# startswith() and endswith()
print(f"startswith('The'): {search_text.startswith('The')}")
print(f"endswith('dog'): {search_text.endswith('dog')}")

# 5. String Splitting
# ============================================

# split() - split by delimiter (default: whitespace)
sentence = "Python is a great language"
words = sentence.split()
print(f"\nsplit(): {words}")

# split with custom delimiter
csv_data = "apple,banana,cherry"
fruits = csv_data.split(",")
print(f"split(','): {fruits}")

# split with maxsplit
limited = sentence.split(" ", 2)
print(f"split(' ', 2): {limited}")

# rsplit() - split from right
right_split = sentence.rsplit(" ", 2)
print(f"rsplit(' ', 2): {right_split}")

# splitlines() - split by line breaks
multiline = "Line 1\nLine 2\nLine 3"
lines = multiline.splitlines()
print(f"splitlines(): {lines}")

# partition() - split into 3 parts
before, sep, after = "hello-world".partition("-")
print(f"partition('-'): ({before}, {sep}, {after})")

# 6. String Stripping (Removing Whitespace)
# ============================================

whitespace_text = "   Hello World   "

print(f"\nOriginal: '{whitespace_text}'")
print(f"strip(): '{whitespace_text.strip()}'")
print(f"lstrip(): '{whitespace_text.lstrip()}'")
print(f"rstrip(): '{whitespace_text.rstrip()}'")

# Strip specific characters
custom = "###Hello###"
print(f"strip('#'): '{custom.strip('#')}'")

# 7. String Replacement
# ============================================

original = "I like apples and apples are great"

# replace() - replace all occurrences
replaced = original.replace("apples", "oranges")
print(f"\nreplace(): {replaced}")

# replace with count limit
replaced_limited = original.replace("apples", "oranges", 1)
print(f"replace(count=1): {replaced_limited}")

# 8. String Checking (Boolean Methods)
# ============================================

print("\nString checking methods:")

# isalpha() - all alphabetic
print(f"'Hello'.isalpha(): {'Hello'.isalpha()}")
print(f"'Hello123'.isalpha(): {'Hello123'.isalpha()}")

# isdigit() - all digits
print(f"'12345'.isdigit(): {'12345'.isdigit()}")
print(f"'123a5'.isdigit(): {'123a5'.isdigit()}")

# isalnum() - alphanumeric
print(f"'Hello123'.isalnum(): {'Hello123'.isalnum()}")
print(f"'Hello 123'.isalnum(): {'Hello 123'.isalnum()}")

# isspace() - all whitespace
print(f"'   '.isspace(): {'   '.isspace()}")

# islower() and isupper()
print(f"'hello'.islower(): {'hello'.islower()}")
print(f"'HELLO'.isupper(): {'HELLO'.isupper()}")

# istitle()
print(f"'Hello World'.istitle(): {'Hello World'.istitle()}")

# isnumeric() and isdecimal()
print(f"'123'.isnumeric(): {'123'.isnumeric()}")
print(f"'½'.isnumeric(): {'½'.isnumeric()}")

# 9. String Alignment and Padding
# ============================================

text = "Python"

# center() - center align
print(f"\ncenter(20, '*'): '{text.center(20, '*')}'")

# ljust() - left align
print(f"ljust(20, '-'): '{text.ljust(20, '-')}'")

# rjust() - right align
print(f"rjust(20, '-'): '{text.rjust(20, '-')}'")

# zfill() - pad with zeros
number = "42"
print(f"zfill(5): '{number.zfill(5)}'")

# 10. String Slicing
# ============================================

slice_text = "Python Programming"

print(f"\nOriginal: {slice_text}")
print(f"First 6: {slice_text[:6]}")
print(f"Last 11: {slice_text[-11:]}")
print(f"Middle: {slice_text[7:18]}")
print(f"Every other: {slice_text[::2]}")
print(f"Reverse: {slice_text[::-1]}")
print(f"Reverse every other: {slice_text[::-2]}")

# 11. String Encoding/Decoding
# ============================================

# encode() - convert to bytes
text_to_encode = "Hello, World!"
encoded = text_to_encode.encode('utf-8')
print(f"\nencode(): {encoded}")

# decode() - convert from bytes
decoded = encoded.decode('utf-8')
print(f"decode(): {decoded}")

# 12. Advanced String Operations
# ============================================

# ord() - get ASCII/Unicode value
print(f"\nord('A'): {ord('A')}")
print(f"ord('a'): {ord('a')}")

# chr() - get character from ASCII/Unicode
print(f"chr(65): {chr(65)}")
print(f"chr(97): {chr(97)}")

# len() - string length
print(f"len('Python'): {len('Python')}")

# max() and min() - based on ASCII values
letters = "python"
print(f"max('{letters}'): {max(letters)}")
print(f"min('{letters}'): {min(letters)}")

# 13. String Formatting
# ============================================

# Old style % formatting
old_format = "Hello, %s! You are %d years old." % ("Bob", 25)
print(f"\n% formatting: {old_format}")

# format() with positional arguments
format1 = "Hello, {}! You are {} years old.".format("Alice", 30)
print(f"format() positional: {format1}")

# format() with named arguments
format2 = "Hello, {name}! You are {age} years old.".format(name="Charlie", age=35)
print(f"format() named: {format2}")

# f-strings with expressions
x, y = 10, 20
print(f"f-string expression: {x} + {y} = {x + y}")

# Format numbers
pi = 3.14159265359
print(f"Pi to 2 decimals: {pi:.2f}")
print(f"Pi in scientific: {pi:.2e}")

# Format with padding
num = 42
print(f"Padded number: {num:05d}")

# 14. String with Regular Expressions
# ============================================

# re.search() - find first match
pattern = r'\d+'
text_with_numbers = "I have 3 apples and 5 oranges"
match = re.search(pattern, text_with_numbers)
if match:
    print(f"\nre.search(): Found '{match.group()}' at position {match.start()}")

# re.findall() - find all matches
all_numbers = re.findall(r'\d+', text_with_numbers)
print(f"re.findall(): {all_numbers}")

# re.sub() - replace pattern
cleaned = re.sub(r'\d+', 'X', text_with_numbers)
print(f"re.sub(): {cleaned}")

# re.split() - split by pattern
parts = re.split(r'\s+', "Split   by    multiple    spaces")
print(f"re.split(): {parts}")

# Email validation pattern
email = "user@example.com"
email_pattern = r'^[\w\.-]+@[\w\.-]+\.\w+$'
is_valid = bool(re.match(email_pattern, email))
print(f"Email valid: {is_valid}")

# 15. String Iteration
# ============================================

print("\nString iteration:")
word = "Python"

# Iterate characters
for char in word:
    print(f"Char: {char}")

# Iterate with index
for idx, char in enumerate(word):
    print(f"Index {idx}: {char}")

# 16. String Comparison
# ============================================

str_a = "apple"
str_b = "banana"
str_c = "apple"

print(f"\n'apple' == 'apple': {str_a == str_c}")
print(f"'apple' == 'banana': {str_a == str_b}")
print(f"'apple' < 'banana': {str_a < str_b}")  # Lexicographic

# Case-insensitive comparison
print(f"'Apple' == 'apple': {'Apple' == 'apple'}")
print(f"'Apple'.lower() == 'apple'.lower(): {'Apple'.lower() == 'apple'.lower()}")

# 17. String Reversal
# ============================================

reverse_text = "Python"

# Using slicing
reversed1 = reverse_text[::-1]
print(f"\nReverse with slice: {reversed1}")

# Using reversed() and join
reversed2 = ''.join(reversed(reverse_text))
print(f"Reverse with reversed(): {reversed2}")

# 18. Character Frequency Count
# ============================================

count_text = "hello world"

# Using Counter
char_count = Counter(count_text)
print(f"\nCounter: {char_count}")
print(f"Most common: {char_count.most_common(3)}")

# Manual count
char_dict = {}
for char in count_text:
    char_dict[char] = char_dict.get(char, 0) + 1
print(f"Manual count: {char_dict}")

# 19. String Translation
# ============================================

# maketrans() and translate()
text_to_translate = "hello world"
translation_table = str.maketrans("helo", "1234")
translated = text_to_translate.translate(translation_table)
print(f"\ntranslate(): {translated}")

# Remove characters
remove_vowels = str.maketrans("", "", "aeiou")
no_vowels = "hello world".translate(remove_vowels)
print(f"Remove vowels: {no_vowels}")

# 20. String Expansion and Tab Handling
# ============================================

# expandtabs() - expand tabs
tabbed = "Name\tAge\tCity"
expanded = tabbed.expandtabs(4)
print(f"\nexpandtabs(4): {expanded}")

# 21. Palindrome Check
# ============================================

def is_palindrome(s):
    # Remove non-alphanumeric and convert to lowercase
    cleaned = ''.join(c.lower() for c in s if c.isalnum())
    return cleaned == cleaned[::-1]

print(f"\nIs 'racecar' palindrome: {is_palindrome('racecar')}")
print(f"Is 'A man, a plan, a canal: Panama' palindrome: {is_palindrome('A man, a plan, a canal: Panama')}")
print(f"Is 'hello' palindrome: {is_palindrome('hello')}")

# 22. String Interleaving
# ============================================

def interleave_strings(s1, s2):
    result = []
    for c1, c2 in zip(s1, s2):
        result.append(c1)
        result.append(c2)
    # Add remaining characters
    result.extend(s1[len(s2):])
    result.extend(s2[len(s1):])
    return ''.join(result)

interleaved = interleave_strings("abc", "123")
print(f"\nInterleave 'abc' and '123': {interleaved}")

# 23. Remove Duplicates (Preserve Order)
# ============================================

def remove_duplicate_chars(s):
    seen = set()
    result = []
    for char in s:
        if char not in seen:
            seen.add(char)
            result.append(char)
    return ''.join(result)

deduped = remove_duplicate_chars("programming")
print(f"\nRemove duplicates from 'programming': {deduped}")

# 24. String Compression
# ============================================

def compress_string(s):
    if not s:
        return s
    
    result = []
    count = 1
    
    for i in range(1, len(s)):
        if s[i] == s[i-1]:
            count += 1
        else:
            result.append(s[i-1] + str(count))
            count = 1
    
    result.append(s[-1] + str(count))
    compressed = ''.join(result)
    
    return compressed if len(compressed) < len(s) else s

compressed = compress_string("aabcccccaaa")
print(f"\nCompress 'aabcccccaaa': {compressed}")

# 25. String Anagrams
# ============================================

def are_anagrams(s1, s2):
    return sorted(s1.lower()) == sorted(s2.lower())

print(f"\nAre 'listen' and 'silent' anagrams: {are_anagrams('listen', 'silent')}")
print(f"Are 'hello' and 'world' anagrams: {are_anagrams('hello', 'world')}")

# 26. Word Count
# ============================================

paragraph = "Python is great. Python is powerful. I love Python!"

# Simple word count
words = paragraph.split()
word_count = len(words)
print(f"\nWord count: {word_count}")

# Frequency of each word
word_freq = Counter(word.lower().strip('.,!?') for word in words)
print(f"Word frequency: {word_freq}")

# 27. String Permutations (Simple)
# ============================================

small_string = "abc"
perms = [''.join(p) for p in permutations(small_string)]
print(f"\nPermutations of 'abc': {perms}")

# 28. Title Case (Smart)
# ============================================

def smart_title_case(s):
    # Words to keep lowercase (articles, conjunctions, prepositions)
    small_words = {'a', 'an', 'and', 'the', 'in', 'on', 'at', 'to', 'for', 'of'}
    
    words = s.split()
    result = []
    
    for i, word in enumerate(words):
        if i == 0 or word.lower() not in small_words:
            result.append(word.capitalize())
        else:
            result.append(word.lower())
    
    return ' '.join(result)

title = smart_title_case("the lord of the rings")
print(f"\nSmart title case: {title}")

# 29. Extract Numbers from String
# ============================================

mixed_string = "There are 3 apples, 5 oranges, and 10 bananas."

# Extract all numbers
numbers = re.findall(r'\d+', mixed_string)
print(f"\nExtract numbers: {numbers}")

# Extract and sum
total = sum(int(n) for n in numbers)
print(f"Sum of numbers: {total}")

# 30. String Template
# ============================================

# Template with placeholders
template = Template("Hello, $name! Welcome to $place.")
result = template.substitute(name="Alice", place="Python World")
print(f"\nTemplate: {result}")

# Safe substitute (won't raise error for missing keys)
result_safe = template.safe_substitute(name="Bob")
print(f"Safe substitute: {result_safe}")

# 31. Common String Patterns
# ============================================

# Check if string contains only unique characters
def has_unique_chars(s):
    return len(s) == len(set(s))

print(f"\n'abcdef' has unique chars: {has_unique_chars('abcdef')}")
print(f"'hello' has unique chars: {has_unique_chars('hello')}")

# Rotate string
def rotate_string(s, n):
    n = n % len(s) if s else 0
    return s[n:] + s[:n]

rotated = rotate_string("python", 2)
print(f"Rotate 'python' by 2: {rotated}")

# Check if strings are rotations of each other
def is_rotation(s1, s2):
    if len(s1) != len(s2):
        return False
    return s2 in s1 + s1

print(f"'waterbottle' is rotation of 'erbottlewat': {is_rotation('waterbottle', 'erbottlewat')}")

# 32. String Validation Examples
# ============================================

# Validate phone number
def is_valid_phone(phone):
    pattern = r'^\d{3}-\d{3}-\d{4}$'
    return bool(re.match(pattern, phone))

print(f"\n'123-456-7890' is valid phone: {is_valid_phone('123-456-7890')}")

# Validate URL
def is_valid_url(url):
    pattern = r'^https?://[\w\.-]+\.\w{2,}(/.*)?$'
    return bool(re.match(pattern, url))

print(f"'https://example.com' is valid URL: {is_valid_url('https://example.com')}")

# 33. String Truncation
# ============================================

def truncate(s, length, suffix='...'):
    if len(s) <= length:
        return s
    return s[:length - len(suffix)] + suffix

long_text = "This is a very long string that needs to be truncated"
truncated = truncate(long_text, 30)
print(f"\nTruncated: {truncated}")
