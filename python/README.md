# Python DSA Practice Problems

This directory contains LeetCode-style problems organized by algorithm patterns and techniques to optimize interview preparation and pattern recognition.

## 📁 Directory Structure

```
python/
├── arrays/              # Array manipulation problems
├── two_pointers/        # Two pointer technique
├── sliding_window/      # Sliding window pattern
├── hash_table/          # Hash table/dictionary problems
├── dynamic_programming/ # DP problems
├── stack/              # Stack-based problems
├── recursion/          # Recursion fundamentals
└── misc/               # Other problems
```

## 📊 Problems by Pattern

### Arrays
| Problem | File | Difficulty | Time | Space | Key Concepts |
|---------|------|-----------|------|-------|--------------|
| Best Time to Buy and Sell Stock | `BestTImeToBuyStock.py` | Easy | O(n) | O(1) | Two pointers, greedy |
| Product of Array Except Self | `ProdArraySelf.py` | Medium | O(n) | O(1) | Prefix/suffix products |
| Merge Sorted Array | `MergeTwoArrays.py` | Easy | O(m+n) | O(1) | Merge, reverse iteration |
| Replace Elements with Greatest Element on Right | `GreatestRightEle.py` | Easy | O(n) | O(1) | Reverse iteration |

### Two Pointers
| Problem | File | Difficulty | Time | Space | Key Concepts |
|---------|------|-----------|------|-------|--------------|
| Two Sum II - Input Array Is Sorted | `TwoSumII.py` | Medium | O(n) | O(1) | Two pointers, sorted array |
| Valid Palindrome | `ValidPalindrome.py` | Easy | O(n) | O(1) | Two pointers, string manipulation |

### Sliding Window
| Problem | File | Difficulty | Time | Space | Key Concepts |
|---------|------|-----------|------|-------|--------------|
| Maximum Subarray (Kadane's Algorithm) | `MaxSubArray.py` | Medium | O(n) | O(1) | Sliding window, dynamic programming |
| Longest Substring Without Repeating Characters | `LenSubstring.py` | Medium | O(n) | O(min(n,m)) | Sliding window, hash set |

### Hash Table
| Problem | File | Difficulty | Time | Space | Key Concepts |
|---------|------|-----------|------|-------|--------------|
| Two Sum | `TwoSum.py` | Easy | O(n) | O(n) | Hash map, complement search |
| Valid Anagram | `AnagramsI.py` | Easy | O(n) | O(1) | Hash map, character counting |

### Dynamic Programming
| Problem | File | Difficulty | Time | Space | Key Concepts |
|---------|------|-----------|------|-------|--------------|
| Climbing Stairs | `ClimbingStairs.py` | Easy | O(n) | O(n) | DP, Fibonacci, memoization |
| House Robber | `HouseRobber.py` | Medium | O(n) | O(n) | DP, memoization, state transition |

### Stack
| Problem | File | Difficulty | Time | Space | Key Concepts |
|---------|------|-----------|------|-------|--------------|
| Valid Parentheses | `ValidParenthesis.py` | Easy | O(n) | O(n) | Stack, matching pairs |

### Recursion
| Problem | File | Difficulty | Time | Space | Key Concepts |
|---------|------|-----------|------|-------|--------------|
| Recursion Fundamentals | `Recursion.py` | N/A | Varies | O(n) | Factorial, Fibonacci, call stack |

### Misc
| Problem | File | Difficulty | Time | Space | Key Concepts |
|---------|------|-----------|------|-------|--------------|
| Suffix Sums | `SuffixSums.py` | N/A | - | - | (To be implemented) |
| Top K Elements | `TopK.py` | N/A | - | - | (To be implemented) |

## 🎯 Pattern Recognition Guide

### When to use each pattern:

**Arrays**
- Direct indexing and iteration
- In-place modifications
- Prefix/suffix computations

**Two Pointers**
- Sorted array problems
- Finding pairs with target sum
- Palindrome checks
- Removing duplicates

**Sliding Window**
- Contiguous subarrays/substrings
- Maximum/minimum in range
- K-sized window problems

**Hash Table**
- Fast lookups (O(1))
- Counting frequencies
- Finding complements
- Detecting duplicates

**Dynamic Programming**
- Optimal substructure
- Overlapping subproblems
- Can break into smaller problems
- Need memoization

**Stack**
- Matching pairs (parentheses, brackets)
- Nested structures
- Reversing order
- Monotonic problems

**Recursion**
- Tree/graph traversal
- Divide and conquer
- Backtracking
- Natural recursive structure

## 📈 Difficulty Distribution

- **Easy**: 8 problems
- **Medium**: 6 problems
- **Hard**: 0 problems

## 🔥 Recommended Study Order

### Week 1: Foundations
1. Arrays → `GreatestRightEle.py`
2. Hash Table → `TwoSum.py`, `AnagramsI.py`
3. Two Pointers → `ValidPalindrome.py`

### Week 2: Core Patterns
4. Arrays → `BestTImeToBuyStock.py`
5. Two Pointers → `TwoSumII.py`
6. Stack → `ValidParenthesis.py`
7. Recursion → `Recursion.py`

### Week 3: Advanced
8. Sliding Window → `MaxSubArray.py`, `LenSubstring.py`
9. Arrays → `ProdArraySelf.py`, `MergeTwoArrays.py`
10. Dynamic Programming → `ClimbingStairs.py`, `HouseRobber.py`

## 💡 Tips for Interview Success

1. **Pattern Recognition**: Learn to identify which pattern fits the problem
2. **Time/Space Analysis**: Always analyze complexity before coding
3. **Edge Cases**: Consider empty arrays, single elements, duplicates
4. **Optimization**: Start with brute force, then optimize
5. **Communication**: Explain your thought process clearly

## 🚀 Quick Commands

```bash
# Run a specific problem
python python/arrays/TwoSum.py

# Run all tests in a category
python -m pytest python/arrays/

# Check syntax of all Python files
find python -name "*.py" -exec python -m py_compile {} \;
```

## 📚 Related Resources

- [LeetCode Patterns](https://seanprashad.com/leetcode-patterns/)
- [NeetCode Roadmap](https://neetcode.io/roadmap)
- [AlgoExpert](https://www.algoexpert.io/)

---

**Last Updated**: November 14, 2025
**Total Problems**: 14 implemented, 2 placeholder
