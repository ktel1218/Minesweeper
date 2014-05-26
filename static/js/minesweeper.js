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

    var contextMenu = document.oncontextmenu;
    var mouseDownCell;
    // Hide context menu
    $('.cell').on('mousedown', function(e) {
        if (e.button !== 2) return true;
        e.preventDefault();
        document.oncontextmenu = function() {return false;};
        mouseDownCell = e.target;
    });

    // Restore context menu
    $('body').on('mouseup', function(e) {
        if (e.button !== 2) return true;
        e.preventDefault();
        document.oncontextmenu = contextMenu;
        if (e.target === mouseDownCell) {
            $(e.target).trigger({ type: 'click', flag: true })
        }
    });

    $('.cell').click(function(e) {
        var clicked = $('> span', this);

        //if shift clicking, place flag. If flagged, remove flag
        if (e.shiftKey || e.flag) {
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
            meow();

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
                $('#alert').html("MINES CLEARED. MEOW!!!");
                $('#alert').css('color', '0066ff');
                GAMEOVER = true;
            }
        }
    });

    function meow () {
      function empty(cell) {
        cell = $(cell);
        return cell.hasClass('blank') &&
          cell.css('backgroundColor') === "rgb(255, 255, 255)";
      }

      // Prepare a shadow grid where each cell is true if it's empty and can
      // fit a cat
      var grid = [];
      $("#board .row").each(function (y, row) {
        grid.push([]);
        $(row).children().each(function (x, cell) {
          grid[y].push( empty(cell) );
        });
      });

      function Image (top, left, width, height) {
        this.top = top;
        this.left = left;
        this.width = width;
        this.height = height;
      }
      Image.prototype.fits = function () {
        var self = this;
        // Look at every cell the image covers, make sure they're all empty
        return grid.every(function (row, y) {
          // filter out rows the image doesn't cover
          if (y < self.top || y >= self.top + self.height) {
            return true;
          }
          return row.every(function (cell, x) {
            // filter out cells/columns the image doesn't cover
            if (x < self.left || x >= self.left + self.width) {
              return true;
            }
            return cell;
          });
        });
      };
      Image.prototype.notOverlap = function (otherImages) {
        var self = this;
        return otherImages.every(function (image) {
          return  self.left + self.width <= image.left ||
                  image.left + image.width <= self.left ||
                  self.top + self.height <= image.top ||
                  image.top + image.height <= self.top;
        });
      };
      Image.prototype.area = function () {
        return this.width * this.height;
      };

      var images = [];
      // Try every possible image size and position, see what fits
      for (var height = grid.length; height > 1; height--) {
        for (var width = grid[0].length; width > 1; width--) {
          for (var top = 0; top <= grid.length - height; top++) {
            for (var left = 0; left <= grid[0].length - width; left++) {
              image = new Image(top, left, width, height);
              if ( image.fits() ) {
                images.push(image);
              }
            }
          }
        }
      }

      // Sort the found images from largest to smallest (by area)
      images.sort(function (a, b) {
        return b.area() - a.area();
      });

      var finalImages = [];
      // Add each image to the list of final images to be drawn, as long as
      // it does not overlap one in that list
      images.forEach(function (image, index) {
        // Does this image overlap existing images that have been added?
        if ( image.notOverlap(finalImages) ) {
          finalImages.push(image);
        }
      });

      $('.meow').remove();
      function color () {
        return Math.floor(Math.random() * 255);
      }
      function kitten (width, height) {
        return 'http://placekitten.com/' + width + '/' + height;
      }
      finalImages.forEach(function (image) {
        var width = image.width * 21 - 1;
        var height = image.height * 21 - 1;
        $('<div style="position: absolute;"></div>')
          .addClass('meow')
          .css('width', width)
          .css('height', height)
          .css('top', image.top * 21)
          .css('left', image.left * 21)
          .css('backgroundColor', 'rgb(' + color() + ',' + color() + ',' + color() + ')')
          .css('backgroundImage', 'url(' + kitten(width, height) + ')')
          .appendTo('#board');
      });
    }
}
