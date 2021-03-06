function Timer(timer, timer_lap, left, right, laps) {
  this.dom_timer     = timer;
  this.dom_timer_lap = timer_lap;
  this.dom_left      = left;
  this.dom_right     = right;
  this.dom_laps      = laps;

  // Add click events for left and right timer buttons
  this.dom_left.addEventListener("click",
    (function(self) {
      return function(e) {
        // Left button toggles between lap and reset buttons
        // Ignore reset state
        if(self.state === 1) { // active
          self.lap();
        } else if (self.state === 2) { // stopped
          self.reset();
        }
      }
    })(this)

  );
  this.dom_right.addEventListener("click",
    (function(self) {
      return function(e) {
        // Left button toggles between start and stop buttons
        if(self.state === 1) { // active
          self.stop();
        } else { // reset or stopped
          self.start();
        }
      }
    })(this)

  );

  this.state         = 0; // 0: reset || 1: active || 2: stopped
  this.state_changed = false;
  this.start_time    = 0;
  this.elapsed_time  = 0;
  this.elapsed_laps   = 0;
  this.laps          = [];
}

Timer.prototype.start = function() {
  this.start_time = 0;
  this.state = 1;
  this.state_changed = true;
}

Timer.prototype.stop = function() {
  this.state = 2;
  this.state_changed = true;
}

Timer.prototype.reset = function() {
  // Set state to reset
  this.state = 0;
  this.state_changed = true;

  // Reset this.start_time
  this.start_time   = 0;
  this.elapsed_time = 0;
  this.elapsed_laps = 0;

  // Clear laps
  this.laps.length = 0;
  this.dom_laps.innerHTML = "";

  this.draw(true);
}

Timer.prototype.lap = function() {
  // Save elapsed_time
  var now = this.convert(new Date(this.elapsed_laps));
  this.elapsed_laps = 0;

  // Create new DOM element
  var dom_lap  = document.createElement("li");
  var dom_text = document.createTextNode(now);
  dom_lap.appendChild(dom_text);

  // Append to dom_laps
  this.dom_laps.insertBefore(dom_lap, this.dom_laps.firstChild);

  // Deep copy elapsed_time time into this.laps
  this.laps.push(dom_lap);
}

Timer.prototype.draw  = function(reset) {
  if(reset) {
    // Timer should be redrawn to 00:00.00
    this.dom_timer.innerHTML     = "00:00.00";
    this.dom_timer_lap.innerHTML = "00:00.00";
  }

  if(this.state == 1) { // active
    // Convert this.start_time to string
    var timer     = this.convert(new Date(this.elapsed_time));
    var timer_lap = this.convert(new Date(this.elapsed_laps));

    // Update timer html with string
    this.dom_timer.innerHTML = timer;
    this.dom_timer_lap.innerHTML = timer_lap;
  }

  // If state is changed, redraw...
  if(this.state_changed) {
    console.log(this.state);
    if(this.state == 0) { // reset
      this.dom_left.innerHTML  = "Lap";
      this.dom_right.innerHTML = "Start";
    }
    if(this.state == 1) { // active
      this.dom_left.innerHTML  = "Lap";
      this.dom_right.innerHTML = "Stop";
    }
    if(this.state == 2) { // stopped
      this.dom_left.innerHTML = "Reset";
      this.dom_right.innerHTML = "Start";
    }

    this.state_changed = false;
  }
}

Timer.prototype.convert = function(date) {
  // @date: Date object
  function pad(n) { return ( n < 10 ? '0' : '') + n; }
  var retval = pad(date.getMinutes()) + ":"
               + pad(date.getSeconds()) + "."
               // Round ms to 2 decimal places
               + date.getMilliseconds();
  return retval;
}

Timer.prototype.update = function(elapsed) {
  this.elapsed_laps += elapsed;
  this.elapsed_time += elapsed;
}

var timer = new Timer(
  document.getElementById("stop-timer"),          // timer
  document.getElementById("stop-timer-lap"),      // lap_tag
  document.getElementById("stop-controls-left"),  // reset
  document.getElementById("stop-controls-right"), // start
  document.getElementById("stop-laps-list")       // laps
);
timer.reset();

// Main loop
var last    = Date.now();
var elapsed = 0;
function loop() {
  elapsed = Date.now() - last;
  last = Date.now();

  // If timer is currently active
  if(timer.state === 1) {
    timer.update(elapsed);
  }

  timer.draw();
  requestAnimationFrame(loop);
}

loop();
