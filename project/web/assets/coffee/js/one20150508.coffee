  func = ->
      # 多行函数
      'bar'
  times = (a,b) -> a * b

  times = (a = 5,b = 2) -> a*b

  sum = (nums...) ->
    result = 0
    nums.forEach(n) -> result += n
    result

  trigger = (events...) ->
    events.splice(1,0,this)
    this.constructor.trigger.apply(events)

  console.log '你好，coffee'