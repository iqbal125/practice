

"""
Merge Sorted Array

You are given two integer arrays nums1 and nums2, sorted in non-decreasing order, 
and two integers m and n, representing the number of elements in nums1 and nums2 respectively.

Merge nums1 and nums2 into a single array sorted in non-decreasing order.

The final sorted array should not be returned by the function, but instead be stored 
inside the array nums1. To accommodate this, nums1 has a length of m + n, where the 
first m elements denote the elements that should be merged, and the last n elements 
are set to 0 and should be ignored. nums2 has a length of n.

Example 1:
Input: nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3
Output: [1,2,2,3,5,6]
Explanation: The arrays we are merging are [1,2,3] and [2,5,6].
The result of the merge is [1,2,2,3,5,6] with the underlined elements coming from nums1.

Example 2:
Input: nums1 = [1], m = 1, nums2 = [], n = 0
Output: [1]
Explanation: The arrays we are merging are [1] and [].
The result of the merge is [1].

Example 3:
Input: nums1 = [0], m = 0, nums2 = [1], n = 1
Output: [1]
Explanation: The arrays we are merging are [] and [1].
The result of the merge is [1].
Note that because m = 0, there are no elements in nums1. The 0 is only there to ensure the array has the right length.

Constraints:
- nums1.length == m + n
- nums2.length == n
- 0 <= m, n <= 200
- 1 <= m + n <= 200
- -10^9 <= nums1[i], nums2[i] <= 10^9

Follow up: Can you come up with an algorithm that runs in O(m + n) time?
"""


def merge(nums1, m, nums2, n):
    nums1_last_index = m - 1
    nums2_last_index = n - 1
    nums1_length = len(nums1) - 1

    while nums1_last_index >= 0 and nums2_last_index >= 0:
 
        if nums1[nums1_last_index] >= nums2[nums2_last_index]:
            nums1[nums1_length] = nums1[nums1_last_index]
            nums1_last_index -= 1
        else:
            nums1[nums1_length] = nums2[nums2_last_index]
            nums2_last_index -= 1

        nums1_length -= 1

    while nums2_last_index >= 0:
        nums1[nums1_length] = nums2[nums2_last_index]
        nums2_last_index -= 1
        nums1_length -= 1

    return nums1



# Test case 1
nums1 = [1, 2, 3, 0, 0, 0]
m = 3
nums2 = [2, 5, 6] 
n = 3
merge(nums1, m, nums2, n)
print(f"Test 1: {nums1}")  # Expected: [1, 2, 2, 3, 5, 6]

