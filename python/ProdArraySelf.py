"""
Product of Array Except Self

Given an integer array nums, return an array answer such that answer[i] 
is equal to the product of all the elements of nums except nums[i].

You must write an algorithm that runs in O(n) time and without using 
the division operation.

Example 1:
Input: nums = [1,2,3,4]
Output: [24,12,8,6]

Example 2:
Input: nums = [-1,1,0,-3,3]
Output: [0,0,9,0,0]

Constraints:
- 2 <= nums.length <= 10^5
- -30 <= nums[i] <= 30
"""


# loop over array
# remove the current index from calculation 
# need a local copy of the current answer
# save the answer at each step in answer array
# keep track of the current count
# need nested array 

def productExceptSelf(nums):
    """
    Args:
        nums: List[int] - array of integers
    Returns:
        List[int] - array where each element is the product of all other elements
    """
    # TODO: Implement your solution here
    ans = []

    for i in enumerate(nums):
        count = 1
        for j, inner in enumerate(nums): 
            if(j == i):
                pass
            else: 
                count = inner * count
        ans.append(count)
        count = 1

    return ans

    




# Test cases
if __name__ == "__main__":
    # Test case 1
    nums1 = [1, 2, 3, 4]
    result1 = productExceptSelf(nums1)
    print(f"Input: {nums1}")
    print(f"Output: {result1}")
    print(f"Expected: [24, 12, 8, 6]")
    print()
    
    # Test case 2
    nums2 = [-1, 1, 0, -3, 3]
    result2 = productExceptSelf(nums2)
    print(f"Input: {nums2}")
    print(f"Output: {result2}")
    print(f"Expected: [0, 0, 9, 0, 0]")
    print()
    
    # Test case 3
    nums3 = [2, 3, 4, 5]
    result3 = productExceptSelf(nums3)
    print(f"Input: {nums3}")
    print(f"Output: {result3}")
    print(f"Expected: [60, 40, 30, 24]")
