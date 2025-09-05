
# Input: nums = [2, 7, 11, 15], target = 9
# Output: [0, 1]  (because nums[0] + nums[1] = 2 + 7 = 9)
# Problem: Given an array of integers and a target sum, find two numbers that add up to the target. Return their indices.


#  iterate over array first pass.   
#  iterate over array nested pass
#  subtract nested item from outer array

def two_sum(nums, target):
    for indexOuter, valueOuter in enumerate(nums):
        for indexInner, valueInner in enumerate(nums[indexOuter + 1:], start=indexOuter + 1):
            total = valueInner + valueOuter
            if(total == target):
                return [indexOuter, indexInner]



input1 = [2, 7, 11, 15]
input2 = 9

print(two_sum(input1, input2))