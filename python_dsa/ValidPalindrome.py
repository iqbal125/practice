


def ValidPalindrome(s):
    # brute force 
    str1 = ''

    for i in s:
        if i.isalnum():
            str1 += i.lower()
        pass
    print(str1)

    strReverse = str1[::-1]
    print(strReverse)
    if(strReverse == str1):
        return True
    
    return False
    

def ValidPalindrome2(s):
    left = 0
    right = len(s) - 1

    while left < right:
        while left < right and not s[left].isalnum():
            left += 1
        while left < right and not s[right].isalnum():
            right -= 1
        
        if s[right].lower() != s[left].lower():
            return False

        left += 1
        right -= 1    

    
    return True


input_string1 = "A man, a plan, a canal: Panama"
input_string2 = "Not a pally"

print(ValidPalindrome2(input_string2))