var STACK = [];

function valid_coordinate (width, height, row, col){
    if (row >= 0 && row < height && col >= 0 && col < width){
        return true;
    }
    return false;
}

function display(grid){
    var board = document.getElementById("board");
    for (var i = 0; i < grid.length; i++) {
        var row_div = document.createElement("div");
        row_div.className = "row";
        row_div.id = i;
        board.appendChild(row_div);
        for (var j = 0; j < grid[i].length; j++) {
            var col_div = document.createElement("div");
            col_div.id = j;
            var content;
            if (grid[i][j] == 0){
                col_div.className = "blank cell";
                content = document.createElement("span");
                content.innerHTML = " ";
            }
            else if (grid[i][j] == -1){
                col_div.className = "mine cell";
                content = document.createElement("img");
                content.src = "resources/mine.png";
            }
            else{
                col_div.className = "number cell";
                content = document.createElement("span");
                content.innerHTML = grid[i][j];                
            }
            col_div.appendChild(content);
            row_div.appendChild(col_div);
        }
    }
}

function check_neighbors(width, height, grid, i, j){
    // basecase
    if (valid_coordinate(width, height, i, j)){
        STACK.push([i,j]);
        if (grid[i][j] === 0){
            grid[i][j] = " ";

            //recursive calls
            //down
            if (valid_coordinate(width, height, i+1, j)){
                check_neighbors(width, height, grid, i+1, j);
            }

            //up
            if (valid_coordinate(width, height, i-1, j)){
                check_neighbors(width, height, grid, i-1, j);
            }

            //right
            if (valid_coordinate(width, height, i, j+1)){
                check_neighbors(width, height, grid, i, j+1);
            }

            //left
            if (valid_coordinate(width, height, i, j-1)){
                check_neighbors(width, height, grid, i, j-1);
            }
            // console.log(i-1, j-1);
            //add diagonals to stack (DUPLICATES IN LIST, UGH)
            if (valid_coordinate(width, height, i+1, j+1)){
                STACK.push([i+1, j+1]);
            }
            if (valid_coordinate(width, height, i-1, j-1)){
                STACK.push([i-1, j-1]);
            }
            if (valid_coordinate(width, height, i+1, j-1)){
                STACK.push([i+1, j-1]);
            }
            if (valid_coordinate(width, height, i-1, j+1)){
                STACK.push([i-1, j+1]);
            }
            return;
        }
        return;
    }
    return;
}

function init(width, height, mines){
    var grid = [];
    var mine_count = 0;

    for (var n = 0; n < height; n++) {
        grid.push([]);
        for (var m = 0; m < width; m++) {
            grid[n].push(0);
        }
    }

    //pick mine locations
    while (mine_count < mines) {
        var row = Math.floor(Math.random() * (height - 1));
        var column = Math.floor(Math.random() * (width - 1));
        if (grid[row][column] != -1){
            grid[row][column] = -1;

            // set numbers
            for (var i = row-1; i < row+2; i++) {
                for (var j = column-1; j < column+2; j++) {
                    if (valid_coordinate(width, height, i, j) && grid[i][j] != -1){
                        grid[i][j] ++;
                    }
                }
            }
            mine_count ++;
        }
    }
    return grid;
}

function main(width, height, mines){

    var grid = init(width, height, mines);
    display(grid);

    $('.cell').click(function(e) {
        var clicked = $('> span', this);

        if (e.shiftKey) {
            if ($('> .flag', this).attr('class') === undefined){
                var flag = document.createElement('img');//will be img
                flag.src = "resources/flag.png";
                flag.className = 'flag';
                this.appendChild(flag);
                $('> .flag', this).show();
            }
            else {
                $('> .flag', this).remove();
            }
            // console.log("flagged!");
        }
        else{
            var content = clicked.html();
            console.log(this.className);
            if ($('> .flag', this).attr('class') !== undefined){
                $('> .flag', this).remove();
            }
            if (content == 0){
                var i = $(this).parent().attr('id');
                var j = this.id;
                check_neighbors(width, height, grid, parseInt(i), parseInt(j));
            }
            if (this.className == "mine cell"){
                // if ($('.mine').children('.flag') == undefined){
                    $('.mine img').show();
                    // $('> flag', 'mine').remove();

                alert("GAMEOVER");
                // }
                $('> .flag', '.number').attr('src', 'resources/bad_flag.png');
                $('> .flag', '.blank').attr('src', 'resources/bad_flag.png');
                this.style.backgroundColor = "ff5522";
            }
            while (STACK.length > 0){
                var coords = STACK.pop();
                var row = $("#"+coords[0]+".row");
                var cell = $('> #'+coords[1], row);
                $('> span', cell).show();
                $('> .flag', cell).remove();

            }
            clicked.show();
        }
        
    });


}