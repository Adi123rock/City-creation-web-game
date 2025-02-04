import * as THREE from 'three';
import { createCamera } from './camera.js';
import { createAssetInstance } from './assets.js';
export function createScene() {
    //Initial scene setup
    const gameWindow=document.getElementById('render-target')
    const scene = new THREE.Scene();
    scene.background= new THREE.Color(0x777777);

    const camera=createCamera(gameWindow);

    const renderer=new THREE.WebGLRenderer();
    renderer.setSize(gameWindow.offsetWidth,gameWindow.offsetHeight);
    gameWindow.appendChild(renderer.domElement);
    
    const raycaster=new THREE.Raycaster();
    const mouse=new THREE.Vector2();//for mouse controlls
    let selectedObject=undefined;

    let terrain=[];//keeps meshes of grass
    let buildings=[];//keeps meshes of buildings

    let onObjectSelected=undefined;
    function initialize(city){
        scene.clear();
        terrain=[];
        buildings=[];
        for(let x=0;x<city.size;x++){
            const column=[];
            for(let y=0;y<city.size;y++){
                const terrainId=city.data[x][y].terrainId;
                const mesh=createAssetInstance(terrainId,x,y);//1.Create the mesh
                scene.add(mesh);//2.Add that mesh to the scene
                column.push(mesh);//3.Add that mesh to the meshes array
                
            }
            terrain.push(column);
            buildings.push([...Array(city.size)])//creates columns of undefined value 
        }
        setupLights();
    }
    function update(city){
        for(let x=0;x<city.size;x++){
            for(let y=0;y<city.size;y++){
                //BUILDING GEOMETRY
                const currentBuildingId=buildings[x][y]?.userData.id;
                const newBuildingId=city.data[x][y].buildingId;
                //if the player removes a building, remove it from the scene
                if(!newBuildingId && currentBuildingId){
                    scene.remove(buildings[x][y]);
                    buildings[x][y]=undefined;
                }
                //If the data model has changed, update the mesh
                if(newBuildingId && newBuildingId!==currentBuildingId){
                    scene.remove(buildings[x][y]);
                    buildings[x][y]=createAssetInstance(newBuildingId,x,y);
                    scene.add(buildings[x][y]);
                }
            }
        }
    }

    function setupLights(){
        const lights=[
            new THREE.AmbientLight(0xffffff,0.2),//base lightning
            new THREE.DirectionalLight(0xffffff,0.3),
            new THREE.DirectionalLight(0xffffff,0.3),
            new THREE.DirectionalLight(0xffffff,0.3)
        ];

        lights[1].position.set(0,1,0);
        lights[2].position.set(1,1,0);
        lights[3].position.set(0,1,1);

        scene.add(...lights);//"..." unpacks the array
    }
    function draw(){
        renderer.render(scene,camera.camera);
    }
    function start(){
        renderer.setAnimationLoop(draw);
    }
    function stop(){
        renderer.setAnimationLoop(null);
    }

    //For mouse controlls
    function onMouseDown(event){
        camera.onMouseDown(event);
        mouse.x=(event.clientX/renderer.domElement.clientWidth)*2-1;//normalizes mouse position, so that it's between -1 and 1, instead of 0 and 1, because the mouse position is relative to the canvas, not the window
        mouse.y=-(event.clientY/renderer.domElement.clientHeight)*2+1;
        
        raycaster.setFromCamera(mouse,camera.camera);//sets the raycaster to the mouse position

        let intersections=raycaster.intersectObjects(scene.children,false);//returns an array of objects that are intersected by the raycaster sorted by distance with closest object first in list
        console.log(intersections.length);
        if(intersections.length>0){
            if(selectedObject) selectedObject.material.emissive.setHex(0);//sets the emissive color of the object to black
            selectedObject=intersections[0]?.object;//sets the selected object to the first object that is intersected by the raycaster
            selectedObject.material.emissive.setHex(0x555555)
            console.log(selectedObject.userData);
            if(this.onObjectSelected){
                console.log('object selected');
                this.onObjectSelected(selectedObject);
            }
        }
    }
    function onMouseUp(event){
        camera.onMouseUp(event);
    }
    function onMouseMove(event){
        camera.onMouseMove(event);
    }

    return {
        onObjectSelected,
        initialize,
        update,
        start,
        stop,
        onMouseDown,
        onMouseUp,
        onMouseMove
    }
}