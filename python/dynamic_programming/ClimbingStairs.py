# n=1: [1] -> 1 way
# n=2: [1,1] or [2] -> 2 ways  
# n=3: [1,1,1] or [1,2] or [2,1] -> 3 ways
# n=4: [1,1,1,1] or [1,1,2] or [1,2,1] or [2,1,1] or [2,2] -> 5 ways

# This is LeetCode problem #70. The key insight is that it follows the Fibonacci pattern!
# Problem Understanding:

# You can climb 1 or 2 steps at a time
# Find total number of distinct ways to reach step n


def climb_stairs(n):
    memo = {}
    total = 0

    def helper(n):
        if n <= 2:
            return 2
        
        if n in memo:
            return memo[n]


        memo[n] = helper(n - 1) + helper(n -2)
        return memo[n]
    
    return helper(n)


print(climb_stairs(4))