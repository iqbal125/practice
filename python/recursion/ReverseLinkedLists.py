"""
Reverse Linked List — LeetCode Easy

Reverse a singly linked list.

Example:
    Input: 1 -> 2 -> 3 -> 4 -> None
    Output: 4 -> 3 -> 2 -> 1 -> None
"""

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class Solution:
    def reverseList(self, head: ListNode) -> ListNode:
        prev = None
        cur = head

        while cur:
            nxt = cur.next
            cur.next = prev
            prev = cur
            cur = nxt

        return prev


# Helpers for local testing
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

    head = build_list([1, 2, 3, 4])
    new_head = sol.reverseList(head)
    print_list(new_head)  # Expected: [4, 3, 2, 1]
