"""
LeetCode Easy — Merge Two Sorted Lists

You are given the heads of two sorted linked lists list1 and list2.
Merge the two lists into one sorted list and return the head
of the merged list.

The new list should be made by splicing together the nodes 
of the first two lists.

Examples:
    Input: list1 = [1,2,4], list2 = [1,3,4]
    Output: [1,1,2,3,4,4]

    Input: list1 = [], list2 = []
    Output: []

    Input: list1 = [], list2 = [0]
    Output: [0]
"""

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class Solution:
    def mergeTwoLists(self, list1: ListNode, list2: ListNode) -> ListNode:
        # Write your code here
        pass


# Helper for building and printing lists (optional for testing)
def build_list(arr):
    dummy = ListNode()
    cur = dummy
    for num in arr:
        cur.next = ListNode(num)
        cur = cur.next
    return dummy.next

def print_list(node):
    out = []
    while node:
        out.append(node.val)
        node = node.next
    print(out)


if __name__ == "__main__":
    sol = Solution()

    # Sample tests
    l1 = build_list([1,2,4])
    l2 = build_list([1,3,4])
    print_list(sol.mergeTwoLists(l1, l2))  # Expected: [1,1,2,3,4,4]

    l1 = build_list([])
    l2 = build_list([])
    print_list(sol.mergeTwoLists(l1, l2))  # Expected: []

    l1 = build_list([])
    l2 = build_list([0])
    print_list(sol.mergeTwoLists(l1, l2))  # Expected: [0]

