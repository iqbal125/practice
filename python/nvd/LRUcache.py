"""
LRU Cache - Leetcode 146

Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.

Implement the LRUCache class:
- LRUCache(int capacity) Initialize the LRU cache with positive size capacity.
- int get(int key) Return the value of the key if the key exists, otherwise return -1.
- void put(int key, int value) Update the value of the key if the key exists. 
  Otherwise, add the key-value pair to the cache. If the number of keys exceeds 
  the capacity from this operation, evict the least recently used key.

The functions get and put must each run in O(1) average time complexity.

Example:
Input
["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"]
[[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]

Output
[null, null, null, 1, null, -1, null, -1, 3, 4]

Explanation
LRUCache lRUCache = new LRUCache(2);
lRUCache.put(1, 1); // cache is {1=1}
lRUCache.put(2, 2); // cache is {1=1, 2=2}
lRUCache.get(1);    // return 1
lRUCache.put(3, 3); // LRU key was 2, evicts key 2, cache is {1=1, 3=3}
lRUCache.get(2);    // returns -1 (not found)
lRUCache.put(4, 4); // LRU key was 1, evicts key 1, cache is {4=4, 3=3}
lRUCache.get(1);    // return -1 (not found)
lRUCache.get(3);    // return 3
lRUCache.get(4);    // return 4

Constraints:
- 1 <= capacity <= 3000
- 0 <= key <= 10^4
- 0 <= value <= 10^5
- At most 2 * 10^5 calls will be made to get and put.
"""

from collections import OrderedDict


# on get move the key/value to beginning, if not exists return -1



class LRUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.cache = OrderedDict()


    def get(self, key: int):
        """
        Return the value of the key if it exists, otherwise return -1.
        Move the accessed key to the head (most recently used).
        """
        if key not in self.cache:
            return -1

        self.cache.move_to_end(key)
        return self.cache[key]


    def put(self, key: int, value: int):
        """
        Update the value if key exists, otherwise add the key-value pair.
        If capacity is exceeded, remove the least recently used item.
        """
        # TODO: Implement put logic
        if key in self.cache:
            self.cache[key] = value
            self.cache.move_to_end(key)
        else:
            self.cache[key] = value
            if len(self.cache) > self.capacity: 
                self.cache.popitem(last=False)



# Test cases
if __name__ == "__main__":
    # Test case 1
    lru = LRUCache(2)
    lru.put(1, 1)
    lru.put(2, 2)
    print(lru.get(1))  # Expected: 1
    lru.put(3, 3)      # Evicts key 2
    print(lru.get(2))  # Expected: -1
    lru.put(4, 4)      # Evicts key 1
    print(lru.get(1))  # Expected: -1
    print(lru.get(3))  # Expected: 3
    print(lru.get(4))  # Expected: 4
