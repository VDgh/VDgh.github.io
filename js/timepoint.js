



class TimePoint {
	
	position;
	index;
	id =0;
	headingId =0;
	altitude = 73;
	elevation=-1000;
	markColor =markerColor;
	speed = 3.5;
     	
	azimuth = 0;
    pitchAngle=0;
	smoothing = 0;
	curvesize=0.2;	
	constructor(latLng,	ix) {

		if(latLng != null){
			this.position =new google.maps.LatLng(latLng.lat(),latLng.lng());
		}
		this.index = ix;
		this.id = Math.floor(Math.random()*1000000);
	
		this.markerDef();	

	}

		
	markerDef(){
/*
		 const lookIcon = {
			path: " M 0,-30 0,0 z ",
			fillColor: "#ddd",
			fillOpacity: 1,
			strokeWeight: 1,
			strokeColor: "#f00",
			rotation: this.azimuth,
			scale: 1.0,
			anchor: new google.maps.Point(0, 30),
		};

		this.lookMarker = new google.maps.Marker({
			position: this.position,
			title: "",
			icon: lookIcon,
 			map: map,
			draggable: false,
		});
*/
			const altIcon = {
			path: " M 0,-50 0,0 z ",
			fillColor: "#ddd",
			fillOpacity: 1,
			strokeWeight: 1,
			strokeColor: "#f00",
			rotation: 0,
			scale: 1.0,
			anchor: new google.maps.Point(0, 0),
		};
		
		this.altMarker = new google.maps.Marker({
			position: this.position,
			title: "",
			icon: altIcon,
 			//map: map,
			draggable: false,
		});
		
	
	}


  

 

	getXml = function(doc){
	
		var wpElm = doc.createElement("Waypoint");
		wpElm.setAttribute("index", this.index);
		var idElm = doc.createElement("id");
		idElm.setAttribute("value", this.id);
		wpElm.appendChild(idElm);
		var posElm = doc.createElement("position");
		posElm.setAttribute("latitude", this.position.lat());
		posElm.setAttribute("longitute", this.position.lng());
		wpElm.appendChild(posElm);
		var altElm = doc.createElement("altitude");
		altElm.setAttribute("value", this.altitude);
		wpElm.appendChild(altElm);
		var elvElm = doc.createElement("elevation");
		elvElm.setAttribute("value", this.elevation);
		wpElm.appendChild(elvElm);
		var speedElm = doc.createElement("speed");
		speedElm.setAttribute("value", this.speed);
		wpElm.appendChild(speedElm);
		var headElm = doc.createElement("headingId");
		headElm.setAttribute("value", this.headingId);
		wpElm.appendChild(headElm);
		var rotElm = doc.createElement("azimuth");
		rotElm.setAttribute("value", this.azimuth);
		wpElm.appendChild(rotElm);
		var pitchElm = doc.createElement("pitchAngle");
		pitchElm.setAttribute("value", this.pitchAngle);
		wpElm.appendChild(pitchElm);
		var smElm = doc.createElement("smoothing");
		smElm.setAttribute("value", this.smoothing);
		wpElm.appendChild(smElm);
		return wpElm;
	}


	setFromXml = function(xml){

			var el= xml.getElementsByTagName('id');
			if(el.lenght>0)this.id =parseInt(el[0].getAttribute('value'));

			el=xml.getElementsByTagName('position');
			if(el.lenght>0){
			var lat=parseFloat(el[0].getAttribute('latitude'));
			var lng=parseFloat(el[0].getAttribute('longitute'));
			this.position=new google.maps.LatLng(lat,lng);}
			this.marker.setPosition(this.position);   

			el= xml.getElementsByTagName('altitude');
			if(el.lenght>0)this.altitude =parseInt(el[0].getAttribute('value'));

			el= xml.getElementsByTagName('elevation');
			if(el.lenght>0)this.elevation =parseInt(el[0].getAttribute('value'));

			el= xml.getElementsByTagName('speed');
			if(el.lenght>0)this.speed =parseFloat(el[0].getAttribute('value'));

			el= xml.getElementsByTagName('headingId');
			if(el.lenght>0)this.headingId =parseInt(el[0].getAttribute('value'));

			el= xml.getElementsByTagName('azimuth');
			if(el.lenght>0)this.azimuth =parseInt(el[0].getAttribute('value'));
			
			el= xml.getElementsByTagName('pitchAngle');
			if(el.lenght>0)this.pitchAngle =parseInt(el[0].getAttribute('value'));

			el= xml.getElementsByTagName('smoothing');
			if(el.lenght>0)this.smoothing =parseFloat(el[0].getAttribute('value'));

	}

 getCsv = function(tb,pos){

		if(this.azimuth<-180)this.azimuth+=360.0;
		var hd = this.position.lat()+tb+this.position.lng()+tb+this.altitude+tb+this.azimuth;
		hd += tb+this.curvesize;
		var rotationdir =0; hd += tb+rotationdir;
		var gimbalmode =0; hd += tb+gimbalmode;
		hd += tb+this.pitchAngle;
		for(i=1;i<=15;i++){
			var actiontype =0; hd += tb+actiontype;
			var actionparam =0; hd += tb+actionparam;
		}
		var altitudemode =0; hd += tb+altitudemode;
		hd += tb+this.speed
		if(pos != null){
			hd += tb+pos.position.lat()+tb+pos.position.lng()+tb+pos.altitude;
		} else{
			hd += tb+0+tb+0+tb+0;
		}
		var poi_altitudemode =0; hd += tb+poi_altitudemode;
		var photo_timeinterval =0; hd += tb+photo_timeinterval;
		var photo_distinterval =0; hd += tb+photo_distinterval;
		return hd;

	}




}

