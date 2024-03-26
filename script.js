//число ходів
let countMove = 0;

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
    for (let i = 0; i < size; i++) {
        let tr = document.createElement("tr");

        for (let j = 0; j < 6; j++) {
            let td = document.createElement("td");
            if (num != "") td.innerHTML = rand(num, 10*num, num);
            else td.innerHTML = num;
            
            //обробка кліка на комірку таблиці зі значенням
            td.addEventListener("click", () => {
                //перевірка правильності відповіді
                let result=Number(select.value)*Number(secondNumber.innerHTML);
                if (result == Number(td.innerHTML)) {
                    let activePlayer = document.querySelector(".game-player.active");
                    td.classList.add(`player-${activePlayer.getAttribute("target")}`);
                    countMove++;
                    if (countMove % 2 == 0) setActivePlayer(1);
                    else setActivePlayer(2);
                    //перевірити чи є правильна відповідь на полі для нового згенерованого числа, якщо ні, згенерувати заново
                    secondNumber.innerHTML = randSecondNumber();
                }
                else {
                    //додати звук фейл.мп3
                    console.log("fail");
                }

                //зафарбування комірки у колір гравця
                //зберігання відповіді гравця в масиві
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
    //заповнює таблицю згенерованими числами
    genTable (size, num);

    //дає право першого хода першому гравцю
    setActivePlayer(1);

    //додає перше число
    const firstNumber = document.querySelector(".number-block.first");
    firstNumber.innerHTML = num;

    //додає друге число
    secondNumber.innerHTML = randSecondNumber();
});