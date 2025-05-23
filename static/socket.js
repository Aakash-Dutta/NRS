function runningAlgorithm(whichalgo) {
  var r_value; // return type for algorithm to check whether the prompt was cancelled
  document.getElementById("myForm").style.display = "none";
  document.getElementById("err").innerHTML = "";

  // algo variable initilized as connection is properly validated
  algo = "Running";

  socket = io();
  socket.on("connect", function () {
    console.log("Connected to server");
  });

  if (whichalgo == "Dijkstra") {
    r_value = runDijkstra();
  } else if (whichalgo == "Bellman_Ford") {
    r_value = runBellmanFord();
  }

  if (r_value == 1) {
    algo = "Not Running";
  }

  if (r_value != 1) {
    // show adjacency list in UI
    socket.on("server_adjmessage", function (adjacency_list) {
      console.log(adjacency_list);
      document.getElementById("adjmessage").innerHTML =
        "<p class='h3'>Adjacency List</p>";
      var adjacency_list_value;
      for (let node in adjacency_list.graph) {
        adjacency_list_value = ` "${node}" : ${JSON.stringify(
          adjacency_list.graph[node]
        )}`;
        document.getElementById("adjmessage").innerHTML +=
          adjacency_list_value + "<br>";
      }
    });
    document.getElementById("adjmessage").style.display = "block";

    document.getElementById("stepAlgorithm").style.display = "inline";
    document.getElementById("exitAlgorithm").style.display = "inline";
    disableChild = document
      .getElementById("upperButtons")
      .children.forEach((child) => {
        child.setAttribute("disabled", "");
      });

    document.getElementById("stateDenoterButton").children.forEach((child) => {
      child.setAttribute("disabled", "");
    });

    document.getElementById("additional-info").style.display = "block";
  }

  socket.on("server", function (msg) {
    console.log(msg);

    currentNode = msg.current_node;
    neighbourNode = msg.neighbor;

    if (msg.data == "Stop") {
      console.log("Closed Connection");
      document.getElementById("stepAlgorithm").setAttribute("disabled", "");

      if (whichalgo == "Dijkstra") {
        shortestPath = msg.path;
        if (shortestPath.length == 0) {
          alert("No link to destination");
          document.getElementById("messages").innerHTML =
            "No link to destination";
          document
            .getElementById("messages")
            .classList.add("border", "border-2", "backColor");
        }
        console.log(shortestPath);
      }

      if (whichalgo == "Bellman_Ford") {
        flag = 0;
        for (let i = 0; i < edges.length; i++) {
          if (sourceOfBelmanFord == edges[i].start) {
            flag = 1;
            break;
          }
          if (sourceOfBelmanFord == edges[i].end) {
            flag = 1;
            break;
          }
        }
        if (flag == 0) {
          alert("No link from source");
          document.getElementById("messages").innerHTML = "No link from source";
          document
            .getElementById("messages")
            .classList.add("border", "border-2", "backColor");
        }
      }
      algo = "Final";
      socket.close();

      dateFinal = new Date();
      console.log(
        "Simulation execution time: " + (dateFinal - dateInital) / 1000 + " sec"
      );
      document.getElementById(
        "user_execution_time"
      ).innerHTML = `User Simulation Time: ${
        (dateFinal - dateInital) / 1000
      } sec`;
      document.getElementById(
        "algo_execution_time"
      ).innerHTML = `Algorithm Execution Time: ${algo_execution_duration}`;
    } else {
      trackBellmanFordCosts = msg.dist; // used when the final step is returned: tracks the cost

      var previousTable = document.getElementById("algorithmTable");
      previousTable
        .querySelector("tbody")
        .children.forEach((child) =>
          child.classList.remove("table-active", "table-info")
        );

      for (let i = 0; i < nodes.length; i++) {
        if (msg.pre[i] == null) {
          msg.pre[i] = "nil";
        }

        // To track the final total cost for dijkstra
        if (i == destinationOfDijkstra) {
          trackDijkstraCosts = msg.dist[i];
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
          currentRow.classList.add("table-active", "table-info");
        }
      }
    }
  });
  socket.on("exec_time", function (msg) {
    console.log("Execution Time: " + msg.time);
    algo_execution_duration = msg.time;
  });

  socket.on("server_negCycle", function (msg) {
    console.log(msg);
    alert("Negative Cycle");
    document.getElementById("messages").innerHTML = "Negative Cycle";
    document
      .getElementById("messages")
      .classList.add("border", "border-2", "backColor");
    document.getElementById("stepAlgorithm").setAttribute("disabled", "");
    algo = "Final";
    socket.emit("clearValues");
  });

  socket.on("disconnect", function (reason, details) {
    console.log("Disconnected from server");
    console.log(reason);
  });
}
