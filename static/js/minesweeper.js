var STACK = {};
var GAMEOVER = false;

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
                content.src = "resources/transparent/mine.png";
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
        STACK[[i, j]] = [i, j];
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
                STACK[[i+1, j+1]] = [i+1, j+1];
            }
            if (valid_coordinate(width, height, i-1, j-1)){
                STACK[[i-1, j-1]] = [i-1, j-1];
            }
            if (valid_coordinate(width, height, i+1, j-1)){
                STACK[[i+1, j-1]] = [i+1, j-1];
            }
            if (valid_coordinate(width, height, i-1, j+1)){
                STACK[[i-1, j+1]] = [i-1, j+1];
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
    var total =  width * height;
    var touched = {};

    function get_size(obj) {
        var size = 0, key;
        for (key in obj){
            if (obj.hasOwnProperty(key)) size ++;
        }
        return size;
    };

    display(grid);

    $('.cell').click(function(e) {
        var clicked = $('> span', this);

        //if shift clicking, place flag. If flagged, remove flag
        if (e.shiftKey) {
            if ($('> .flag', this).attr('class') === undefined){
                var flag = document.createElement('img');//will be img
                flag.src = "resources/transparent/flag.png";
                flag.className = 'flag';
                this.appendChild(flag);
                $('> .flag', this).show();
            }
            else {
                $('> .flag', this).remove();
            }
        }
        // if regular click, and if square isn't flagged, and if not gameover
        else if ($('> .flag', this).attr('class') == undefined && !GAMEOVER){

            var content = clicked.html();
            var i = parseInt($(this).parent().attr('id'));
            var j = parseInt(this.id);
            STACK[[i, j]] = [i, j];
            
            if (content == 0){
                
                check_neighbors(width, height, grid, i, j);
            }
            
            for (key in STACK){
                var coords = STACK[key];
                touched[key] = STACK[key];
                delete STACK[key];
                var row = $("#"+coords[0]+".row");
                var cell = $('> #'+coords[1], row);
                $('> #'+coords[1], row).css('background-color', '#ffffff');
                $('> span', cell).show();
                $('> .flag', cell).remove();

            }
            this.style.backgroundColor = "ffffff";

            if (this.className == "mine cell"){
                $('.mine').each(function(i){
                    if ($('> .flag', this).attr('class') === undefined){
                        $('img', this).show();
                    }
                });

                $('> .flag', '.number').attr('src', 'resources/transparent/bad_flag.png');
                $('> .flag', '.blank').attr('src', 'resources/transparent/bad_flag.png');
                this.style.backgroundColor = "ff5522";
                GAMEOVER = true;
                $('#alert').html("GAME OVER");
            }
            else if (total - get_size(touched) == mines){
                $('#alert').html("MINES CLEARED");
                $('#alert').css('color', '0066ff');
                GAMEOVER = true;
            }
        }
    });
}