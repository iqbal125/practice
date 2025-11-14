



"""
Valid Parentheses

Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', 
determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.

Example 1:
Input: s = "()"
Output: true

Example 2:
Input: s = "()[]{}"
Output: true

Example 3:
Input: s = "(]"
Output: false

Example 4:
Input: s = "([)]"
Output: false

Example 5:
Input: s = "{[]}"
Output: true

Constraints:
- 1 <= s.length <= 10^4
- s consists of parentheses only '()[]{}'.
"""




def ValidParen(s): 
    stk = []
    hashMap = {
        ")": "(", "]": "[", "}": "{" 
    }

    for char in s:
        # if closing bracket
        if char in hashMap:
            if(len(stk) == 0 or stk.pop() != hashMap[char]):
                return False
        # if opening bracket
        else: 
            stk.append(char)

    if len(stk) == 0:
        return True


s1 = "[([])]" #true
s2 = "[(])" #false

print(ValidParen(s2))