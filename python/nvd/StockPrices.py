"""
LeetCode #121 - Best Time to Buy and Sell Stock

You are given an array prices where prices[i] is the price of a given stock on the ith day.

You want to maximize your profit by choosing a single day to buy one stock and choosing 
a different day in the future to sell that stock.

Return the maximum profit you can achieve from this transaction. If you cannot achieve 
any profit, return 0.

Example 1:
Input: prices = [7,1,5,3,6,4]
Output: 5
Explanation: Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.
Note that buying on day 2 and selling on day 1 is not allowed because you must buy before you sell.

Example 2:
Input: prices = [7,6,4,3,1]
Output: 0
Explanation: In this case, no transactions are done and the max profit = 0.

Constraints:
- 1 <= prices.length <= 10^5
- 0 <= prices[i] <= 10^4
"""

class Solution:
    def maxProfit(self, prices: list[int]) -> int:
        """
        Find the maximum profit from buying and selling stock once.
        
        Args:
            prices: List of stock prices where prices[i] is the price on day i
            
        Returns:
            Maximum profit achievable, or 0 if no profit is possible
        """
        pass


# Test cases
if __name__ == "__main__":
    solution = Solution()
    
    # Test case 1
    prices1 = [7, 1, 5, 3, 6, 4]
    print(f"Input: {prices1}")
    print(f"Output: {solution.maxProfit(prices1)}")
    print(f"Expected: 5\n")
    
    # Test case 2
    prices2 = [7, 6, 4, 3, 1]
    print(f"Input: {prices2}")
    print(f"Output: {solution.maxProfit(prices2)}")
    print(f"Expected: 0\n")
    
    # Test case 3
    prices3 = [2, 4, 1]
    print(f"Input: {prices3}")
    print(f"Output: {solution.maxProfit(prices3)}")
    print(f"Expected: 2\n")
    
    # Test case 4
    prices4 = [3, 2, 6, 5, 0, 3]
    print(f"Input: {prices4}")
    print(f"Output: {solution.maxProfit(prices4)}")
    print(f"Expected: 4\n")
    
    # Test case 5
    prices5 = [1, 2, 3, 4, 5]
    print(f"Input: {prices5}")
    print(f"Output: {solution.maxProfit(prices5)}")
    print(f"Expected: 4\n")
