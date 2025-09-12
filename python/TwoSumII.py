
def TwoSumII(arr, target): 
    left = 0
    right = len(arr) - 1

    while left < right:
        diff = arr[left] + arr[right]
        if(diff == target):
            return [left, right]
        
        if(diff < target):
            left += 1
        if(diff > target):
            right -= 1
    pass



arr1 = [1,3,4,5,7,11]
target = 9

print(TwoSumII(arr1, target))