const canvas = document.createElement("canvas")
canvas.width = 1 << 10
canvas.height = 1 << 10
const ctx = canvas.getContext("2d");
document.querySelector("body").appendChild(canvas);

const offscreen = document.createElement("canvas")
offscreen.width = canvas.width
offscreen.height = canvas.height
const ctxOffScreen = offscreen.getContext("2d");

const CELLS = 1 << 10
const DEAD = 0;
const ALIVE = 1;

const ROWS = CELLS;
const COLS = CELLS;

const ROWS_MASK = ROWS - 1
const COLS_MASK = COLS - 1

const SIZE = ROWS * COLS;
const SIDE = Math.floor(canvas.width / CELLS);
const SHIFT_AMT = Math.log2(COLS)

if ((ROWS & (ROWS - 1)) !== 0 || (COLS & (COLS - 1)) !== 0) {
    throw new Error("Rows or Cols need to be power of 2");
}

const NEIGHBOUR_COUNT = new Uint8Array(SIZE);

const simulate = (aliveCells) => {
    drawCells(aliveCells);

    for (const packed of aliveCells) {
        const x = ((packed >> 16) & 0xFFFF) + ROWS;
        const y = (packed & 0xFFFF) + COLS;
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                if (dx !== 0 || dy !== 0) {
                    const nx = (x + dx) & ROWS_MASK;
                    const ny = (y + dy) & COLS_MASK;
                    const index = (nx * COLS) + ny;
                    NEIGHBOUR_COUNT[index]++;
                }
            }
        }
    }

    const newLiveCells = new Set();
    for (let i = 0; i < SIZE; i++) {
        const count = NEIGHBOUR_COUNT[i];
        if(count === 3) {
            const x = i >> SHIFT_AMT;
            const y = i & COLS_MASK;
            const packed = (x << 16) | y;
            newLiveCells.add(packed)
        } else if(count === 2) {
            const x = i >> SHIFT_AMT;
            const y = i & COLS_MASK;
            const packed = (x << 16) | y;
            if(aliveCells.has(packed)) {
                newLiveCells.add(packed)
            }
        }
    }

    NEIGHBOUR_COUNT.fill(0)
    return newLiveCells;
}

const drawCells = (liveCells) => {
    ctxOffScreen.clearRect(0, 0, offscreen.width, offscreen.height);
    ctxOffScreen.beginPath();
    for (const packed of liveCells) {
        const x = (packed >> 16) & 0xFFFF;
        const y = packed & 0xFFFF; 
        ctxOffScreen.rect(x * SIDE, y * SIDE, SIDE, SIDE);
    }
    ctxOffScreen.fill();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(offscreen, 0, 0);
}

class Xorshift {
    constructor() {
        this.seed = 1722975432744;
    }
    random() {
        let x = this.seed;
        x ^= x << 13;
        x ^= x >> 17;
        x ^= x << 5;
        this.seed = x;
        return (x >>> 0) / 0xFFFFFFFF;
    }
}


function getInitialCells() {
    const cells = new Set();
    const rng = new Xorshift();
    for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
            if (rng.random() > 0.3) {
                const packed = (x << 16) | y;
                cells.add(packed);
            }
        }
    }
    return cells;
}

let liveCells = getInitialCells();
function tick() {
    liveCells = simulate(liveCells)
    requestAnimationFrame(tick)
}
tick()

