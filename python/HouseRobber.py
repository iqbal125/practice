# You're a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed. 
# The constraint is that adjacent houses have connected security systems - if two adjacent houses are robbed on the same night, 
# the police will be alerted.
# Goal: Find the maximum amount of money you can rob without alerting the police.

def FindPath(arr):
    n = len(arr) -1

    memo = {}

    def helper(i):
        if i in memo:
            return  memo[i]
        
        if i == 0:
            return nums[0]
        if i == 1:
            return max(nums[0], nums[1])
        

        rob_current = nums[i] + helper(i-2)
        skip_current = helper(i - 1)

        memo[i] = max(rob_current, skip_current)

        return memo[i]

    return helper(n)

nums = [2, 7, 9, 3, 1]
# Output" 12
# Explanation: Rob house 0 (money = 2), house 2 (money = 9) and house 4 (money = 1)
# Total = 2 + 9 + 1 = 12

print(FindPath(nums))