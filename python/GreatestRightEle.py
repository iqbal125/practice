# Replace Elements with Greatest Element on Right Side
# Problem Statement
# Given an array of integers, replace every element with the greatest element on its right side. Replace the last element with -1 since there are no elements to its right.
# Note: The modification should be done in-place or you can return a new array.
# Examples
# Example 1:
# Input: [17, 18, 5, 4, 6, 1]
# Output: [18, 6, 6, 6, 1, -1]

# Explanation:
# - 17 is replaced by 18 (greatest on right)
# - 18 is replaced by 6 (greatest among [5, 4, 6, 1])
# - 5 is replaced by 6 (greatest among [4, 6, 1])
# - 4 is replaced by 6 (greatest among [6, 1])
# - 6 is replaced by 1 (greatest among [1])
# - 1 is replaced by -1 (no elements on right)
# Example 2:
# Input: [1, 2, 3, 4, 5]
# Output: [5, 5, 5, 5, -1]

# Explanation: Each element is replaced by the maximum of all elements to its right.



def GreatestRightEle(arr):
    rightMax = -1
    

    for i in range(len(arr) - 1, -1, -1):
        newMax = max(arr[i], rightMax)
        arr[i] = rightMax
        rightMax = newMax

    # return arr1
    print(arr)




arr1 = [17, 18, 5, 4, 6, 1]
# Output: [18, 6, 6, 6, 1, -1]

# Input: [1, 2, 3, 4, 5]
# Output: [5, 5, 5, 5, -1]

GreatestRightEle(arr1)