let graphComponentMatrix =[];

for(let i = 0; i < rows ; i++){
    let row =[];
    for(let j = 0; j < columns ; j++){
        
        //Array->[] stores children(can be more than one)
        row.push([]);
    }
    graphComponentMatrix.push(row);
}
function isGraphCyclic(graphComponentMatrix){
    // dependency -> visited , dfsvisited
    let visited=[];
    let dfsVisited =[];
    for(let i = 0 ; i < rows;i++){
        let visitedRow=[];
        let dfsVisitedRow=[];
        for(let j = 0 ; j < columns;j++){
            visitedRow.push(false);
            dfsVisitedRow.push(false);
        }
        visited.push(visitedRow);
        dfsVisited.push(dfsVisitedRow);
    }

    for(let i = 0 ; i < rows ; i++){
        for(let j = 0 ;  j< columns ; j++){
            if(visited[i][j]===false){
            let response=dfsCycleDetection(graphComponentMatrix,i,j,visited,dfsVisited);
            if(response==true){
                return [i,j];
            }
            }
            
        }
    }
    return null;
}
//start -> visited= true and dfsvisited= true
//end - > dfsvisited = false
//if visited[i][j]==true return back (already explored path)
//cycle detection condition -> if (visit[i][j]==true && dfsvisited[i][j]==true)--> cycle ;
function dfsCycleDetection(graphComponentMatrix, srcr , srcc, visited, dfsVisited) {
    visited[srcr][srcc]= true ;
    dfsVisited[srcr][srcc]= true ;
    //check 

    for(let children = 0 ;children< graphComponentMatrix[srcr][srcc].length ;children++){
        let [nbrr,nbrc]=graphComponentMatrix[srcr][srcc][children];
        if(visited[nbrr][nbrc]===false){
            let response = dfsCycleDetection(graphComponentMatrix,nbrr,nbrc,visited,dfsVisited);
            if(response===true) return true; // found cycle so return true 
        }
        else if(visited[nbrr][nbrc]===true &&dfsVisited[nbrr][nbrc]===true)
        return true;
    }
    dfsVisited[srcr][srcc]= false ;
    return false;
}
