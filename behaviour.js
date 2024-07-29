let nodes = new Array(20);
let c;

let circleX = 100;
let circleY = 100;
let diameter = 150;
function setup() {
  createCanvas(720, 480);
}

function draw() {
  background(230);

  //next step. how do i know if the mouse is over that circle?

  if (dist(circleX, circleY, mouseX, mouseY) < diameter / 2 && mouseIsPressed) {
    circleX = mouseX;
    circleY = mouseY;
  }

  ellipse(circleX, circleY, diameter, diameter);
  text("HEY", circleX, circleY);

  //   for (let i = 0; i < nodes.length; i++) {
  //     circle(50 + i, 50 + i, 20);
  //     text(i, 50 + i, 50 + i);
  //   }

  function addNode() {
    // push item into array
  }
}
