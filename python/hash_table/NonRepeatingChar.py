"""
LeetCode Easy — First Unique Character in a String

Given a string s, find the first non-repeating character in it 
and return its index. If it does not exist, return -1.

Examples:
    Input: s = "leetcode"
    Output: 0

    Input: s = "loveleetcode"
    Output: 2

    Input: s = "aabb"
    Output: -1
"""



# iterate over string and create hashmap freq counter
# iterate over hashmap and return first that has 1 count




class Solution:
    def firstUniqChar(self, s: str) -> int:
          if len(s) == 0:
                return -1
          if len(s) == 1:
                return 0

          freq = {}
          for i in s:
                freq[i] = freq.get(i, 0) + 1
        
          for i, v in enumerate(s):
                if freq[v] == 1:
                      return i
          return -1
                      



if __name__ == "__main__":
        sol = Solution()
        
        # Sample tests
        print(sol.firstUniqChar("leetcode"))        # Expected: 0
        print(sol.firstUniqChar("loveleetcode"))    # Expected: 2
        print(sol.firstUniqChar("aabb"))            # Expected: -1
