var fps = 1;

var previousTime = Date.now();

var textTimeElem = document.getElementById('text-time');
var clockCanvasElem = document.getElementById("clock-canvas");

// FIXME should be calculated on each resize to fill the available
// space
clockCanvasElem.width = 400;
clockCanvasElem.height = 400; 

var ctx = clockCanvasElem.getContext("2d");
var width = clockCanvasElem.width;
var height = clockCanvasElem.height;
var radius = width / 2;
var centerX = radius;
var centerY = radius;
var lineWidthBase = radius / 150;

var handAngles = {'hours': 0, 'minutes': 0, 'seconds': 0};
var handSizes = {
    'hours': radius * 0.5,
    'minutes': radius * 0.8,
    'seconds': radius * 0.7
};
var lineWidths = {
    'hours': lineWidthBase * 9,
    'minutes': lineWidthBase * 6,
    'seconds': lineWidthBase * 4
};
var colors = {
    'black': "#000000",
    'white': "#FFFFFF",
    'hours': "#005FE4",
    'minutes': "#00B20D",
    'seconds': "#E6000A"
};

function drawSimpleBackground() {
  // Draw the background of the simple clock.
  //
  // The simple clock background is a white disk, with hours and
  // minutes ticks, and the hour numbers.

  var lineWidthBackground = lineWidthBase * 4;
  ctx.lineWidth = lineWidthBackground;
  ctx.strokeStyle = colors['black'];
  ctx.fillStyle = colors['white'];
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius - lineWidthBackground, 0, 2*Math.PI);
  ctx.fill();
  ctx.stroke();
}

function update() {
  // update text time
  var date = new Date();
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var seconds = date.getSeconds();

  var zeroFill = function(number) {
    return ('00' + number).substr(-2);
  }

  textTimeElem.innerHTML = 
    '<span style="color:' + colors['hours'] + '">' + zeroFill(hours) + '</span>' +
    ':<span style="color:' + colors['minutes'] + '">' + zeroFill(minutes) +  '</span>' +
    ':<span style="color:' + colors['seconds'] + '">' + zeroFill(seconds) +  '</span>';

  handAngles['hours'] = Math.PI - (Math.PI / 6 * hours + Math.PI / 360 * minutes);
  handAngles['minutes'] = Math.PI - Math.PI / 30 * minutes;
  handAngles['seconds'] = Math.PI - Math.PI / 30 * seconds;
}

function drawHands() {
  // Draw the hands of the analog clocks.

  var handNames = ['hours', 'minutes', 'seconds'];
  for (var i=0; i<handNames.length; i++) {
    var name = handNames[i];
      ctx.lineCap = 'round';
      ctx.lineWidth = lineWidths[name];
      ctx.strokeStyle = colors[name];
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(centerX + handSizes[name] * Math.sin(handAngles[name]),
                 centerY + handSizes[name] * Math.cos(handAngles[name]));
      ctx.stroke();
  }
}

function draw() {
  // clear
  ctx.clearRect(0, 0, width, height);

  // FIXME draw background in other layer to prevent redrawings
  drawSimpleBackground();

  drawHands();
}

function animate() {
  var currentTime = Date.now();

  if ((currentTime - previousTime) > (1000 / fps)) {
    previousTime = currentTime;
    update();
    draw();
  }
  requestAnimationFrame(animate);
}

animate();
