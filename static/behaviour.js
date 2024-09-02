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

function setup() {
  let canvas = createCanvas(720, 480); // global variable initiated: width = 720; height = 480;
  canvas.parent("canvasContainer");

  // Add Event listener to attach event handler to specified element
  document.getElementById("addNodeBtn").addEventListener("click", addNode);
  document
    .getElementById("myForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      validateForm();
    });
  document
    .getElementById("addEdgeBtn")
    .addEventListener("click", addEdgeViewer);
  document.getElementById("clear").addEventListener("click", clearCanvas);
  document.getElementById("dijkstra").addEventListener("click", function () {
    if (edges.length == 0) {
      alert("No Edges connected in graph");
    } else {
      runDijkstra();
    }
  });
  document
    .getElementById("stepAlgorithm")
    .addEventListener("click", stepUpdater);
  document
    .getElementById("exitAlgorithm")
    .addEventListener("click", exitSimulation);
}

function draw() {
  background(230);

  if (algo == "Running") {
    frameRate(24);
  } else {
    frameRate(60);
  }

  // iteratively draw edges
  for (let i = 0; i < edges.length; i++) {
    var n1 = nodes[edges[i].start];
    var n2 = nodes[edges[i].end];

    stroke(0);
    strokeWeight(3);
    if (
      algo == "Running" &&
      ((n1.name == currentNode && n2.name == neighbourNode) ||
        (n1.name == neighbourNode && n2.name == currentNode))
    ) {
      // stroke(231, 76, 60);
      stroke(abs(231 * cos(frameCount * 0.1)), 76, 60);
      edges[i].visited = true;
    } else if (algo == "Final") {
      for (let z = 0; z < shortestPath.length; z++) {
        if (
          (shortestPath[z] == n1.name && shortestPath[z + 1] == n2.name) ||
          (shortestPath[z] == n2.name && shortestPath[z + 1] == n1.name)
        ) {
          stroke(34, 153, 84);
        }
      }
    } else if (edges[i].visited == true) {
      stroke(231, 76, 60);
    } else {
      stroke(0);
    }

    line(n1.x, n1.y, n2.x, n2.y);

    noStroke();
    fill(0);
    // display text in the midpoint of two nodes
    text(edges[i].weight, (n1.x + n2.x) / 2, (n1.y + n2.y) / 2);
  }

  // iteratively draw nodes
  for (let i = 0; i < nodes.length; i++) {
    stroke(0);
    strokeWeight(2);

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
        for (let z = 0; z < shortestPath.length; z++) {
          if (nodes[i].name == shortestPath[z]) {
            fill(34, 153, 84);
            nodes[i].finalpath = true;
            break;
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
    ellipse(nodes[i].x, nodes[i].y, 40, 40);
    fill(0);
    textSize(18);
    strokeWeight(0);
    /**
     * Align the name of nodes based on their values(single & double digit numbers)
     */
    if (i < 10) {
      text(i, nodes[i].x - 5, nodes[i].y + 5);
    } else if (i >= 10) {
      text(i, nodes[i].x - 10, nodes[i].y + 5);
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

      if (dist(nodes[i].x, nodes[i].y, mouseX, mouseY) < 40) {
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
    if (dist(mouseX, mouseY, nodes[i].x, nodes[i].y) < 20) {
      draggingNode = i;
    }
  }
}

function mouseReleased() {
  draggingNode = null;
}

function addNode() {
  document.getElementById("myForm").style.display = "none"; // hide addEdgeViewer Form

  var x = random(50, width - 50);
  var y = random(50, height - 50);

  /**
   * Loop to check and stop overlapping between the nodes
   * 40 is the least distance to be considered between two nodes
   */
  for (var i = 0; i < nodes.length; i++) {
    let d = dist(x, y, nodes[i].x, nodes[i].y);
    if (d < 40) {
      var x = random(50, width - 50);
      var y = random(50, height - 50);
      i = 0;
    }
  }

  var valueOfNode = nodes.length;
  nodes.push({
    x: x,
    y: y,
    name: valueOfNode,
    visited: false,
    finalpath: false,
  });
}

/**
 * This function loads the form for edge submission
 * and sets paramters for max values that can be taken as inputs
 * also reset preloaded values to " "
 */
function addEdgeViewer() {
  if (nodes.length < 2) {
    alert("Only one node. Cannot add edge!!");
  } else {
    document.getElementById("myForm").style.display = "block";
    document.getElementById("err").value = "";

    document.getElementById("startNode").setAttribute("max", nodes.length - 1);
    document.getElementById("endNode").setAttribute("max", nodes.length - 1);

    document.getElementById("startNode").value = "";
    document.getElementById("endNode").value = "";
    document.getElementById("weight").value = "";
  }
}

// validates whether start is equall to end or not
// if validates passes to addEdge()
function validateForm() {
  let start = parseInt(document.getElementById("startNode").value);
  let end = parseInt(document.getElementById("endNode").value);
  let weight = parseInt(document.getElementById("weight").value);

  if (start == end) {
    document.getElementById("err").innerHTML =
      "Start node should not be equal to the end node.";
    return false;
  }
  addEdge(start, end, weight);
}

/**
 * Adds new egde between nodes
 * or updates the edge's weight between the nodes if already present
 */
function addEdge(start, end, weight) {
  let flag = 0;
  for (let i = 0; i < edges.length; i++) {
    if (edges[i].start == start && edges[i].end == end) {
      edges[i].weight = weight;
      flag = 1;
    } else if (edges[i].start == end && edges[i].end == start) {
      edges[i].weight = weight;
      flag = 1;
    }
  }
  if (flag == 0) {
    edges.push({
      start: parseInt(start),
      end: parseInt(end),
      weight: parseInt(weight),
      visited: false,
    });
  }
  document.getElementById("myForm").style.display = "none";
  document.getElementById("err").innerHTML = "";
}

/**
 * Removes items from nodes and edges, also clears canvas
 */
function clearCanvas() {
  nodes = [];
  edges = [];
  clear();
  background(230); // additional clear

  if (socket) {
    socket.emit("clearValues");
    socket.close();
  }
}

function generateTable(source) {
  table = "<tr><th>Vertex</th><th>Distance</th><th>Predecessor</th></tr>";
  nodes.forEach((node) => {
    if (node.name == source) {
      table += `<tr><td>${node.name}</td><td>0</td><td>nil</td></tr>`;
    } else {
      table += `<tr><td>${node.name}</td><td>inf</td><td>nil</td></tr>`;
    }
  });
  document.getElementById("algorithmTable").innerHTML = table;
}

function runDijkstra() {
  // clear some case if they occur
  document.getElementById("myForm").style.display = "none";
  document.getElementById("err").innerHTML = "";

  document.getElementById("stepAlgorithm").style.display = "inline";
  document.getElementById("exitAlgorithm").style.display = "inline";
  disableChild = document
    .getElementById("upperButtons")
    .children.forEach((child) => {
      child.setAttribute("disabled", "");
    });

  let source;
  let destination;
  do {
    source = parseInt(prompt(`Enter source node: 0-${nodes.length - 1}`));
  } while (isNaN(source));

  do {
    destination = parseInt(
      prompt(`Enter destination node: 0-${nodes.length - 1}`)
    );
  } while (isNaN(destination));

  generateTable(source);

  // algo variable initilized as connection is properly validated
  algo = "Running";

  socket = io();
  socket.on("connect", function () {
    console.log("Connected to server");
  });

  socket.emit("process_dijkstra", {
    edges: edges,
    source: source,
    destination: destination,
  });

  // event sent by server
  socket.on("server", function (msg) {
    console.log(msg);

    currentNode = msg.current_node;
    neighbourNode = msg.neighbor;

    if (msg.data == "Stop") {
      console.log("Closed Connection");
      document.getElementById("stepAlgorithm").setAttribute("disabled", "");
      shortestPath = msg.path;
      if (shortestPath.length == 0) {
        document.getElementById("messages").innerHTML =
          "No link to destination";
      }
      console.log(shortestPath);
      algo = "Final";
      socket.close();
    } else {
      var previousTable = document.getElementById("algorithmTable");
      previousTable
        .querySelector("tbody")
        .children.forEach((child) => child.classList.remove("table-active"));

      for (let i = 0; i < nodes.length; i++) {
        if (msg.pre[i] == null) {
          msg.pre[i] = "nil";
        }
        currentRow = previousTable.rows[i + 1];

        cellDistance = previousTable.rows[i + 1].cells[1];
        cellPredecessor = previousTable.rows[i + 1].cells[2];

        previousData = cellDistance.lastChild.textContent;
        if (previousData != msg.dist[i]) {
          // For unconncted node
          if (msg.dist[i] == null) {
            continue;
          }

          previousBlock = document.createElement("span");
          previousBlock.classList.add("text-decoration-line-through");
          previousBlock.textContent = "  " + cellDistance.textContent;

          previousPre = document.createElement("span");
          previousPre.classList.add("text-decoration-line-through");
          previousPre.textContent = "  " + cellPredecessor.textContent;

          cellDistance.textContent = "";
          cellPredecessor.textContent = "";

          cellDistance.appendChild(previousBlock);
          cellPredecessor.appendChild(previousPre);

          var newBlock = document.createElement("span");
          newBlock.textContent = `  ${msg.dist[i]}`;
          cellDistance.appendChild(newBlock);

          var newPre = document.createElement("span");
          newPre.textContent = `  ${msg.pre[i]}`;
          cellPredecessor.appendChild(newPre);

          // highlight row
          currentRow.classList.add("table-active");
        }
      }
    }
  });

  socket.on("disconnect", function (reason, details) {
    console.log("Disconnected from server");
    console.log(reason);
  });
}

function stepUpdater() {
  socket.emit("step");
}

function exitSimulation() {
  if (socket) {
    socket.emit("clearValues");
    socket.close();
  }

  document.getElementById("algorithmTable").innerHTML = "";
  document.getElementById("stepAlgorithm").removeAttribute("disabled");
  document
    .getElementById("upperButtons")
    .children.forEach((child) => child.removeAttribute("disabled"));
  document.getElementById("stepAlgorithm").style.display = "none";
  document.getElementById("exitAlgorithm").style.display = "none";

  // reset values of variables
  algo = "Not Running";
  currentNode = null;
  neighbourNode = null;
  shortestPath = [];

  nodes.forEach((node) => ((node.visited = false), (node.finalpath = false)));
  edges.forEach((edge) => (edge.visited = false));

  document.getElementById("messages").innerHTML = "";
}
