


"""
Valid Palindrome

A phrase is a palindrome if, after converting all uppercase letters into lowercase letters 
and removing all non-alphanumeric characters, it reads the same forward and backward. 
Alphanumeric characters include letters and numbers.

Given a string s, return true if it is a palindrome, or false otherwise.

Example 1:
Input: s = "A man, a plan, a canal: Panama"
Output: true
Explanation: "amanaplanacanalpanama" is a palindrome.

Example 2:
Input: s = "race a car"
Output: false
Explanation: "raceacar" is not a palindrome.

Example 3:
Input: s = " "
Output: true
Explanation: s is an empty string "" after removing non-alphanumeric characters.
Since an empty string reads the same forward and backward, it is a palindrome.

Constraints:
- 1 <= s.length <= 2 * 10^5
- s consists only of printable ASCII characters.
"""



def ValidPalindrome(s):
    # brute force 
    str1 = ''

    for i in s:
        if i.isalnum():
            str1 += i.lower()
        pass
    print(str1)

    strReverse = str1[::-1]
    print(strReverse)
    if(strReverse == str1):
        return True
    
    return False
    

def ValidPalindrome2(s):
    left = 0
    right = len(s) - 1

    while left < right:
        while left < right and not s[left].isalnum():
            left += 1
        while left < right and not s[right].isalnum():
            right -= 1
        
        if s[right].lower() != s[left].lower():
            return False

        left += 1
        right -= 1    

    
    return True


input_string1 = "A man, a plan, a canal: Panama"
input_string2 = "Not a pally"

print(ValidPalindrome2(input_string2))