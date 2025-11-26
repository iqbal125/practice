def move_zeroes(nums: list[int]) -> None:
    """
    Given an integer array nums, move all 0's to the end of the array 
    while maintaining the relative order of the non-zero elements.
    
    You must do this in-place (modify the array directly) with O(1) extra space.
    
    Example 1:
    Input: nums = [0,1,0,3,12]
    Output: [1,3,12,0,0]
    
    Example 2:
    Input: nums = [0]
    Output: [0]
    
    Example 3:
    Input: nums = [1,2,3]
    Output: [1,2,3]
    
    Note: Do not return anything, modify nums in-place instead.
    """
    # TODO: Implement your solution here


    # basically replace in place all non-zero numbers from left to right
    # the ending is watever and tracked with insert
    # use insert num value to keep track of how many zeros to fill in at the end
    # iterate over the array with Index 

    insert = 0

    for i in range(len(nums)):
        if nums[i] != 0:
            nums[insert] = nums[i]
            insert += 1

    while insert < len(nums):
        nums[insert] = 0
        insert += 1


if __name__ == "__main__":
    # Test cases
    test_cases = [
        # ([0, 1, 0, 3, 12], [1, 3, 12, 0, 0]),
        # ([0], [0]),
        # ([1, 2, 3], [1, 2, 3]),
        ([0, 0, 1], [1, 0, 0]),
        # ([1, 0], [1, 0]),
        # ([2, 1], [2, 1]),
        ([0, 0, 0, 1, 2], [1, 2, 0, 0, 0]),
    ]
    
    for i, (nums, expected) in enumerate(test_cases):
        nums_copy = nums.copy()  # Make a copy for display
        move_zeroes(nums)
        status = "✓" if nums == expected else "✗"
        print(f"Test {i + 1}: {status} Input: {nums_copy} | Expected: {expected} | Got: {nums}")
