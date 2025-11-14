"""
Longest Substring Without Repeating Characters

Given a string s, find the length of the longest substring without repeating characters.

Example 1:
Input: s = "abcabcbb"
Output: 3
Explanation: The answer is "abc", with the length of 3.

Example 2:
Input: s = "bbbbb"
Output: 1
Explanation: The answer is "b", with the length of 1.

Example 3:
Input: s = "pwwkew"
Output: 3
Explanation: The answer is "wke", with the length of 3.

Example 4:
Input: s = ""
Output: 0

Constraints:
- 0 <= s.length <= 5 * 10^4
- s consists of English letters, digits, symbols and spaces.

Hint: Use sliding window technique with a set to track characters
"""

# init left and right
# +1 right after every loop
# if right in a seen list, then save max substring in new var, make left the new right

def lengthOfLongestSubstring(s):
    """
    Args:
        s: str - input string
    Returns:
        int - length of longest substring without repeating characters
    """
    # TODO: Implement your solution here
    if(len(s) == 0):
        return 0

    right = 0
    max_len = 1


    for i, left in enumerate(s):
        seen = []
        right = i
        cur_len = 0

        while(right < len(s)):
            if(s[right] not in seen):
                cur_len += 1
                seen.append(s[right])
                right += 1
            else:
                break
        
        max_len = max(cur_len, max_len)

    
    return max_len
    





# Test cases
if __name__ == "__main__":
    # Test case 1
    s1 = "abcabcbb"
    result1 = lengthOfLongestSubstring(s1)
    print(f"Input: '{s1}'")
    print(f"Output: {result1}")
    print("Expected: 3")
    print()
    
    # Test case 2
    s2 = "bbbbb"
    result2 = lengthOfLongestSubstring(s2)
    print(f"Input: '{s2}'")
    print(f"Output: {result2}")
    print("Expected: 1")
    print()
    
    # Test case 3
    s3 = "pwwkew"
    result3 = lengthOfLongestSubstring(s3)
    print(f"Input: '{s3}'")
    print(f"Output: {result3}")
    print("Expected: 3")
    print()
    
    # Test case 4
    s4 = ""
    result4 = lengthOfLongestSubstring(s4)
    print(f"Input: '{s4}'")
    print(f"Output: {result4}")
    print("Expected: 0")
    print()
    
    # Test case 5
    s5 = "dvdf"
    result5 = lengthOfLongestSubstring(s5)
    print(f"Input: '{s5}'")
    print(f"Output: {result5}")
    print("Expected: 3")
