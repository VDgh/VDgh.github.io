
    let  vectorPoint = class{  
        coo = [3];
        constructor(coo){this.coo = coo;}
    };
 
    let  planeEq = class{  constructor(){}  eq = [4]; };
            
    let  lineVertices = class{ constructor(){} vx =new Array(2); };
 
    let  planeChar = class{ constructor(){} 
                    nameCode = 0;                           // kod na imeto na ploskostta
                    nmbLines = 0;
                    pLine = [];
                    pPolygon = [];
                    pArea = 0;                              // plosht v mm^2
                    gravityC = new vectorPoint([0,0,0]);    // cent@r na tejest
                    pGrowthRate = 0;
                    iniGrowthTyp = 0;                        // tip nachalo v@rhu zarodisha 3-ploscost 2-linia  1-tochka
                    iniGrowthNmb = 0;                        // nomer tochka.linia ploskost na zarodisha
                    };
    
    let  grPlaneChar = {
                        'nameCode' : [],                            // kod na imeto na ploskostta
                        'specialName' : [],                         // kod na imeto na ploskostta
                        'specialName2' : '',                        // kod na imeto na ploskostta
                        'growthRate' : 0,
                        'iniGrowthTyp' : 0,                         // tip nachalo v@rhu zarodisha 3-ploscost 2-linia  1-tochka
                        'iniGrowthNmb' : 0,                         // nomer tochka.linia ploskost na zarodisha
                        'cutShape' : 0,                             // Koi polied@r ostawa 0 ili 1
                        'planeDrc' : 0                              // napravlenie na ploskostta za da e nav@n
                        };
                     
    let new_GrPlanes = {
                        'codeName' : 0,
                        'mbPlanes' : 0,
                        'char' : grPlaneChar[0],
                        'plk_g' : planeEq[0]
                        };
                    
    let zoneChar = class{ constructor(){} 
                        nameCode = 0;                        // kod na imeto na zonata
                        volume = 0;                          // obem na zonata v cm^3
                        gravityC = new vectorPoint([0,0,0]); // cent@r na tejest
                        nmbPlanes = 0;                       // broi ploskosti za zona
                        plane =[0];                          // nomera na ploskoste v zona
                      };
                    

    let quartzGeometry = class{ constructor(){} 
                          nmbPlanes_n = 0;     // broi ploskosti obshto
                          nmbLines_n = 0;      // broi linii obshto
                          nmbZones_n = 0;       // broi zoni obshto
                          nmbPoints_n = 0       // broi tochki obshto
                          plk_n = planeEq[0];
                          plk_r = planeEq[0];
                          pl_n = planeChar[0];                  
                          li_n = lineVertices[0];
                          p_n = vectorPoint[0];
                          p_r = vectorPoint[0];
                          zone_n = zoneChar[0];
                          nmbSpecialNames = 0;
                          specialPlNames = [0];
                       } ;                
                  
    let quartzCrystal = class{ constructor(){} 
                        cr_Name = "";
                        file = "";                  // k@de e zapisan kato "file"
                        cr_ID_Nmb = 0;              // nomer na kristala pri generirane
                        seedType = "";              // opisanie na zarodisha
                        //--------------------zarodish
                        dimzar = "";
                        orizar = ""; 
                        //--------------------israstvane
                        eff_z = 0;
                        debel = 0;
                        q_gr = 0;
                        //--------------------geometria
                        geometry = new quartzGeometry();
                        //--------------------plosht i teglo
                        rua = [];
                        ruw = [];
                      };
                  
 

let cryBt=[];
let pz=0;

function strLoadCrystal(crData){
 
    let stBt=[];
    for (var i = 0; i < crData.length; ++i) {
        var code = crData.charCodeAt(i);
        stBt = stBt.concat([code]);
    }
  
    return  loadCrystal(stBt);
}
     
function loadCrystal(crByt){
   
    cryBt=crByt;
   
    pz=0;
      
   let qrz  = new quartzCrystal(); 
    qrz.cr_Name = getString();
    qrz.cr_ID_Nmb = getInteger();
    qrz.dimzar = getString();
    qrz.orizar = getString();
    qrz.eff_z = getDouble();
    qrz.debel = getDouble();
    qrz.q_gr = getDouble();
    
    intVal = getInteger();
    qrz.geometry.nmbPlanes_n = intVal;
    qrz.geometry.pl_n = [intVal];
    qrz.geometry.plk_n = [intVal];
    qrz.geometry.plk_r= [intVal];
    
    intVal = getInteger();
    qrz.geometry.nmbLines_n = intVal;
    qrz.geometry.li_n = [intVal];

    intVal = getInteger();
    qrz.geometry.nmbPoints_n = intVal;
    qrz.geometry.p_n = [intVal];
    qrz.geometry.p_r = [intVal];
    
    intVal = getInteger();
    qrz.geometry.nmbZones_n = intVal;
    qrz.geometry.zone_n = [intVal];

    intVal = getInteger();
    qrz.geometry.nmbSpecialNames = intVal;
    qrz.geometry.specialPlNames = [intVal];


    for (let  i = 0; i < qrz.geometry.nmbPlanes_n; i++)
    {
        qrz.geometry.pl_n[i] = new planeChar();
        qrz.geometry.pl_n[i].nameCode = getInteger();
        qrz.geometry.pl_n[i].nmbLines = getInteger();
        qrz.geometry.pl_n[i].pLine = [qrz.geometry.pl_n[i].nmbLines];
        for (let j = 0; j < qrz.geometry.pl_n[i].nmbLines; j++)
        {
            qrz.geometry.pl_n[i].pLine[j] = getInteger();
         }
        qrz.geometry.pl_n[i].pArea = getDouble();
        coo =[];
        for (let j = 0; j < 3; j++) coo.push(getDouble());
        qrz.geometry.pl_n[i].gravityC = new vectorPoint(coo);

        qrz.geometry.pl_n[i].pGrowthRate = getDouble();
        qrz.geometry.pl_n[i].iniGrowthNmb = getInteger();
        
        qrz.geometry.plk_n[i] = new planeEq();
        qrz.geometry.plk_r[i] = new planeEq();
        for (let j = 0; j < 4; j++)
         {
            dbl = getDouble();
            qrz.geometry.plk_n[i].eq[j] = dbl;
            qrz.geometry.plk_r[i].eq[j] = dbl;
        }
    
    }


   for (let i = 0; i < qrz.geometry.nmbLines_n; i++)
   {
        qrz.geometry.li_n[i] = new lineVertices();
        for (let j = 0; j < 2; j++)
            qrz.geometry.li_n[i].vx[j] = getInteger();
   }

   for (let i = 0; i < qrz.geometry.nmbPoints_n; i++)
   {
        coo =[];
        for (let j = 0; j < 3; j++) coo.push(getDouble());
        qrz.geometry.p_n[i] = new vectorPoint(coo);
        qrz.geometry.p_r[i] = new vectorPoint(coo);
    }

    for (let i = 0; i < qrz.geometry.nmbZones_n; i++)
    {
        qrz.geometry.zone_n[i] =  new zoneChar();
        qrz.geometry.zone_n[i].nameCode = getInteger();
        qrz.geometry.zone_n[i].volume = getDouble();
        coo =[];
        for (let j = 0; j < 3; j++) coo.push(getDouble());
        qrz.geometry.zone_n[i].gravityC = new vectorPoint(coo);
        intVal = getInteger();
        qrz.geometry.zone_n[i].nmbPlanes = intVal;
        qrz.geometry.zone_n[i].plane = [intVal];
        for (let j = 0; j < qrz.geometry.zone_n[i].nmbPlanes; j++)
        {
            qrz.geometry.zone_n[i].plane[j] = getInteger();
        }
    }

    addPolygons(qrz); //-----------polygons--------

    return qrz;

}




function addPolygons(qrz){

    for(let zn = 0; zn< qrz.geometry.nmbZones_n; zn++){
       for(let i = 0; i< qrz.geometry.zone_n[zn].plane.length; i++){
    
            pNm = Math.abs(qrz.geometry.zone_n[zn].plane[i]);
           
           
            vOut =new Array(3);
            for(let j = 0; j < 3; j ++) {   
                vOut[j] = qrz.geometry.pl_n[pNm].gravityC.coo[j] - qrz.geometry.zone_n[zn].gravityC.coo[j];
            }
            const out = new THREE.Vector3(vOut[0],vOut[1],vOut[2]);
           
            stVx =-1 
          
           
            qrz.geometry.pl_n[pNm].pPolygon= new Array(qrz.geometry.pl_n[pNm].nmbLines);// [qrz.geometry.pl_n[pNm].nmbLines];
            stVx =-1 
            for( let j = 0; j<qrz.geometry.pl_n[pNm].pLine.length; j++){
                ln =  qrz.geometry.pl_n[pNm].pLine[j];
                if(j==0){
                    if(ln<0) {qrz.geometry.pl_n[pNm].pPolygon[j] = qrz.geometry.li_n[-ln].vx[1]; stVx = qrz.geometry.li_n[-ln].vx[0];}
                    else  {qrz.geometry.pl_n[pNm].pPolygon[j] = qrz.geometry.li_n[ln].vx[0]; stVx = qrz.geometry.li_n[ln].vx[1];}
                }
                else{
                    ln=Math.abs(ln);
                    if(qrz.geometry.pl_n[pNm].pPolygon[j-1]== qrz.geometry.li_n[ln].vx[1]  )
                       qrz.geometry.pl_n[pNm].pPolygon[j]= qrz.geometry.li_n[ln].vx[0];
                    else if(qrz.geometry.pl_n[pNm].pPolygon[j-1]== qrz.geometry.li_n[ln].vx[0]  )
                       qrz.geometry.pl_n[pNm].pPolygon[j]= qrz.geometry.li_n[ln].vx[1];
                    else {
                         
                        
                        for( let m =j+1; m<qrz.geometry.pl_n[pNm].nmbLines; m++){
                            ln1 = Math.abs(qrz.geometry.pl_n[pNm].pLine[m]);
                           
                            if(qrz.geometry.pl_n[pNm].pPolygon[j-1]== qrz.geometry.li_n[ln1].vx[1]  ){
                               qrz.geometry.pl_n[pNm].pPolygon[j]= qrz.geometry.li_n[ln1].vx[0];
                               qrz.geometry.pl_n[pNm].pLine[j] = ln1;qrz.geometry.pl_n[pNm].pLine[m] = ln;
                            }
                            else if(qrz.geometry.pl_n[pNm].pPolygon[j-1]== qrz.geometry.li_n[ln1].vx[0]  ){
                               qrz.geometry.pl_n[pNm].pPolygon[j]= qrz.geometry.li_n[ln1].vx[1];
                               qrz.geometry.pl_n[pNm].pLine[j] = ln1;qrz.geometry.pl_n[pNm].pLine[m] = ln;
                              
                            }
                        }
                    }
                }
            }
             
            
            
            
            
            
            
            
            
            
            poly =  qrz.geometry.pl_n[pNm].pPolygon;
             
//              if(i= qrz.geometry.zone_n[zn].plane.length-1)  
//              {
             
// console.log (zn, pNm,  qrz.geometry.pl_n[pNm].nmbLines)
// console.log (qrz.geometry.pl_n[pNm].pPolygon)
// console.log ('---P O L Y--------')
//              }

 
             if(poly.length>2){
                if(poly[poly.length-1] !=stVx) poly.push(stVx);
                v1 =new Array(3);v2 =new Array(3);
                for(let j = 0; j < 3; j ++){
                    v1[j] = qrz.geometry.p_n[poly[1]].coo[j] -qrz.geometry.p_n[poly[0]].coo[j];
                    v2[j] = qrz.geometry.p_n[poly[2]].coo[j] -qrz.geometry.p_n[poly[1]].coo[j];
                }
                const pV1= new THREE.Vector3(v1[0], v1[1], v1[2]);
                const pV2= new THREE.Vector3(v2[0], v2[1], v2[2]);
                const nVec =pV1.cross(pV2);
                eq = qrz.geometry.plk_n[pNm].eq;
                const norm= new THREE.Vector3(eq[0], eq[1], eq[2]);
                const zAx =  new THREE.Vector3(0, 0, 1);

                polyAngl = out.angleTo(nVec)*180/Math.PI;
               // normAngl = out.angleTo(norm)*180/Math.PI;
               // zAngl = Math.acos(out.dot(zAx));
 
//alert(pNm + "  " + polyAngl)


                if(Math.abs(polyAngl)<90){
                    qrz.geometry.pl_n[pNm].pPolygon= qrz.geometry.pl_n[pNm].pPolygon.reverse();
                }
                // if(Math.abs(normAngl)>90){
                //     for( let r=0;r<3;r++)qrz.geometry.plk_n[pNm].eq[r] *=-1; 
                // }
            }
        }    
    }
    
     return qrz;

}


//================================================================================================
//================================================================================================
//================================================================================================
//================================================================================================
//================================================================================================
//================================================================================================





normalizeVector = function(vec) {
    
    d=0;
    for( let i=0;i<3;i++) d+= vec[i]*vec[i];
    d=Math.sqrt(d);
    r= [3];
    for( let i=0;i<3;i++) r[i] =vec[i]/d;
    return r;
};




function getString(){
   
    strLen = getShortInt();
    bt1 = cryBt.slice(pz, pz+strLen);
    pz+=strLen;
    
    let str = bt1
    .map((byte) => { 
        return String.fromCharCode(byte); 
    }) 
    .join(""); 
    return str;
}

function  getInteger(){
    bt = cryBt.slice(pz, pz+4).reverse();
    pz+=4;
    var buf = new Uint8Array(bt).buffer;
    var view = new DataView(buf);
    try{
      return view.getInt32(0);
    }
      catch{
     alert( bt.length + "   " + pz + "   " + cryBt.length);
      }
}

function  getShortInt(){
    bt = cryBt.slice(pz, pz+2).reverse();
    pz+=2;
    var buf = new Uint8Array(bt).buffer;
    var view = new DataView(buf);
    return view.getInt16(0);
}

function  getSingle(){        
    bt = cryBt.slice(pz, pz+4).reverse();
    pz+=4;
    var buf = new Uint8Array(bt).buffer;
    var view = new DataView(buf);
    return view.getFloat32(0);


}

function  getDouble(){        
    bt = cryBt.slice(pz, pz+8).reverse();
    pz+=8;
    var buf = new Uint8Array(bt).buffer;
    var view = new DataView(buf);
    return view.getFloat64(0);
}

function addDouble(num){
   
    bytes = [0, 0, 0, 0, 0, 0, 0, 0];
    bts = [8];
    if (num == 0 ) return bytes;
    var buf = new Uint8Array(bytes).buffer
    var view = new DataView(buf);
    view.setFloat64(0,num);
    for( let i=0;i<8; i++){
        bts[i] = view.getInt8(i) ;
        if(bts[i]<0)bts[i]+=256;
    }
    return bts.reverse();
}





//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX


function readFloat(array){
    
    var buf = new Uint8Array(array).buffer
    var view = new DataView(buf);
    return view.getFloat32(0);
 }


function readInt(array) {
  
    var value = 0;
     for (var i = 0; i < array.length; i++) {
         value = (value << 8) | array[i];
     }
     return value;
 }
 
 function writeInt(n, bts = 4) {
     x = Number(n);
     var bytes = [];
     var i = bts;
     do {
     bytes[--i] = x & (255);
     x = x>>8;
     } while ( i )
     return bytes;
 }


 function int32ToBytes (int) {
    return [
      int & 0xff,
      (int >> 8) & 0xff,
      (int >> 16) & 0xff,
      (int >> 24) & 0xff
    ]
  }


//=================================================================


function readDouble(bytes,reverse){
    
    if (reverse) bytes=bytes.reverse();

    var buf = new Uint8Array(array).buffer
    var view = new DataView(buf);
    r1= view.getFloat64(0);



    sign = 1
    mantissa = bytes[1] % 2^4;
  
    for  ( let i = 2; i< 8; i++){
        mantissa = mantissa * 256 + bytes[i];
    }
    if (bytes[0] > 127) sign = -1 ;
    
    exponent = (bytes[0] % 128) * 16 + Math.floor(bytes[1] / 16);
    if (exponent == 0)     return 0;
        
    mantissa = (ldexp(mantissa, -52) + 1) * sign;
    
    r2=ldexp(mantissa, exponent - 1023);
    alert( "double " + "  " + r1 + "  " + r2);

    return ldexp(mantissa, exponent - 1023);
 


}


function writeDouble(num){
   
    bytes = [0, 0, 0, 0, 0, 0, 0, 0];
    if (num == 0 ) return bytes;
  
    anum = Math.abs(num);
    [mantissa, exponent] = frexp(anum);
 
    exponent = exponent - 1;
    mantissa = mantissa * 2 - 1;
    //sign = num >= anum & 128 | 0;
    sign= 128;if(num >= anum)sign=0;
  
    exponent = exponent + 1023;
  
    bytes[0] = sign + Math.floor(exponent / 16);
    mantissa = mantissa * 16;
    currentmantissa = Math.floor(mantissa);
    mantissa = mantissa - currentmantissa;
    bytes[1] = (exponent % 16) * 16 + currentmantissa;
    for  ( let i = 2; i< 8; i++){
        mantissa = mantissa * 256;
        currentmantissa = Math.floor(mantissa);
        mantissa = mantissa - currentmantissa;
        bytes[i] = currentmantissa;
    }
    
    // bytes=bytes.reverse();
    return bytes
}


//=================================================================


function ldexp(mantissa, exponent) {
    var steps = Math.min(3, Math.ceil(Math.abs(exponent) / 1023));
    var result = mantissa;
    for (var i = 0; i < steps; i++)
        result *= Math.pow(2, Math.floor((exponent + i) / steps));
    return result;
}


function frexp(value) {
    if (value === 0) return [value, 0];
    var data = new DataView(new ArrayBuffer(8));
    data.setFloat64(0, value);
    var bits = (data.getUint32(0) >>> 20) & 0x7FF;
    if (bits === 0) { // denormal
        data.setFloat64(0, value * Math.pow(2, 64));  // exp + 64
        bits = ((data.getUint32(0) >>> 20) & 0x7FF) - 64;
    }
    var exponent = bits - 1022;
    var mantissa = ldexp(value, -exponent);
    return [mantissa, exponent];
}

//=================================================================


