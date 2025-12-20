"""
Longest Increasing Subsequence

Given an integer array nums, return the length of the longest strictly increasing subsequence.

Example 1:
Input: nums = [10,9,2,5,3,7,101,18]
Output: 4
Explanation: The longest increasing subsequence is [2,3,7,101], therefore the length is 4.

Example 2:
Input: nums = [0,1,0,3,2,3]
Output: 4

Example 3:
Input: nums = [7,7,7,7,7,7,7]
Output: 1

Constraints:
- 1 <= nums.length <= 2500
- -10^4 <= nums[i] <= 10^4

Follow up: Can you come up with an O(n log n) solution?
"""

# init len of n, and multiply by 1 to init dp array
# iterate over array, with i, have nested for loop j
# for each position of i, ask if nums[i] is bigger than nums[j]
# then just set dp array of i to be the greater of dp[i] or dp[j + 1]
 

class Solution:
    def lengthOfLIS(self, nums: list[int]) -> int:
        """
        Find the length of the longest increasing subsequence.
        
        Args:
            nums: List of integers
            
        Returns:
            Length of the longest increasing subsequence
        """
        n = len(nums)

        if n == 0:
            return 1
        
        dp = [1] * n

        for i in range(1, n):
            for j in range(i):
                if nums[i] > nums[j]:
                    dp[i] = max(dp[i], dp[j] + 1)

        return max(dp)

# Test cases
if __name__ == "__main__":
    solution = Solution()
    
    # Test case 1
    nums1 = [10,9,2,5,3,7,101,18]
    print(f"Input: {nums1}")
    print(f"Output: {solution.lengthOfLIS(nums1)}")
    print(f"Expected: 4\n")
    
    # Test case 2
    nums2 = [0,1,0,3,2,3]
    print(f"Input: {nums2}")
    print(f"Output: {solution.lengthOfLIS(nums2)}")
    print(f"Expected: 4\n")
    
    # Test case 3
    nums3 = [7,7,7,7,7,7,7]
    print(f"Input: {nums3}")
    print(f"Output: {solution.lengthOfLIS(nums3)}")
    print(f"Expected: 1\n")
