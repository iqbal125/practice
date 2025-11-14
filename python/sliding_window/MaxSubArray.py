
"""
Maximum Subarray (Kadane's Algorithm)

Given an integer array nums, find the contiguous subarray (containing at least one number) 
which has the largest sum and return its sum.

A subarray is a contiguous part of an array.

Example 1:
Input: nums = [-2,1,-3,4,-1,2,1,-5,4]
Output: 6
Explanation: [4,-1,2,1] has the largest sum = 6.

Example 2:
Input: nums = [1]
Output: 1

Example 3:
Input: nums = [5,4,-1,7,8]
Output: 23

Constraints:
- 1 <= nums.length <= 10^5
- -10^4 <= nums[i] <= 10^4

Follow up: If you have figured out the O(n) solution, try coding another solution 
using the divide and conquer approach, which is more subtle.
"""


def max_sub_array(arr): 
    max_current = arr[0]
    max_global = arr[0]

    for i in range(1, len(arr1)):
        if max_current + arr[i] > arr[i]:
            max_current += arr[i]
        else: 
            max_current = arr[i]
        
        if max_current > max_global: 
            max_global = max_current
        
    print(max_global)
    return max_global


arr1 = [-2, 1, -3, 4, -1, 2] # 5

print(max_sub_array(arr1))