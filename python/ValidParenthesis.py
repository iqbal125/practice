



def ValidParen(s): 
    stk = []
    hashMap = {
        ")": "(", "]": "[", "}": "{" 
    }

    for char in s:
        # if closing bracket
        if char in hashMap:
            if(len(stk) == 0 or stk.pop() != hashMap[char]):
                return False
        # if opening bracket
        else: 
            stk.append(char)

    if len(stk) == 0:
        return True


s1 = "[([])]" #true
s2 = "[(])" #false

print(ValidParen(s2))