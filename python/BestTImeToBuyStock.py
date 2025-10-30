
# what is the best time to buy and sell stock

def FindProfit(prices_arr):
    left = 0
    right = 1
    max_profit = 0


    while right < len(prices_arr):
        if(prices_arr[left] < prices_arr[right]):
            profit = prices_arr[right] - prices_arr[left]

            max_profit = max(max_profit, profit)
        elif(prices_arr[left] > prices_arr[right]):
            left = right
        
        right += 1


    print(max_profit)
    return max_profit



prices = [4,7,2,5,1,3,6,4]
# Output: 5

FindProfit(prices)