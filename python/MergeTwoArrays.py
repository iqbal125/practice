

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

