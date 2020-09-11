const grid = document.getElementById("grid");
const distances = [];
for (let i = 0; i < 20; i++) {
    distances.push([]);
    for (let j = 0; j < 20; j++) {
        distances[i].push(0);
    }
}
let clicked = false;
document.addEventListener("mousedown", function (e) {
    e.preventDefault();
    clicked = true;
});
document.addEventListener("mouseup", function () {
    clicked = false;
});
const addElementToGrid = function (i, j) {
    const element = document.createElement("div");
    element.classList = ["el"];
    element.id = i + "x" + j;
    element.addEventListener("mouseover", function () {
        element.classList.add("el--animated");
        setTimeout(() => {
            element.classList.remove("el--animated");
        }, 1000);
    });

    element.addEventListener("mouseover", function () {
        if (clicked) {
            element.classList.toggle("el--wall");
            let [col, row] = element.id.split("x");
            distances[col][row] == 0
                ? (distances[col][row] = -1)
                : (distances[col][row] = 0);
        }
    });

    element.addEventListener("mousedown", function () {
        element.classList.toggle("el--wall");
        let [col, row] = element.id.split("x");
        distances[col][row] == 0
            ? (distances[col][row] = -1)
            : (distances[col][row] = 0);
    });

    grid.appendChild(element);
};

for (let i = 0; i < 20; i++) {
    for (let j = 0; j < 20; j++) {
        addElementToGrid(i, j);
    }
}

const solveLabirynth = () => {
    const dirs = [
        [1, 0],
        [0, -1],
        [-1, 0],
        [0, 1],
    ];

    const visited = [[0, 0]];
    let timerCounter = 0;
    distances[0][0] = 1;
    while (visited.length > 0) {
        [x, y] = visited.shift();
        dirs.forEach(([dx, dy]) => {
            if (
                x + dx >= 0 &&
                x + dx < 20 &&
                y + dy >= 0 &&
                y + dy < 20 &&
                distances[x + dx][y + dy] == 0
            ) {
                distances[x + dx][y + dy] = distances[x][y] + 1;
                // let idx = x + "x" + y;
                // console.log(idx);
                // document.getElementById(idx).style.backgroundColor = "red";

                visited.push([x + dx, y + dy]);
            }
        });
    }
    const path = [];
    if (distances[19][19] > 0) {
        [x, y] = [19, 19];
        while (distances[x][y] > 1)
            dirs.forEach(([dx, dy]) => {
                if (
                    x + dx >= 0 &&
                    x + dx < 20 &&
                    y + dy >= 0 &&
                    y + dy < 20 &&
                    distances[x + dx][y + dy] == distances[x][y] - 1
                ) {
                    path.push([x + dx, y + dy]);
                    [x, y] = [x + dx, y + dy];
                }
            });
    }

    path.unshift([19, 19]);
    path.push([0, 0]);
    path.reverse().forEach(([x, y]) => {
        let idx = x + "x" + y;
        setTimeout(() => {
            document.getElementById(idx).style.backgroundColor = "yellow";
        }, 50 * timerCounter++);
    });
};

document.getElementById("solveLab").onclick = solveLabirynth;
