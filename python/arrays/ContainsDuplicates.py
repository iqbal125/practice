def contains_duplicate(nums: list[int]) -> bool:
    """
    Given an integer array nums, return true if any value appears 
    at least twice in the array, and return false if every element is distinct.
    
    Example 1:
    Input: nums = [1,2,3,1]
    Output: true
    
    Example 2:
    Input: nums = [1,2,3,4]
    Output: false
    
    Example 3:
    Input: nums = [1,1,1,3,3,4,3,2,4,2]
    Output: true
    """
    # Optimal Solution: O(n) time, O(n) space
    seen = set()
    
    for num in nums:
        if num in seen:
            return True
        seen.add(num)
    
    return False


if __name__ == "__main__":
    # Test cases
    test_cases = [
        ([1, 2, 3, 1], True),
        ([1, 2, 3, 4], False),
        ([1, 1, 1, 3, 3, 4, 3, 2, 4, 2], True),
        ([], False),
        ([1], False),
    ]
    
    for i, (nums, expected) in enumerate(test_cases):
        result = contains_duplicate(nums)
        status = "✓" if result == expected else "✗"
        print(f"Test {i + 1}: {status} Input: {nums} | Expected: {expected} | Got: {result}")
