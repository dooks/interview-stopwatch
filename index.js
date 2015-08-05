function Timer(timer, lap_tag, reset, start, laps) {
  this.dom_timer   = timer;
  this.dom_lap_tag = lap_tag;
  this.dom_reset   = reset;
  this.dom_start   = start;
  this.dom_laps    = laps;

  this.start_time   = null;
  this.elapsed_time = null;
  this.laps    = [];
}

Timer.prototype.start = function() {
  this.start_time = 0;
}

Timer.prototype.lap   = function() {
  // Save elapsed_time time
  var now = this.elapsed_time;

  // Create new DOM element
  var dom_lap  = document.createElement("li");
  //var dom_text = document.createTextNode(now);
  //dom_lap.appendChild(dom_text);

  // Append to dom_laps
  this.dom_laps.appendChild(dom_lap);

  // Deep copy elapsed_time time into this.laps
  this.laps.push(dom_lap);
}

Timer.prototype.reset = function() {
  // Reset this.start_time
  this.start_time   = null;
  this.elapsed_time = null;

  // Clear laps
  this.laps.length = 0;
}
Timer.prototype.draw  = function() {
  // Convert this.start_time to string
  if(this.start_time === null) {
    this.dom_timer.innerHTML = "00:00:00";
  } else {
    var timer = this.convert(new Date(this.elapsed_time));
    // Update timer html with string
    this.dom_timer.innerHTML = timer;
  }

  // For each lap, convert to string and display
  for(var i = 0; i < this.laps; i++) {
    var lap = this.convert(this.laps[1][i]);
    this.laps[0][i].innerHTML = lap;
  }
}

Timer.prototype.convert = function(date) {
  // @date: Date object
  var retval = date.getMinutes() + " : "
               + date.getSeconds() + " : "
               + date.getMilliseconds();
  return retval;
}

Timer.prototype.update = function(elapsed) {
  this.elapsed_time += elapsed;
}


// Testing
var timer = new Timer(
  document.getElementById("stop-timer"),          // timer
  document.getElementById("stop-lap-tag"),        // lap_tag
  document.getElementById("stop-controls-reset"), // reset
  document.getElementById("stop-start"),          // start
  document.getElementById("stop-laps-list")       // laps
);
timer.start();
//timer.elapsed_time = timer.start_time;
//timer.draw();

// Add 20 ms
//timer.elapsed_time += 20;
//timer.draw();

// Add 20 seconds
//timer.elapsed_time += 100 * 20;
//timer.draw();

// Add one minute
//timer.elapsed_time += 10000 * 20;
//timer.draw();

// Main loop
var last = Date.now();
var elapsed = 0;
function loop() {
  elapsed = Date.now() - last;
  last = Date.now();

  timer.update(elapsed);
  timer.draw();

  requestAnimationFrame(loop);
}

loop();
