"""
LeetCode #981 - Time Based Key-Value Store

Design a time-based key-value data structure that can store multiple values for the 
same key at different time stamps and retrieve the key's value at a certain timestamp.

Implement the TimeMap class:
- TimeMap() Initializes the object of the data structure
- void set(String key, String value, int timestamp) Stores the key with the value at 
  the given time timestamp
- String get(String key, int timestamp) Returns a value such that set was called 
  previously, with timestamp_prev <= timestamp. If there are multiple such values, 
  it returns the value associated with the largest timestamp_prev. If there are no 
  values, it returns ""

Example 1:
Input: 
["TimeMap", "set", "get", "get", "set", "get", "get"]
[[], ["foo", "bar", 1], ["foo", 1], ["foo", 3], ["foo", "bar2", 4], ["foo", 4], ["foo", 5]]
Output:
[null, null, "bar", "bar", null, "bar2", "bar2"]

Explanation:
TimeMap timeMap = new TimeMap();
timeMap.set("foo", "bar", 1);  // store the key "foo" and value "bar" along with timestamp = 1
timeMap.get("foo", 1);         // return "bar"
timeMap.get("foo", 3);         // return "bar", since there is no value at timestamp 3 and 
                               // timestamp 2, then the only value is at timestamp 1 is "bar"
timeMap.set("foo", "bar2", 4); // store the key "foo" and value "bar2" along with timestamp = 4
timeMap.get("foo", 4);         // return "bar2"
timeMap.get("foo", 5);         // return "bar2"

Constraints:
- 1 <= key.length, value.length <= 100
- key and value consist of lowercase English letters and digits
- 1 <= timestamp <= 10^7
- All the timestamps of set are strictly increasing
- At most 2 * 10^5 calls will be made to set and get
"""

class TimeMap:
    def __init__(self):
        """
        Initialize the time-based key-value store.
        """
        pass

    def set(self, key: str, value: str, timestamp: int) -> None:
        """
        Store the key with the value at the given timestamp.
        
        Args:
            key: The key to store
            value: The value to associate with the key
            timestamp: The timestamp for this key-value pair
        """
        pass

    def get(self, key: str, timestamp: int) -> str:
        """
        Retrieve the value associated with the key at or before the given timestamp.
        
        Args:
            key: The key to look up
            timestamp: The timestamp to query
            
        Returns:
            The value associated with the largest timestamp <= given timestamp,
            or "" if no such value exists
        """
        pass


# Test cases
if __name__ == "__main__":
    # Test case 1
    print("Test Case 1:")
    timeMap = TimeMap()
    
    timeMap.set("foo", "bar", 1)
    print("set('foo', 'bar', 1)")
    
    result1 = timeMap.get("foo", 1)
    print(f"get('foo', 1) = '{result1}'")  # Expected: "bar"
    
    result2 = timeMap.get("foo", 3)
    print(f"get('foo', 3) = '{result2}'")  # Expected: "bar"
    
    timeMap.set("foo", "bar2", 4)
    print("set('foo', 'bar2', 4)")
    
    result3 = timeMap.get("foo", 4)
    print(f"get('foo', 4) = '{result3}'")  # Expected: "bar2"
    
    result4 = timeMap.get("foo", 5)
    print(f"get('foo', 5) = '{result4}'")  # Expected: "bar2"
    
    # Test case 2
    print("\nTest Case 2:")
    timeMap2 = TimeMap()
    
    timeMap2.set("love", "high", 10)
    timeMap2.set("love", "low", 20)
    print("set('love', 'high', 10)")
    print("set('love', 'low', 20)")
    
    result5 = timeMap2.get("love", 5)
    print(f"get('love', 5) = '{result5}'")   # Expected: ""
    
    result6 = timeMap2.get("love", 10)
    print(f"get('love', 10) = '{result6}'")  # Expected: "high"
    
    result7 = timeMap2.get("love", 15)
    print(f"get('love', 15) = '{result7}'")  # Expected: "high"
    
    result8 = timeMap2.get("love", 20)
    print(f"get('love', 20) = '{result8}'")  # Expected: "low"
    
    result9 = timeMap2.get("love", 25)
    print(f"get('love', 25) = '{result9}'")  # Expected: "low"
