// Generated by CoffeeScript 1.9.2
(function() {
  var cat, horse, pig, ringFireAlarm, setName;

  setName = function(name) {
    return this.name = name;
  };

  cat = {};

  cat.setName = setName;

  cat.setName('Mittens');

  console.log(cat.name);

  pig = {};

  setName.apply(pig, ['Babe']);

  console.log(pig.name);

  setName.call(pig, 'Babe1');

  console.log(pig.name);

  horse = {};

  cat.setName.apply(horse, ['Mr. Ed']);

  console.log(horse.name);

  ringFireAlarm = function(isDrill) {
    if (isDrill == null) {
      return isDrill = true;
    }
  };

}).call(this);

//# sourceMappingURL=one3.js.map
