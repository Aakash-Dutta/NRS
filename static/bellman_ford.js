function runBellmanFord() {
  let source;
  do {
    source = prompt(`Enter source node: 0-${nodes.length - 1}`);
    if (source === null) {
      console.log("Prompt was cancelled.");
      socket.close();
      return 1;
    }
    source = parseInt(source);
  } while (isNaN(source) || source < 0 || source > nodes.length - 1);

  generateTable(source);
  sourceOfBelmanFord = source; // to highlight the souce node at end

  socket.emit("process_bellmanFord", {
    edges: edges,
    source: source,
    state: stateChoosen,
  });
  dateInital = new Date();

  document.getElementById(
    "source-destination"
  ).innerHTML = `Source : ${source}`;
}
