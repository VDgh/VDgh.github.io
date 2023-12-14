const tetraType = 0;
const cellType = 1;
const bulkType = 2;

const def_alpha_A0 = 4.91267
const def_alpha_C0 = 5.40442

const def_beta_A0 = 4.9039
const def_beta_C0 = 5.3914

let alpha_A0;
let alpha_C0;
let beta_A0;
let beta_C0;
let Si_O ;// distance Si-O 10e-10 m  
let Si_O_Si;// angle Si-O-Si

//custom_const();
//alpha ();
//alpha_beta(1);
//cellAlphaBeta(0);


function custom_const(){
   
   //si_O = 1.62   '  
    //Si_O_Si = 141.6405 // angle Si-O-Si

    //si_O = 1.617   '  
    //Si_O_Si = 142.1795 // angle Si-O-Si

    //si_O = 1.6136   '  
    //Si_O_Si = 142.8 // angle Si-O-Si

    //si_O = 1.61   '  
    //Si_O_Si = 143.4757 // angle Si-O-Si

    Si_O = 1.60725418   // distance Si-O 10e-10 m  
    Si_O_Si = 144.0     // angle Si-O-Si
  
   
    alpha_A0 = def_alpha_A0;
    alpha_C0 = def_alpha_C0;
    beta_A0 = def_beta_A0;
    beta_C0 = def_beta_C0;
}



function cellAlphaBeta(struType, scale = 1){
    
    custom_const();
    let alRt =0, alLf = 2, beta =1;
   
    let struSi = [];
    let struOxi = [];
    let struBond = [];

    for(let al_bt = alRt; al_bt<= alLf; al_bt++ ){
   
        let si_SimCoo = [];
        let mat_g = new Array(3, 3);

        const pi = Math.PI;
        const rt120 = 2 * pi / 3;
        const si = Math.sin(rt120);
        const co = Math.cos(rt120);
    
    
        if (al_bt == beta) {  //beta
            a0 = beta_A0 ;
            c0 = beta_C0 ;
            xsi = 0.5 * a0; ysi = 0; zsi = 0;
            xoc = 0.277 * a0; yoc = -xoc / Math.sqrt(3); zoc = 1 / 6 * c0
        }else if (al_bt == alLf){
            a0 = alpha_A0 ;
            c0 = alpha_C0 ;
            xsi = 0.5 * a0; ysi = 0; zsi = 0;
            xoc = 0.277 * a0; yoc = -xoc / Math.sqrt(3); zoc = 1 / 6 * c0
        }else{
            a0 = alpha_A0;
            c0 = alpha_C0;
            rdi = 2 * Si_O * Math.cos((180 - Si_O_Si) / 2 / 180 * pi);
            odi = Si_O * Math.sin((180 - Si_O_Si) / 2 / 180 * pi);
            ccq =  a0 * a0 + c0 *c0 / 9 - rdi * rdi;
            bbq = a0 * a0 * ((co - 1) - si * Math.sqrt(3));
            aaq = (co - 1) * (co - 1) * a0 * a0 + si * si * a0 * a0
            det = bbq * bbq - 4 * aaq * ccq
            if (det > 0){
                re1 = (-bbq + Math.sqrt(det)) / (2 * aaq)  //re2 = (-bbq - Math.sqrt(det)) / (2 * aaq)
            }else{ alert ("??? 1")}
            kx = re1;
            xsi = kx * a0; ysi = 0; zsi = 0
            xsil = co * xsi - si * ysi + a0 / 2
            ysil = si * xsi + co * ysi - a0 * Math.sqrt(3) / 2
            zsil = zsi + c0 / 3

            o_pl = [];
            o_pl=[xsil - xsi, xsil - xsi, zsil - zsi, 0];
            di4 = Math.sqrt(o_pl[0] * o_pl[0]  + o_pl[1] * o_pl[1] + o_pl[2] * o_pl[2]);

            for(let i1=0;i1<3;i1++){
                o_pl[i1] = o_pl[i1] / di4;
            }
            
            tce = [];
            tce=[(xsil + xsi) / 2, (ysil + ysi) / 2, (zsil + zsi) / 2,0]
        
            o_pl[3] =  o_pl[0] * tce[0]
            o_pl[3] += o_pl[1] * tce[1]
            o_pl[3] += o_pl[2] * tce[2]

            teoe1 = Math.atan(Math.sqrt(2))
            hkon = Si_O * Math.cos(teoe1)
            rko = Si_O * Math.sin(teoe1)
            pol1 = (o_pl[3] - o_pl[0] * (xsi - hkon)) / o_pl[1] - ysi;
            aaq = 1 + o_pl[2] * o_pl[2] / (o_pl[1] * o_pl[1]);
            bbq = -(2 * pol1 * o_pl[2] / o_pl[1] - 2 * zsi)
            ccq = zsi * zsi + pol1 * pol1 - rko * rko
            det = bbq * bbq - 4 * aaq * ccq
            if (det > 0) {
                re1 = (-bbq + Math.sqrt(det)) / (2 * aaq)//re2 = (-bbq - Math.sqrt(det)) / (2 * aaq)
            }else{ alert("??? 2");}

            zoc = re1;
            yoc = (o_pl[3] - o_pl[2] * zoc - o_pl[0] * (xsi - hkon)) / o_pl[1];
            xoc = xsi - hkon;

        }
        
        // if( al_bt == alLf) {
        //     xsi =  a0-xsi;
        //     xsil = a0-xsil;
        //     xoc =  a0- xoc;
        // }

        oxi = []; 
        oxi.push([xoc, yoc, zoc]);
 
        oxi.push([0, 0, 0]);
        oxi[1][0] = oxi[0][0];
        oxi[1][1] = -oxi[0][1];
        oxi[1][2] = -oxi[0][2];

        oxi.push([0, 0, 0]);
        oxi[2][0] = co * oxi[1][0] - si * oxi[1][1] + a0;
        oxi[2][1] = si * oxi[1][0] + co * oxi[1][1];
        oxi[2][2] = oxi[1][2] + c0 / 3;

        oxi.push([0, 0, 0]);
        oxi[3][0] = oxi[2][0];
        oxi[3][1] = -oxi[2][1];
        oxi[3][2] = -oxi[2][2];


        si_SimCoo =[];
        pz =[xsi,ysi,zsi]
        si_SimCoo.push([...pz]);   
        
        oxi_Coo = []; 
        oxiSimCoo = [];
    
        oxiSimCoo.push([...oxi]);


        //third order symmetry rotation Z 120 deg. tract z+=c0/3
        mat_g=[]; // matrix rot. Z 120 + transl. c0/3
        mat_g.push([co, -si, 0,  a0 / 2]);
        mat_g.push([si,  co, 0, -a0 * Math.sqrt(3) / 2]);
        mat_g.push([ 0,   0, 1,  c0 / 3]);
    
        pz =[]; pz =[0,0,0];
        for(let i1 = 0; i1 < 3; i1++){
            pz[i1] = mat_g[i1][3];
            for(let i2=0; i2 < 3; i2++){
                pz[i1]  += si_SimCoo[0][i2] * mat_g[i1][i2];
            }
        }
        si_SimCoo.push(pz); //([...pz]);
        oxi = []; 
        for(let i1=0; i1 < 4; i1++){
            oxi.push([0, 0, 0]);
            for(let i2=0; i2 < 3; i2++){
                oxi[i1][i2] = mat_g[i2][3];
                for(let i3=0; i3 < 3; i3++){
                    oxi[i1][i2] += oxiSimCoo[0][i1][i3] * mat_g[i2][i3]
                }
            }
        }
        oxiSimCoo.push(oxi); //([...oxi]);

        //second order symmetry rotation X 180 deg.
        mat_g=[]; // matrix rot. X 180 + transl. 0
        mat_g.push([ 1, 0, 0, 0]);
        mat_g.push([ 0,-1, 0, 0]);
        mat_g.push([ 0, 0,-1, 0]);

        pz =[]; pz =[0,0,0];
        for(let i1 = 0; i1 < 3; i1++){
            pz[i1] = mat_g[i1][3];
            for(let i2=0; i2 < 3; i2++){
                pz[i1]  += si_SimCoo[1][i2] * mat_g[i1][i2];
            }
        }
        si_SimCoo.push(pz); //([...pz]);
        oxi = []; 
        for(let i1=0; i1 < 4; i1++){
            oxi.push([0, 0, 0]);
            for(let i2=0; i2 < 3; i2++){
                oxi[i1][i2] = mat_g[i2][3];
                for(let i3=0; i3 < 3; i3++){
                    oxi[i1][i2] += oxiSimCoo[1][i1][i3] * mat_g[i2][i3]
                }
            }
        }
        oxiSimCoo.push(oxi); //([...oxi]);
        
        let si_BulkCoo = [];
        let oxi_BulkCoo = [];
        for( let i1 = -2;i1 <= 2; i1++){
            for( let i2 = -2;i2 <= 2; i2++){
                ai1 = i1; //if( i2 == 2 ){ ai1 = i1 - 2;}
                for( let i3 = -2; i3 <= 2; i3++){
                    for(let i4 = 0; i4 < 3; i4++){
                        pz =[]; pz =[0,0,0];                   
                        pz[0] = si_SimCoo[i4][0] + ai1 * a0 + a0 / 2 * i2
                        pz[1] = si_SimCoo[i4][1] + i2 * a0 * Math.sqrt(3) / 2
                        pz[2] = si_SimCoo[i4][2] + i3 * c0
                    
                        
                        if((struType == cellType && pz[0] * pz[0] + pz[1] * pz[1]<= .7 * a0 * a0  && pz[2] >= 0 && pz[2] <= c0) 
                        || (struType == bulkType && pz[0] * pz[0] + pz[1] * pz[1]<= 2.5 * a0 * a0  && pz[2] >= 0 && pz[2] <= 2*c0) 
                        || (struType == tetraType && pz[0] <.4 * a0 &&  pz[0] >0 * a0  && pz[1] <.8 * a0 &&  pz[1] >0 * a0 && pz[2] <.7 * c0 &&  pz[2] >.5 * c0  ) )
                    // || (struType == tetraType && pz[0] <.6 * a0 &&  pz[0] >.4 * a0  && Math.abs(pz[1]) < .1*a0  && Math.abs(pz[2]) < .1*c0) )
                        {
                            si_BulkCoo.push(pz); 
                            oxi = []; 
                            for(let i5 = 0; i5< 4; i5++){
                                oxi.push([0, 0, 0]);
                                oxi[i5][0] = oxiSimCoo[i4][i5][0] + ai1 * a0 + a0 / 2 * i2
                                oxi[i5][1] = oxiSimCoo[i4][i5][1] + i2 * a0 * Math.sqrt(3) / 2
                                oxi[i5][2] = oxiSimCoo[i4][i5][2] + i3 * c0
                            }
                            oxi_BulkCoo.push(oxi); //([...oxi]);
                        }
                    }
                }
            }
        }
        


        si_Coo=[]; oxi_Coo = []; siBond = [];
        
        if(si_BulkCoo.length>0){
            for(let i1 = 0; i1<oxi_BulkCoo.length; i1++){
                prvSi = -1
                for(let i2 = 0; i2 < si_Coo.length; i2++){
                    d =  (si_BulkCoo[i1][0]- si_Coo[i2][0]) * (si_BulkCoo[i1][0]- si_Coo[i2][0]);
                    d += (si_BulkCoo[i1][1]- si_Coo[i2][1]) * (si_BulkCoo[i1][1]- si_Coo[i2][1]);
                    d += (si_BulkCoo[i1][2]- si_Coo[i2][2]) * (si_BulkCoo[i1][2]- si_Coo[i2][2]);
                    if( Math.sqrt(d) < .1 ){ prvSi = i2; break;}
                }
                if(prvSi == -1){ 
                    si_Coo.push([...si_BulkCoo[i1]]);
                    prvSi=si_Coo.length-1;
                    siBond.push([prvSi]);
                    for(let i2 = 0; i2 < oxi_BulkCoo[i1].length; i2++){
                    prov =-1;
                        for(let i3 = 0; i3 < oxi_Coo.length; i3++){
                            d =  (oxi_BulkCoo[i1][i2][0]- oxi_Coo[i3][0]) * (oxi_BulkCoo[i1][i2][0]- oxi_Coo[i3][0]);
                            d += (oxi_BulkCoo[i1][i2][1]- oxi_Coo[i3][1]) * (oxi_BulkCoo[i1][i2][1]- oxi_Coo[i3][1]);
                            d += (oxi_BulkCoo[i1][i2][2]- oxi_Coo[i3][2]) * (oxi_BulkCoo[i1][i2][2]- oxi_Coo[i3][2]);
                            if( Math.sqrt(d) < .1 ){ prov = i3; break;}
                        }
                        if(prov == -1){ 
                            oxi_Coo.push([...oxi_BulkCoo[i1][i2]]);
                            siBond[prvSi].push(oxi_Coo.length-1);
                        }else{
                            siBond[prvSi].push(prov);
                        }
                    }
                }
            }
        }

        if(al_bt == alLf){
            for( let i1 = 0; i1 < si_Coo.length;i1++ )    
                for(let i2 = 0; i2 < 3;i2++ )
                    si_Coo[i1][i2] = 2*si_Coo[i1][i2] - struSi[0][i1][i2];     
            for( let i1 = 0; i1 < oxi_Coo.length;i1++ )    
                for(let i2 = 0; i2 < 3;i2++ )
                oxi_Coo[i1][i2] = 2*oxi_Coo[i1][i2] - struOxi[0][i1][i2];     
        }
         
        struSi.push(si_Coo);
        struOxi.push(oxi_Coo);
        struBond.push(siBond);

    }
    cooGroup  = new THREE.Group();
    cooGroup.children.push(struSi); 
    cooGroup.children.push(struOxi);
    cooGroup.children.push(struBond); 

    return cooGroup;
}

let allCooStructures;



 function showStructure(struType, animGauge, scale = 1){
    
    let lBnd = 0;
    let rBnd = 1; 
    let wt = 1;
    if(animGauge>1){lBnd = 1; rBnd = 2;}
    wt = animGauge - lBnd;

    if(allCooStructures == undefined){
        allCooStructures =  new THREE.Group();
        for(let tp = tetraType; tp<= bulkType; tp++ ){
            cooGroup = cellAlphaBeta(tp);
            allCooStructures.children.push(cooGroup);
        }
    }
    cooGroup = allCooStructures.children[struType];
    struSi = cooGroup.children[0]; 
    struOxi = cooGroup.children[1]; 
    struBond = cooGroup.children[2]; 

    var Cell ;
    if(struType == cellType) { 
        const CellGeometry = new THREE.CylinderGeometry( a0 / 2 * scale, a0 / 2 * scale, c0 * scale, 6,1,false,Math.PI/2 ); 
        const CellMaterial =  new THREE.MeshPhysicalMaterial({ color: 0xaa5544, transparent: true, opacity: 0.60,  depthWrite :false});  //, side: THREE.DoubleSide })
        Cell = new THREE.Mesh( CellGeometry, CellMaterial ); 
        // Cell.renderOrder =1;  // inMat ..... depthWrite :false,
        Cell.position.y = c0 / 2 * scale;
    }

    const SiGeometry = new THREE.SphereGeometry( 0.3, 32, 16 ); 
    const SiMaterial =  new THREE.MeshPhysicalMaterial({ color: 0x6688aa, transparent: false});  //, opacity: 0.60, side: THREE.DoubleSide })
    const SiSph = new THREE.Mesh( SiGeometry, SiMaterial ); 
   
    const OxiGeometry = new THREE.SphereGeometry( 0.5, 32, 16 ); 
    const OxiMaterial =  new THREE.MeshPhysicalMaterial({ color: 0xaa5544, transparent: true, opacity: 0.90});  //, side: THREE.DoubleSide })
    const OxiSph = new THREE.Mesh( OxiGeometry, OxiMaterial ); 
   
    siGroup =  new THREE.Group();
    oxiGroup =  new THREE.Group();
    bondsGroup =  new THREE.Group();
    structuteGroup = new THREE.Group();
     
    siPos = [];
      for(let i1 = 0; i1<struSi[0].length; i1++){
        siSphere = SiSph.clone();
        siSphere.position.x = (struSi[lBnd][i1][0] * (1 - wt) + wt * struSi[rBnd][i1][0]) * scale;
        siSphere.position.y = (struSi[lBnd][i1][2] * (1 - wt) + wt * struSi[rBnd][i1][2]) * scale;
        siSphere.position.z = (struSi[lBnd][i1][1] * (1 - wt) + wt * struSi[rBnd][i1][1]) * scale;
        siGroup.add(siSphere);
        siPos.push(siSphere.position);
    }   
   
    oxiPos = [];
    for(let i1 = 0; i1<struOxi[0].length; i1++){
        oxiSphere = OxiSph.clone();
        oxiSphere.position.x = (struOxi[lBnd][i1][0] * (1 - wt) + wt * struOxi[rBnd][i1][0]) * scale;
        oxiSphere.position.y = (struOxi[lBnd][i1][2] * (1 - wt) + wt * struOxi[rBnd][i1][2]) * scale;
        oxiSphere.position.z = (struOxi[lBnd][i1][1] * (1 - wt) + wt * struOxi[rBnd][i1][1]) * scale;
        oxiGroup.add(oxiSphere);
        oxiPos.push(oxiSphere.position);
    }   
   
    bNb=-1;
    for(let i1 = 0; i1<struBond[0].length; i1++){ 
        siVec = siPos[i1]
        for(let i2 = 1; i2<struBond[0][i1].length; i2++){ 
            oNm = struBond[0][i1][i2];
            oxiVec =oxiPos[oNm];
            var direction = new THREE.Vector3().subVectors(siVec, oxiVec);
            var bondsMaterial = new THREE.MeshBasicMaterial({ color: 0x5B5B5B });
            var bondsGeometry = new THREE.CylinderGeometry(0.04, 0.04, direction.length(), 6, 4, false);
            bondsGeometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, direction.length() / 2, 0));
            bondsGeometry.applyMatrix4(new THREE.Matrix4().makeRotationX(Math.PI/2));
            var bond = new THREE.Mesh(bondsGeometry, bondsMaterial);
            bond.position.copy(siVec);
            bond.lookAt(oxiVec);
            bondsGroup.add(bond);
       }
    }
  
    structuteGroup.add(siGroup);
    structuteGroup.add(oxiGroup);
    structuteGroup.add(bondsGroup);
    if (Cell != undefined) structuteGroup.add(Cell);
    
    return structuteGroup;

}






 function showStructureOld(struType, al_bt, animGauge, scale = 1){
    
    let lBnd = 0;
    let rBnd = 1; 
    let wt = 1;
    if(animGauge <= 0){lBnd = -1; rBnd = 0; }
    wt = animGauge - lBnd;
   
   
    al_bt=0;
    let o = new Array(4, 3);
    let si_SimCoo = [];
    let M_Si_Coo = new Array(3, 3);
    let M_O_Coo = new Array(3, 4, 3);
    let mat_g = new Array(3, 3);

    re_ox_si = new Array(220, 2);
    oxi = new Array(220, 3);
    sil = new Array(81, 3);
    si0 = new Array(81, 3);
    re_si_ox = new Array(81, 4);


    const pi = Math.PI;
    const rt120 = 2 * pi / 3;
    const si = Math.sin(rt120);
    const co = Math.cos(rt120);
 
    
    custom_const();

    if (al_bt == 1) {  //beta
        a0 = beta_A0 ;
        c0 = beta_C0 ;
        xsi = 0.5 * a0; ysi = 0; zsi = 0;
        xoc = 0.277 * a0; yoc = -xoc / Math.sqrt(3); zoc = 1 / 6 * c0
    }else{
        a0 = alpha_A0;
        c0 = alpha_C0;
         
        rdi = 2 * Si_O * Math.cos((180 - Si_O_Si) / 2 / 180 * pi);
        odi = Si_O * Math.sin((180 - Si_O_Si) / 2 / 180 * pi);
        ccq =  a0 * a0 + c0 *c0 / 9 - rdi * rdi;
        bbq = a0 * a0 * ((co - 1) - si * Math.sqrt(3));
        aaq = (co - 1) * (co - 1) * a0 * a0 + si * si * a0 * a0
        det = bbq * bbq - 4 * aaq * ccq
        if (det > 0){
            re1 = (-bbq + Math.sqrt(det)) / (2 * aaq)  //re2 = (-bbq - Math.sqrt(det)) / (2 * aaq)
        }else{ alert ("??? 1")}
       
        kx = re1
        xsi = kx * a0; ysi = 0; zsi = 0
    
        xsil = co * xsi - si * ysi + a0 / 2
        ysil = si * xsi + co * ysi - a0 * Math.sqrt(3) / 2
        zsil = zsi + c0 / 3
    
        o_pl = [];
        o_pl=[xsil - xsi, xsil - xsi, zsil - zsi, 0];
        di4 = Math.sqrt(o_pl[0] * o_pl[0]  + o_pl[1] * o_pl[1] + o_pl[2] * o_pl[2]);

        for(let i1=0;i1<3;i1++){
            o_pl[i1] = o_pl[i1] / di4;
        }
        
        tce = [];
        tce=[(xsil + xsi) / 2, (ysil + ysi) / 2, (zsil + zsi) / 2,0]
      
        o_pl[3] =  o_pl[0] * tce[0]
        o_pl[3] += o_pl[1] * tce[1]
        o_pl[3] += o_pl[2] * tce[2]

        teoe1 = Math.atan(Math.sqrt(2))
        hkon = Si_O * Math.cos(teoe1)
        rko = Si_O * Math.sin(teoe1)
        pol1 = (o_pl[3] - o_pl[0] * (xsi - hkon)) / o_pl[1] - ysi;
        aaq = 1 + o_pl[2] * o_pl[2] / (o_pl[1] * o_pl[1]);
        bbq = -(2 * pol1 * o_pl[2] / o_pl[1] - 2 * zsi)
        ccq = zsi * zsi + pol1 * pol1 - rko * rko
        det = bbq * bbq - 4 * aaq * ccq
        if (det > 0) {
            re1 = (-bbq + Math.sqrt(det)) / (2 * aaq)//re2 = (-bbq - Math.sqrt(det)) / (2 * aaq)
        }else{ alert("??? 2");}

        zoc = re1;
        yoc = (o_pl[3] - o_pl[2] * zoc - o_pl[0] * (xsi - hkon)) / o_pl[1];
        xoc = xsi - hkon;

    }
    
    oxi = []; 
    oxi.push([xoc, yoc, zoc]);
    
    oxi.push([0, 0, 0]);
    oxi[1][0] = oxi[0][0];
    oxi[1][1] = -oxi[0][1];
    oxi[1][2] = -oxi[0][2];

    oxi.push([0, 0, 0]);
    oxi[2][0] = co * oxi[1][0] - si * oxi[1][1] + a0;
    oxi[2][1] = si * oxi[1][0] + co * oxi[1][1];
    oxi[2][2] = oxi[1][2] + c0 / 3;

    oxi.push([0, 0, 0]);
    oxi[3][0] = oxi[2][0];
    oxi[3][1] = -oxi[2][1];
    oxi[3][2] = -oxi[2][2];


    si_SimCoo =[];
    pz =[xsi,ysi,zsi]
    si_SimCoo.push([...pz]);   
    
    oxi_Coo = []; 
    oxiSimCoo = [];
   
    oxiSimCoo.push([...oxi]);


       //third order symmetry rotation Z 120 deg. tract z+=c0/3
    mat_g=[]; // matrix rot. Z 120 + transl. c0/3
    mat_g.push([co, -si, 0,  a0 / 2]);
    mat_g.push([si,  co, 0, -a0 * Math.sqrt(3) / 2]);
    mat_g.push([ 0,   0, 1,  c0 / 3]);
   
    pz =[]; pz =[0,0,0];
    for(let i1 = 0; i1 < 3; i1++){
        pz[i1] = mat_g[i1][3];
        for(let i2=0; i2 < 3; i2++){
            pz[i1]  += si_SimCoo[0][i2] * mat_g[i1][i2];
        }
    }
    si_SimCoo.push(pz); //([...pz]);
    oxi = []; 
    for(let i1=0; i1 < 4; i1++){
        oxi.push([0, 0, 0]);
        for(let i2=0; i2 < 3; i2++){
            oxi[i1][i2] = mat_g[i2][3];
            for(let i3=0; i3 < 3; i3++){
                oxi[i1][i2] += oxiSimCoo[0][i1][i3] * mat_g[i2][i3]
            }
        }
    }
    oxiSimCoo.push(oxi); //([...oxi]);

      //second order symmetry rotation X 180 deg.
      mat_g=[]; // matrix rot. X 180 + transl. 0
      mat_g.push([ 1, 0, 0, 0]);
      mat_g.push([ 0,-1, 0, 0]);
      mat_g.push([ 0, 0,-1, 0]);

      pz =[]; pz =[0,0,0];
      for(let i1 = 0; i1 < 3; i1++){
          pz[i1] = mat_g[i1][3];
          for(let i2=0; i2 < 3; i2++){
              pz[i1]  += si_SimCoo[1][i2] * mat_g[i1][i2];
          }
      }
      si_SimCoo.push(pz); //([...pz]);
      oxi = []; 
      for(let i1=0; i1 < 4; i1++){
          oxi.push([0, 0, 0]);
          for(let i2=0; i2 < 3; i2++){
              oxi[i1][i2] = mat_g[i2][3];
              for(let i3=0; i3 < 3; i3++){
                  oxi[i1][i2] += oxiSimCoo[1][i1][i3] * mat_g[i2][i3]
              }
          }
      }
      oxiSimCoo.push(oxi); //([...oxi]);
     
     let si_BulkCoo = [];
     let oxi_BulkCoo = [];
     for( let i1 = -2;i1 <= 2; i1++){
         for( let i2 = -2;i2 <= 2; i2++){
             ai1 = i1; //if( i2 == 2 ){ ai1 = i1 - 2;}
             for( let i3 = -2; i3 <= 2; i3++){
                 for(let i4 = 0; i4 < 3; i4++){
                    pz =[]; pz =[0,0,0];                   
                    pz[0] = si_SimCoo[i4][0] + ai1 * a0 + a0 / 2 * i2
                    pz[1] = si_SimCoo[i4][1] + i2 * a0 * Math.sqrt(3) / 2
                    pz[2] = si_SimCoo[i4][2] + i3 * c0
                  
                    
                    if((struType == cellType && pz[0] * pz[0] + pz[1] * pz[1]<= .7 * a0 * a0  && pz[2] >= 0 && pz[2] <= c0) 
                    || (struType == bulkType && pz[0] * pz[0] + pz[1] * pz[1]<= 2.5 * a0 * a0  && pz[2] >= 0 && pz[2] <= 2*c0) 
                    || (struType == tetraType && pz[0] <.4 * a0 &&  pz[0] >0 * a0  && pz[1] <.8 * a0 &&  pz[1] >0 * a0 && pz[2] <.7 * c0 &&  pz[2] >.5 * c0  ) )
                   // || (struType == tetraType && pz[0] <.6 * a0 &&  pz[0] >.4 * a0  && Math.abs(pz[1]) < .1*a0  && Math.abs(pz[2]) < .1*c0) )
                    {
                        si_BulkCoo.push(pz); 
                        oxi = []; 
                        for(let i5 = 0; i5< 4; i5++){
                            oxi.push([0, 0, 0]);
                            oxi[i5][0] = oxiSimCoo[i4][i5][0] + ai1 * a0 + a0 / 2 * i2
                            oxi[i5][1] = oxiSimCoo[i4][i5][1] + i2 * a0 * Math.sqrt(3) / 2
                            oxi[i5][2] = oxiSimCoo[i4][i5][2] + i3 * c0
                         }
                         oxi_BulkCoo.push(oxi); //([...oxi]);
                    }
                }
            }
        }
    }
    


    si_Coo=[]; oxi_Coo = []; siBond = [];
    
    if(si_BulkCoo.length>0){
        for(let i1 = 0; i1<oxi_BulkCoo.length; i1++){
            prvSi = -1
            for(let i2 = 0; i2 < si_Coo.length; i2++){
                d =  (si_BulkCoo[i1][0]- si_Coo[i2][0]) * (si_BulkCoo[i1][0]- si_Coo[i2][0]);
                d += (si_BulkCoo[i1][1]- si_Coo[i2][1]) * (si_BulkCoo[i1][1]- si_Coo[i2][1]);
                d += (si_BulkCoo[i1][2]- si_Coo[i2][2]) * (si_BulkCoo[i1][2]- si_Coo[i2][2]);
                if( Math.sqrt(d) < .1 ){ prvSi = i2; break;}
            }
            if(prvSi == -1){ 
                si_Coo.push([...si_BulkCoo[i1]]);
                prvSi=si_Coo.length-1;
                siBond.push([i1]);
                for(let i2 = 0; i2 < oxi_BulkCoo[i1].length; i2++){
                prov =-1;
                    for(let i3 = 0; i3 < oxi_Coo.length; i3++){
                        d =  (oxi_BulkCoo[i1][i2][0]- oxi_Coo[i3][0]) * (oxi_BulkCoo[i1][i2][0]- oxi_Coo[i3][0]);
                        d += (oxi_BulkCoo[i1][i2][1]- oxi_Coo[i3][1]) * (oxi_BulkCoo[i1][i2][1]- oxi_Coo[i3][1]);
                        d += (oxi_BulkCoo[i1][i2][2]- oxi_Coo[i3][2]) * (oxi_BulkCoo[i1][i2][2]- oxi_Coo[i3][2]);
                        if( Math.sqrt(d) < .1 ){ prov = i3; break;}
                    }
                    if(prov == -1){ 
                        oxi_Coo.push([...oxi_BulkCoo[i1][i2]]);
                        siBond[prvSi].push([oxi_Coo.length-1]);
                    }else{
                        siBond[prvSi].push([prov]);

                    }
                }
            }
        }
   }

   /////////////////////////////////////////////////////////////////////////////////////////


    var Cell ;
    if(struType == cellType) { 
        const CellGeometry = new THREE.CylinderGeometry( a0 / 2 * scale, a0 / 2 * scale, c0 * scale, 6,1,false,pi/2 ); 
        //const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } ); 
        const CellMaterial =  new THREE.MeshPhysicalMaterial({ color: 0xaa5544, transparent: true, opacity: 0.60,  depthWrite :false});  //, side: THREE.DoubleSide })
        Cell = new THREE.Mesh( CellGeometry, CellMaterial ); 
        // Cell.renderOrder =1;  // inMat ..... depthWrite :false,
        Cell.position.y = c0 / 2 * scale;
    }

     const SiGeometry = new THREE.SphereGeometry( 0.3, 32, 16 ); 
    //const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } ); 
    const SiMaterial =  new THREE.MeshPhysicalMaterial({ color: 0x6688aa, transparent: false});  //, opacity: 0.60, side: THREE.DoubleSide })
    const SiSph = new THREE.Mesh( SiGeometry, SiMaterial ); 
   
    const OxiGeometry = new THREE.SphereGeometry( 0.5, 32, 16 ); 
    //const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } ); 
    const OxiMaterial =  new THREE.MeshPhysicalMaterial({ color: 0xaa5544, transparent: true, opacity: 0.90});  //, side: THREE.DoubleSide })
    const OxiSph = new THREE.Mesh( OxiGeometry, OxiMaterial ); 
   
    siGroup =  new THREE.Group();
    oxiGroup =  new THREE.Group();
    bondsGroup =  new THREE.Group();
    structuteGroup = new THREE.Group();
    siSphere = new Array(si_SimCoo.length);
    oxiSphere = new Array(4 * si_SimCoo.length);
    
    
    for(let i1 = 0; i1<si_Coo.length; i1++){
        siSphere[i1] = SiSph.clone();
        siSphere[i1].position.x = si_Coo[i1][0] * scale;
        siSphere[i1].position.y = si_Coo[i1][2] * scale;
        siSphere[i1].position.z = si_Coo[i1][1] * scale;
        siGroup.add(siSphere[i1]);
    }   
    
    for(let i1 = 0; i1<oxi_Coo.length; i1++){
        oxiSphere[i1] = OxiSph.clone();
        oxiSphere[i1].position.x = oxi_Coo[i1][0] * scale;
        oxiSphere[i1].position.y = oxi_Coo[i1][2] * scale;
        oxiSphere[i1].position.z = oxi_Coo[i1][1] * scale;
        oxiGroup.add(oxiSphere[i1]);
    }
   
    for(let i1 = 0; i1<siBond.length; i1++){ 
        siVec = new THREE.Vector3(si_Coo[i1][0], si_Coo[i1][2], si_Coo[i1][1])
        for(let i2 = 1; i2<siBond[i1].length; i2++){ 
            oNm = siBond[i1][i2];
            oxiVec = new THREE.Vector3(oxi_Coo[oNm][0], oxi_Coo[oNm][2], oxi_Coo[oNm][1])
            var direction = new THREE.Vector3().subVectors(siVec, oxiVec);
            var bondsMaterial = new THREE.MeshBasicMaterial({ color: 0x5B5B5B });
            var bondsGeometry = new THREE.CylinderGeometry(0.04, 0.04, direction.length(), 6, 4, false);
            bondsGeometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, direction.length() / 2, 0));
            bondsGeometry.applyMatrix4(new THREE.Matrix4().makeRotationX(pi/2));
            var bond = new THREE.Mesh(bondsGeometry, bondsMaterial);
            bond.position.copy(siVec);
            bond.lookAt(oxiVec);
            bondsGroup.add(bond);
        }
    }

    
    structuteGroup.add(siGroup);
    structuteGroup.add(oxiGroup);
    structuteGroup.add(bondsGroup);
    if (Cell != undefined) structuteGroup.add(Cell);
    
    return structuteGroup;

}


