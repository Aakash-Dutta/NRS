import unittest
from Algorithms import Dijkstra, BellmanFord, Graph, DirectedGraph

g = Graph()
g.add_edge('0','1',12)
g.add_edge('0','2',3)
g.add_edge('2','1',4)

dg = DirectedGraph()
dg.add_edge('0','1',3)
dg.add_edge('1','2',2)
dg.add_edge('2','0',2)

class TestDijkstraAlgorithm(unittest.TestCase):
    # For Dijkstra Algo implementation - Undirected Graph
    def test_DijkstraAlgoUndirected(self):
        self.assertEqual(Dijkstra({'0': {'1': 12, '2': 3}, '1': {'0': 12, '2': 4}, '2': {'0': 3, '1': 4}},'0'),({'0': 0, '1': 7, '2': 3}, {'0': None, '1': '2', '2': '0'}))

    # For shortest path returned by Dijkstra's Algorithm - Undirected Graph
    def test_UndirectedGraphOutputTest(self):
        self.assertEqual(g.shortest_path('0','1'),(['0','2','1']))

    # For Dijkstra Algo implementation - Directed Graph
    def test_DijktraAlgoDirected(self):
        self.assertEqual(Dijkstra({'0': {'1': 3}, '1': {'2': 2}, '2': {'0': 2}},'0'),({'0': 0, '1': 3, '2': 5}, {'0': None, '1': '0', '2': '1'}))

    # For shortest path returned by Dijkstra's Algorithm - Undirected Graph
    def test_DirectedGraphOutputTest(self):
        self.assertEqual(dg.shortest_path('0','2'),(['0','1','2']))

class TestBellmanAlgorithm(unittest.TestCase):
    def test_BellmanAlgoUndirected(self):
        self.assertEqual(BellmanFord({'0': {'2': 3}, '2': {'0': 3, '1': 2, '3': 3, '4': 7}, '1': {'2': 2, '5': 5}, '3': {'2': 3, '4': 4}, '4': {'3': 4, '5': 6, '2': 7}, '5': {'4': 6, '1': 5}},'0',"Undirected"),({'0': 0, '2': 3, '1': 5, '3': 6, '4': 10, '5': 10}, {'0': None, '2': '0', '1': '2', '3': '2', '4': '2', '5': '1'}))

    def test_BellmanFordDirected(self):
        self.assertEqual(BellmanFord({'0': {'2': 3}, '2': {'1': 2, '3': 3, '4': 7}, '1': {'5': 5}, '3': {'4': 4}, '4': {}, '5': {'4': 6}},'0',"Directed"),({'0': 0, '2': 3, '1': 5, '3': 6, '4': 10, '5': 10}, {'0': None, '2': '0', '1': '2', '3': '2', '4': '2', '5': '1'}))
    

if __name__ == '__main__':
    unittest.main()
