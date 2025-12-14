

# init min val to 1


def get_min_value(nums):
    min_val = 0
    curSum = 0

    for i in nums:
        curSum += i
        min_val = min(curSum, min_val)

    result = abs(min_val) + 1
    print(result)
    return result


Input = [-3,2,-3,4,2]

get_min_value(Input)