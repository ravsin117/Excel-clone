let rows = 100;
let columns = 26;

let addressColCont = document.querySelector(".address-column-container");
let addressRowCont = document.querySelector(".address-row-container");
let cellConts=document.querySelector(".cells-container");
let addressBar=document.querySelector(".address-bar");

for(let i = 0 ; i < rows ;i++){ //cells in row container(1-100)
    let addressCol=document.createElement("div");
    addressCol.setAttribute("class","address-column")
    addressCol.innerText = i+1;
    addressColCont.appendChild(addressCol);
}

for(let i=0;i<columns;i++){  //cells in column container(A-Z)
    let addressRow = document.createElement("div");
    addressRow.setAttribute("class", "address-row");
    addressRow.innerText = String.fromCharCode(65+i);
    addressRowCont.appendChild(addressRow);
}

for(let i=0;i<rows;i++){
    let rowCont=document.createElement("div");
    rowCont.setAttribute("class","row-container");
    for(let j=0;j<columns;j++){
        let cell = document.createElement("div");
        cell.setAttribute("class","cell");
        cell.setAttribute("contenteditable","true");
        cell.setAttribute("spellcheck",false);// after this we will be able to write anything without error 

        // Attributes for cell and column identification.
        cell.setAttribute("rid",i);
        cell.setAttribute("cid",j);

        rowCont.appendChild(cell); // cell=> block level elem here so apply display flex on its parent here i.e(row-container)
        addlistenerForAddressBarDisplay(cell,i,j);
    }
    cellConts.appendChild(rowCont);
}

function addlistenerForAddressBarDisplay(cell,i,j){
    cell.addEventListener("click",(e)=> {
        let rowId = i+1;
        let colId= String.fromCharCode(65+j);
        addressBar.value=`${colId}${rowId}`;
    })
}

// by default first cell must be  clicked when we reload the page
let firstCell = document.querySelector(".cell");
firstCell.click();













