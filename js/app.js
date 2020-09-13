const nRows = 40;
const nCols = 40;
const grid = document.getElementById("grid");
const distances = [];

// Poniższe 8 linijek zapewnia, że zmienna
// "clicked" będzie przyjmować "true", gdy lewy przycisk
// myszy będzie wcisnięty (co zapewnia pierwszy z eventListenerów)
// i "false" w przeciwnym wypadku (o co zadba drugi z eventListenerów)
// niezależnie od miejsca, w którym kliknięcie zostanie wykonane,
// gdyż element 'document' zajmuje powierzchnię całej strony.
let clicked = false;
document.addEventListener("mousedown", function (e) {
    e.preventDefault();
    clicked = true;
});
document.addEventListener("mouseup", function () {
    clicked = false;
});

const addElementToGrid = function (i, j) {
    // Funkcja dodająca element (jeden z tych kilkuset małych kwadracików)
    // do elementu o klasie .grid.
    // Przyjmuje ona dwa argumenty, nazwane 'i' oraz 'j',
    // podobnie do zmiennych użytych w zagnieżdżonej pętli,
    // w której w późniejszej części skryptu dana funkcja będzie
    // wywoływana.
    // Tworząc element z poziomu JavaScriptu, musimy kolejno:
    // 1. utworzyć element i dodać go do zmiennej, np 'element',
    //    za pomocą metody .createElement
    // 2. przypisać odpowienie klasy, potrzebne do ostylowania oraz unikalne id,
    //    którego będziemy używać do modyfikacji poszczególnych kwadracików
    //    w gridzie
    // 3. przypisać eventListenery, jeśli możemy to zrobić w momencie
    //    deklaracji elementu, gdyż mamy od razu zmienną,
    //    na której można wywołąć metodę .addEventListener
    // 4. gdy już mamy gotowy element, dodajemy go do elementu rodzica
    //    o klasie .grid. Elementy te będą zajmować w gridzie
    //    pierwsze wolne miejsce, więc nie musimy się martwić o ręczne
    //    przypisywanie im konkretnego miejsca, np. za pomocą
    //    grid-column, czy grid-row. Same ułożą się tak, jak powinny.

    // Ad 1 - utworznie elementu o tagu div i przypisanie go do zmiennej:
    const element = document.createElement("div");

    // Ad 2 - przypisanie klas i id do elementu:
    element.classList = ["el"];
    element.id = i + "x" + j;

    // Ad 3, event listenery:
    element.addEventListener("mouseover", function () {
        // ten eventListener dodaje animację do każdego elementu,
        // na który najedziemy myszką. Animacja zdefiniowana jest w
        // pliku .scss, a dodajemy ją poprzez dodanie klasy
        // do konkretnego elementu, po czym po zakończeniu animacji,
        // czyli po jednej sekundzie (1000ms), usuwamy klasę

        element.classList.add("el--animated");
        setTimeout(() => {
            element.classList.remove("el--animated");
        }, 1000);
    });

    element.addEventListener("mouseover", function () {
        // ten eventListener służy do "rysowania ścian".
        // Na wstępie sprawdzany jest stan zmiennej "clicked",
        // (jeśli w if-ie nie ma znaku porównania ani drugiej
        // wartości do porownania, domyślnie przypisywane jest
        // porównanie do wartościu "true". Zapis ten jest więc
        // równoznaczny z: 'if (clicked === true) { ... }'),
        // przyjmującej wartośći "true" - jeśli lewy przycisk
        // myszy jest wsićnięty, i "false", gdy nie jest wciśnięty.
        // Dzięki temu, machając z wciśniętą myszką po gridzie, możemy
        // rysować ściany pod kursorem (bądź je zdejmować, gdy
        // najedziemy na element już będący ścianą - dzięki metodzie
        // .toggle)

        if (clicked) {
            element.classList.toggle("el--wall");
            distances[i][j] == 0
                ? (distances[i][j] = -1)
                : (distances[i][j] = 0);
        }
    });

    element.addEventListener("mousedown", function () {
        // Poprzedni eventListener powodował, że najeżdzając
        // z wcisniętą myszką na element, zmieniał się on w
        // ścianę. Jednak nie zmieniał się on w przypadku, gdy mając
        // juz myszkę na elemencie dopiero wciskaliśmy myszkę.
        // Ten eventListener naprawia ten "bug", powodując, ze
        // metoda .toggle zostanie wywołana także przy
        // wkliknięciu.

        element.classList.toggle("el--wall");
        distances[i][j] == 0 ? (distances[i][j] = -1) : (distances[i][j] = 0);
    });

    // Ad 4 - dodanie 'element' do grida za pomocą .appendChild
    grid.appendChild(element);
}; // koniec funkcji addElementToGrid :)

document.addEventListener("touchmove", function (e) {
    e.preventDefault();
    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    const [col, row] = element.id.split("x");
    element.classList.toggle("el--wall");
    distances[col][row] == 0
        ? (distances[col][row] = -1)
        : (distances[col][row] = 0);
});

const createGrid = () => {
    for (let i = 0; i < nRows; i++) {
        distances.push([]);
        for (let j = 0; j < nCols; j++) {
            distances[i].push(0);
            addElementToGrid(i, j);
        }
    }
};

const solveLabirynth = () => {
    const dirs = [
        [1, 0],
        [0, -1],
        [-1, 0],
        [0, 1],
    ];
    let timerCounter = 0;
    const visited = [[0, 0]];
    distances[0][0] = 1;
    while (visited.length > 0) {
        [x, y] = visited.shift();
        dirs.forEach(([dx, dy]) => {
            if (
                x + dx >= 0 &&
                x + dx < nRows &&
                y + dy >= 0 &&
                y + dy < nCols &&
                distances[x + dx][y + dy] == 0
            ) {
                const distance = distances[x][y] + 1;
                distances[x + dx][y + dy] = distance;
                const element = document.getElementById(
                    x + dx + "x" + (y + dy)
                );
                setTimeout(() => {
                    if (element.style.backgroundColor === "")
                        element.style.backgroundColor = "green";

                    element.innerText = distance;
                }, 3 * timerCounter++);
                visited.push([x + dx, y + dy]);
            }
        });
    }
let anotherTimer = 0
    const path = [[nRows - 1, nCols - 1]];
    if (distances[nRows - 1][nCols - 1] > 0) {
        [x, y] = [nRows - 1, nCols - 1];
        while (distances[x][y] > 1)
            dirs.forEach(([dx, dy]) => {
                if (
                    x + dx >= 0 &&
                    x + dx < nRows &&
                    y + dy >= 0 &&
                    y + dy < nCols &&
                    distances[x + dx][y + dy] == distances[x][y] - 1
                ) {
                    path.push([x + dx, y + dy]);
                    [x, y] = [x + dx, y + dy];
                    // todo: zmienić tło elementu na 
                    // !! Ważne
                    // setTimeout(() => {
                    //     document.getElementById((x + dx) + 'x' + (y + dy)).style.backgroundColor = "yellow";
                    // }, 3 * timerCounter + 100 * (index + 1));
                }
            });
    }
    path.push([0, 0]);

    path.forEach(([x, y], index) => {
        const id = x + "x" + y;
        setTimeout(() => {
            document.getElementById(id).style.backgroundColor = "yellow";
        }, 3 * timerCounter + 20 * (index + 1));
    });
};

const resetDistances = () => {
    // pętla w pętli, w której przechodzimy po każdym
    // z elementów i usuwamy dodane stylowanie
    // oraz w tablicy distances dla każdego elementu
    // niebędącego ścianą ustawiamy odległość od punktu startowego
    // na 0
    for (let i = 0; i < nRows; i++) {
        for (let j = 0; j < nCols; j++) {
            let idx = i + "x" + j;
            document.getElementById(idx).style.backgroundColor = "";
            document.getElementById(idx).innerText = "";
            if (distances[i][j] > 0) {
                distances[i][j] = 0;
            }
        }
    }
    path = [];
};

const clearWalls = () => {
    // pętla w pętli, za pomocą której szukamy elementów będących
    // ścianami, czyli mającymi w druwymiarowej tablicy "distances"
    // wpisaną wartość -1. Następnie przypisujemy im wartość 0
    // i usuwamy klasę "el--wall", powodując, że z grida znikają
    // wszystkie ściany

    for (let i = 0; i < nRows; i++) {
        for (let j = 0; j < nCols; j++) {
            if (distances[i][j] === -1) {
                distances[i][j] = 0;
                // z pomocą obecnych wartości 'i' oraz 'j'
                // tworzymy zmienną zawierającą element o odpowiednim
                // id, dzięki czemu możemy usunąć z tego elementu klasę.
                const wall = document.getElementById(i + "x" + j);
                wall.classList.remove("el--wall");
            }
        }
    }
};

// Na sam koniec po prostu tworzymy grid
//  i dodajemy eventListenery do przycisków, kuniec
createGrid();
document.getElementById("solveLab").onclick = solveLabirynth;
document.getElementById("resetDistances").onclick = resetDistances;
document.getElementById("clearWalls").onclick = clearWalls;
