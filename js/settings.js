

	let selWp =-1;
	let selPoi =-1;
 
	let radioWp;
	let wp;
	let poi;
	let display;
	let locationText;
	let selLookAt;
		
 function initSettings(){
	radioWp= document.getElementById("radioWp");
    wp =document.getElementById("Waypoints");
    poi = document.getElementById("POI");
    display = document.getElementById("display");
	locationText = document.getElementById("locTxt");
    selLookAt=document.getElementById("selLookAt");
 
 
 
	var radios = document.querySelectorAll('input[type=radio]');//  'input[type=radio][name=".."]'
	radios.forEach(radio => radio.addEventListener('change', () => displayChange(0)));
}


function updateSettings(upNmb){
 
 if(radioWp.checked){
    selWp = upNmb;
	
	waypoints[upNmb].markColor=markerColor;

	locationText.value=  waypoints[upNmb].position.lat() + "\n" + waypoints[upNmb].position.lng() + "\n" + waypoints[upNmb].elevation;
	altitudeVal(waypoints[upNmb].altitude);
	speedVal(2,waypoints[upNmb].speed);
	bezierVal(2,waypoints[upNmb].smoothing);

	editLookAt();
	pos =null;
	selLookAt.value = "Free Selection";
	if(upNmb<waypoints.length-1 &&  waypoints[upNmb].headingId == waypoints[upNmb+1].id){
		selLookAt.value = "Next Waypoint";
	    pos=waypoints[upNmb+1].position;
	}else if(upNmb>0 && waypoints[upNmb].headingId == waypoints[upNmb-1].id){
		selLookAt.value = "Previous Waypoint";
		pos=waypoints[upNmb-1].position;
	}else{ 	
		for(let i=0;i<pois.length;i++){
				if(waypoints[upNmb].headingId == pois[i].id){
					selLookAt.value = "POI - "+(i+1);
					pos=pois[i].position;
			        waypoints[upNmb].markColor =  pois[i].markColor;
				}
		}
	}
	if( selLookAt.value == "Free Selection"){
			waypoints[upNmb].headingId =0;}
	
	if(pos != null)
		waypoints[upNmb].azimuth = positionToAzimuth( waypoints[upNmb].position,  pos);
	
	waypoints[upNmb].refreshMarkers();
	
	azimithVal(waypoints[upNmb].azimuth);
	pitchVal(waypoints[upNmb].pitchAngle);
  
 }else{
	  
	  
  }
}




function plusOne(){
	nmb = parseInt(display.value);
	if ( isNaN(nmb)) nmb=0;
	displayChange(nmb+1);
}


function minusOne(){
	nmb = parseInt(display.value);
	if ( isNaN(nmb)) nmb=0;
	displayChange(nmb-1)
}

function displayChange(nmb){
 	
	var dsp;
	if ( isNaN(nmb)) dsp=0;
    else dsp =parseInt(nmb);

	if(radioWp.checked){
		if(waypoints.length>0){
			if(dsp>waypoints.length){
				dsp = waypoints.length;
			} else if (dsp<1) {	dsp=1; } 
		
		  selWp = dsp-1;
		}else {	dsp="";	selWp=-1;}	
	}else{
		if(pois.length>0){
			if(dsp>pois.length){
				dsp = pois.length;
			} else if (dsp<1) {	dsp=1; } 
			selPoi = dsp-1;
		}else {	dsp="";	selPoi=-1;}	
	}
	
	display.value=dsp;
 	if(dsp==""){$(".panel").hide("slow");}
	else {updateSettings(dsp-1);}
 

}

function deleteWpPoi(){
	
	selNmb = parseInt(display.value)-1;

	if(radioWp.checked){
		waypoints[selNmb].deleteWp();
		waypoints.splice(selNmb, 1); 
		for (let i = 0; i < waypoints.length; i++) {
			waypoints[i].index =i;  }
	}else{
		pois[selNmb].deletePoi();
		pois.splice(selNmb, 1); 
	for (let i = 0; i < pois.length; i++) {
	pois[i].index =i;  }
	}

    path=[];
	for (let i = 0; i < waypoints.length; i++) {

		for (let j = 0; j < waypoints.length; j++) {
            path.push(waypoints[j].position);
			if(waypoints[i].headingId == waypoints[j].id){
				waypoints[i].azimuth = positionToAzimuth( waypoints[i].position,  waypoints[j].position);
			}
		}
 		for(let j=0;j<pois.length;j++){
			if(waypoints[i].headingId == pois[j].id){
				waypoints[i].markColor =  pois[j].markColor;
				waypoints[i].azimuth = positionToAzimuth( waypoints[i].position,  pois[j].position);
			}
		}
		waypoints[i].refreshMarkers();
		path.push(waypoints[i].position);
	}
   
	poly.setPath(path);
	
	//redrawPath();
}






function selectAction(value) {
  let container = document.getElementById("actCont");

	switch (value){
		case "Stay For":
		break;
		case "Rotate Aircraft":
		case "Orbit":
			bt = per.querySelector("#btnCCW");
			bt.removeAttribute("hidden"); 
		break;
		case "Delete":
			container.removeChild(per);
		break;
		case "Insert":
			let node = document.getElementById("act100");
			let clone = node.cloneNode(true);
			container.insertBefore(clone, per);
		break;
}
}


function addAction(){

let node = document.getElementById("act100");
let clone = node.cloneNode(true);
let container = document.getElementById("actCont");
//alert(container.childElementCount);
clone.removeAttribute("hidden"); 
clone.id = parseInt( Math.random()*1000000)

container.appendChild(clone);
//alert(container.childElementCount);
}


function editLookAt(){

	var sl = document.getElementById("selLookAt");
	for(let i=sl.length-1;i>=0;i--) {
		sl.remove(i);
	}
	var option;
	if (selWp<waypoints.length-1){
		option = document.createElement("option");  option.text = "Next Waypoint"; sl.add(option);}
  	if (selWp>0){
		option = document.createElement("option");  option.text = "Previous Waypoint"; sl.add(option);}
	option = document.createElement("option");  option.text = "Free Selection"; sl.add(option);
	for(let i=0;i<pois.length;i++){
		option = document.createElement("option");  option.text = "POI - " + (i+1); sl.add(option);}
}



function selectLookAt(el) {
	en = document.getElementById("enLaser");
	if (el.includes("Free"))
		{en.disabled = false;}
	else
		{en.disabled = true;}
	
	
	waypoints[selWp].headingId =0;
	
	pos = null;
	if(el.includes('POI - ')){
		po = parseInt(el.replace("POI - ", ""));

		waypoints[selWp].headingId = pois[po-1].id;
		waypoints[selWp].markColor =  pois[po-1].markColor;
		pos = pois[po-1].position;
	}
	if(el.includes('Next')){
 			waypoints[selWp].headingId = waypoints[selWp+1].id;
			waypoints[selWp].markColor=markerColor;
			pos = waypoints[selWp+1].position;
	}
	if(el.includes('Previous')){
			waypoints[selWp].headingId = waypoints[selWp-1].id;
			waypoints[selWp].markColor=markerColor;
			pos = waypoints[selWp-1].position;
	}
	
	if(pos != null)
		waypoints[selWp].azimuth = positionToAzimuth( waypoints[selWp].position,  pos);
	else
		waypoints[selWp].azimuth = 0;
		
	waypoints[selWp].refreshMarkers();
	azimithVal(waypoints[selWp].azimuth);



}

function bezierVal(src,vl){
	if(selWp==0) vl=0;
	//if(selWp==waypoints.length-1) vl=0;
	sl =document.getElementById("bzSlider");
	inp =document.getElementById("bzInpit");
	if(src==1) vll = parseFloat(vl)/100;
	else vll = parseFloat(vl);
	mn=  parseFloat(sl.min)/100;
	mx= parseFloat(sl.max)/100;
	if(vll<mn) vll=mn;
	if(vll>mx) vll=mx;
	sl.value = vll*100;
	inp.value = vll;
	waypoints[selWp].smoothing = vll;
	if(selWp>0 && selWp<waypoints.length-1)
		waypoints[selWp].bezierPath(true,30,waypoints[selWp-1],waypoints[selWp+1]);

}


function azimithVal(vl){

	sl=document.getElementById("yawSlider");
	inp=document.getElementById("yawInpit");
	vll=parseInt(vl);
	mn=parseInt(sl.min);
	mx=parseInt(sl.max);
	if(vll<mn) vll=mn;
	if(vll>mx) vll=mx;
	sl.value = vll;
	inp.value = vll;
	waypoints[selWp].azimuth=vll;
	waypoints[selWp].refreshMarkers();
}

function pitchVal(vl){
	sl=document.getElementById("pitchSlider");
	inp=document.getElementById("pitchInpit");
	vll=parseInt(vl);
	mn=parseInt(sl.min);
	mx=parseInt(sl.max);
	if(vll<mn) vll=mn;
	if(vll>mx) vll=mx;
	sl.value = vll;
	inp.value = vll;
	waypoints[selWp].pitchAngle=vll;

}





function speedVal(src,vl){
	sl =document.getElementById("spSlider");
	inp =document.getElementById("spInpit");
	if(src==1) vll = parseFloat(vl)/10;
	else vll = parseFloat(vl);
	mn=  parseFloat(sl.min)/10;
	mx= parseFloat(sl.max)/10;
	if(vll<mn) vll=mn;
	if(vll>mx) vll=mx;
	sl.value = vll*10;
	inp.value = vll;
	waypoints[selWp].speed = vll;
}

function altitudeVal(vl){
 	
	sl = document.getElementById("altSlider");
	inp = document.getElementById("altInpit");
	vll = parseInt(vl);
	mn =  parseInt(sl.min);
	mx = parseInt(sl.max);
	if(vll<mn) vll=mn;
	if(vll>mx) vll=mx;
	sl.value = vll;
	inp.value = vll;

	if(radioWp.checked){ waypoints[selWp].altitude = vll;}
	else{ pois[selPoi].altitude = vll;}

}

function radioChange(src){
 	if(radioWp.checked )
	{    poi.style.display = "none";
		wp.style.display = "block";
	}	else	{
		wp.style.display = "none";
		poi.style.display = "block";
	}

}
//============================================================================================
//============================================================================================

async function saveFl(type){
 
	var blStr="aaa";

	if(type == "xml"){
		/*const xmlStr = (
			`<?xml version="1.0" encoding="UTF-8"?>
            <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
                <url><loc>https://erikmartinjordan.com</loc></url>
            </urlset>
			`
		);	*/	
		const xmlStr = (`<?xml version="1.0" encoding="UTF-8"?>`);
		var doc = document.implementation.createDocument("", "", null);	
		
		var miElem = doc.createElement("Mission");

		var wpElem1 = doc.createElement("Waypoints");
		
		for(let i=0;i< waypoints.length;i++){
			wpElem1.appendChild(waypoints[i].getXml(doc));
		}
		
		miElem.appendChild(wpElem1);
		var poiElem1 = doc.createElement("PointsOfInterest");
		for(let i=0;i< pois.length;i++){
			poiElem1.appendChild(pois[i].getXml(doc));
		}
		miElem.appendChild(poiElem1);
	
		doc.appendChild(miElem);

		const serializer = new XMLSerializer();
		const docStr = serializer.serializeToString(doc);
		
		blStr= xmlStr + docStr;
	}else if (type.includes("wp csv")){
		var tb=",";
		var hd = "latitude"+tb+"longitude"+tb+"altitude(m)"+tb+"heading(deg)"+tb;
		hd+="curvesize(m)"+tb+"rotationdir"+tb+"gimbalmode"+tb+"gimbalpitchangle"+tb;
	    for(i=1;i<=15;i++)hd+="actiontype" + i +tb+ "actionparam"+i+tb;
		hd+="altitudemode"+tb+"speed(m/s)"+tb+"poi_latitude"+tb+"poi_longitude"+tb
		hd+="poi_altitude(m)"+tb+"poi_altitudemode"+tb+"photo_timeinterval"+tb+"photo_distinterval";

		blStr = hd;
		for(let i=0;i< waypoints.length;i++){
			let ps = null;
			for(let j=0;j< waypoints.length;j++){
				if(waypoints[i].headingId == waypoints[j].id) ps = waypoints[j];}
			for(let j=0;j< pois.length;j++){
				if(waypoints[i].headingId == pois[j].id) ps = pois[j];}
			blStr += "\r\n" + waypoints[i].getCsv(tb,ps);
		}
	}else if (type.includes("tl csv")){
		var tb=",";
		var hd = "latitude"+tb+"longitude"+tb+"altitude(m)"+tb+"heading(deg)"+tb;
		hd+="curvesize(m)"+tb+"rotationdir"+tb+"gimbalmode"+tb+"gimbalpitchangle"+tb;
	    for(i=1;i<=15;i++)hd+="actiontype" + i +tb+ "actionparam"+i+tb;
		hd+="altitudemode"+tb+"speed(m/s)"+tb+"poi_latitude"+tb+"poi_longitude"+tb
		hd+="poi_altitude(m)"+tb+"poi_altitudemode"+tb+"photo_timeinterval"+tb+"photo_distinterval";

		blStr = hd;
		for(let i=0;i< tmLn.length;i++){
			let ps = null;
			for(let j=0;j< tmLn.length;j++){
				if(tmLn[i].headingId == tmLn[j].id) ps = tmLn[j];}
			for(let j=0;j< pois.length;j++){
				if(tmLn[i].headingId == pois[j].id) ps = pois[j];}
			blStr += "\r\n" + tmLn[i].getCsv(tb,ps);
		}


	}
 
// (A) CREATE BLOB OBJECT
	var xBlob = new Blob([blStr], {type: "text/xml"});

// (B) FILE HANDLER & FILE STREAM
	const fileHandle = await getNewFileHandle();
	const fileStream = await fileHandle.createWritable();
 
// (C) WRITE FILE
	await fileStream.write(xBlob);
	await fileStream.close();
}


function getNewFileHandle() {
	const opts = {
		types: [{
			description: 'Text file',
			accept: {'text/xml': ['.xml']  , 'text/plain': ['.txt']},
		}],
	};
  return window.showSaveFilePicker(opts);
}

async function openFl(type) {

	let fileHandle;
	const pickerOpts = {
		types: [{
			description: 'Text file',
			accept: {'text/xml': ['.xml']  , 'text/plain': ['.txt']},
		}],
		excludeAcceptAllOption: true,
		multiple: false
	};
	[fileHandle] = await window.showOpenFilePicker(pickerOpts);
	const file = await fileHandle.getFile();
	const contents = await file.text();
 	
	if(type == "xml"){
		waypoints=[];
		pois=[];
		parser = new DOMParser();
		xmlDoc = parser.parseFromString(contents,"text/xml");
		w = xmlDoc.getElementsByTagName("Waypoint");
		for (i = 0; i < w.length; i++) {
			wp= new Waypoint(null,i);
			wp.setFromXml(w[i]);
			wp.refreshMarkers();
			waypoints.push(wp);
		}
		p = xmlDoc.getElementsByTagName("POI");
		for (i = 0; i < p.length; i++) {
			po= new Poi(null,i);
			po.setFromXml(p[i]);
			po.refreshMarkers();
			pois.push(po);
		}
		
		for (let i = 0; i < waypoints.length; i++) {
			for (let j = 0; j < waypoints.length; j++) {
				if(waypoints[i].headingId == waypoints[j].id){
					waypoints[i].azimuth = positionToAzimuth( waypoints[i].position,  waypoints[j].position);
					waypoints[i].refreshMarkers();
				}
			}
			for(let j=0;j<pois.length;j++){
				if(waypoints[i].headingId == pois[j].id){
					waypoints[i].markColor =  pois[j].markColor;
					waypoints[i].azimuth = positionToAzimuth( waypoints[i].position,  pois[j].position);
					waypoints[i].refreshMarkers();
				}
			}
		}
		
		redrawPath();
	} 
 	
	$("#panelM").hide("slow");
 }



function path3d(val){

redraw3D();

}

function map3d(){
 	
	
	if(	tiltRotBtns[0].style.visibility == 'visible') {

		for( i=0;i<tiltRotBtns.length;i++){tiltRotBtns[i].style.visibility = 'hidden';}
		for( i=0;i<waypoints.length;i++){waypoints[i].showMarkers();}
		for( i=0;i<wpMid.length;i++){wpMid[i].setMap(map);}
		map.setHeading(0);
		map.setTilt(0);
		for( i =0;i<polyArr.length;i++){polyArr[i].setMap(null);}
		polyArr = [];

	} else{
		
		for( i=0;i<tiltRotBtns.length;i++){tiltRotBtns[i].style.visibility = 'visible';}
		for( i=0;i<waypoints.length;i++){waypoints[i].hideMarkers();}
		for( i=0;i<wpMid.length;i++){wpMid[i].setMap(null);}
		map.setHeading(90);
		map.setTilt(60);
		
		timeLine();
		redraw3D();
	}
}


 function toggleSettings(){
	
	if($("#panelS").is(":visible")){
	
		for (let i = 0; i < waypoints.length; i++) {
			ic = waypoints[i].marker.getIcon();
			ic.fillColor =waypoints[i].markColor;
			waypoints[i].marker.setIcon(ic);
		}
		for (let i = 0; i < pois.length; i++) {
			ic = pois[i].marker.getIcon();
			ic.fillColor =  pois[i].markColor;
			pois[i].marker.setIcon(ic);
		}
	}
	
	if(display.value == "") $("#panelS").hide("slow");
	else $("#panelS").slideToggle("slow");
	//$(".panel").show("slow");
	//$(".panel").hide("slow");
}





 function toggleMission(){

	//if(display.value == "") $("#panelM").hide("slow");
	//else 
	$("#panelM").slideToggle("slow");

}
