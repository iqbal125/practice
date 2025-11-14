"""
Two Sum - Two Pointer Approach
Given a sorted array of integers, find two numbers that add up to a target value.
Return the indices of the two numbers (1-indexed).
"""

# init 2 pointers on either end
# check if 2 pointers sum is more or less than the target
# if more than decrement right 
# if less than increment left 
# state: need to keep track of right, left, sum. 


def two_sum(nums: list[int], target: int) -> list[int]:
    """
    Find two numbers in a sorted array that add up to target.
    
    Args:
        nums: Sorted list of integers
        target: Target sum
    
    Returns:
        List containing 1-indexed positions of the two numbers
    
    Example:
        >>> two_sum([2, 7, 11, 15], 9)
        [1, 2]
    """
    # TODO: Implement using two pointers

    left = 0
    right = len(nums) - 1

    while left < right:
        sum = nums[left] + nums[right]
        if sum == target:
            return [left + 1, right + 1] 
        elif sum < target:
            left += 1
        else:
            right -= 1



if __name__ == "__main__":
    # Test cases
    print(two_sum([2, 7, 11, 15], 9))  # Expected: [1, 2]
    print(two_sum([2, 3, 4], 6))       # Expected: [1, 3]
    print(two_sum([-1, 0], -1))        # Expected: [1, 2]
