function rand(min,max,num){
    return Math.floor(Math.floor(Math.random()*(max-min+1)+min) / num) * num;
}

let table = document.querySelector(".game-table");
console.log(table);

const size = 6;
const num = 3; //обирати в программі

for (let i = 0; i < size; i++) {
    let tr = document.createElement("tr");

    for (let j = 0; j < 6; j++) {
        let td = document.createElement("td");
        td.innerHTML = rand(num, 10*num, num);
        tr.appendChild(td);
    }
    table.appendChild(tr);
}