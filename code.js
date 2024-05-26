const canvas = document.createElement("canvas")
canvas.width = window.innerWidth
canvas.height = window.innerHeight
const ctx = canvas.getContext("2d");
document.querySelector("body").appendChild(canvas);

const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
};
resizeCanvas();
const CELLS = 200, DEAD = 0, ALIVE = 1;
const CONFIG = {
    rows: Math.floor(CELLS / (canvas.width / canvas.height)),
    columns: CELLS,
    side: () => canvas.width / CELLS
}

const drawCells = (cells) => {
    const side = CONFIG.side()
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    for (let y = 0; y < cells.length; y++) {
        for (let x = 0; x < cells[0].length; x++) {
            if (cells[y][x]) {
                ctx.fillRect(x * side, y * side, side, side)
            }
        }
    }
}
const generateCells = ({ rows, columns } = {}) => {
    const cells = [];
    for (let y = 0; y < rows; y++) {
        cells.push([])
    }
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < columns; x++) {
            cells[y][x] = DEAD
        }
    }
    return cells;
}
const cells = generateCells(CONFIG)
drawCells(cells)

const simulate = () => {
    const die = []
    const live = []
    const rows = cells.length;
    const columns = cells[0].length;

    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < columns; x++) {
            const UP = (rows + y - 1) % rows;
            const DOWN = (rows + y + 1) % rows;
            const LEFT = (columns + x + 1) % columns;
            const RIGHT = (columns + x - 1) % columns;

            const neighbours = cells[UP][LEFT]   + cells[UP][x]   + cells[UP][RIGHT]
                             + cells[y][LEFT]                     + cells[y][RIGHT]
                             + cells[DOWN][LEFT] + cells[DOWN][x] + cells[DOWN][RIGHT];

            if (cells[y][x] === ALIVE) {
                if (neighbours < 2 || neighbours > 3) {
                    die.push([y, x]);
                }
            } else {
                if (neighbours === 3) {
                    live.push([y, x]);
                }
            }
        }
    }
    for (const [y, x] of live) {
        cells[y][x] = ALIVE;
    }

    for (const [y, x] of die) {
        cells[y][x] = DEAD;
    }
}

addEventListener("resize", (_) => {
    resizeCanvas()
    drawCells(cells);
});

addEventListener("click", (e) => {
    const side = CONFIG.side()
    const x = Math.floor(e.x / side)
    const y = Math.floor(e.y / side)

    if (cells[y] != undefined && cells[y][x] != undefined) {
        cells[y][x] = 1 - cells[y][x];
    }
    drawCells(cells);
});

addEventListener("keydown", (e) => {
    if (e.key === ' ') {
        simulate()
        drawCells(cells)
    }
    if(e.key === 'r') {
        randomize()
        drawCells(cells)
    }
    if(e.key === 'a') {
        animate()
    }
    if(e.key === 's') {
        stop = true;
    }
})

const randomize = () => {
    for (let y = 0; y < cells.length; y++) {
        for (let x = 0; x < cells[0].length; x++) {
            cells[y][x] = Math.round(Math.random())
        }
    }
    drawCells(cells)
}

let stop = false;
const animate = () => {
    simulate()
    drawCells(cells)
    if(!stop) {
        requestAnimationFrame(animate)
    } else {
        stop = false
    }
}

