import * as THREE from 'three';
export function createCamera(gameWindow) {
    const DEG2RAD=Math.PI/180;

    const LEFT_MOUSE_BUTTON=0;
    const MIDDLE_MOUSE_BUTTON=1;
    const RIGHT_MOUSE_BUTTON=2;

    const MIN_CAMERA_RADIUS=10;//Minimum camera radius
    const MAX_CAMERA_RADIUS=20;//Maximum camera radius
    const MIN_CAMERA_ELEVATION=30;
    const MAX_CAMERA_ELEVATION=90;
    const ROTATION_SENSITIVTY=0.5;
    const ZOOM_SENSITIVITY=0.02;
    const PAN_SENSITIVITY=-0.01;
    const Y_AXIS=new THREE.Vector3(0,1,0);

    const camera=new THREE.PerspectiveCamera(75,gameWindow.offsetWidth/gameWindow.offsetHeight,0.1,1000);
    let cameraOrigin=new THREE.Vector3();//default zero vector
    let cameraRadius=(MIN_CAMERA_RADIUS +MAX_CAMERA_RADIUS)/2;
    let cameraAzimmuth=135;
    let cameraElevation=45;
    let isLeftMouseDown=false;
    let isRightMouseDown=false;
    let isMiddleMouseDown=false;
    let prevMouseX=0;
    let prevMouseY=0;
    updateCameraPosition();
    
    //For mouse controlls
    function onMouseDown(event){
        console.log('mouse down')
        if(event.button===LEFT_MOUSE_BUTTON){
            isLeftMouseDown=true;
        }
        if(event.button===MIDDLE_MOUSE_BUTTON){
            isMiddleMouseDown=true; 
        }
        if(event.button===RIGHT_MOUSE_BUTTON){
            isRightMouseDown=true;
        }
    }
    function onMouseUp(event){
        console.log('mouse up')
        if(event.button===LEFT_MOUSE_BUTTON){
            isLeftMouseDown=false;
        }
        if(event.button===MIDDLE_MOUSE_BUTTON){
            isMiddleMouseDown=false; 
        }
        if(event.button===RIGHT_MOUSE_BUTTON){
            isRightMouseDown=false;
        }
    }
    function onMouseMove(event){
        console.log('mouse move')
        const deltaX=event.clientX-prevMouseX;
        const deltaY=event.clientY-prevMouseY; 
        //Handles the rotation of the camera
        if(isLeftMouseDown){
            cameraAzimmuth+=-((deltaX)*ROTATION_SENSITIVTY);
            cameraElevation+=-((deltaY)*ROTATION_SENSITIVTY);
            cameraElevation=Math.min(MAX_CAMERA_ELEVATION,Math.max(MIN_CAMERA_ELEVATION,cameraElevation));//keeps the camera elevation between 0 and 90 degrees
            updateCameraPosition();
        }

        //Handles the panning of the camera
        if(isMiddleMouseDown){
            const forward=new THREE.Vector3(0,0,1).applyAxisAngle(Y_AXIS,cameraAzimmuth*DEG2RAD);//gets the forward vector of the camera,it rotate the z-axis vector to point in the same direction that our camera is facing
            const left=new THREE.Vector3(1,0,0).applyAxisAngle(Y_AXIS,cameraAzimmuth*DEG2RAD);//gets the left vector of the camera, for x-axis
            cameraOrigin.add(forward.multiplyScalar(deltaY*PAN_SENSITIVITY));
            cameraOrigin.add(left.multiplyScalar(deltaX*PAN_SENSITIVITY));
            updateCameraPosition();
        }

        //Handles the zooming of the camera
        if(isRightMouseDown){
            cameraRadius+=-((deltaY)*ZOOM_SENSITIVITY);
            cameraRadius=Math.min(MAX_CAMERA_RADIUS,Math.max(MIN_CAMERA_RADIUS,cameraRadius));//keeps the camera radius between MIN_CAMERA_RADIUS and MAX_CAMERA_RADIUS
            updateCameraPosition();
        }
        prevMouseX=event.clientX;
        prevMouseY=event.clientY;
    }

    function updateCameraPosition(){
        camera.position.x=cameraRadius*Math.sin(cameraAzimmuth*DEG2RAD)*Math.cos(cameraElevation*DEG2RAD);
        camera.position.y=cameraRadius*Math.sin(cameraElevation*DEG2RAD);
        camera.position.z=cameraRadius*Math.cos(cameraAzimmuth*DEG2RAD)*Math.cos(cameraElevation*DEG2RAD);
        camera.position.add(cameraOrigin)
        camera.lookAt(cameraOrigin);
        camera.updateMatrix();//called to apply the above changes 
    }
    return{
        camera,
        onMouseDown,
        onMouseUp,
        onMouseMove
    }
}