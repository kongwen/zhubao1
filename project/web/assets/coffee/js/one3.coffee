 setName = (name) -> @name = name

 cat = {}
 cat.setName = setName
 cat.setName 'Mittens'
 console.log cat.name

 pig = {}
 setName.apply pig,['Babe']
 console.log pig.name
 setName.call pig,'Babe1'
 console.log pig.name

 horse = {}
 cat.setName.apply horse,['Mr. Ed']
 console.log horse.name

 ringFireAlarm = (isDrill) ->
    isDrill = true unless isDrill?