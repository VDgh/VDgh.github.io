
const epsilon = 1.0e-4;

let crStructure = {
   rightAlpha: true,
   leftAlpha: false,
   beta: false
};

let crShow = {
   faceSel: true
};

let redu=0;
let crystals = [];



function setShapeFace(qzCr, codeName){
   shCry =  Object.assign({},  qzCr);
   shPack = [];
   qzBlock = new THREE.Group();
   shPack.push(shCry);
   
 const zonesToShow = [0, 1];


 crOffset =new vectorPoint([0,0,0]); //   shCry.geometry.zone_n[0].gravityC;
 let maxDs =1;
  for(let i = 0; i< shCry.geometry.nmbPoints_n; i++){
     for( let j=0; j<3; j++){
       maxDs = Math.max(maxDs, Math.abs(shCry.geometry.p_n[i].coo[j] - crOffset.coo[j]));
     }
  }

 if(redu==0) redu =3/maxDs;

   shPack.push(redu);

   for( zn of zonesToShow){
     if (zn>0) alfa =1;
     for(let i = 0; i< shCry.geometry.zone_n[zn].plane.length; i++){
         pNm = Math.abs(shCry.geometry.zone_n[zn].plane[i]);
         ixV = -1; ixI = -1;
         pln0 = ixV+1;
         polyLength = shCry.geometry.pl_n[pNm].pPolygon.length
         faceVertices = new Float32Array( polyLength*3 );
         faceIndexes = []; //  new Uint16Array( thriAng*3 );
         for( let j = 0; j< polyLength; j++){
            tdBs= shCry.geometry.pl_n[pNm].pPolygon[j];
            ixV ++; faceVertices[ixV] = redu * shCry.geometry.p_n[tdBs].coo[0];
            ixV ++; faceVertices[ixV] = redu * shCry.geometry.p_n[tdBs].coo[2];
            ixV ++; faceVertices[ixV] = redu * shCry.geometry.p_n[tdBs].coo[1];
         }
         for( let j = 1; j<shCry.geometry.pl_n[pNm].pPolygon.length -1; j++){
            ixI ++; faceIndexes.push(pln0);
            ixI ++; faceIndexes.push(pln0 + j);
            ixI ++; faceIndexes.push(pln0 + j + 1);
            // ixI ++; faceIndexes.push(pln0 + j + 1);
            // ixI ++; faceIndexes.push(pln0 + j);
            // ixI ++; faceIndexes.push(pln0);
         }
         const geometry = new THREE.BufferGeometry();
         geometry.setAttribute( 'position', new THREE.BufferAttribute( faceVertices, 3 ) );
         geometry.setIndex( faceIndexes );
         geometry.computeVertexNormals();
         // geometry.applyMatrix( new THREE.Matrix4().makeRotationY( Math.PI ) );

        let material;
        if(shCry.geometry.pl_n[pNm].nameCode == 201){
           material =  new THREE.MeshMatcapMaterial({ color: 0xaaccff, transparent: true, opacity: 0.90, side: THREE.DoubleSide })
        } else {
           material =  new THREE.MeshPhongMaterial({ color: 0x99ccff, transparent: true, opacity: 0.90, side: THREE.FrontSide})
        }

         //THREE.FrontSide, THREE.BackSide, THREE.DoubleSide.
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



let crPack=[];

function sceneIntro( sceneIntro,  qrz = null){

  if(qrz != null){
   guiName = 'Crystal'; codeName = 'Cry_';
   
   crPack = setShapeFace(qrz,codeName);
   //crPack[2].scale.set(.03,.03,.03);
   crPack[2].position.copy(scnIntroCenter);
   crPack[2].position.x-=1.5
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

  animGauge=0;
  placeStucture(sceneIntro,animGauge)

 

   const struFolder = gui.addFolder('Quartz Structure')
   struFolder.add(crStructure,'rightAlpha').name('Right Alpha Quartz').listen().onChange((value) => {if(value)struChange(sceneIntro,0);});
   struFolder.add(crStructure,'leftAlpha').name('Left Alpha Quartz').listen().onChange((value) => {if(value)struChange(sceneIntro,2);});
   struFolder.add(crStructure,'beta').name('Beta Quartz').listen().onChange((value) => {if(value)struChange(sceneIntro,1);});
   struFolder.open();
 
}
let oldStru = 0;


async function struChange(sceneIntro,newStru){
   if(newStru != 0 ) crStructure.rightAlpha = false;
   if(newStru != 2 ) crStructure.leftAlpha = false;
   if(newStru != 1 ) crStructure.beta = false;
   if (oldStru != undefined){
      for(let i1 = 0; i1<=10; i1++ ){
         anim = oldStru*(1-i1/10.0) + i1/10*newStru;
         placeStucture(sceneIntro,anim);
          await delay(30);
      }
  
   }
   oldStru = newStru;

}

function delay(time) {
   return new Promise(resolve => setTimeout(resolve, time));
 }
 
 

function placeStucture(sceneIntro,animGauge){

   position = new THREE.Vector3();
   position.copy(scnIntroCenter);
   position.x += 1.2;
   position.z += 2.5;
   showStructure(sceneIntro, tetraType, animGauge, position,.3);
   //sceneIntro.add(tetraGroup);

   position = new THREE.Vector3();
   position.copy(scnIntroCenter);
   position.x += 1.5;
   position.z += 1.0;
   showStructure(sceneIntro, cellType, animGauge, position, .2);
   //sceneIntro.add(cellGroup);

   position = new THREE.Vector3();
   position.copy(scnIntroCenter);
   position.x += 1.2;
   position.z -= 1.5;  
   showStructure(sceneIntro, bulkType, animGauge, position,.15);
   //sceneIntro.add(bulkGroup);




}







let cutPack = [];
function sceneCutting( sceneCut, qzCr = null){
 
  


  
  
   if(qzCr != null){
   
      qrz =  Object.assign({},  qzCr); // clone
     // oriPak = []; oriPak.push(qrz);
      cutDis = 20;
      cutNorm =new THREE.Vector3(.7,1,.4);
      cutNorm.normalize() ;
      //cutNorm.multiplyScalar(-1);
      
      cutPlane = new planeEq();
      cutPlane.eq[0] = cutNorm.x; cutPlane.eq[1] = cutNorm.y; cutPlane.eq[2] = cutNorm.z;
      cutPlane.eq[3] = cutDis;
      
      cutQz = new Array(2);
      
      for(let c = 0;c < cutQz.length; c++){
         cutNorm.multiplyScalar(-1);
         cutPlane.eq[0] = cutNorm.x; cutPlane.eq[1] = cutNorm.y; cutPlane.eq[2] = cutNorm.z;
         cutDis += 2; cutPlane.eq[3] = Math.sign(cutNorm.y)*cutDis
         cutQz[c] = crystalCut(qrz,cutPlane)
      }
      
      


      for(let c = 0;c < cutQz.length; c++){
         guiName = 'Cut block'; codeName = 'Cut_' + c+ "-";
         cutPack =setShapeFace(cutQz[c], codeName);
        // cutPack[2].position.set( 5,0,5);
         cutPack[2].position.copy(scnCutCenter);
         sceneCut.add(cutPack[2]);
         crystals.push(cutPack);
      }
      // const crFolder = gui.addFolder(guiName)
      // crFolder.add(qzBlock.rotation, 'x', 0, Math.PI * 2).name('Rotate X Axis')
      // crFolder.add(qzBlock.rotation, 'y', 0, Math.PI * 2).name('Rotate Y Axis')
      // crFolder.add(qzBlock.rotation, 'z', 0, Math.PI * 2).name('Rotate Z Axis')
   
      // crFolder.add(crShow, "faceSel").name('Enable Face Selection').onChange((value) => {
      //    console.log(value);
      // });
      // crFolder.open();
    
   
   }

}






function crystalCut(qzOri,cutPlnEq){

    
   let qzCut  =new  quartzCrystal();
   
   var dictVx = {};
   var dictLn = {};
   var dictPln = {};
 
   fillDict(dictVx, qzOri.geometry.p_n.length);
   fillDict(dictLn, qzOri.geometry.li_n.length);
   fillDict(dictPln, qzOri.geometry.pl_n.length);

   var ixVx = -1; var ixLn = -1; var ixPln = -1; 
   var fgLn = false;
  
   qzCut.geometry.p_n = [];
   qzCut.geometry.li_n = [];
   qzCut.geometry.pl_n = [];
   qzCut.geometry.plk_n =[];
   qzCut.geometry.zone_n = [];
   
   for (let zn = 0; zn < qzOri.geometry.zone_n.length; zn++){
      newZone  = Object.assign({},  qzOri.geometry.zone_n[zn]);
      newZone.plane=[]; newZone.nmbPlanes = 0;
      newCutPlane = new planeChar();
      addZone = false;
      for(let i = 0; i< qzOri.geometry.zone_n[zn].nmbPlanes; i++){
         pNm = Math.abs(qzOri.geometry.zone_n[zn].plane[i]);
         ixPln =-1;
         if(dictPln[pNm]){
            newPlane  = Object.assign({},  qzOri.geometry.pl_n[pNm]);
            newPlane.pLine=[]; newPlane.pPolygon=[]; newPlane.nmbLines = 0;
            newCutLine = new lineVertices();      
            gravityPl = new vectorPoint([0,0,0]); gravityPlCnt =0;
            for( let j = 0; j< qzOri.geometry.pl_n[pNm].pLine.length; j++){
               lin =  Math.abs(qzOri.geometry.pl_n[pNm].pLine[j]);
               if(dictLn[lin] == -1){
   
                  v1= qzOri.geometry.li_n[lin].vx[0];  
                  dis1 = pointPlaneDist(qzOri.geometry.p_n[v1], cutPlnEq)
                  v2= qzOri.geometry.li_n[lin].vx[1];  
                  dis2 = pointPlaneDist(qzOri.geometry.p_n[v2], cutPlnEq)
                  
                  newLn = new lineVertices() ; 
                  if(Math.sign(dis1) > -epsilon && Math.sign(dis2) > -epsilon){    //---------------------
                     
                     if(dictVx[v1] == -1){ qzCut.geometry.p_n.push( new vectorPoint(qzOri.geometry.p_n[v1].coo)); 
                        ixVx = qzCut.geometry.p_n.length-1;dictVx[v1] = ixVx; }
                        else{ ixVx = dictVx[v1];}
                     newLn.vx[0] = ixVx;
      
                     if(dictVx[v2] == -1){ qzCut.geometry.p_n.push( new vectorPoint(qzOri.geometry.p_n[v2].coo)); 
                        ixVx = qzCut.geometry.p_n.length-1;dictVx[v2] = ixVx; }
                        else{ ixVx = dictVx[v2];}
                     newLn.vx[1] = ixVx;
  
                     fgLn=true;
      
                  }else if(Math.sign(dis1) > -epsilon && Math.sign(dis2) < -epsilon){    //---------------------
            
                     if(dictVx[v1] == -1){ qzCut.geometry.p_n.push( new vectorPoint(qzOri.geometry.p_n[v1].coo)); 
                        ixVx = qzCut.geometry.p_n.length-1;dictVx[v1] = ixVx; }
                    else{ ixVx = dictVx[v1];}
                     newLn.vx[0] = ixVx;
                        
                     if(dictVx[v2] == -1){
                        newP = pointPlaneIntersection(qzOri.geometry.p_n[v1], qzOri.geometry.p_n[v2], cutPlnEq)
                        qzCut.geometry.p_n.push( new vectorPoint(newP.coo));
                        ixVx = qzCut.geometry.p_n.length-1 + 1000 ; dictVx[v2] = ixVx; 
                     }
                     else{ ixVx = dictVx[v2];}
                     newLn.vx[1] = ixVx;
                     
                     fgLn=true;
                  
                  }else if(Math.sign(dis1) < -epsilon && Math.sign(dis2) > -epsilon){    //---------------------
                     if(dictVx[v1] == -1){
                        newP = pointPlaneIntersection(qzOri.geometry.p_n[v1], qzOri.geometry.p_n[v2], cutPlnEq)
                        qzCut.geometry.p_n.push( new vectorPoint(newP.coo));
                        ixVx = qzCut.geometry.p_n.length-1 + 1000 ; dictVx[v1] = ixVx; 
                     }
                     else{ ixVx = dictVx[v1];}
                     newLn.vx[0] = ixVx;
                        
                     if(dictVx[v2] == -1){ qzCut.geometry.p_n.push( new vectorPoint(qzOri.geometry.p_n[v2].coo)); 
                        ixVx = qzCut.geometry.p_n.length-1;dictVx[v2] = ixVx; }
                     else{ ixVx = dictVx[v2];}
                     newLn.vx[1] = ixVx;
                     
                     fgLn=true; 
         
                  }else if(Math.sign(dis1) < -epsilon && Math.sign(dis2) < -epsilon){}  // no line  ---------------
                  //-----------------------------------------------------------------------                  

                  if(fgLn  ){
                     if (newLn.vx[1]< newLn.vx[0]) newLn.vx.reverse();
                     qzCut.geometry.li_n.push(newLn);
                     ixLn = qzCut.geometry.li_n.length - 1; 
                     dictLn[lin] = ixLn;  
                  }  else {ixLn = -1}          
               } else {ixLn = dictLn[lin];}
               if(ixLn> -1){
                  newPlane.pLine.push(ixLn);
                }
               fgLn=false;
            }
 
            cutLn = new lineVertices(); lclIx=0; cutLn.vx =[-1,-1];
            for( let j = 0; j< newPlane.pLine.length; j++){
               clin =  Math.abs(newPlane.pLine[j]);
               for( let k = 0;k<2;k++){
                  if(qzCut.geometry.li_n[clin].vx[k]>999){
                     cutLn.vx[lclIx] = qzCut.geometry.li_n[clin].vx[k]; lclIx++;
                  }
               }
            }
            if (cutLn.vx[0]>-1 && cutLn.vx[1]>-1){
               qzCut.geometry.li_n.push(cutLn);
               ixLn = qzCut.geometry.li_n.length-1;
               newCutPlane.pLine.push(ixLn);
               newPlane.pLine.push(ixLn);
            }
 
            if (newPlane.pLine.length>2){
               qzCut.geometry.plk_n.push(qzOri.geometry.plk_n[pNm]);
               qzCut.geometry.pl_n.push(newPlane);
               ixPln = qzCut.geometry.pl_n.length-1;

            }
         }else{ ixPln= dictPln[pNm]; }
 
         if(ixPln>-1){ newZone.plane.push(ixPln); }
      }
      
      if (newCutPlane.pLine.length >2){ 
         qzCut.geometry.pl_n.push(newCutPlane);
         qzCut.geometry.plk_n.push(cutPlnEq);
         newZone.plane.push(qzCut.geometry.pl_n.length-1)
      }
      
      if (newZone.plane.length>3){ qzCut.geometry.zone_n.push(newZone)}
   }      
        
  
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`` 
      
   qzCut.geometry.nmbZones_n = qzCut.geometry.zone_n.length;
   qzCut.geometry.nmbPlanes_n = qzCut.geometry.pl_n.length;
   qzCut.geometry.nmbLines_n = qzCut.geometry.li_n.length;
   qzCut.geometry.nmbPoints_n = qzCut.geometry.p_n.length;

  //=====1000=========================
  
   for( let i = 0; i< qzCut.geometry.pl_n.length; i++){
      mxX=0; mxY=0;mxZ=0; cnt=0; suX=0;suY=0;suZ=0;
      for( let j = 0; j< qzCut.geometry.pl_n[i].pLine.length; j++){
         clin =  Math.abs(qzCut.geometry.pl_n[i].pLine[j]);
          for( let k = 0;k<2;k++){
            if(qzCut.geometry.li_n[clin].vx[k]>800) qzCut.geometry.li_n[clin].vx[k]-=1000;
            vxPl = qzCut.geometry.p_n[qzCut.geometry.li_n[clin].vx[k]];
            cnt++;
            suX += vxPl.coo[0];suY += vxPl.coo[1];suZ += vxPl.coo[2];
         }
      }
      qzCut.geometry.pl_n[i].gravityC.coo = [suX/cnt, suY/cnt, suZ/cnt];
      qzCut.geometry.pl_n[i].nmbLines = qzCut.geometry.pl_n[i].pLine.length;
 //console.log(i, " plane i " ,cnt,mxX,mxY,mxZ,  qzCut.geometry.pl_n[i].gravityC.coo);
   }
   //===gravityC========================================
   for( let zn = 0; zn< qzCut.geometry.nmbZones_n; zn ++){
      qzCut.geometry.zone_n[zn].nmbPlanes =  qzCut.geometry.zone_n[zn].plane.length;
      suX = 0; suY = 0; suZ = 0;
      for(let i = 0; i< qzCut.geometry.zone_n[zn].nmbPlanes; i++){
         pNm = Math.abs(qzCut.geometry.zone_n[zn].plane[i]);
         pNm = Math.abs(qzCut.geometry.zone_n[zn].plane[i]);
         suX += qzCut.geometry.pl_n[pNm].gravityC.coo[0];
         suY += qzCut.geometry.pl_n[pNm].gravityC.coo[1];
         suZ += qzCut.geometry.pl_n[pNm].gravityC.coo[2];
         cnt++;
//console.log(pNm, " pNm " , qzCut.geometry.pl_n[pNm].gravityC.coo)
      }
      qzCut.geometry.zone_n[zn].gravityC.coo = [suX/cnt, suY/cnt, suZ/cnt];
//console.log(zn, " zn " , qzCut.geometry.zone_n[zn].gravityC.coo)
   } 
    
//============================lines====================================================

   for(let pNm = 0; pNm< qzCut.geometry.pl_n.length; pNm++){
      fly = -1; 
      if(qzCut.geometry.pl_n[pNm].pLine.length>2) {  
         continueTest = true;
         for (let test=0; test<3; test++) {   
            if( ! continueTest) break;
            continueTest = false;
            lines =qzCut.geometry.pl_n[pNm].pLine;
            if(test == 3 ) lines= lines.reverse();
            trg = qzCut.geometry.li_n[lines[0]].vx[1];
            if(test == 2 ) trg = qzCut.geometry.li_n[lines[0]].vx[0];
            for( let j = 1; j<lines.length; j++){
               fly = lines[j];
               for( let k = j; k<lines.length; k++){
                  if( qzCut.geometry.li_n[Math.abs(lines[k])].vx[0] ==trg ){
                     trg =qzCut.geometry.li_n[Math.abs(lines[k])].vx[1];
                     lines[j] =lines[k]; lines[k] = fly; 
                        break; 
                  }
                  else if ( qzCut.geometry.li_n[Math.abs(lines[k])].vx[1] ==trg ){
                     trg =qzCut.geometry.li_n[Math.abs(lines[k])].vx[0]; 
                     lines[j] =-lines[k]; lines[k] = fly; 
                        break;
                  }
                  if(k == lines.length-1) continueTest = true;
               }
            }
         }
      }
      qzCut.geometry.pl_n[pNm].pLine = lines;
   }

   polyQz =  addPolygons(qzCut);
    
   return polyQz;
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





