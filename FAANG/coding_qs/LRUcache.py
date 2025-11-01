from collections import OrderedDict

class LRUCache:
    def __init__(self, capacity):
        if capacity < 0:
            raise ValueError("Capacity cannot be negative")
        self.cache = OrderedDict()
        self.capacity = capacity
    
    def get(self, key):
        if self.capacity == 0 or key not in self.cache:
            return -1
        self.cache.move_to_end(key)
        return self.cache[key]

    def put(self, key, value):
        # If capacity is 0, don't store anything
        if self.capacity == 0:
            return
            
        if key in self.cache:
            # Update existing key
            self.cache[key] = value
            self.cache.move_to_end(key)
        else:
            # Add new key
            self.cache[key] = value
            # Remove oldest item if capacity exceeded
            if len(self.cache) > self.capacity:
                self.cache.popitem(last=False)
        


# Test with normal capacity
# cache1 = LRUCache(3)

# cache1.put(1, 1)
# cache1.put(2, 2)
# cache1.put(3, 3)
# cache1.get(1)
# cache1.put(4, 4)

# print("Normal cache (capacity=3):", cache1.cache)

# Test with capacity = 0
cache_zero = LRUCache(0)
cache_zero.put(1, 1)
cache_zero.put(2, 2)
print("Zero capacity cache:", cache_zero.cache)
print("Get from zero capacity cache:", cache_zero.get(1))

# Test with negative capacity (this will raise ValueError)
try:
    cache_negative = LRUCache(-1)
except ValueError as e:
    print(f"ValueError caught: {e}")

# Test with capacity = 1
# cache_one = LRUCache(1)
# cache_one.put(1, 1)
# print("After adding 1:", cache_one.cache)
# cache_one.put(2, 2)
# print("After adding 2 (should evict 1):", cache_one.cache)

