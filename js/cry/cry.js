
const epsilon = 1.0e-4;


let crShow = {
   faceSel: true
};

 let crystals = [];

 function setShapeFace(qzCr, codeName){
   shCry =  Object.assign({},  qzCr);
   shPack = [];
   qzBlock = new THREE.Group();
   shPack.push(shCry);
   
 const zonesToShow = [0];


 crOffset =new vectorPoint([0,0,0]); //   shCry.geometry.zone_n[0].gravityC;
 let maxDs =1;
  for(let i = 0; i< shCry.geometry.nmbPoints_n; i++){
     for( let j=0; j<3; j++){
       maxDs = Math.max(maxDs, Math.abs(shCry.geometry.p_n[i].coo[j] - crOffset.coo[j]));
     }
  }

 
  redu =3/maxDs;

  shPack.push(redu);

  extdNmbVx = 0; thriAng =0;
  for( zn of zonesToShow){
     
      for(let i = 0; i< shCry.geometry.zone_n[zn].nmbPlanes; i++){
        pNm = Math.abs(shCry.geometry.zone_n[zn].plane[i]);
        thriAng += (shCry.geometry.pl_n[pNm].pPolygon.length -2);
        extdNmbVx +=  shCry.geometry.pl_n[pNm].pPolygon.length
     }
  }


   alfa =0.8;
  for( zn of zonesToShow){
     if (zn>0) alfa =1;
     for(let i = 0; i< shCry.geometry.zone_n[zn].plane.length; i++){
        pNm = Math.abs(shCry.geometry.zone_n[zn].plane[i]);
        ixV = -1; ixI = -1;
        pln0 = ixV+1;
         polyLength = shCry.geometry.pl_n[pNm].pPolygon.length

        faceVertices = new Float32Array( polyLength*3 );
        faceIndexes = []; //  new Uint16Array( thriAng*3 );

// console.log (zn, pNm,  shCry.geometry.pl_n[pNm].nmbLines)
// console.log (shCry.geometry.pl_n[pNm].pPolygon)
// console.log ('--------------------------')

        for( let j = 0; j< polyLength; j++){
           tdBs= shCry.geometry.pl_n[pNm].pPolygon[j];
           ixV ++; faceVertices[ixV] = redu * shCry.geometry.p_n[tdBs].coo[0];
           ixV ++; faceVertices[ixV] = redu * shCry.geometry.p_n[tdBs].coo[2];
           ixV ++; faceVertices[ixV] = redu * shCry.geometry.p_n[tdBs].coo[1];

           //alert(ixV + "  "  + crShape.vertices[ixV] + "  " + crShape.vertices);

        }


        for( let j = 1; j<shCry.geometry.pl_n[pNm].pPolygon.length -1; j++){
           ixI ++; faceIndexes.push(pln0);
           ixI ++; faceIndexes.push(pln0 + j);
           ixI ++; faceIndexes.push(pln0 + j + 1);
        }




        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute( 'position', new THREE.BufferAttribute( faceVertices, 3 ) );
        geometry.setIndex( faceIndexes );
        geometry.computeVertexNormals();

        let material;
        if(shCry.geometry.pl_n[pNm].nameCode == 201){
           material =  new THREE.MeshMatcapMaterial({ color: 0xaaccff, transparent: true, opacity: 0.90, side: THREE.DoubleSide })
        } else {
           material =  new THREE.MeshPhongMaterial({ color: 0x99ccff, transparent: true, opacity: 0.60, side: THREE.DoubleSide })
        }


        //const material =  new THREE.MeshMatcapMaterial({ color: 0xaaccff, transparent: true, opacity: 0.90, side: THREE.DoubleSide })
        //const material =  new THREE.MeshBasicMaterial({ color: 0xaaccff, transparent: true, opacity: 0.90, side: THREE.DoubleSide })

        //const material =  new THREE.MeshPhysicalMaterial({ color: 0x99ccff, transparent: true, opacity: 0.60, side: THREE.DoubleSide })
        //const material =  new THREE.MeshPhongMaterial({ color: 0x99ccff, transparent: true, opacity: 0.60, side: THREE.DoubleSide })
        //const material = new THREE.MeshStandardMaterial({color: 0x99ccff, transparent: true, opacity: 0.60, side: THREE.DoubleSide })




         matName = 'Mat_' + codeName + zn.toString() +"_"+ i.toString()
         mexhName = codeName + zn.toString() +"_"+ i.toString()


         const cryMesh = new THREE.Mesh( geometry, material );

         cryMesh.name =mexhName;
         cryMesh.castShadow = true;
         cryMesh.receiveShadow = true;

         qzBlock.add(cryMesh);


     }

  }
  
  shPack.push(qzBlock)
  return shPack;
  
  
  

}




function sceneIntro( sceneIntro,  qrz = null){

  if(qrz != null){
   guiName = 'Crystal'; codeName = 'Cry_';
   var crPack=[];
   crPack = setShapeFace(qrz,codeName);



   crPack[2].position.set(-2, 0.5, 0);
   sceneIntro.add(crPack[2]);
   crystals.push(crPack);
   
   const crFolder = gui.addFolder(guiName)
   crFolder.add(qzBlock.rotation, 'x', 0, Math.PI * 2).name('Rotate X Axis')
   crFolder.add(qzBlock.rotation, 'y', 0, Math.PI * 2).name('Rotate Y Axis')
   crFolder.add(qzBlock.rotation, 'z', 0, Math.PI * 2).name('Rotate Z Axis')

   crFolder.add(crShow, "faceSel").name('Enable Face Selection').onChange((value) => {
      console.log(value);
   });
   crFolder.open();
  }




}




function sceneCutting( sceneCut, qzCr = null){
 
   if(qzCr != null){
   
      qrz =  Object.assign({},  qzCr); // clone
      oriPak = []; oriPak.push(qrz);
    
      cutQz = crystalCut(qrz)
      guiName = 'Cut block'; codeName = 'Cut_';
      
      var cutPack = [];
      cutPack =setShapeFace(cutQz, codeName);
      cutPack[2].position.set(-2, 5, 0);
      sceneCut.add(cutPack[2]);
      crystals.push(cutPack);



      const crFolder = gui.addFolder(guiName)
      crFolder.add(qzBlock.rotation, 'x', 0, Math.PI * 2).name('Rotate X Axis')
      crFolder.add(qzBlock.rotation, 'y', 0, Math.PI * 2).name('Rotate Y Axis')
      crFolder.add(qzBlock.rotation, 'z', 0, Math.PI * 2).name('Rotate Z Axis')
   
      crFolder.add(crShow, "faceSel").name('Enable Face Selection').onChange((value) => {
         console.log(value);
      });
      crFolder.open();
    
   
   }

}




function crystalCut(qzOri){

   cutNorm =new THREE.Vector3(0,1,0);
   cutNorm.normalize() ;
   //cutNorm.multiplyScalar(-1);
   cutPlane = new planeEq();
   cutPlane.eq[0] = cutNorm.x; cutPlane.eq[1] = cutNorm.y; cutPlane.eq[2] = cutNorm.z;
   cutPlane.eq[3] = 50;

   
   let qzCut  =new  quartzCrystal();
   
   var dictVx = {};
   var dictLn = {};
   var dictPln = {};
   var dictZn = {};

   fillDict(dictVx, qzOri.geometry.nmbPoints_n);
   fillDict(dictLn, qzOri.geometry.nmbLines_n);
   fillDict(dictPln, qzOri.geometry.nmbPlanes_n);
   fillDict(dictZn, qzOri.geometry.nmbZones_n);

   var ixVx = -1; var ixLn = -1; var ixPln = -1; var ixZn = -1;
   var ctVx = -1; var ctLn = -1; var ctPln = -1; var ctZn = -1;
   var fgVx = false; var fgLn = false; var fgPln = false; var fgZn = false;
   qzCut.geometry.p_n = [];
   qzCut.geometry.li_n = [];
   qzCut.geometry.pl_n = [];
   qzCut.geometry.plk_n =[];
   qzCut.geometry.zone_n = [];
   
   for (let zn = 0; zn < qzOri.geometry.nmbZones_n; zn++){
      fgZn=true;        
      newCutPlane = new planeChar();
      for(let i = 0; i< qzOri.geometry.zone_n[zn].nmbPlanes; i++){
         pNm = Math.abs(qzOri.geometry.zone_n[zn].plane[i]);
         if(dictPln[pNm] == -1){        
            fgPln=true; 
            gravityPl = new vectorPoint([0,0,0]); gravityPlCnt =0;
                      
            for( let j = 0; j< qzOri.geometry.pl_n[pNm].pLine.length; j++){
               
               lin =  Math.abs(qzOri.geometry.pl_n[pNm].pLine[j]);
               v1= qzOri.geometry.li_n[lin].vx[0];  
               dis1 = pointPlaneDist(qzOri.geometry.p_n[v1], cutPlane)
               v2= qzOri.geometry.li_n[lin].vx[1];  
               dis2 = pointPlaneDist(qzOri.geometry.p_n[v2], cutPlane)
               
               newLn = new lineVertices() ; 
               if(Math.sign(dis1) > -epsilon && Math.sign(dis2) > -epsilon){    //---------------------
                  
                  if(dictVx[v1] == -1){ qzCut.geometry.p_n.push( new vectorPoint(qzOri.geometry.p_n[v1].coo)); 
                     ctVx = qzCut.geometry.p_n.length-1; dictVx[v1] = ctVx; ixVx = ctVx; }
                  else{ ixVx = dictVx[v1];}
                  newLn.vx[0] = ixVx;
   
                  if(dictVx[v2] == -1){ qzCut.geometry.p_n.push( new vectorPoint(qzOri.geometry.p_n[v2].coo)); 
                     ctVx = qzCut.geometry.p_n.length-1;dictVx[v2] = ctVx;ixVx = ctVx; }
                  else{ ixVx = dictVx[v2];}
                  newLn.vx[1] = ixVx;
                  
                  fgLn=true; 

               }else if(Math.sign(dis1) > -epsilon && Math.sign(dis2) < -epsilon){    //---------------------
            
                  if(dictVx[v1] == -1){ qzCut.geometry.p_n.push( new vectorPoint(qzOri.geometry.p_n[v1].coo)); 
                     ctVx = qzCut.geometry.p_n.length-1;dictVx[v1] = ctVx; ixVx = ctVx; }
                  else{ ixVx = dictVx[v1];}
                  newLn.vx[0] = ixVx;
                     
                  if(dictVx[v2] == -1){
                     newP = pointPlaneIntersection(qzOri.geometry.p_n[v1], qzOri.geometry.p_n[v2], cutPlane)
                     qzCut.geometry.p_n.push( new vectorPoint(newP.coo));
                     ctVx = qzCut.geometry.p_n.length-1; ixVx = 1000+ctVx; dictVx[v2] = ixVx; 
                  
                  }
                  else{ ixVx = dictVx[v2];}
                  newLn.vx[1] = ixVx;
                  
                  fgLn=true;

      
               }else if(Math.sign(dis1) < -epsilon && Math.sign(dis2) > -epsilon){    //---------------------
                  if(dictVx[v1] == -1){
                     newP = pointPlaneIntersection(qzOri.geometry.p_n[v1], qzOri.geometry.p_n[v2], cutPlane)
                     qzCut.geometry.p_n.push( new vectorPoint(newP.coo));
                     ctVx = qzCut.geometry.p_n.length-1; ixVx = 1000+ctVx; dictVx[v1] = ixVx; 
                  }
                  else{ ixVx = dictVx[v1];}
                  newLn.vx[0] = ixVx;
                     
                  if(dictVx[v2] == -1){ qzCut.geometry.p_n.push( new vectorPoint(qzOri.geometry.p_n[v2].coo)); 
                     ctVx = qzCut.geometry.p_n.length-1;dictVx[v2] = ctVx;ixVx = ctVx; }
                  else{ ixVx = dictVx[v2];}
                  newLn.vx[1] = ixVx;
                  fgLn=true; 

      
               }else if(Math.sign(dis1) < -epsilon && Math.sign(dis2) < -epsilon){    //---------------------
            
               }
   //-----------------------------------------------------------------------
      
               if(fgZn){
                  if(dictZn[zn] == -1){ctZn++; dictZn[zn] = ctZn;ixZn = ctZn; qzCut.geometry.zone_n.push(new zoneChar); }
                  fgZn = false;
               }
               
               if(fgPln){
                  if(dictPln[pNm] == -1){ ctPln++; ixPln = ctPln; dictPln[pNm] = ctPln; 
                     qzCut.geometry.pl_n.push(new planeChar); 
                     qzCut.geometry.plk_n.push(qzOri.geometry.plk_n[pNm]);
                     qzCut.geometry.pl_n[ixPln].pLine = []
                  }
                   qzCut.geometry.zone_n[ixZn].plane.push(ixPln);
                  fgPln = false;
               }
               if(fgLn  ){
                  if (newLn.vx[1]< newLn.vx[0]) newLn.vx.reverse();
                  if(dictLn[lin] == -1){ ctLn++; ixLn =ctLn; dictLn[lin] = ctLn;  qzCut.geometry.li_n.push(newLn);}
                  else {ixLn = dictLn[lin];}
                  qzCut.geometry.pl_n[ixPln].pLine.push(ixLn);
                  pLn= qzCut.geometry.li_n[ixLn];
                  
                  fgLn=false;
               }
            }
         
            cutLn = new lineVertices(); lclIx=0; cutLn.vx =[-1,-1];
            for( let j = 0; j< qzCut.geometry.pl_n[ixPln].pLine.length; j++){
               clin =  Math.abs(qzCut.geometry.pl_n[ixPln].pLine[j]);
               for( let k = 0;k<2;k++){
                  if(qzCut.geometry.li_n[clin].vx[k]>999){
                     cutLn.vx[lclIx] = qzCut.geometry.li_n[clin].vx[k]; lclIx++;
                  }
               }
               
            }
            if (cutLn.vx[0]>-1 && cutLn.vx[1]>-1){
               ctLn++; ixLn =ctLn; qzCut.geometry.li_n.push(cutLn);
               qzCut.geometry.pl_n[ixPln].pLine.push(ixLn);
               newCutPlane.pLine.push(ixLn);
             }
         }
       }
      
       if (newCutPlane .pLine.length >2){ 
         qzCut.geometry.pl_n.push(newCutPlane);
         qzOri.geometry.zone_n[zn].plane.push(qzCut.geometry.pl_n.length-1)
       }
   
   }
   
   
   
   qzCut.geometry.nmbZones_n = ctZn + 1;
   qzCut.geometry.nmbPlanes_n = ctPln + 1;
   qzCut.geometry.nmbLines_n = ctLn + 1;
   qzCut.geometry.nmbPoints_n = ctVx + 1;

   for( let i = 0; i< qzCut.geometry.pl_n.length; i++){
      for( let j = 0; j< qzCut.geometry.pl_n[i].pLine.length; j++){
         clin =  Math.abs(qzCut.geometry.pl_n[i].pLine[j]);
         for( let k = 0;k<2;k++){
            if(qzCut.geometry.li_n[clin].vx[k]>999) qzCut.geometry.li_n[clin].vx[k]-=1000;
            vxPl = qzCut.geometry.p_n[qzCut.geometry.li_n[clin].vx[k]];
            qzCut.geometry.pl_n[i].gravityC.add(vxPl);
         }
      }
   }

   for( let zn = 0; zn< qzCut.geometry.nmbZones_n; zn ++){
      qzCut.geometry.zone_n[zn].nmbPlanes =  qzCut.geometry.zone_n[zn].plane.length;
      for(let i = 0; i< qzCut.geometry.zone_n[zn].nmbPlanes; i++){
         pNm = Math.abs(qzCut.geometry.zone_n[zn].plane[i]);
         qzCut.geometry.pl_n[pNm].nmbLines = qzCut.geometry.pl_n[pNm].pLine.length;
         for (let g=0;g<3;g++) qzCut.geometry.pl_n[pNm].gravityC.coo[g] /=(qzCut.geometry.pl_n[pNm].nmbLines*2)
         qzCut.geometry.zone_n[zn].gravityC.add(qzCut.geometry.pl_n[pNm].gravityC);
      }
      for (let g=0;g<3;g++) qzCut.geometry.zone_n[zn].gravityC.coo[g] /=qzCut.geometry.zone_n[zn].nmbPlanes
   } 
    
   polyQq =  addPolygons(qzCut);
    
   return polyQq;
}

function fillDict(dict,sz){
   for( let i =0; i<sz;i++){  dict[i] = -1 }
}

function pointPlaneDist(p, plEq){
  var su =0;
  for(let i = 0; i < 3; i++){
   su += p.coo[i] * plEq.eq[i] 
  }
  return su - plEq.eq[3]
}

function pointPlaneIntersection(p1, p2, plEq){
   dist1 = Math.abs(pointPlaneDist(p1, plEq));
   dist2 = Math.abs(pointPlaneDist(p2, plEq));
   dist = dist1 + dist2
   if(dist<epsilon) return p1;
   rsh =  dist1/(dist);
   pInt = new vectorPoint([0,0,0])
   for(let i = 0; i < 3; i++){
      pInt.coo[i] =  p2.coo[i] * rsh + p1.coo[i] *(1 - rsh);
   }
   return pInt;
 }





