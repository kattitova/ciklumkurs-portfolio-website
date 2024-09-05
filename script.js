//число ходів
let countMove = 0;
// массив для чисел таблиці
let tableArr = new Array();

//змінна, що відповідає за статус гри
let gameStatus = "new"; //new || winning || nonwinner

const gameHeader = document.querySelector(".game-header");

//генерує числа 0..1 для заповнення тега select
const select = document.querySelector(".first-number");
//ховає блок із гравцями та прикладом, щоб гравець заново натиснув кнопку Почати гру
const gameInfoBlock = document.querySelector(".game-info-block");
select.addEventListener("change", () => {
    gameInfoBlock.classList.add("hidden");
});

for (let i = 1; i <= 10; i++) {
    let option = document.createElement("option");
    option.setAttribute("value", i);
    option.innerHTML = i;
    select.appendChild(option);
}

//генерує рандомні значення чисел кратних обраному Першому числу гри
function rand(min,max,num){
    return Math.floor(Math.floor(Math.random()*(max-min+1)+min) / num) * num;
}

//генерує значення від 1 до 10
function randSecondNumber() {
    return 1 + Math.floor(Math.random() * 10);
}

const size = 6; //розмір ігрового поля 6х6

//селектор другого числа
const secondNumber = document.querySelector(".number-block.second");

//функція додати аудио
function addAudio (src) {
    const myAudio = new Audio(src);
    myAudio.play();
}

function setActivePlayer(num) {
    //прибирає клас active з обох гравців
    const players = document.querySelectorAll(".game-player");
    [...players].map(player => player.classList.remove("active"));

    //додає num-гравцю клас active - дає право першого хода
    const activePlayer = document.querySelector(`.game-player.player-${num}`);
    activePlayer.classList.add("active");
    
    //додає в текст номер гравця, який ходить
    const playerNumber = document.querySelector(".player-number");
    playerNumber.innerHTML = num;
}

//функція перевірки чи є правильна відповідь на полі для нового згенерованого числа, якщо ні, згенерувати заново
const genSecondNumberFunc = (tableArr) => {
    //генерує новє друге число
    let genSecondNumber = randSecondNumber();
    //рахує множення першого числа з новим другим числом та шукає його в масиві - таблиці відповідей
    let checkResult = tableArr.findIndex((element) => element == genSecondNumber * Number(select.value));
    while (checkResult < 0) {
        genSecondNumber = randSecondNumber();
        checkResult = tableArr.findIndex((element) => element == genSecondNumber * Number(select.value));
        if (countMove == size * size) break;
    }   
    return genSecondNumber;
}

const setWinnerCell = (startInd, ind, type) => {
    const gameTable = document.querySelector(".game-table");
    const allTD = gameTable.querySelectorAll("td");
    switch (type) {
        case "row": 
            const indexRow = startInd + ind;
            for(let i = indexRow; i < indexRow + 4; i++) {
                allTD[i].classList.add("win-row");
            }
            break;
            
        case "column": 
            const indexCol = startInd + size * ind;
            for(let i = indexCol; i <= indexCol + 3 * size; i = i + size) {
                allTD[i].classList.add("win-col");
            }
            break;

        case "diagonal-left":
            const indexDiagLeft = startInd + size * ind + ind;
            for (let i = indexDiagLeft; i <= indexDiagLeft + 3 * (size + 1); i = i + size + 1) {
                allTD[i].classList.add("win-diagonal-left");
            }
            break;
        
        case "diagonal-right":
            const indexDiagRight = startInd - (size - 1) * ind;
            for (let i = indexDiagRight; i >= indexDiagRight - 3 * (size - 1); i = i - (size - 1)) {
                allTD[i].classList.add("win-diagonal-right");
            }
            break;

        default: break;
    }
}

//перевірка на перемогу чи нічию
const checkWinner = (tableArr, activePlayer) => {
    //за ходи першого гравця в масиві відповідають значення -1
    //за ходи другого гравця в масиві відповідають значення -5
    const playerInd = activePlayer === 1 ? -1 : -5;
    let playerWinnerNumber = 0;

    //перевірка горизонтальних ліній на наявність 4х відповідей одного гравця
    //перевіряємо чи є в рядку підряд чотири комірки зі зніченням одного з гравців -1 або -5
    const checkLine = (line, player, startInd, type) => {
        let sum = 0;
        for(let i = 0; i < line.length; i++) {
            let line4 = line.slice(i, i+4);
            if (line4.length === 4) {
                sum = line4.reduce((acc, el) => {
                    if (el < 0) acc+=el;
                    return acc;
                }, 0);
                if (sum === player * 4) { console.log(startInd, i, type);
                    setWinnerCell(startInd, i, type);
                    return activePlayer;
                }
            }
        }
        return 0;
    }
    
    for (let i = 0; i < tableArr.length; i+=size) {
        //відокремлюємо кожний горизонтальний рядок по size (=6) комірок
        const horizontLine = tableArr.slice(i, i+size);
        const checkResult = checkLine(horizontLine, playerInd, i, "row");
        if(checkResult !==0) {
            playerWinnerNumber = checkResult;
            break;
        }
    }

    //перевірка вертикальних ліній на наявність 4х відповідей одного гравця
    for (let i = 0; i < size; i++) {
        const verticalLine = [];
        for (let j = i; j < tableArr.length; j += size) {
            verticalLine.push(tableArr[j]);
        }
        const checkResult = checkLine(verticalLine, playerInd, i, "column");
        if(checkResult !==0) {
            playerWinnerNumber = checkResult;
            break;
        }
    }

    //перевірка діагональних ліній 0->35 на наявність 4х відповідей одного гравця
    
    let h = 1;
    for (let i = 0; i <= 12; i+=h) {
        const leftDiagonalLine = [];
        if (i === 3) {
            i=6;
            h=6;
        }
        for (let j = i; j < tableArr.length; j+=size+1) {
            if (j !== 30) { //костиль, щоб в третю зліва діагональ не потрапляв зайвий елемент з індексом 30
                if(tableArr[j]) leftDiagonalLine.push(tableArr[j]);
            }
        }
        
        const checkResult = checkLine(leftDiagonalLine, playerInd, i, "diagonal-left");
        if(checkResult !==0) {
            playerWinnerNumber = checkResult;
            break;
        }
    }
    
    //перевірка діагональних ліній 30->5 на наявність 4х відповідей одного гравця
    for (let i = 18; i <= 32; i+=h) {
        const rightDiagonalLine = [];
        const exceptionArr = [0, 1, 2, 6, 7, 12]; //массив костилів елементів, які не мають потрапити в праві діагоналі
        for(j = i; j > 0; j-=size-1) {
            if (!exceptionArr.includes(j)) {
                if(tableArr[j]) rightDiagonalLine.push(tableArr[j]);
            }
        }
        if (i === 30) h = 1;

        const checkResult = checkLine(rightDiagonalLine, playerInd, i, "diagonal-right");
        if(checkResult !==0) {
            playerWinnerNumber = checkResult;
            break;
        }
    }

    return playerWinnerNumber;
}

const table = document.querySelector(".game-table");

function genTable (size, num) {    
    table.innerHTML = "";
    let ind = 0;
    for (let i = 0; i < size; i++) {
        let tr = document.createElement("tr");

        for (let j = 0; j < 6; j++) {
            let td = document.createElement("td");
            if (num != "") {
                let randNum = rand(num, 10*num, num);
                td.innerHTML = randNum;
                td.setAttribute("ind", ind);
                tableArr[ind] = randNum;
                ind++;
            }
            else td.innerHTML = num;
            
            //обробка кліка на комірку таблиці зі значенням
            td.addEventListener("click", () => {
                //перевірка правильності відповіді
                let result=Number(select.value)*Number(secondNumber.innerHTML);
                //якщо відповідь правильна
                if (result == Number(td.innerHTML)) {
                    addAudio("./sound/correct.mp3");
                    let activePlayer = document.querySelector(".game-player.active");
                    //отримує номер гравця, що ходить
                    let activePlayerNumber = activePlayer.getAttribute("data-player");
                    //дає комірці номер гравця, що обрав комірку, та клас block, який блокує подальщі кліки на комірку
                    td.classList.add(`player-${activePlayerNumber}`, "block");
                    //записує в масив, який гравець обрав конкретну комірку
                    tableArr[Number(td.getAttribute("ind"))]= Number(activePlayerNumber)===1 ? -1 : -5;

                    //перевірка на перемогу чи ничію
                    const gameResult = checkWinner(tableArr, Number(activePlayerNumber));
                    if (countMove === 36 && gameResult === 0) {
                        gameStatus = "nonwinner";
                        console.log("nichya");
                        toggleNonWinnerResult();
                        gameInfoBlock.classList.toggle("hidden");
                    }
                    if (gameResult !== 0) {
                        console.log(`win ${gameResult} player`);
                        gameStatus = "winning";
                        toggleWinnerResult(gameResult);
                        gameInfoBlock.classList.toggle("hidden");
                    }

                    //рахує ходи
                    countMove++;
                    // змінює хід гравця
                    if (countMove % 2 == 0) setActivePlayer(1);
                    else setActivePlayer(2);
                    //перевірити чи є правильна відповідь на полі для нового згенерованого числа, якщо ні, згенерувати заново
                    secondNumber.innerHTML = genSecondNumberFunc(tableArr);
                    //console.log(tableArr);
                }
                else {
                    //звук fail.мп3 при невірній відповіді
                    console.log("fail");
                    addAudio("./sound/fail.mp3");
                    td.classList.add("error");
                    setTimeout(function(){
                        td.classList.remove("error");
                    }, 500)
                }
                
                //console.log(countMove);
            });

            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
}

//функція, яка ховає/відображає блок з перемогою
function toggleWinnerResult (gameResult) {
    const setWinnerPlayer = document.querySelector(".player-number.winner");
    setWinnerPlayer.textContent = gameResult; 
    
    const winnerMessage = document.querySelector(".winner-message");
    winnerMessage.classList.toggle("hidden");
    const winerPlayerNumber = winnerMessage.querySelector(".player-number");
    winerPlayerNumber.className = "player-number winner";
    winerPlayerNumber.classList.add(`player-${gameResult}`);

    const gameResultBlock = document.querySelector(".game-result");
    gameResultBlock.classList.toggle("hidden");

    table.classList.toggle("block");

    gameHeader.classList.toggle("winner");
}

//функція, яка ховає/відображає блок з нічиєю
function toggleNonWinnerResult () {
    const nonWinnerMessage = document.querySelector(".non-winner-message");
    nonWinnerMessage.classList.toggle("hidden");

    const gameResultBlock = document.querySelector(".game-result");
    gameResultBlock.classList.toggle("hidden");

    table.classList.toggle("block");

    gameHeader.classList.toggle("winner");
}

//малює порожню таблицю
genTable (size, "");

//клік по кнопці Старт Гри
const buttonStartGame = document.querySelector(".game-start");
buttonStartGame.addEventListener("click", () => {
    //відображає блок із гравцями та прикладом
    gameInfoBlock.classList.remove("hidden");
    if (gameStatus === "nonwinner") toggleNonWinnerResult();
    else if (gameStatus === "winning") toggleWinnerResult("");
    table.classList.remove("block");
    gameStatus = "new";

    gameHeader.classList.add("active");

    //перше число обране в випадаючому списку
    const num = Number(select.value);
    //кількість ходів
    countMove = 0;
    //заповнює таблицю згенерованими числами
    genTable(size, num);

    //дає право першого хода першому гравцю
    setActivePlayer(1);

    //додає перше число
    const firstNumber = document.querySelector(".number-block.first");
    firstNumber.innerHTML = num;

    //додає друге число
    secondNumber.innerHTML = genSecondNumberFunc(tableArr);
});