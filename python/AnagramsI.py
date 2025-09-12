

def ValidAnagrams(s, t):
    if(len(s) != len(t)):
        return False

    countT = {}
    countS = {}

    for i in s:
        countS[i] = countT.get(i, 0) + 1
    
    for i in t: 
        countT[i] = countS.get(i, 0) + 1

    return countS == countT


s = "anagram"
t = "nagaram"

ValidAnagrams(s, t)