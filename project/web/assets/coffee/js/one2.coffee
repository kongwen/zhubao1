  console.log do -> 'hello ,functions'


  hi =(a) -> 'hello ,functions' + a

  console.log hi(555)

  greeting = (subject) -> "hello ,#{subject}!"
  console.log greeting('arguments')

  squadron = 'Red'
  xWing = squadron + 5
  console.log xWing

  greetings =  -> "hello ,#{arguments[1]}!"
  console.log greetings('111','222')

  odd = (num) ->
    if typeof  num is 'number'
      if num is Math.round num
        if  num > 0
          num % 2 is 1
        else
          throw  "#{num} 不是正整数"
      else
        throw  "#{num} 不是整数"
    else
      throw  "#{num} 不是数字"

  #console.log odd('1')
  #console.log odd(2.2)
  #console.log odd(-3)
  console.log odd(3)

  try
    odd 5.1
  catch  e
    console.log e

  odds = (num) ->
    unless typeof  num is 'number'
      throw  "#{num} 不是数字"
    unless num is Math.round num
      throw  "#{num} 不是整数"
    unless  num > 0
      throw  "#{num} 不是正整数"
    num % 2 is 1

