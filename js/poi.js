

class Poi {

    position;
    index;
    id;
    altitude = 5;
    markColor = "rgb(200,200,100)";
    index;

    constructor(latLng, ix) {
        if (latLng != null) {
            this.position = new google.maps.LatLng(latLng.lat(), latLng.lng());
        }

        this.index = ix;
        this.id = Math.floor(Math.random() * 1000000);

        var rC = 150 + Math.floor(Math.random() * 100);
        var gC = 150 + Math.floor(Math.random() * 100);
        var bC = 150 + Math.floor(Math.random() * 100);
        this.markColor = "rgb(" + rC + ", " + gC + ", " + bC + ")";

        this.markerDef();
    }

    markerDef() {
        //https://www.w3.org/TR/SVG/paths.html#PathData
        const poiIcon = {
            path: "M7,-12 a8,8 0 1,0 -14,-0 L0,0 z   M7,-15 a10,10 0 0,0 -14,0 a10,10 0 0,0 14,0  z   M0,-18 a3,3 0 0,1 0,6 a3,3 0 0,1 0,-6 z  M0,-17 a2,2 0 0,1 0,4 M0,-16 a1,1 0 0,1 0,2    ",

            fillColor: this.markColor,
            fillOpacity: 0.9,
            strokeWeight: 1,
            strokeColor: "#000",
            rotation: this.rotation,
            scale: 1.7,
            anchor: new google.maps.Point(0, 0),
        };

        this.marker = new google.maps.Marker({
            position: this.position,
            title: "",
            icon: poiIcon,
            map: map,
            volatilit: true,
            draggable: true,
        });

        this.marker.addListener("click", () => {
            clickWp(this.index);
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

        const altIcon = {
            path: "M0,0 z",
            fillColor: "#ddd",
            fillOpacity: 1,
            strokeWeight: 0,
            strokeColor: "#fc0",
            rotation: 0,
            scale: 1,
            anchor: new google.maps.Point(0, 14),
        };

        this.altMarker = new google.maps.Marker({
            position: this.position,
            title: "",
            icon: altIcon,
            label: {
                text: (this.altitude).toString(),
                color: 'black',
                fontSize: "11px",
                fontWeight: "normal"
            },
            map: map,
            draggable: false,
            clickable: false,
        });

        const ixIcon = {
            path: " M 0,0 z ",
            fillColor: "#fff",
            fillOpacity: .7,
            strokeWeight: 0,
            strokeColor: "#888",
            rotation: 0,
            scale: 1,
            anchor: new google.maps.Point(0, 35),
        };
        this.ixMarker = new google.maps.Marker({
            position: this.position,
            icon: ixIcon,
            label: {
                text: (this.index + 1).toString(),
                color: 'black',
                fontSize: "11px",
                fontWeight: "normal"
            },
            map: map,
            draggable: false,
            clickable: false,
        });

    }

    refreshMarkers = function () {

        this.marker.setPosition(this.position);

        this.altMarker.setMap(null);
        this.ixMarker.setMap(null);

        this.ixMarker.setPosition(this.position);
        var ic = this.ixMarker.getLabel();
        ic.text = this.index + 1;
        this.ixMarker.setLabel(ic);
        this.altMarker.setPosition(this.position);
        ic = this.altMarker.getLabel();
        ic.text = this.altitude;
        this.altMarker.setLabel(ic);

        this.ixMarker.setMap(map);
        this.altMarker.setMap(map);
    }

    deletePoi = function () {
        this.ixMarker.setMap(null);
        this.altMarker.setMap(null);
        this.marker.setMap(null);
        google.maps.event.clearInstanceListeners(this.marker);
    }

    getXml = function (doc) {

        var poiElm = doc.createElement("POI");
        poiElm.setAttribute("index", this.index);
        var idElm = doc.createElement("id");
        idElm.setAttribute("value", this.id);
        poiElm.appendChild(idElm);
        var posElm = doc.createElement("position");
        posElm.setAttribute("latitude", this.position.lat());
        posElm.setAttribute("longitute", this.position.lng());
        poiElm.appendChild(posElm);
        var altElm = doc.createElement("altitude");
        altElm.setAttribute("value", this.altitude);
        poiElm.appendChild(altElm);
        return poiElm;
    }

    setFromXml = function (xml) {

        var el = xml.getElementsByTagName('id');
        this.id = parseInt(el[0].getAttribute('value'));

        el = xml.getElementsByTagName('position');
        var lat = parseFloat(el[0].getAttribute('latitude'));
        var lng = parseFloat(el[0].getAttribute('longitute'));
        this.position = new google.maps.LatLng(lat, lng);
        this.marker.setPosition(this.position);

        el = xml.getElementsByTagName('altitude');
        this.altitude = parseInt(el[0].getAttribute('value'));

    }

}
