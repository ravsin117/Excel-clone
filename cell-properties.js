//storage

let sheetDB=[];

for(let i = 0 ;  i< rows;i++){    // row is also accessible here bcz of script linking in main file.
    let sheetRow=[];
    for(let j=0;j<columns;j++){
        let cellprop={
            bold:false,
            italic:false,
            underline:false,
            alignment:"left",
            fontFamily:"monospace",
            fontSize:"14",
            fontColor:"#000000",   // black
            BgColor:"#000000",
            value:"",     //<- for storing value in cell
            formula:"",
            children:[],
        }
        sheetRow.push(cellprop);
    }
    sheetDB.push(sheetRow);
}

/* for cell and storage identification we assign an id to each cell , by assecing this unique id we will be able to perform manipulation(ie we will add properties) to the individual cell.
*/

let bold = document.querySelector(".bold");
let italic = document.querySelector(".italic");
let underline = document.querySelector(".underline");
let fontSize = document.querySelector(".font-size-prop");
let fontFamily = document.querySelector(".font-family-prop");
let fontColor = document.querySelector(".font-color-prop");
let BgColor = document.querySelector(".Bgcolor-prop");
let alignment = document.querySelectorAll(".alignment");

let activeColorProp="#d1d8e0";
let inactiveColorProp="#ecf0f1";
let leftAlign =  alignment[0];
let centerAlign =  alignment[1];
let rightAlign =  alignment[2];

//attach property listners

//bold property
bold.addEventListener("click",(e) => {
    let address = addressBar.value;
    let [cell,cellProp]=getCellAndCellProp(address)
    //Modifications 
    cellProp.bold=!cellProp.bold; // prop of bold changed
    cell.style.fontWeight= cellProp.bold ? "bold" : "normal"; //UI Changes 
    bold.style.backgroundColor= cellProp.bold ? activeColorProp : inactiveColorProp;
})
//italic property
italic.addEventListener("click", (e) => {
    let address = addressBar.value;
    let [cell, cellProp] = getCellAndCellProp(address);
    //Modifications
    cellProp.italic = !cellProp.italic; // prop of bold changed
    cell.style.fontStyle = cellProp.italic ? "italic" : "normal"; //UI Changes
    italic.style.backgroundColor = cellProp.italic ? activeColorProp : inactiveColorProp;
});
//underline property
underline.addEventListener("click", (e) => {
    let address = addressBar.value;
    let [cell, cellProp] = getCellAndCellProp(address);
    //Modifications
    cellProp.underline = !cellProp.underline; // prop of bold changed
    cell.style.textDecoration = cellProp.underline ? "underline" : "none"; //UI Changes
    underline.style.backgroundColor = cellProp.underline? activeColorProp: inactiveColorProp;
});

// font-size
fontSize.addEventListener("change", (e) => {
    let address = addressBar.value;
    let [cell, cellProp] = getCellAndCellProp(address);
    
    cellProp.fontSize = fontSize.value;
    cell.style.fontSize = cellProp.fontSize+"px";
    fontSize.value = cellProp.fontSize; 
})
// font-family 
fontFamily.addEventListener("change", (e) => {
    let address = addressBar.value;
    let [cell, cellProp] = getCellAndCellProp(address);
    
    cellProp.fontFamily = fontFamily.value; // changes in db 
    cell.style.fontFamily = cellProp.fontFamily; // changes in UI
    fontFamily.value = cellProp.fontFamily; 
})

// font-color 
fontColor.addEventListener("change",(e)=>{
    let address = addressBar.value;
    let [cell, cellProp] = getCellAndCellProp(address);

    cellProp.fontColor = fontColor.value;
    cell.style.color = cellProp.fontColor;
    fontColor.value = cellProp.fontColor;
})

//Background-color 
BgColor.addEventListener("change",(e)=>{
    let address = addressBar.value;
    let [cell, cellProp] = getCellAndCellProp(address);
    
    cellProp.BgColor=BgColor.value;
    cell.style.background = cellProp.BgColor;
    BgColor.value = cellProp.BgColor;
})
//alignment 
alignment.forEach((alignElem)=>{
    alignElem.addEventListener("click",(e)=>{
        let address = addressBar.value;
        let [cell, cellProp] = getCellAndCellProp(address);

        let alignValue = e.target.classList[0];
        cellProp.alignment = alignValue; //change in db
        cell.style.textAlign = cellProp.alignment; //ui change
        
        switch(alignValue){ //ui change
            case "left":
                leftAlign.style.backgroundColor=activeColorProp;
                centerAlign.style.backgroundColor = inactiveColorProp;
                rightAlign.style.backgroundColor = inactiveColorProp;
                break;
            case "center":
                leftAlign.style.backgroundColor = inactiveColorProp;
                centerAlign.style.backgroundColor = activeColorProp;
                rightAlign.style.backgroundColor = inactiveColorProp;
                break;
            case "right":
                leftAlign.style.backgroundColor = inactiveColorProp;
                centerAlign.style.backgroundColor = inactiveColorProp;
                rightAlign.style.backgroundColor = activeColorProp;
                break;
        }
        
    })
})



let allCells = document.querySelectorAll(".cell");
for(let i = 0;i<allCells.length;i++){
    addListnerToAttachCellProperties(allCells[i]);
}

function addListnerToAttachCellProperties(cell){
    cell.addEventListener("click",(e)=>{
        
        let address = addressBar.value;
        let [rid,cid]=decodeRIDCIDfromAddress(address);
        let cellProp=sheetDB[rid][cid];

        //Apply changes in cell's UI (individual cell property applied on selecting cell)
    cell.style.fontWeight= cellProp.bold ? "bold" : "normal"; //UI Changes 
    cell.style.fontStyle = cellProp.italic ? "italic" : "normal"; //UI Changes
    cell.style.textDecoration = cellProp.underline ? "underline" : "none"; //UI Changes
    cell.style.fontSize = cellProp.fontSize + "px";
    cell.style.fontFamily = cellProp.fontFamily; // changes in UI
    cell.style.color = cellProp.fontColor;
    cell.style.background = cellProp.BgColor==="#000000"? "transparent" : cellProp.BgColor ;
    cell.style.textAlign = cellProp.alignment;
    
    
    
    //apply properties UI container (properties container's UI changes when selected individual cell)
    bold.style.backgroundColor = cellProp.bold? activeColorProp: inactiveColorProp;
    italic.style.backgroundColor = cellProp.italic? activeColorProp:inactiveColorProp;
    underline.style.backgroundColor = cellProp.underline? activeColorProp: inactiveColorProp;    
    fontColor.value = cellProp.fontColor;
    BgColor.value = cellProp.BgColor;
    fontSize.value = cellProp.fontSize; 
    fontFamily.value = cellProp.fontFamily; 

    switch(cellProp.alignment){ //ui change
            case "left":
                leftAlign.style.backgroundColor=activeColorProp;
                centerAlign.style.backgroundColor = inactiveColorProp;
                rightAlign.style.backgroundColor = inactiveColorProp;
                break;
            case "center":
                leftAlign.style.backgroundColor = inactiveColorProp;
                centerAlign.style.backgroundColor = activeColorProp;
                rightAlign.style.backgroundColor = inactiveColorProp;
                break;
            case "right":
                leftAlign.style.backgroundColor = inactiveColorProp;
                centerAlign.style.backgroundColor = inactiveColorProp;
                rightAlign.style.backgroundColor = activeColorProp;
                break;
        }
        let formulaBar = document.querySelector(".formulae-bar");
        formulaBar.value = cellProp.formula;
        cell.value = cellProp.value;
        
    })
}


function getCellAndCellProp(address) {
  //<-returns cell and cell property of selected cell
  let [rid, cid] = decodeRIDCIDfromAddress(address);
  // Acess cell and storage object
  let cell = document.querySelector(`.cell[rid="${rid}"][cid="${cid}"]`);
  let cellProp = sheetDB[rid][cid];
  return [cell, cellProp];
}

function decodeRIDCIDfromAddress(address) {
  //<- decodes & returns row-id and colm-id
  let rid = Number(address.slice(1) - 1); // -1 bcz of 0 base index
  let cid = Number(address.charCodeAt(0)) - 65;
  return [rid, cid];
}



