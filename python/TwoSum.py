

def TwoSum(arr, target):
    prevMap = {}

    for index, value in enumerate(arr):
        diff = target - value

        if diff in prevMap:
            return[prevMap[diff], index]
        prevMap[value] = index
    


 

arr1 = [2, 4, 7, 11, 15]
target = 9


TwoSum(arr1, target)