// focus event -> when a cell is clicked it is in focus , 
// blur event-> when we click out of some cell then the previous cell experiences blur event .
// blur events occur even before click event(a cell goes out of focus first .i.e -> blurs and then otherr cell undergoes click event)

for(let i = 0 ; i < rows ;i++){
    for(let j = 0 ; j < columns ;j++){
        let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
        cell.addEventListener("blur",(e)=>{
            let address = addressBar.value;
            let [activecell,cellProp]=getCellAndCellProp(address);
            let enteredData = activecell.innerText;
            // cellProp.value = enteredData;
            
            if(enteredData === cellProp.value) return;
            cellProp.value = enteredData;
            //if data modified-> remove p-c relation , formula empty , update children with new hardcoded(modified) value
            removeChildFromParent(cellProp.formula);
            cellProp.formula="";
            updateChildrenCells(address);
        })
    }
}
let formulaBar = document.querySelector(".formulae-bar");
formulaBar.addEventListener("keydown",async(e)=>{
    let inputFormula = formulaBar.value;
    if(e.key==="Enter" && inputFormula){
        
        // if change in formula -> break old parent child relation & evaluate new formula and add new p-c relation
        let address = addressBar.value;
        let[cell,cellProp] =getCellAndCellProp(address);
        if(inputFormula!==cellProp.formula)
        removeChildFromParent(cellProp.formula);
        
        addChildToGraphComponent(inputFormula,address);
        //check formula if cyclic or not then only evaluate 
        let cyclicResponse = isGraphCyclic(graphComponentMatrix);
        if (cyclicResponse) {
          // alert("Your formula is Cyclic");
            let response = confirm(
            "Your formula is cyclic do you want to trace your path ?");
            while (response === true) {
            //keep on trackong color untill user is satisfied.
            await isGraphCyclicTracePath(graphComponentMatrix, cyclicResponse);
            response = confirm("Your formula is cyclic. Do you want to trace your path ?");
            }
            removeChildFromGraphComponent(inputFormula, address);
            return;
        }
        let evaluatedValue = evaluateFormula(inputFormula);
        

        // to update Ui and cell prop in db
        setCellUIandCellProp(evaluatedValue,inputFormula,address);
        addChildToParent(inputFormula);
        console.log(sheetDB);
        updateChildrenCells(address)
    }
})

function removeChildFromGraphComponent(formula , childAddress){
    let [crid, ccid] = decodeRIDCIDfromAddress(childAddress); //ccid-childcolumn id
    let encodedFormula = formula.split(" ");
    for (let i = 0; i < encodedFormula.length; i++) {
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if (asciiValue >= 65 && asciiValue <= 90) {
        let [prid, pcid] = decodeRIDCIDfromAddress(encodedFormula[i]); // prid - parent row id
        graphComponentMatrix[prid][pcid].pop(); // pushed array in parent's cell
        }
    }
}

function addChildToGraphComponent(formula, childAddress){
    let[crid,ccid]=decodeRIDCIDfromAddress(childAddress);//ccid-childcolumn id
    let encodedFormula = formula.split(" ");
    for(let i = 0 ; i < encodedFormula.length;i++ ){
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if(asciiValue>=65 && asciiValue<=90){
            let [prid,pcid]=decodeRIDCIDfromAddress(encodedFormula[i]) // prid - parent row id 
            graphComponentMatrix[prid][pcid].push([crid,ccid]); // pushed array in parent's cell
        }
    }
}
function addChildToParent(formula){
    let childAddress = addressBar.value;
    let encodedFormula = formula.split(" ");
    for(let i = 0 ; i < encodedFormula.length;i++ ){
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if(asciiValue>=65 && asciiValue<=90){
            let [ParentCell, parentCellProp] = getCellAndCellProp(encodedFormula[i]);
            parentCellProp.children.push(childAddress);
        }
    }
}
function removeChildFromParent(formula){
    let childAddress = addressBar.value;
    let encodedFormula = formula.split(" ");
    for (let i = 0; i < encodedFormula.length; i++) {
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if (asciiValue >= 65 && asciiValue <= 90){
        let [parentCell, parentCellProp] = getCellAndCellProp(encodedFormula[i]);
        let idx = parentCellProp.children.indexOf(childAddress);
        parentCellProp.children.splice(idx,1);
        }
    }
}
function updateChildrenCells(parentAddress){
    let [parentCell, parentCellProp] = getCellAndCellProp(parentAddress);
    let children = parentCellProp.children;

    for(let i = 0 ; i<children.length; i++){
        let childAddress= children[i];
        let [childCell, childCellProp] = getCellAndCellProp(childAddress);
        let childFormula = childCellProp.formula;
        let evaluatedValue = evaluateFormula(childFormula);
        setCellUIandCellProp(evaluatedValue, childFormula,childAddress);
        updateChildrenCells(childAddress);
    }
}
function evaluateFormula(formula){
    let encodedFormula = formula.split(" "); // formula must be space saperated
    for(let i = 0 ; i < encodedFormula.length;i++){
        let asciiValue = encodedFormula[i].charCodeAt(0);
        
        if(asciiValue>=65 && asciiValue<=90){ // if the formula in in decoded form then it will be evaluated and its value will be used instead
            let [cell,cellProp]=getCellAndCellProp(encodedFormula[i]);
            encodedFormula[i]=cellProp.value;
        }
    }
    let decodedFormula = encodedFormula.join(" ");
    return eval(decodedFormula);
}

function setCellUIandCellProp(evaluatedValue,formula,address){

    let [cell,cellProp]=getCellAndCellProp(address);

    cell.innerText = evaluatedValue; // UI update
    cellProp.value = evaluatedValue; // db update
    cellProp.formula = formula;
}





