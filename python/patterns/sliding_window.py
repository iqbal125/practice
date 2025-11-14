



arr1 = [1, 2, 3, 4, 5, 6, 7, 8]
target = 3
print(arr1[:3])

print(range(3, len(arr1)))

def sliding_window(arr, target):
    max_sum = 0
    window_sum = sum(arr[:target])
    print(window_sum)

    for i in range(target, len(arr)):
        # print(i)
        window_sum += arr[i] - arr[i-target]
        print(arr[i], arr[i-target], window_sum)
        max_sum = max(window_sum, max_sum)

    return max_sum


sliding_window(arr1, 3)