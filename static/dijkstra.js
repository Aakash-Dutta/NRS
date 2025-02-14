function runDijkstra() {
  let source;
  let destination;

  do {
    source = prompt(`Enter source node: 0-${nodes.length - 1}`);
    if (source === null) {
      console.log("Prompt was cancelled.");
      socket.close();
      return 1;
    }
    source = parseInt(source);
  } while (isNaN(source) || source < 0 || source > nodes.length - 1);

  do {
    destination = prompt(`Enter destination node: 0-${nodes.length - 1}`);
    if (destination === null) {
      console.log("Prompt was cancelled.");
      socket.close();
      return 1;
    } else if (destination == source) {
      alert("Source and Destination are the same!!");
      socket.close();
      return 1;
    }

    destination = parseInt(destination);
  } while (
    isNaN(destination) ||
    destination < 0 ||
    destination > nodes.length - 1
  );

  generateTable(source);

  socket.emit("process_dijkstra", {
    edges: edges,
    source: source,
    destination: destination,
    state: stateChoosen,
  });
  dateInital = new Date();

  document.getElementById(
    "source-destination"
  ).innerHTML = `Source : ${source}, Destination: ${destination}`;
}
