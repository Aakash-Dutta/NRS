/*
 nodes[] : nodes[{x,y}] represents x-postion and y-postion in canvas, and node's name 
 edges[] : edges[{start, end, weight}] represents start node,end node and weight of edge
 draggindNode: to track if a node in dragged
*/
let nodes = [];
let edges = [];
let draggingNode = null;
let socket;
let table;
let algo = "Not Running";
let currentNode;
let neighbourNode;
let shortestPath = [];
let whichalgo;
let sourceOfBelmanFord;
let trackBellmanFordCosts;
let dateInital;
let dateFinal;
let stateChoosen = "Undirected";

//
let radius;
let fontSize;

function setup() {
  var height;
  var width;
  if (windowWidth < 768) {
    //768 for medium and small sized devices
    height = 300;
    width = windowWidth;
  } else {
    width = windowWidth / 2 - 20;
    height = 480;
  }
  let canvas = createCanvas(width, height);
  canvas.parent("canvasContainer");

  //default values for nodes
  nodes = [
    {
      x: width / 2 - 100,
      y: height / 2 + 60,
      name: 0,
      visited: false,
      finalpath: false,
    },
    {
      x: width / 2 - 100,
      y: height / 2 - 100,
      name: 1,
      visited: false,
      finalpath: false,
    },
    {
      x: width / 2,
      y: height / 2,
      name: 2,
      visited: false,
      finalpath: false,
    },
    {
      x: width / 2,
      y: height / 2 + 120,
      name: 3,
      visited: false,
      finalpath: false,
    },
    {
      x: width / 2 + 150,
      y: height / 2 + 70,
      name: 4,
      visited: false,
      finalpath: false,
    },
    {
      x: width / 2 + 150,
      y: height / 2 - 100,
      name: 5,
      visited: false,
      finalpath: false,
    },
  ];

  // default value for edges
  edges = [
    { start: 0, end: 2, weight: 3, visited: false },
    { start: 2, end: 1, weight: 2, visited: false },
    { start: 2, end: 3, weight: 3, visited: false },
    { start: 3, end: 4, weight: 4, visited: false },
    { start: 5, end: 4, weight: 6, visited: false },
    { start: 1, end: 5, weight: 5, visited: false },
    { start: 2, end: 4, weight: 7, visited: false },
  ];

  // Add Event listener to attach event handler to specified element
  document.getElementById("addNodeBtn").addEventListener("click", addNode);
  document
    .getElementById("myForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      validateForm();
    });
  document
    .getElementById("formCancelbutton")
    .addEventListener("click", function () {
      document.getElementById("myForm").style.display = "none";
    });
  document
    .getElementById("addEdgeBtn")
    .addEventListener("click", addEdgeViewer);
  document.getElementById("clear").addEventListener("click", clearCanvas);
  document.getElementById("dijkstra").addEventListener("click", function () {
    if (edges.length == 0) {
      alert("No Edges connected in graph");
    } else {
      for (let i = 0; i < edges.length; i++) {
        if (edges[i].weight < 0) {
          alert(
            `For Dijkstra's Algorithm, Graph shouldn't have negative edges. There is negative edge at, ${edges[i].start}-->${edges[i].end}`
          );
          return false;
        }
      }
      whichalgo = "Dijkstra";
      runningAlgorithm(whichalgo);
    }
  });
  document
    .getElementById("bellman-ford")
    .addEventListener("click", function () {
      if (edges.length == 0) {
        alert("No Edges connected in graph");
      } else {
        if (stateChoosen == "Undirected") {
          for (let i = 0; i < edges.length; i++) {
            if (edges[i].weight < 0) {
              alert(
                `For Bellman Ford's Algorithm in undirected graph, there shouldn't be negative edges. There is negative edge at, ${edges[i].start}-->${edges[i].end}`
              );
              return false;
            }
          }
        }
        whichalgo = "Bellman_Ford";
        runningAlgorithm(whichalgo);
      }
    });
  document
    .getElementById("stepAlgorithm")
    .addEventListener("click", stepUpdater);
  document
    .getElementById("exitAlgorithm")
    .addEventListener("click", exitSimulation);

  document
    .getElementById("undirectedButton")
    .addEventListener("click", function () {
      console.log("Undirected Graph");
      stateChoosen = "Undirected";

      document.getElementById("udSpan").innerHTML =
        '<i class="fa-solid fa-star"></i>';
      document.getElementById("ddSpan").innerHTML = "";

      document.getElementById("directedButton").classList.remove("active");
      document.getElementById("undirectedButton").classList.add("active");
    });
  document
    .getElementById("directedButton")
    .addEventListener("click", function () {
      console.log("Directed Graph");
      stateChoosen = "Directed";

      document.getElementById("ddSpan").innerHTML =
        '<i class="fa-solid fa-star"></i>';
      document.getElementById("udSpan").innerHTML = "";

      document.getElementById("directedButton").classList.add("active");
      document.getElementById("undirectedButton").classList.remove("active");
    });

  // const myCanvas = document.getElementById("algorithm_colors");
  // const ctx = myCanvas.getContext("2d");

  // ctx.beginPath();
  // ctx.arc(15, 15, 10, 0, 2 * Math.PI);
  // ctx.fillStyle = "red";
  // ctx.fill();
  // ctx.stroke();
}

function windowResized() {
  var width = document.getElementById("canvasContainer").offsetWidth;
  var height;
  if (windowWidth < 768) {
    height = 300;
  } else {
    height = 480;
  }
  resizeCanvas(width, height);
}

function draw() {
  background("#e7eaf6");
  stroke(0);
  strokeWeight(3);

  if (algo == "Running") {
    frameRate(24);
  } else {
    frameRate(60);
  }

  // iteratively draw edges
  for (let i = 0; i < edges.length; i++) {
    var n1 = nodes[edges[i].start];
    var n2 = nodes[edges[i].end];

    if (
      algo == "Running" &&
      ((n1.name == currentNode && n2.name == neighbourNode) ||
        (n1.name == neighbourNode && n2.name == currentNode))
    ) {
      // stroke(231, 76, 60);
      stroke(abs(231 * cos(frameCount * 0.1)), 76, 60);
      edges[i].visited = true;
    } else if (algo == "Final") {
      if (whichalgo == "Dijkstra") {
        if ((edges[i].visited = true)) {
          stroke(0);
        }
        for (let z = 0; z < shortestPath.length; z++) {
          if (
            (shortestPath[z] == n1.name && shortestPath[z + 1] == n2.name) ||
            (shortestPath[z] == n2.name && shortestPath[z + 1] == n1.name)
          ) {
            stroke(34, 153, 84);
          }
        }
      } else {
        if (edges[i].visited == true) {
          stroke(231, 76, 60);
        } else {
          stroke(0);
        }
      }
    } else if (edges[i].visited == true) {
      stroke(231, 76, 60);
    } else {
      stroke(0);
    }

    if (windowWidth > 768) {
      strokeWeight(3);
    } else {
      strokeWeight(1);
    }

    line(n1.x, n1.y, n2.x, n2.y);

    if (stateChoosen == "Directed") {
      // arrow make
      push();
      var angleOfLine = atan2(n1.y - n2.y, n1.x - n2.x);
      translate(n2.x, n2.y); // translate to end node
      rotate(angleOfLine - HALF_PI); // rotates the arrow point
      /**
       * Upper Point towards the end node is (0,22)
       * and left right point are (-4,30) and (4,30)
       */

      if (width >= 768) {
        triangle(-4, 30, 4, 30, 0, 22);
      } else {
        triangle(-4, 22, 4, 22, 0, 12);
      }

      pop();
    }

    noStroke();
    fill(0);
    // display text in the midpoint of two nodes
    text(edges[i].weight, (n1.x + n2.x) / 2, (n1.y + n2.y) / 2);
  }

  // iteratively draw nodes
  for (let i = 0; i < nodes.length; i++) {
    /**
     * If node is dragged use green-like color
     * else, use default node color
     */
    if (dist(mouseX, mouseY, nodes[i].x, nodes[i].y) < 20 && mouseIsPressed) {
      fill(159, 226, 191); // green-like color
    } else {
      if (algo == "Running" && nodes[i].name == currentNode) {
        fill(231, 76, 60); //red like color
        nodes[i].visited = true;
      } else if (algo == "Running" && nodes[i].name == neighbourNode) {
        // fill(241, 196, 15); // yellow like color
        fill(255, 255, abs(230 * cos(frameCount * 0.1)));
      } else if (algo == "Final") {
        if (whichalgo == "Dijkstra") {
          for (let z = 0; z < shortestPath.length; z++) {
            if (nodes[i].name == shortestPath[z]) {
              fill(34, 153, 84);
              nodes[i].finalpath = true;
              break;
            }
          }
        } else {
          if (nodes[i].name == sourceOfBelmanFord) {
            fill(231, 76, 60); //red like color
            nodes[i].finalpath = true;
          }
          for (let key in trackBellmanFordCosts) {
            if (trackBellmanFordCosts.hasOwnProperty(key)) {
              if (nodes[i].name == key) {
                strokeWeight(1);
                text(
                  `Cost: ${trackBellmanFordCosts[key]}`,
                  nodes[i].x,
                  nodes[i].y + 40
                );
              }
            }
          }
        }
        if (nodes[i].finalpath == false) {
          fill(255);
        }
      } else if (nodes[i].visited == true) {
        fill(226, 102, 88); // red
      } else {
        fill(255);
      }
    }
    if (windowWidth > 768) {
      stroke(0);
      strokeWeight(2);
      radius = 20;
      fontSize = 18;
    } else {
      stroke(0);
      strokeWeight(1);
      radius = 10;
      fontSize = 9;
    }

    ellipse(nodes[i].x, nodes[i].y, radius * 2, radius * 2);
    fill(0);
    textSize(fontSize);
    strokeWeight(0);
    /**
     * Align the name of nodes based on their values(single & double digit numbers)
     */
    if (windowWidth >= 768) {
      if (i < 10) {
        text(i, nodes[i].x - 5, nodes[i].y + 5);
      } else if (i >= 10) {
        text(i, nodes[i].x - 10, nodes[i].y + 5);
      }
    } else {
      if (i < 10) {
        text(i, nodes[i].x - 2.5, nodes[i].y + 3);
      } else if (i >= 10) {
        text(i, nodes[i].x - 5, nodes[i].y + 3);
      }
    }
  }

  /**
   * Update the (x,y) postion of nodes if dragged away from orginal position
   * Also limit the dragged postion to near the boundary of canvas
   * And , also limit the distance between the nodes so that they dont overlapped when dragged by incompetant user
   */
  if (draggingNode != null) {
    var tracker = draggingNode;
    var flag = 0;

    for (let i = 0; i < nodes.length; i++) {
      if (i == draggingNode) {
        continue;
      }

      if (dist(nodes[i].x, nodes[i].y, mouseX, mouseY) < radius * 2) {
        draggingNode = null;
        flag = 1;
      }
    }
    if (flag == 0) {
      if (mouseX > width - 50 || mouseX < 50) {
        tracker = draggingNode;
        draggingNode = null;
      } else {
        nodes[draggingNode].x = mouseX;
      }
      draggingNode = tracker;

      if (mouseY > height - 50 || mouseY < 50) {
        draggingNode = null;
      } else {
        nodes[draggingNode].y = mouseY;
      }
    }
  }
}

// For draggable if present within node boundary
function mousePressed() {
  for (let i = 0; i < nodes.length; i++) {
    if (dist(mouseX, mouseY, nodes[i].x, nodes[i].y) < radius) {
      draggingNode = i;
    }
  }
}

function mouseReleased() {
  draggingNode = null;
}

/**
 * Removes items from nodes and edges, also clears canvas
 */
function clearCanvas() {
  document.getElementById("myForm").style.display = "none";
  nodes = [];
  edges = [];
  clear();
  background("#e7eaf6"); // additional clear

  if (socket) {
    socket.emit("clearValues");
  }
}

function generateTable(source) {
  table =
    "<thead><tr><th>Vertex</th><th>Distance</th><th>Predecessor</th></tr></thead><tbody class='table-group-divider'>";
  nodes.forEach((node) => {
    if (node.name == source) {
      table += `<tr><td>${node.name}</td><td>0</td><td>nil</td></tr>`;
    } else {
      table += `<tr><td>${node.name}</td><td>inf</td><td>nil</td></tr>`;
    }
  });
  table += "</tbody>";
  document.getElementById("algorithmTable").innerHTML = table;
}

function stepUpdater() {
  socket.emit("step");
}

function exitSimulation() {
  console.log(edges);
  console.log(nodes);
  if (socket) {
    socket.emit("clearValues");
  }

  document.getElementById("myForm").style.display = "none";
  document.getElementById("algorithmTable").innerHTML = "";
  document.getElementById("stepAlgorithm").removeAttribute("disabled");
  document
    .getElementById("upperButtons")
    .children.forEach((child) => child.removeAttribute("disabled"));
  document
    .getElementById("stateDenoterButton")
    .children.forEach((child) => child.removeAttribute("disabled"));
  document.getElementById("stepAlgorithm").style.display = "none";
  document.getElementById("exitAlgorithm").style.display = "none";
  document.getElementById("additional-info").style.display = "none";

  // reset values of variables
  algo = "Not Running";
  currentNode = null;
  neighbourNode = null;
  shortestPath = [];
  trackBellmanFordCosts = null;

  nodes.forEach((node) => ((node.visited = false), (node.finalpath = false)));
  edges.forEach((edge) => (edge.visited = false));

  document.getElementById("messages").innerHTML = "";
  document
    .getElementById("messages")
    .classList.remove("border", "backColor", "border-2");
}
