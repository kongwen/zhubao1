// Generated by CoffeeScript 1.9.2
(function() {
  var func, sum, times, trigger,
    slice = [].slice;

  func = function() {
    return 'bar';
  };

  times = function(a, b) {
    return a * b;
  };

  times = function(a, b) {
    if (a == null) {
      a = 5;
    }
    if (b == null) {
      b = 2;
    }
    return a * b;
  };

  sum = function() {
    var nums, result;
    nums = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    result = 0;
    nums.forEach(n)(function() {
      return result += n;
    });
    return result;
  };

  trigger = function() {
    var events;
    events = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    events.splice(1, 0, this);
    return this.constructor.trigger.apply(events);
  };

  console.log('你好，coffee');

}).call(this);

//# sourceMappingURL=one20150508.js.map
