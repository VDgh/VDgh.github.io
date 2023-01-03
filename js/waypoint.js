
const markerColor = '#0000'; //'#05f';
const defSmoothing = 0.8;

class Waypoint {

    position;
    index;
    id = 0;
    headingId = 0;
    altitude = 20;
    elevation = -1000;
    markColor = markerColor;
    speed = 3.5;

    azimuth = 0;
    pitchAngle = 0;
    smoothing = 0;
    curvesize = 0.2;
    listActivities = [];

    constructor(latLng, ix) {
        if (latLng != null) {
            this.position = new google.maps.LatLng(latLng.lat(), latLng.lng());
        }
 		this.index = ix;
        this.id = Math.floor(Math.random() * 1000000);
        this.bzPoly = new google.maps.Polyline({
            strokeColor: "#aaff00",
            strokeOpacity: 1.0,
            strokeWeight: 2,
            map: map,
        });

        this.markerDef();

    }

    markerDef() {
        //https://www.w3.org/TR/SVG/paths.html#PathData
        //path:"M0,-10 a10,10 0 0,1 0,20 a10,10 0 0,1 0,-20 z", //  circle
        //path: " M -3,0 3,0 M 0,-4 0,4  M -4,-4 A 7,7 0 1,0 4,-4 L 0,-10 z ",
        //path: " M -4,0 4,0 M 0,-6 0,6  M 1,-6 a3,3 0 1,1 4,4 v 4 a3,3 0 1,1 -4,4 h -2 a 3,3 0 1,1 -4,-4 v -4 a 3,3 0 1,1 4,-4 z  M -7,-7 A 10,10 0 1,0 7,-7 L 0,-16 z ",
        //path: " M 0,-9 h 2 a5,5 0 1,1 6,6 v 6 a5,5 0 1,1 -6,6 h -4 a 5,5 0 1,1 -6,-6 v -6 a 5,5 0 1,1 6,-6  M 0,-9 v -30 M 0,-9 z ",
        //path: " M 1,-6 a3,3 0 1,1 4,4 v 4 a3,3 0 1,1 -4,4 h -2 a 3,3 0 1,1 -4,-4 v -4 a 3,3 0 1,1 4,-4 z ",

        const altIcon = {
            path: " M 0,-30 0,-6 M 1,-6 a3,3 0 1,1 4,4 v 4 a3,3 0 1,1 -4,4 h -2 a 3,3 0 1,1 -4,-4 v -4 a 3,3 0 1,1 4,-4 z ",
            fillColor: "#ddd",
            fillOpacity: 1,
            strokeWeight: 1,
            strokeColor: "#fc0",
            rotation: this.azimuth,
            scale: 1.8,
            anchor: new google.maps.Point(0, 0),
        };

        this.altMarker = new google.maps.Marker({
            position: this.position,
            title: "#",
            icon: altIcon,
            label: {
                text: (this.altitude).toString(),
                color: 'black',
                fontSize: "11px",
                fontWeight: "normal"
            },
            map: map,
            draggable: false,
        });

        const ixIcon = {
            //path: " M 0,0 z ",
            path: "M0,-10 a10,10 0 0,1 0,20 a10,10 0 0,1 0,-20 z", //  circle
            fillColor: "#fff",
            fillOpacity: .7,
            strokeWeight: 1,
            strokeColor: "#888",
            rotation: 0,
            scale: 0.8,
            anchor: new google.maps.Point(20, 20),
        };
        this.ixMarker = new google.maps.Marker({
            position: this.position,
            icon: ixIcon,
            label: {
                text: (this.index + 1).toString(),
                color: 'black',
                fontSize: "12px",
                fontWeight: "normal"
            },
            map: map,
            clickable: false,
        });

        const droneIcon = {

            //path: "  M -7,-7 A 10,10 0 1,0 7,-7 L 0,-16 z ",
            path: " M 1,-6 a3,3 0 1,1 4,4 v 4 a3,3 0 1,1 -4,4 h -2 a 3,3 0 1,1 -4,-4 v -4 a 3,3 0 1,1 4,-4 z  M -7,-7 A 10,10 0 1,0 7,-7 L 0,-16 z ",

            fillColor: this.markColor,
            fillOpacity: 0.9,
            strokeWeight: 1,
            strokeColor: this.markColor,
            rotation: this.azimuth,
            scale: 1.5,
            anchor: new google.maps.Point(0, 0),
        };

        this.marker = new google.maps.Marker({
            position: this.position,
            title: "#",
            icon: droneIcon,
            map: map,
            volatilit: true,
            draggable: true,
        });

        this.marker.addListener("click", () => {
            clickWp(this.index)
        });

        this.marker.addListener("dragstart", () => {
            dragWp(this.index, 1);
        });

        this.marker.addListener("drag", () => {
            dragWp(this.index, 2);
        });

        this.marker.addListener("dragend", () => {
            dragWp(this.index, 3);
        });

    }

    refreshMarkers = function () {

        this.ixMarker.setPosition(this.position);
        var ic = this.ixMarker.getIcon();
        ic.rotation = this.azimuth;
        this.ixMarker.setIcon(ic);
        ic = this.ixMarker.getLabel();
        ic.text = this.index + 1;
        this.ixMarker.setLabel(ic);
        this.altMarker.setPosition(this.position);
        ic = this.altMarker.getIcon();
        ic.rotation = this.azimuth;
        this.altMarker.setIcon(ic);
        ic = this.altMarker.getLabel();
        ic.text = this.altitude;
        this.altMarker.setLabel(ic);
        ic = this.marker.getIcon();
        ic.rotation = this.azimuth;
        ic.fillColor = this.markColor;
        if (this.markColor == markerColor)
            ic.strokeColor = markerColor;
        else
            ic.strokeColor = '#000';

        this.marker.setIcon(ic);
    }

    showMarkers = function () {
        this.ixMarker.setMap(map);
        this.altMarker.setMap(map);
        this.marker.setMap(map);
        this.bzPoly.setMap(map);
    }

    hideMarkers = function () {
        this.ixMarker.setMap(null);
        this.altMarker.setMap(null);
        this.marker.setMap(null);
        this.bzPoly.setMap(null);
    }

    deleteWp = function () {
        this.hideMarkers();
        google.maps.event.clearInstanceListeners(this.marker);
    }

    bezierPath = function (draw, steps, wpBf, wpAf) {

        var ds1 = distance(this.position, wpBf.position);
        var ds3 = distance(this.position, wpAf.position);
        var minVl = Math.min(ds1, ds3) / 2;
        this.curvesize = this.smoothing * minVl;
        var rsh1 = this.curvesize / ds1;
        var rsh3 = this.curvesize / ds3;
        var sm1 = new google.maps.LatLng(
                rsh1 * wpBf.position.lat() + (1 - rsh1) * this.position.lat(),
                rsh1 * wpBf.position.lng() + (1 - rsh1) * this.position.lng());
        var sm3 = new google.maps.LatLng(
                rsh3 * wpAf.position.lat() + (1 - rsh3) * this.position.lat(),
                rsh3 * wpAf.position.lng() + (1 - rsh3) * this.position.lng());
        var pathBz = bezierCurve3Wp(steps, sm1, this.position, sm3);
        this.bzPoly.setMap(map);
        if (draw)
            this.bzPoly.setPath(pathBz);

        sm1 = rsh1 * wpBf.altitude + (1 - rsh1) * this.altitude;
        sm3 = rsh3 * wpAf.altitude + (1 - rsh3) * this.altitude;
        this.bezierAltitude = bezierCurve3(steps, sm1, this.altitude, sm3);

        //sm1 = rsh1*wpBf.azimuth + (1 -  rsh1) * this.azimuth;
        //sm3 = rsh3*wpAf.azimuth + (1 -  rsh3) * this.azimuth;
        //this.bezierAzimuth = bezierCurve3(steps, sm1, this.azimuth, sm3);

        sm1 = angleRatio(this.azimuth, wpBf.azimuth, rsh1);
        sm3 = angleRatio(this.azimuth, wpAf.azimuth, rsh3);
        //alert(rsh1+" "+rsh3 +"\n"+ wpBf.azimuth+" "+this.azimuth+" "+wpAf.azimuth +"\n"+  sm1+" "+this.azimuth+" "+sm3);
        this.bezierAzimuth = bezierCurve3(steps, sm1, this.azimuth, sm3);

        sm1 = rsh1 * wpBf.pitchAngle + (1 - rsh1) * this.pitchAngle;
        sm3 = rsh3 * wpAf.pitchAngle + (1 - rsh3) * this.pitchAngle;
        this.bezierPitchAngle = bezierCurve3(steps, sm1, this.pitchAngle, sm3);

        return pathBz;
    }

    getXml = function (doc) {

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

        for (i = 0; i < this.listActivities.length; i++) {
            var paElm = doc.createElement("point_action");
            paElm.setAttribute("name", this.listActivities[i][0]);
            paElm.setAttribute("deg", this.listActivities[i][1]);
            paElm.setAttribute("sec", this.listActivities[i][2]);
            paElm.setAttribute("ccw", this.listActivities[i][3]);
            wpElm.appendChild(paElm);
        }

        return wpElm;
    }

    setFromXml = function (xml) {

        var el = xml.getElementsByTagName('id');
        if (el.length > 0)
            this.id = parseInt(el[0].getAttribute('value'));

        el = xml.getElementsByTagName('position');
        if (el.length > 0) {
            var lat = parseFloat(el[0].getAttribute('latitude'));
            var lng = parseFloat(el[0].getAttribute('longitute'));
            this.position = new google.maps.LatLng(lat, lng);
        }
        this.marker.setPosition(this.position);

        el = xml.getElementsByTagName('altitude');
        if (el.length > 0)
            this.altitude = parseInt(el[0].getAttribute('value'));

        el = xml.getElementsByTagName('elevation');
        if (el.length > 0)
            this.elevation = parseInt(el[0].getAttribute('value'));

        el = xml.getElementsByTagName('speed');
        if (el.length > 0)
            this.speed = parseFloat(el[0].getAttribute('value'));

        el = xml.getElementsByTagName('headingId');
        if (el.length > 0)
            this.headingId = parseInt(el[0].getAttribute('value'));

        el = xml.getElementsByTagName('azimuth');
        if (el.length > 0)
            this.azimuth = parseInt(el[0].getAttribute('value'));

        el = xml.getElementsByTagName('pitchAngle');
        if (el.length > 0)
            this.pitchAngle = parseInt(el[0].getAttribute('value'));

        el = xml.getElementsByTagName('smoothing');
        if (el.length > 0)
            this.smoothing = parseFloat(el[0].getAttribute('value'));

        el = xml.getElementsByTagName('point_action');
        this.listActivities = [];
        for (let i = 0; i < el.length; i++) {
            let siAc = [4];
            siAc[0] = el[i].getAttribute('name');
            siAc[1] = el[i].getAttribute('deg');
            siAc[2] = el[i].getAttribute('sec');
            siAc[3] = el[i].getAttribute('ccw');
            this.listActivities.push(siAc);
        }
        this.refreshMarkers();
 	}

    getCsv = function (tb, pos) {

        var hd = this.position.lat() + tb + this.position.lng() + tb + this.altitude + tb + this.azimuth;
        hd += tb + this.curvesize;
        var rotationdir = 0;
        hd += tb + rotationdir;
        var gimbalmode = 0;
        hd += tb + gimbalmode;
        hd += tb + this.pitchAngle;

        for (i = 0; i < this.listActivities.length; i++) {
            if (this.listActivities[i][0] == "Stay For")
                hd += tb + 0 + tb + this.listActivities[i][2]*1000;
            if (this.listActivities[i][0] == "Take Photo")
                hd += tb + 1 + tb + 0;
            if (this.listActivities[i][0] == "Start Video")
                hd += tb + 2 + tb + 0;
            if (this.listActivities[i][0] == "Stop Video")
                hd += tb + 3 + tb + 0;
            if (this.listActivities[i][0] == "Rotate Aircraft")
                hd += tb + 4 + tb + this.listActivities[i][1];
            if (this.listActivities[i][0] == "Tilt Camera")
                hd += tb + 5 + tb + this.listActivities[i][1];
            if (this.listActivities[i][0] == "Orbit")
                hd += tb + 4 + tb + this.listActivities[i][1]; // <!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

        }

        for (i = this.listActivities.length; i < 15; i++) 
             hd += tb + "-1" + tb + "0";
        
		var altitudemode = 0;
        hd += tb + altitudemode;
        hd += tb + this.speed
        if (pos != null) {
            hd += tb + pos.position.lat() + tb + pos.position.lng() + tb + pos.altitude;
        } else {
            hd += tb + 0 + tb + 0 + tb + 0;
        }
        var poi_altitudemode = 0;
        hd += tb + poi_altitudemode;
        var photo_timeinterval = 0;
        hd += tb + photo_timeinterval;
        var photo_distinterval = 0;
        hd += tb + photo_distinterval;
        return hd;

    }

    setFromCsv = function () {}

}
