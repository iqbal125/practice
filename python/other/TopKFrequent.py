"""
Top K Frequent Elements

Given an integer array nums and an integer k, return the k most frequent elements.
You may return the answer in any order.

Example 1:
Input: nums = [1,1,1,2,2,3], k = 2
Output: [1,2]

Example 2:
Input: nums = [1], k = 1
Output: [1]

Time Complexity: O(n)
Space Complexity: O(n)
"""

from typing import List
from collections import Counter
import heapq



# create a hashmap of numbers and frequencies 
# easier to counter from collections than doing freq = {} and then for i in nums: freq[i] = freq.get(i, 0) + 1

# init heap 
# iterate over freq hashmap 
# push to heap as tuple, counter first ele, and key as second, 
#  tuple will keep largest at the end of heap
#  if the length of heap is larger than then remove smallest heap element with .pop


def topKFrequent(nums: List[int], k: int) -> List[int]:
    # TODO: Implement the solution
    freq = Counter(nums)

    heap = []

    for num, frequency in freq.items():
        heapq.heappush(heap, (frequency, num))

        if len(heap) > k:
            heapq.heappop(heap)

    result = [num for _, num in heap]
    return result




nums1 = [1, 1, 1, 2, 2, 3, 4]
print(topKFrequent(nums1, 2))

# Test cases
# if __name__ == "__main__":
#     solution = Solution()
    
#     # Test case 1
#     nums1 = [1, 1, 1, 2, 2, 3]
#     k1 = 2
#     print(f"Input: nums = {nums1}, k = {k1}")
#     print(f"Output: {solution.topKFrequent(nums1, k1)}")
#     print(f"Expected: [1, 2] (any order)\n")
    
#     # Test case 2
#     nums2 = [1]
#     k2 = 1
#     print(f"Input: nums = {nums2}, k = {k2}")
#     print(f"Output: {solution.topKFrequent(nums2, k2)}")
#     print(f"Expected: [1]\n")
    
#     # Test case 3
#     nums3 = [4, 4, 4, 5, 5, 6]
#     k3 = 2
#     print(f"Input: nums = {nums3}, k = {k3}")
#     print(f"Output: {solution.topKFrequent(nums3, k3)}")
#     print(f"Expected: [4, 5] (any order)")
