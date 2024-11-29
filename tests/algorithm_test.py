import unittest
from Algorithms import Dijkstra, BellmanFord, Graph, DirectedGraph

g = Graph()
g.add_edge('0','1',12)
g.add_edge('0','2',3)
g.add_edge('2','1',4)


class TestDijkstraAlgorithm(unittest.TestCase):
    # For Dijkstra Algo implementation - Undirected Graph
    def test_DijkstraAlgoUndirected(self):
        self.assertEqual(Dijkstra({'0': {'1': 12, '2': 3}, '1': {'0': 12, '2': 4}, '2': {'0': 3, '1': 4}},'0'),({'0': 0, '1': 7, '2': 3}, {'0': None, '1': '2', '2': '0'}))

    # For shortest path returned by Dijkstra's Algorithm - Undirected Graph
    def test_UndirectedGraphOutputTest(self):
        self.assertEqual(g.shortest_path('0','1'),(['0','2','1']))

    # For Dijkstra Algo implementation - Directed Graph
    def test_DijktraAlgoDirected(self):
        pass

    # For shortest path returned by Dijkstra's Algorithm - Undirected Graph
    def test_DirectedGraphOutputTest(self):
        pass
    
    

if __name__ == '__main__':
    unittest.main()
