class Square:
    def __init__(self, inp):
        self.inp = inp
        tmp = inp.strip().split("-")
        self.size = len(tmp)
        tmp = [list(row) for row in tmp]
        self.grid = list(map(list, zip(*tmp))) # Transpose the grid so that grid[x][y] is the letter at position (x, y)

        self.neighbors = {
            (i, j): self.get_neighbors(i, j)
            for i in range(self.size)
            for j in range(self.size)
        }

    def get_neighbors(self, i, j):
        return [
            (x, y)
            for x in range(i-1, i+2)
            for y in range(j-1, j+2)
            if 0 <= x < self.size and 0 <= y < self.size and (x, y) != (i, j)
        ]