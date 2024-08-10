from flask import Flask, render_template, request, jsonify
from flask_socketio import SocketIO, send, emit
from Algorithms import *


app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

@app.route("/")
def index():
    return render_template('index.html')

@socketio.on('connect')
def handle_connect():
    print("Connected")

@socketio.on('disconnect')
def handel_disconnect():
    print("Disconnected")

@socketio.on('process_dijkstra')
def handle_dijkstra(data):
    print(data)
    G = Graph()

    for edge in data:
        start = edge["start"]
        end = edge["end"]
        weight = edge["weight"]
        G.add_edge(str(start), str(end), weight)
    print(G.shortest_path("0","1"))

if __name__ == '__main__':
    socketio.run(app, allow_unsafe_werkzeug=True)