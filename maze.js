const board = [];
let current;
const stack = [];
let globalRun;


// Y axis, switching between rows
// let rows = 50;
// X axis, switching beween columns
// let cols = 50;

boardState = {
    cols: null,
    rows: null,
    xStart: null,
    yStart: null
};

function setState() {
    // Option to set things together from inputs.
    // cols: $('#colSet').val() || 25,
    // rows: $('#rowSet').val() || 25,
    const rows = $('#rowSet').val() || 25;
    const cols = $('#colSet').val() || 25;
    const yStart = Math.floor(Math.random() * rows);
    const xStart = Math.floor(Math.random() * cols);

    boardState.cols = cols;
    boardState.rows = rows;
    boardState.xStart = xStart;
    boardState.yStart = yStart;
}

function setCurrent() {
    current = board[boardState.yStart][boardState.xStart];
    current.highlight = true
}

function createBoard() {
    board.splice(0, board.length)
    for(let  y= 0; y < boardState.rows; y++) {
    // Create the setup of the arrays right off the bat
    // render will just read the board
    const row = new Array();
    
    // row.fill({'box': [true, true, true, true]});
    for(let x=0; x < boardState.cols; x++) {
        const cell = {
            'box': [true, true, true, true],
            'coord': [y , x],
            'visited': false,
            'highlight': false,
        };
        row.push(cell);
    }
    board.push(row);
    }
}

function renderBoard() {
    $('#board').empty()
    board.forEach((row) => {
        const newRow = $(`<div class='row'></div>`);
        row.forEach((col) => {
            // Lines for boxes by index - Top[0], Right[1], Bottom[2], left[3]
            const column = $(`
                <div class='cell 
                    ${col.highlight ? 'highlight' : ''}
                    ${col.visited ? 'visited' : ''}
                    ${col.box[0] ? 'top' : 'tw'} 
                    ${col.box[1] ? 'right' : 'rw'} 
                    ${col.box[2] ? 'bottom' : 'bw'} 
                    ${col.box[3] ? 'left' : 'lw'}'>
                </div>`);
            newRow.append(column);
        });
        $('#board').append(newRow)
    })
}

function draw() {
    current.visited = true;
    current.highlight = true;
    // Check sides to see what has or has not been visited
    const next = checkSides(current);
    if(next) {
        next.visited = true;
        // Save the current cell into stack history
        current.highlight = false;
        stack.push(current);
        boardState.count++
        // Remove the sides dependent upon where they are
        // in relation to each other
        removeSides(current, next)
        // The next item becomes the current cell
        current = next
    } else if(stack.length > 0){
        current.highlight = false;
        current = stack.pop();
        boardState.count--
    } else {
        globalRun = null;
    }

    current.highlight = true;
}

function checkSides(current) {

    const y = current.coord[0];
    const x = current.coord[1];

    const neighbors = [];

    const top = coord(y - 1, x);
    const right = coord(y, x + 1);
    const bottom = coord(y + 1, x);
    const left = coord(y, x -1);

    if(top && !top.visited){
        neighbors.push(top)
    };
    if(right && !right.visited){
        neighbors.push(right)
    };
    if(bottom && !bottom.visited){
        neighbors.push(bottom)
    };
    if(left && !left.visited){
        neighbors.push(left)
    };

    if(neighbors.length > 0){
        const cell = Math.floor(Math.random() * neighbors.length);
        return neighbors[cell];
    } else {
        return undefined;
    }
}

function coord(y, x){
    if(x < 0 || y < 0 || x > boardState.cols - 1 || y > boardState.rows - 1) {
        return undefined
    }
    return board[y][x]
}

function removeSides(a, b) {
    const x = a.coord[1] - b.coord[1];
    
    if (x === 1) {
        a.box[3] = false;
        b.box[1] = false;
    } else if (x === -1) {
        a.box[1] = false;
        b.box[3] = false;
    }

    const y = a.coord[0] - b.coord[0];

    if (y === 1) {
        a.box[0] = false;
        b.box[2] = false;
    } else if (y === -1) {
        a.box[2] = false;
        b.box[0] = false;
    }
}

const fps = 15;

function tick(timestamp) {
    setTimeout(function() {
        draw();
        renderBoard();
        globalRun = requestAnimationFrame(tick);
    }, 1000/fps)
}

$('#board').on('click', '.cell', function({target}) {
    console.log($(target))
})

$('#tick').click(function() {
    draw();
    renderBoard();
});

$('#startRun').click(function() {
    globalRun = requestAnimationFrame(tick)
});

$('#pauseRun').click(function() {
    cancelAnimationFrame(globalRun);
});

$('#newMaze').click(function() {
    setState();
    createBoard();
    setCurrent();
    renderBoard();
})

// Option to change size of maze
// $('#colSet').on('change', function() {
//     createBoard();
//     renderBoard();
// })

// $('#rowSet').on('change', function() {
//     createBoard();
//     renderBoard();
// })

$('form').submit(function(event) {
    event.preventDefault();
    boardState.cols = $('#colSet').val();
    boardState.rows = $('#rowSet').val();
    setState();
    createBoard();
    setCurrent();
    renderBoard();
});

setState()
createBoard();
setCurrent();
renderBoard();

