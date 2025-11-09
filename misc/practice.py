

from collections import OrderedDict

# get and set functions
# ordered dict for cache ds 
# need capacity user provided


# put
# add to cache if not set
# if already set, move to end
# if len is more than capacity after adding, then remove last element


# get
# if key not in cache, cache miss return -1
# if it is return and move key to end

class LRUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.cache = OrderedDict()
    
    def get(self, key):
        if key not in self.cache:
            return -1
        
        self.cache.move_to_end(key, last=True)
        return self.cache[key]

    def put(self, key, value):
        if key in self.cache:
            self.cache[key] = value
            self.cache.move_to_end(key, last=True)
        else: 
            self.cache[key] = value
            if len(self.cache) >  self.capacity:
                self.cache.popitem(last=False)



cache1 = LRUCache(5)



