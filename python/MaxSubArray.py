

def max_sub_array(arr): 
    max_current = arr[0]
    max_global = arr[0]

    for i in range(1, len(arr1)):
        if max_current + arr[i] > arr[i]:
            max_current += arr[i]
        else: 
            max_current = arr[i]
        
        if max_current > max_global: 
            max_global = max_current
        
    print(max_global)
    return max_global


arr1 = [-2, 1, -3, 4, -1, 2] # 5

print(max_sub_array(arr1))