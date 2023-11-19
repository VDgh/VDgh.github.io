
let crShow = {
   scaler: 1,
   faceSel: true
};


let glShape = class{
    vertices = [];  
    normals = [];
    colors = [];
    indexes = [];
 };

 var glTransparency = false;
 var gl;
 var program;
 var positionLocation, normalLocation,  colorLocation;
 var worldViewProjectionLocation, worldLocation;
 var positionBuffer, normalBuffer,colorBuffer;
 var fieldOfViewRadians, fRotationY , fRotationX;
 var reverseLightDirectionLocation;
 var shape;

function setShapeFace(){     
  
  
  const zonesToShow = [0, 1];
 

  crOffset = qrz.geometry.zone_n[0].gravityC;
  let maxDs =1;
   for(let i = 0; i< qrz.geometry.nmbPoints_n; i++){  
      for( let j=0; j<3; j++){
        maxDs = Math.max(maxDs, Math.abs(qrz.geometry.p_n[i].coo[j] - crOffset.coo[j]));
      }
   }                            
  
   redu =3/maxDs;
  
   extdNmbVx = 0; thriAng =0;
   for( zn of zonesToShow){
      for(let i = 0; i< qrz.geometry.zone_n[zn].nmbPlanes; i++){
         pNm = Math.abs(qrz.geometry.zone_n[zn].plane[i]);
         thriAng += (qrz.geometry.pl_n[pNm].pPolygon.length -2);
         extdNmbVx +=  qrz.geometry.pl_n[pNm].pPolygon.length
      }
   }
   
 
    alfa =0.8;
   for( zn of zonesToShow){
      if (zn>0) alfa =1;
   
      for(let i = 0; i< qrz.geometry.zone_n[zn].nmbPlanes; i++){
         pNm = Math.abs(qrz.geometry.zone_n[zn].plane[i]);
         ixV = -1; ixI = -1; 
         pln0 = ixV+1;
         
         polyLength = qrz.geometry.pl_n[pNm].nmbLines; //.pPolygon.length
         
         faceVertices = new Float32Array( polyLength*3 );
         faceIndexes = []; //  new Uint16Array( thriAng*3 );  
         
         
         for( let j = 0; j< polyLength; j++){
            tdBs= qrz.geometry.pl_n[pNm].pPolygon[j];
            ixV ++; faceVertices[ixV] = redu * qrz.geometry.p_n[tdBs].coo[0];
            ixV ++; faceVertices[ixV] = redu * qrz.geometry.p_n[tdBs].coo[2];
            ixV ++; faceVertices[ixV] = redu * qrz.geometry.p_n[tdBs].coo[1];
      
            //alert(ixV + "  "  + crShape.vertices[ixV] + "  " + crShape.vertices);
            
         }
         
         
         for( let j = 1; j<qrz.geometry.pl_n[pNm].pPolygon.length -1; j++){
            ixI ++; faceIndexes.push(pln0);
            ixI ++; faceIndexes.push(pln0 + j);
            ixI ++; faceIndexes.push(pln0 + j + 1);
         }
      
      
      
      
         const geometry = new THREE.BufferGeometry();
 
         //   const indices = [
         // 	0, 1, 2,
         // 	0, 2, 3,
         // ];
         
         const indices = faceIndexes;
         
         
         geometry.setIndex( indices );
             
         geometry.setAttribute( 'position', new THREE.BufferAttribute( faceVertices, 3 ) );
         geometry.computeVertexNormals();
         
         let material;
 
         if(qrz.geometry.pl_n[pNm].nameCode == 201){
            material =  new THREE.MeshMatcapMaterial({ color: 0xaaccff, transparent: true, opacity: 0.90, side: THREE.DoubleSide })
         } else {
            material =  new THREE.MeshPhongMaterial({ color: 0x99ccff, transparent: true, opacity: 0.60, side: THREE.DoubleSide })
         }
         
                 
         //const material =  new THREE.MeshMatcapMaterial({ color: 0xaaccff, transparent: true, opacity: 0.90, side: THREE.DoubleSide })
         //const material =  new THREE.MeshBasicMaterial({ color: 0xaaccff, transparent: true, opacity: 0.90, side: THREE.DoubleSide })
         
         //const material =  new THREE.MeshPhysicalMaterial({ color: 0x99ccff, transparent: true, opacity: 0.60, side: THREE.DoubleSide })
         //const material =  new THREE.MeshPhongMaterial({ color: 0x99ccff, transparent: true, opacity: 0.60, side: THREE.DoubleSide })
         //const material = new THREE.MeshStandardMaterial({color: 0x99ccff, transparent: true, opacity: 0.60, side: THREE.DoubleSide })
        
         
          matName = 'CryMat_' + zn.toString() +"_"+ i.toString()
          mexhName = 'Cry_' + zn.toString() +"_"+ i.toString()
          
                   
          const cryMesh = new THREE.Mesh( geometry, material );
         
          cryMesh.name =mexhName;
          cryMesh.position.set(-2, 0.5, 0);
          cryMesh.castShadow = true;
          cryMesh.receiveShadow = true;
         
          qzBlock.add(cryMesh);
  
  
      }  
     
      scene.add(qzBlock);
      
     
   
   }

      const crFolder = gui.addFolder('Crystal')
      crFolder.add(qzBlock.rotation, 'x', 0, Math.PI * 2).name('Rotate X Axis')
      crFolder.add(qzBlock.rotation, 'y', 0, Math.PI * 2).name('Rotate Y Axis')
      crFolder.add(qzBlock.rotation, 'z', 0, Math.PI * 2).name('Rotate Z Axis')
     
      crFolder.add(crShow, "faceSel").name('Enable Face Selection').onChange((value) => {
         console.log(value);
      });
      crFolder.open();



  
}


