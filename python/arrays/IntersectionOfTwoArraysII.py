def intersect(nums1: list[int], nums2: list[int]) -> list[int]:
    """
    Given two integer arrays nums1 and nums2, return an array of their intersection.
    Each element in the result must appear as many times as it shows in both arrays.
    
    You may return the result in any order.
    
    Example 1:
    Input: nums1 = [1,2,2,1], nums2 = [2,2]
    Output: [2,2]
    
    Example 2:
    Input: nums1 = [4,9,5], nums2 = [9,4,9,8,4]
    Sorted: nums1 = [4,5,9], nums2 = [4,4,8,9,9]
    Output: [4,9]
    """
    # TODO: Implement your solution here
    if not nums1 or not nums2:
        return []

    nums1.sort()
    nums2.sort()

    nums1_pointer = 0
    nums2_pointer = 0


    # sort both arrays 
    # iterate using while loops and manual index management
    # init empty result array
    # check if nums1 index value matches nums2 index value
    # if match add value to result arr, increment both nums1 and nums2 
    # if not, check which is bigger, 
    # if nums1 is smaller, increment nums1 pointer
    # if nums1 is bigger, increment nums2 pointer
    # repeat
    # if either pointers are out of range end loop

    result = []

    while nums1_pointer < len(nums1) and nums2_pointer < len(nums2):
        v1 = nums1[nums1_pointer]
        v2 = nums2[nums2_pointer]

        if nums1[nums1_pointer] == nums2[nums2_pointer]:
            result.append(nums1[nums1_pointer])
            nums1_pointer += 1
            nums2_pointer += 1
        elif nums1[nums1_pointer] < nums2[nums2_pointer]:
            nums1_pointer += 1
        else:
            nums2_pointer += 1
    
    
    return result



if __name__ == "__main__":
    # Test cases
    test_cases = [
        ([1, 2, 2, 1], [2, 2], [2, 2]),
        ([4, 9, 5], [9, 4, 9, 8, 4], [4, 9]),
        ([1, 2, 3], [4, 5, 6], []),
        ([1, 1, 1], [1, 1], [1, 1]),
        ([], [1, 2, 3], []),
        ([1], [1], [1]),
        ([3, 1, 2], [1, 1], [1]),
    ]
    
    for i, (nums1, nums2, expected) in enumerate(test_cases):
        result = intersect(nums1, nums2)
        # Sort both for comparison since order doesn't matter
        result_sorted = sorted(result)
        expected_sorted = sorted(expected)
        status = "✓" if result_sorted == expected_sorted else "✗"
        print(f"Test {i + 1}: {status} Input: nums1={nums1}, nums2={nums2} | Expected: {expected} | Got: {result}")
