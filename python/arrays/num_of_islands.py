"""
2D Array Traversal Pattern - Interview Question
"""

# ============================================================================
# Problem: Number of Islands
# ============================================================================
# Given a 2D grid map of '1's (land) and '0's (water), count the number of islands.
# An island is surrounded by water and is formed by connecting adjacent lands
# horizontally or vertically.
#
# Example 1:
# Input: grid = [
#   ["1","1","1","1","0"],
#   ["1","1","0","1","0"],
#   ["1","1","0","0","0"],
#   ["0","0","0","0","0"]
# ]
# Output: 1
#
# Example 2:
# Input: grid = [
#   ["1","1","0","0","0"],
#   ["1","1","0","0","0"],
#   ["0","0","1","0","0"],
#   ["0","0","0","1","1"]
# ]
# Output: 3

def numIslands(grid):
    """
    Approach: DFS
    Time: O(m * n) where m = rows, n = cols
    Space: O(m * n) for recursion stack in worst case
    """
    if not grid:
        return 0
    
    rows, cols = len(grid), len(grid[0])
    count = 0
    
    def dfs(r, c):
        # TODO: Implement DFS to mark visited land cells
        pass
    
    # TODO: Iterate through grid and count islands
    
    return count


# ============================================================================
# Test Cases
# ============================================================================

if __name__ == "__main__":
    # Test 1: Single island
    grid1 = [
        ["1","1","1","1","0"],
        ["1","1","0","1","0"],
        ["1","1","0","0","0"],
        ["0","0","0","0","0"]
    ]
    print(f"Test 1: {numIslands(grid1)}")  # Expected: 1
    
    # Test 2: Multiple islands
    grid2 = [
        ["1","1","0","0","0"],
        ["1","1","0","0","0"],
        ["0","0","1","0","0"],
        ["0","0","0","1","1"]
    ]
    print(f"Test 2: {numIslands(grid2)}")  # Expected: 3
