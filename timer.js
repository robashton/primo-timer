var _ = require('underscore')

var Timer = function(desiredFps) {
  this.timeAtLastFrame = new Date().getTime()
  this.idealTimePerFrame = 1000 / desiredFps
  this.leftover = 0
  this.scheduled = []
  this.ticks = 0
}

Timer.prototype = {
  tick: function(cb) {
    var timeAtThisFrame = new Date().getTime()
      , timeSinceLastTick = timeAtThisFrame - this.timeAtLastFrame + this.leftover
      , catchUpFrameCount = Math.floor(timeSinceLastTick / this.idealTimePerFrame)

    for(var i = 0; i < catchUpFrameCount; i++) {
      cb()
      this.ticks++
      this.fireAnyScheduledEvents()
    }

    this.leftover = timeSinceLastTick - (catchUpFrameCount * this.idealTimePerFrame)
    this.timeAtLastFrame = timeAtThisFrame
  },
  schedule: function(cb, ms) {
    this.scheduled.push({
      cb: cb,
      ticks: this.ticks + Math.floor((ms / this.idealTimePerFrame))
    })
  },
  fireAnyScheduledEvents: function() {
    var remaining = []
    for(var i =0 ; i < this.scheduled.length; i++) {
      var item = this.scheduled[i]
      if(item.ticks <= this.ticks)
        item.cb()
      else
        remaining.push(item)
    }
    this.scheduled = remaining
  }
}

module.exports = Timer

