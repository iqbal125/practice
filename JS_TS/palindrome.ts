const isPalindrome = (str) => {
  let strRef = str.replace(/[^a-z0-9]/gi, "").toLowerCase()
  if (str === "" || strRef === "") return -1

  const mid = Math.floor(strRef.length / 2)

  const rightStr = strRef.slice(mid + (strRef.length % 2))
  const leftStr = strRef.slice(0, mid)

  const rightReverse = rightStr.split("").reverse().join("")

  if (rightReverse === leftStr) return true
  return false
}

console.log(isPalindrome("A man, a plan, a canal, Panama")) // true
console.log(isPalindrome("race a car")) // false
