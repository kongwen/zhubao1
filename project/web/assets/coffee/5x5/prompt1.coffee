  stdin = process.openStdin()
  stdin.setEncoding 'utf8'

  inputCallback = null
  stdin.on 'data',(input) -> inputCallback input

  promptForTile1 = ->
    console.log "请输入第一个有效坐标："
    inputCallback = (input) ->
      promptForTile2() if strToCoordinates input

  promptForTile2 = ->
    console.log "请输入第二个有效坐标："
    inputCallback = (input) ->
      if strToCoordinates input
        console.log "正在交换坐标...完成！"
        promptForTile1()

  GRID_SIZE = 5
  inRange = (x,y) ->
    0 <= x < GRID_SIZE and 0<= y <GRID_SIZE

  isInteger = (num) ->
    num is Math.round(num)

  strToCoordinates = (input) ->
    halves = input.split(',')
    if halves.length is 2
      x = parseFloat halves[0]
      y = parseFloat halves[1]
      if !isInteger(x) or !isInteger(y)
        console.log("每个坐标数必须是正整数！")
      else if not inRange(x-1,y-1)
        console.log("每个坐标数必须是在1和#{GRID_SIZE}之间！")
      else
        {x,y}
    else
      console.log("请输入坐标格式为：x,y")


  console.log("欢迎来到 5x5 游戏！")
  promptForTile1()