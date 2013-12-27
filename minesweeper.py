import random
# minesweeper

def valid_coordinate(width, height, row, col):
    if row >= 0 and row < height and
    col >= 0 and col < width:
def cell_number(row, col):
    ...
    
def main(width,height,mines):
    grid = []
    mine_rows = []
    mine_columns = []
    for row in range(height):
        grid.append([0]*width)
    
    # picked mine locations
    for i in range(mines):
        row = random.randint(0, height-1)
        column = random.randint(0, width-1)
        mine_rows.append(row)
        mine_columns.append(column)
        grid[row][column] = "*"

    # place mines in proper locations

    for i in range(len(grid)):
        for j in range(len(grid[i])):
            grid[i][j] = cell_number(i, j)

            # if valid_coordinate(i+1, j) and grid[i + 1][j] == "*":
            # if grid[i - 1][j] == "*":

    build(grid)
    

main(5,6,3)