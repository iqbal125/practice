

"""
Recursion Practice Problems

This file contains various recursion examples and problems:

1. Factorial: Calculate n! = n × (n-1) × (n-2) × ... × 1
   Example: factorial(5) = 5 × 4 × 3 × 2 × 1 = 120

2. Fibonacci: Calculate the nth Fibonacci number where F(n) = F(n-1) + F(n-2)
   Example: F(0)=0, F(1)=1, F(2)=1, F(3)=2, F(4)=3, F(5)=5...

Key Concepts:
- Base case: The condition that stops the recursion
- Recursive case: The function calling itself with a smaller problem
- Call stack: How recursive calls are managed in memory

Time Complexity:
- Factorial: O(n)
- Fibonacci (naive): O(2^n) - exponential!
- Fibonacci (with memoization): O(n)
"""


# def countdown(n: int):

#     if(n <= 0):
#         return "Done"
    
#     countdown(n - 1)


def factorial(n: int):

    if n <= 1:
        return 1
    

    return n * factorial(n - 1)


# print(factorial(5))
    
# COMPLETE FIBONACCI TRACE - Every Single Step!

def fibonacci_traced(n, depth=0, call_number=[0]):
    """Fibonacci with complete execution tracing"""
    call_number[0] += 1
    call_id = call_number[0]
    indent = "  " * depth
    
    print(f"{indent}[{call_id}] → fibonacci({n}) called")
    
    # Base cases
    if n <= 1:
        print(f"{indent}[{call_id}] → Base case! Returning {n}")
        return n
    
    # Show what we're about to do
    print(f"{indent}[{call_id}] → About to call fibonacci({n-1}) + fibonacci({n-2})")
    
    # Left recursive call
    print(f"{indent}[{call_id}] → Calling fibonacci({n-1})...")
    left_result = fibonacci_traced(n - 1, depth + 1, call_number)
    print(f"{indent}[{call_id}] → fibonacci({n-1}) returned {left_result}")
    
    # Right recursive call  
    print(f"{indent}[{call_id}] → Calling fibonacci({n-2})...")
    right_result = fibonacci_traced(n - 2, depth + 1, call_number)
    print(f"{indent}[{call_id}] → fibonacci({n-2}) returned {right_result}")
    
    # Combine results
    final_result = left_result + right_result
    print(f"{indent}[{call_id}] → Returning {left_result} + {right_result} = {final_result}")
    
    return final_result

print("=== COMPLETE TRACE OF fibonacci(4) ===")
result = fibonacci_traced(4)
print(f"\n🎯 FINAL ANSWER: fibonacci(4) = {result}")



# fibonacci(5)
# ├── fibonacci(4)
# │   ├── fibonacci(3)
# │   │   ├── fibonacci(2)
# │   │   │   ├── fibonacci(1) = 1
# │   │   │   └── fibonacci(0) = 0
# │   │   │   Returns: 1 + 0 = 1
# │   │   └── fibonacci(1) = 1
# │   │   Returns: 1 + 1 = 2
# │   └── fibonacci(2)
# │       ├── fibonacci(1) = 1
# │       └── fibonacci(0) = 0
# │       Returns: 1 + 0 = 1
# │   Returns: 2 + 1 = 3
# └── fibonacci(3)
#     ├── fibonacci(2)
#     │   ├── fibonacci(1) = 1
#     │   └── fibonacci(0) = 0
#     │   Returns: 1 + 0 = 1
#     └── fibonacci(1) = 1
#     Returns: 1 + 1 = 2
# Returns: 3 + 2 = 5