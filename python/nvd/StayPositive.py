"""
LeetCode #1413 - Minimum Value to Get Positive Step by Step Sum

Given an array of integers nums, you start with an initial positive value startValue.

In each iteration, you calculate the step by step sum of startValue plus elements in nums 
(from left to right).

Return the minimum positive value of startValue such that the step by step sum is never 
less than 1.

Example 1:
Input: nums = [-3,2,-3,4,2]
Output: 5
Explanation: If you choose startValue = 4, in the third iteration your step by step sum 
is less than 1.
Step by step sum:
startValue = 4 | startValue = 5 | nums
  (4 -3 ) = 1  | (5 -3 ) = 2    |  -3
  (1 +2 ) = 3  | (2 +2 ) = 4    |   2
  (3 -3 ) = 0  | (4 -3 ) = 1    |  -3
  (0 +4 ) = 4  | (1 +4 ) = 5    |   4
  (4 +2 ) = 6  | (5 +2 ) = 7    |   2

Example 2:
Input: nums = [1,2]
Output: 1
Explanation: Minimum start value should be positive.

Example 3:
Input: nums = [1,-2,-3]
Output: 5

Constraints:
- 1 <= nums.length <= 100
- -100 <= nums[i] <= 100
"""


# init min value, lowest value of of running count 
# init running count 
# iterate over array
# add i to running count,
# reset min value 

class Solution:
    def minStartValue(self, nums: list[int]) -> int:
        """
        Find the minimum positive starting value such that the running sum 
        never drops below 1.
        
        Args:
            nums: List of integers
            
        Returns:
            Minimum positive starting value
        """
        
        min_value = 0
        running_total = 0

        for i in nums:
            running_total += i 
            min_value = min(running_total, min_value)
        
        return 1 - min_value


# Test cases
if __name__ == "__main__":
    solution = Solution()
    
    # Test case 1
    nums1 = [-3, 2, -3, 4, 2]
    print(f"Input: {nums1}")
    print(f"Output: {solution.minStartValue(nums1)}")
    print(f"Expected: 5\n")
    
    # Test case 2
    nums2 = [1, 2]
    print(f"Input: {nums2}")
    print(f"Output: {solution.minStartValue(nums2)}")
    print(f"Expected: 1\n")
    
    # Test case 3
    nums3 = [1, -2, -3]
    print(f"Input: {nums3}")
    print(f"Output: {solution.minStartValue(nums3)}")
    print(f"Expected: 5\n")
    
    # Test case 4
    nums4 = [-3, -2, -1]
    print(f"Input: {nums4}")
    print(f"Output: {solution.minStartValue(nums4)}")
    print(f"Expected: 7\n")
    
    # Test case 5
    nums5 = [2, 3, 5, -5, -1]
    print(f"Input: {nums5}")
    print(f"Output: {solution.minStartValue(nums5)}")
    print(f"Expected: 1\n")
