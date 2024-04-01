//число ходів
let countMove = 0;
let tableArr = new Array();

//генерує числа 0..1 для заповнення тега select
const select = document.querySelector(".first-number");
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

function genTable (size, num) {
    const table = document.querySelector(".game-table");
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
                if (result == Number(td.innerHTML)) {
                    let activePlayer = document.querySelector(".game-player.active");
                    //отримує номер гравця, що ходить
                    let activePlayerNumber = activePlayer.getAttribute("target");
                    //дає комірці номер гравця, що обрав комірку, та клас block, який блокує подальщі кліки на комірку
                    td.classList.add(`player-${activePlayerNumber}`, "block");
                    //записує в масив, який гравець обрав конкретну комірку
                    tableArr[Number(td.getAttribute("ind"))]= -1 * Number(activePlayerNumber);
                    //рахує ходи
                    countMove++;
                    // змінює хід гравця
                    if (countMove % 2 == 0) setActivePlayer(1);
                    else setActivePlayer(2);
                    //перевірити чи є правильна відповідь на полі для нового згенерованого числа, якщо ні, згенерувати заново
                    //генерує новє друге число
                    let genSecondNumber = randSecondNumber();
                    //рахує множення першого числа з новим другим числом та шукає його в масиві - таблиці відповідей
                    let checkResult = tableArr.findIndex((element) => element == genSecondNumber * Number(select.value));
                    while (checkResult < 0) {
                        genSecondNumber = randSecondNumber();
                        checkResult = tableArr.findIndex((element) => element == genSecondNumber * Number(select.value));
                        if (countMove == 36) break;
                    }
                    secondNumber.innerHTML = genSecondNumber;
                }
                else {
                    //додати звук фейл.мп3
                    console.log("fail");
                    td.classList.add("error");
                    setTimeout(function(){
                        td.classList.remove("error");
                    }, 500)
                }
                //зафарбувати неправильну відповідь в червоне на 1-2 с
                //додати аудіо
                //перевірка на перемогу чи ничію
            });

            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
}

//малює порожню таблицю
genTable (size, "");

//клік по кнопці Старт Гри
const buttonStartGame = document.querySelector(".game-start");
buttonStartGame.addEventListener("click", () => {
    const num = Number(select.value);
    countMove = 0;
    //заповнює таблицю згенерованими числами
    genTable(size, num);

    //дає право першого хода першому гравцю
    setActivePlayer(1);

    //додає перше число
    const firstNumber = document.querySelector(".number-block.first");
    firstNumber.innerHTML = num;

    //додає друге число
    secondNumber.innerHTML = randSecondNumber();
});