"""
Subarray Sum Equals K

Given an array of integers nums and an integer k, return the total number of 
subarrays whose sum equals to k.

A subarray is a contiguous non-empty sequence of elements within an array.

Example 1:
Input: nums = [1,1,1], k = 2
Output: 2
Explanation: There are 2 subarrays with sum 2: [1,1] and [1,1]

Example 2:
Input: nums = [1,2,3], k = 3
Output: 2
Explanation: There are 2 subarrays with sum 3: [1,2] and [3]

Example 3:
Input: nums = [1,-1,0], k = 0
Output: 3
Explanation: There are 3 subarrays with sum 0: [1,-1], [0], and [1,-1,0]

Constraints:
- 1 <= nums.length <= 2 * 10^4
- -1000 <= nums[i] <= 1000
- -10^7 <= k <= 10^7

Follow up: Can you solve it in O(n) time complexity?
"""

# kinda like 2 sum, keep track of difference, where key is the difference and value is count

# iterate over array for loop 
# keep track of running total
# prefix sums hashmaps, keep track of differences, init with 0:1, for empty array
# keep track of result and final count
# total - k, if prefix in hashmap, increase the result count by the number of counts in hashmap not just 1



class Solution:
    def subarraySum(self, nums: list[int], k: int) -> int:
        """
        Find the total number of continuous subarrays whose sum equals to k.
        
        Args:
            nums: List of integers
            k: Target sum
            
        Returns:
            Count of subarrays with sum equal to k
        """
        running_total = 0
        prefix_sums = {0: 1}
        result_count = 0

        for i in nums:
            running_total += i 
            
            diff = running_total - k

            if diff in prefix_sums:
                result_count += prefix_sums[diff]

            prefix_sums[running_total] = prefix_sums.get(running_total, 0) + 1
            print(prefix_sums)
        
        return result_count



# Test cases
if __name__ == "__main__":
    solution = Solution()
    
    # Test case 1
    nums1 = [1, 1, 1]
    k1 = 2
    print(f"Input: nums = {nums1}, k = {k1}")
    print(f"Output: {solution.subarraySum(nums1, k1)}")
    print(f"Expected: 2\n")
    
    # Test case 2
    nums2 = [1, 2, 3]
    k2 = 3
    print(f"Input: nums = {nums2}, k = {k2}")
    print(f"Output: {solution.subarraySum(nums2, k2)}")
    print(f"Expected: 2\n")
    
    # Test case 3
    nums3 = [1, -1, 0]
    k3 = 0
    print(f"Input: nums = {nums3}, k = {k3}")
    print(f"Output: {solution.subarraySum(nums3, k3)}")
    print(f"Expected: 3\n")
    
    # Test case 4
    nums4 = [1, 2, 1, 2, 1]
    k4 = 3
    print(f"Input: nums = {nums4}, k = {k4}")
    print(f"Output: {solution.subarraySum(nums4, k4)}")
    print(f"Expected: 4\n")
