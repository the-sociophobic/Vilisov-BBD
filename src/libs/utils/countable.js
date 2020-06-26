export default (number, word) => {
  let countableWord
  
  if (Array.isArray(word)) {
    if ((number > 10 && number < 20) || number % 10 > 4 || number % 10 === 0)
      countableWord = word[2]
    else if (number % 10 > 1)
      countableWord = word[1]
    else
      countableWord = word[0]
  }
  else if (number === 1)
    countableWord = word
  else countableWord = word + "s"

  return countableWord
}
