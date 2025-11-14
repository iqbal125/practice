

# init k num of elements from beginning of array
# find the sum of that and make that the max sum
# subract the element from the beginning of array using the index and add the next element index
# compare if more than max sum
# if yes then set to new max_sum, if not then continue


def sub_array(nums, k):
    max_sum = sum(nums[:k])
    current_sum = max_sum

    for right in range(k, len(nums)):
        left = right - k
        current_sum += nums[right] - nums[left]
        max_sum = max(current_sum, max_sum)
    
    return max_sum

k = 3
nums = [5, 2, 7, 1, 4, 6, 3]

print(sub_array(nums, k))