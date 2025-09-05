
nums = [10, 20, 30, 90, 80, 40, 50]


def getIndexAndValue(nums):
    for i, value in enumerate(nums):
        print(f"{i} index {value} value")


def sort_nums(nums):
    sorted_nums = sorted(nums)
    return sorted_nums



def square_num(nums):
    squared = list(map(lambda x: x * 2, nums))
    return squared

def filter_by_twenty(nums):
    filtered_list = list(filter(lambda x: x % 20 == 0, nums))
    return filtered_list

print(any(i % 20 == 0 for i in nums))
print(all(i % 20 == 0 for i in nums))
print(filter_by_twenty(nums))

