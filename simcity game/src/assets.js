//this will create our assets
import * as THREE from 'three';

const geometry=new THREE.BoxGeometry(1,1,1);
const assets={
    'grass':(x,y)=>{
        //GRASS GEOMETRY

        //1.Load the mesh/3D object corresponding to the tile at (x,y)
        const material=new THREE.MeshLambertMaterial({color:0x00aa00});//this material supports lightning
        const mesh=new THREE.Mesh(geometry,material);
        mesh.userData={id:'grass',x,y};
        mesh.position.set(x,-0.5,y);//-0.5 takes the grass below the plane
        return mesh;
    },
    'residential':(x,y)=>{
        const material=new THREE.MeshLambertMaterial({color:0x00ff00});
        const mesh=new THREE.Mesh(geometry,material);
        mesh.userData={id:'residential',x,y};
        mesh.position.set(x,0.5,y);
        return mesh;
    },
    'commercial':(x,y)=>{
        const material=new THREE.MeshLambertMaterial({color:0x0000ff});
        const mesh=new THREE.Mesh(geometry,material);
        mesh.userData={id:'commercial',x,y};
        mesh.position.set(x,0.5,y);
        return mesh;
    },
    'industrial':(x,y)=>{
        const material=new THREE.MeshLambertMaterial({color:0xffff00});
        const mesh=new THREE.Mesh(geometry,material);
        mesh.userData={id:'industrial',x,y};
        mesh.position.set(x,0.5,y);
        return mesh;
    },
    'road':(x,y)=>{
        const material=new THREE.MeshLambertMaterial({color:0x4444440});
        const mesh=new THREE.Mesh(geometry,material);
        mesh.userData={id:'road',x,y};
        mesh.scale.set(1,0.1,1);
        mesh.position.set(x,0.05,y);
        return mesh;
    }
}//dictionary that maps assetId to a function

export function createAssetInstance(assetId,x,y){
    if(assetId in assets){
        return assets[assetId](x,y);//it returns a function so we are giving it input
    }
    else{
        console.warn(`Asset with id ${assetId} is not found`);
        return undefined;
    }
}