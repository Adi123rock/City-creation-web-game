export function createCity(size) {
    const data=[];//2D data array

    initialize();//called before to make sure our data is initialized
    function initialize(){
        for(let x=0;x<size;x++){
            const column=[];//x,y coordinates of each tile in a column
            for(let y=0;y<size;y++){
                const tile=createTile(x,y);
                column.push(tile);
            }
            data.push(column);
        }
    }

    function update(){
        // console.log(`Updating city`);
        for(let x=0;x<size;x++){
            // const column=[];
            for(let y=0;y<size;y++){
                data[x][y].update();
            }
        }
    }
    return{
        size,
        data,
        update
    }
}

function createTile(x,y){
    return{
        x,
        y,
        terrainId:'grass',
        buildingId:undefined,
        update(){
        }
    }
}