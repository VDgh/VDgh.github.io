

let poly;
let insrPoly;
let tlPoly;

let wpMid = [];
let waypoints = [];
let pois = [];
let tmLn = [];
let polyArr = [];

let elevator;
let infowindow;
let tiltRotBtns;

// Initialize and add the map
function initMap() {
    const gfg_office = {
        lat: 46.38464,
        lng: -72.55208,
    };

    map = new google.maps.Map(
            document.getElementById("map"), {
            zoom: 17,
            center: gfg_office,
            zoomControl: true,
            mapTypeControl: true,
            mapTypeId: "terrain",
            scaleControl: true,
            streetViewControl: false,
            rotateControl: true,
            fullscreenControl: false,

            heading: 0, // 320,
            tilt: 0, // 47.5,
            mapId: "90f87356969d889c", //"undefined",
        });

    tiltRotBtns = [];
    const buttons = [
        ["Rotate Left", "rotate", 15, google.maps.ControlPosition.LEFT_CENTER],
        ["Rotate Right", "rotate", -15, google.maps.ControlPosition.RIGHT_CENTER],
        ["Tilt Down", "tilt", 15, google.maps.ControlPosition.TOP_CENTER],
        ["Tilt Up", "tilt", -15, google.maps.ControlPosition.BOTTOM_CENTER],
    ];
    cnt = 0;
    buttons.forEach(([text, mode, amount, position]) => {
        const controlDiv = document.createElement("div");
        const controlUI = document.createElement("button");

        controlUI.classList.add("ui-button");
        controlUI.innerText = `${text}`;
        controlUI.style.visibility = 'hidden';
        controlUI.id = "tiltRotBtn" + (cnt++);
        controlUI.addEventListener("click", () => {

            adjustMap(mode, amount);
        });
        controlDiv.appendChild(controlUI);
        tiltRotBtns.push(controlUI);
        map.controls[position].push(controlDiv);

    });

    const adjustMap = function (mode, amount) {
        switch (mode) {
        case "tilt":
            map.setTilt(map.getTilt() + amount);
            break;
        case "rotate":
            map.setHeading(map.getHeading() + amount);
            break;
        default:
            break;
        }
        redraw3D();

    };

    addYourLocationButton(map);

    polyM();
}

function polyM() {

    poly = new google.maps.Polyline({
        strokeColor: "#000000",
        strokeOpacity: 1.0,
        strokeWeight: 1,
    });
    poly.setMap(map);

    insrPoly = new google.maps.Polyline({
        strokeColor: "#000000",
        strokeOpacity: 1.0,
        strokeWeight: 1,
    });
    insrPoly.setMap(map);

    tlPoly = new google.maps.Polyline({
        strokeColor: "#ff0000",
        strokeOpacity: 1,
        strokeWeight: 2,
    });
    tlPoly.setMap(map);

    elevator = new google.maps.ElevationService();
    infowindow = new google.maps.InfoWindow({});
    infowindow.open(map);

    map.addListener("mousedown", slowDown);
    map.addListener("center_changed", slowUp);
    map.addListener("mouseup", slowUp);

    initSettings();

}
//=======================================================================

function timeLine() {

    totalPoly = [];
    totalSpeed = [];
    totalAltitude = [];
    totalAzimuth = [];
    totalPitch = [];
    steps = 10;
    for (i = 0; i < waypoints.length; i++) {
        if (waypoints[i].smoothing == 0 || i == 0 || i == waypoints.length - 1) {
            totalPoly.push(waypoints[i].position);
            totalSpeed.push(waypoints[i].speed);
            totalAltitude.push(waypoints[i].altitude);
            totalAzimuth.push(waypoints[i].azimuth);
            totalPitch.push(waypoints[i].pitchAngle);
        } else {
            pntPoly = waypoints[i].bezierPath(false, steps, waypoints[i - 1], waypoints[i + 1]);
            pntSpeed = bezierCurve2(pntPoly.length, waypoints[i - 1].speed, waypoints[i].speed);

            for (j = 0; j < pntPoly.length; j++) {
                totalPoly.push(pntPoly[j]);
                totalSpeed.push(pntSpeed[j]);
                totalAltitude.push(waypoints[i].bezierAltitude[j]);
                totalAzimuth.push(waypoints[i].bezierAzimuth[j]);
                totalPitch.push(waypoints[i].bezierPitchAngle[j]);
            }
        }
    }
    totalPoly.push(waypoints[waypoints.length - 1].position);
    totalSpeed.push(waypoints[waypoints.length - 1].speed);
    totalAltitude.push(waypoints[waypoints.length - 1].altitude);
    totalAzimuth.push(waypoints[waypoints.length - 1].azimuth);
    totalPitch.push(waypoints[waypoints.length - 1].pitchAngle);

    //alert( totalPoly.length);

    stepSec = 1;
    tl = timeline(stepSec, totalPoly, totalSpeed);

    //path=[];
    tmLn = [];
    for (i = 0; i < tl.length; i++) {
        wpIx = Math.floor(tl[i]);
        rh = tl[i] - wpIx;
        la = (1 - rh) * totalPoly[wpIx].lat() + rh * totalPoly[wpIx + 1].lat();
        lo = (1 - rh) * totalPoly[wpIx].lng() + rh * totalPoly[wpIx + 1].lng();
        tm = new TimePoint(new google.maps.LatLng(la, lo), i);
        tm.speed = (1 - rh) * totalSpeed[wpIx] + rh * totalSpeed[wpIx + 1];
        tm.altitude = (1 - rh) * totalAltitude[wpIx] + rh * totalAltitude[wpIx + 1];
        tm.azimuth = angleRatio(totalAzimuth[wpIx], totalAzimuth[wpIx + 1], rh); //(1-rh)*totalAzimuth[wpIx]+rh*totalAzimuth[wpIx+1];
        tm.pitchAngle = (1 - rh) * totalPitch[wpIx] + rh * totalPitch[wpIx + 1];

        tmLn.push(tm);

        //path.push(new google.maps.LatLng(la,lo));
    }

    //tlPoly.setPath(path);
    //alert(tmLn.length);
    redraw3D();
}

//========================================================================


var del = null;
var e = null;
var reliefElevation;

function cameraR(hWinPx, zoom) {
    const conAng = toRadians(12.5);
    var wH = hWinPx / Math.pow(2, zoom);
    return .5 * wH / Math.tan(conAng);
}

function redraw3D() {

    if (tiltRotBtns[0].style.visibility == 'hidden')
        return;

    //------------camera coo-----------------

    proj = map.getProjection();
    ce = proj.fromLatLngToPoint(map.getCenter());
    rCm = cameraR(window.innerHeight, map.zoom);
    camP = new GeoPoint(0, rCm * Math.sin(toRadians(map.tilt)), rCm * Math.cos(toRadians(map.tilt)));
    camMx = matrix_1();
    camMx = rotate_Z(toRadians(map.getHeading()), camMx);
    camRel = camP.rotate(camMx);
    camR = new GeoPoint(camRel.x + ce.x, camRel.y + ce.y, camRel.z);
    //---------------------------------------------------------------------------------
    geoSc = .000003;
    z0 = camR.z;

    for (i = 0; i < polyArr.length; i++) {
        polyArr[i].setMap(null);
    }
    polyArr = [];
    prev0 = null;
    prev1 = null;

    path3dChecked = document.getElementById("3dPath").checked;
    heading3dChecked = document.getElementById("3dHeading").checked;

    for (i = 0; i < tmLn.length; i++) {
        coo = proj.fromLatLngToPoint(tmLn[i].position);
        z1 = tmLn[i].altitude * geoSc;
        gp = new GeoPoint(coo.x, coo.y, z1);

        x = (coo.x - camR.x) * z1 / (z0 - z1) + coo.x;
        y = (coo.y - camR.y) * z1 / (z0 - z1) + coo.y;
        wp = new google.maps.Point(x, y);
        ps = proj.fromPointToLatLng(wp);

        //------------------------------------------------------------
        loo = new GeoPoint(0, -0.0001, 0);
        looMx = matrix_1();
        //looMx =rotate_X(toRadians(tmLn[i].pitchAngle),looMx);
        looMx = rotate_Z(toRadians(tmLn[i].azimuth), looMx);
        looR = loo.rotate(looMx);
        w3loo = looR.add(gp);

        xL = (w3loo.x - camR.x) * w3loo.z / (camR.z - w3loo.z) + w3loo.x;
        yL = (w3loo.y - camR.y) * w3loo.z / (camR.z - w3loo.z) + w3loo.y;
        wL = new google.maps.Point(xL, yL);
        pL = proj.fromPointToLatLng(wL);

        if (i > 0) {
            if (path3dChecked) {
                polyPoth = [prev0, prev1, ps, tmLn[i].position];
                newPlg = new google.maps.Polygon({
                    paths: polyPoth,
                    strokeColor: "#AA0000",
                    strokeOpacity: 1,
                    strokeWeight: 1,
                    fillColor: "#FF0000",
                    fillOpacity: 0.1,
                    zIndex: 5,
                });
                newPlg.setMap(map);
                polyArr.push(newPlg);
            }
            if (heading3dChecked) {
                polyLook = [prev1, prevL, pL, ps];
                newPlg = new google.maps.Polygon({
                    paths: polyLook,
                    strokeColor: "#0000AA",
                    strokeOpacity: 1,
                    strokeWeight: 1,
                    fillColor: "#0000FF",
                    fillOpacity: 0.4,
                    zIndex: 5,
                });
                newPlg.setMap(map);
                polyArr.push(newPlg);
            }
        }
        prev0 = tmLn[i].position;
        prev1 = ps;
        prevL = pL
    }

}

function slowDown(evn) {
    e=evn;
	del = setTimeout(slowClick, 500);
    reliefElevation = -1000;
    elevator.getElevationForLocations({
        locations: [evn.latLng],
    }, function (results, status) {
        reliefElevation = results[0].elevation;
        if (waypoints.length > 0 && waypoints[waypoints.length - 1].position.lat() == evn.latLng.lat()) {
            waypoints[waypoints.length - 1].elevation = Math.round(reliefElevation);
        }

    });
}

function slowUp(evn) {
    redraw3D();
    clearTimeout(del);
    e = null;
}

function slowClick(evn) {
    clearTimeout(del);
    addLatLng(e);
    e = null;
}

function addLatLng(evn) {
    if (radioWp.checked) {
        tw = new Waypoint(evn.latLng, waypoints.length);
        tw.elevation = Math.round(reliefElevation);
        waypoints.push(tw);
        displayChange(waypoints.length);
        redrawPath();
    } else {
        po = new Poi(evn.latLng, pois.length);
        pois.push(po);
        displayChange(pois.length);
    }

}

function clickWp(wpNm) {

    displayChange(wpNm + 1);

    if (radioWp.checked) {
        for (let i = 0; i < waypoints.length; i++) {
            ic = waypoints[i].marker.getIcon();
            if (i != wpNm) {
                ic.fillColor = waypoints[i].markColor;
            } else {
                ic.fillColor = "red";
            }
            waypoints[i].marker.setIcon(ic);
        }
    } else {
        for (let i = 0; i < pois.length; i++) {
            ic = pois[i].marker.getIcon();
            if (i != wpNm) {
                ic.fillColor = pois[i].markColor;
            } else {
                ic.fillColor = "red";
            }
            pois[i].marker.setIcon(ic);
        }
    }

}

function dragWp(wpNm, stat) {

    if (stat == 1) {
        waypointsOld = waypoints;
    }

    if (stat == 2) {

        if (radioWp.checked) {

            path = [];
            waypoints[wpNm].position = waypoints[wpNm].marker.getPosition();
            for (let i = 0; i < waypoints.length; i++) {
                path.push(waypoints[i].position);
                if (waypoints[wpNm].headingId == waypoints[i].id) {
                    waypoints[wpNm].azimuth = positionToAzimuth(waypoints[wpNm].position, waypoints[i].position);
                }
                if (waypoints[i].headingId == waypoints[wpNm].id) {
                    waypoints[i].azimuth = positionToAzimuth(waypoints[i].position, waypoints[wpNm].position);
                    waypoints[i].refreshMarkers();
                }
            }
            poly.setPath(path);

            for (let i = 0; i < pois.length; i++) {
                if (waypoints[wpNm].headingId == pois[i].id) {
                    waypoints[wpNm].markColor = pois[i].markColor;
                    waypoints[wpNm].azimuth = positionToAzimuth(waypoints[wpNm].position, pois[i].position);
                }
            }
            waypoints[wpNm].refreshMarkers();

            for (let i = Math.max(1, wpNm - 1); i < Math.min(waypoints.length - 1, wpNm + 2); i++) {
                pth = waypoints[i].bezierPath(true, 30, waypoints[i - 1], waypoints[i + 1]);
            }

            if (wpNm > 0) {
                pos = middle(waypoints[wpNm - 1].position,
                        waypoints[wpNm].position);
                wpMid[wpNm - 1].setPosition(pos);
            }

            if (wpNm < waypoints.length - 1) {
                pos = middle(waypoints[wpNm].position, waypoints[wpNm + 1].position);
                wpMid[wpNm].setPosition(pos);
            }

        } else {}

    }

    if (stat == 3) {
        //   redrawPath();
    }
}

function dragMd(mdNm, stat) {
    // alert(mdNm + "  " + stat);

    if (stat < 3) {

        insrPoly.setMap(null);
        path = [];

        path.push(waypoints[mdNm].position);
        path.push(wpMid[mdNm].getPosition());
        path.push(waypoints[mdNm + 1].position);

        insrPoly.setPath(path);
        insrPoly.setMap(map);

    } else {

        waypoints.splice(mdNm + 1, 0, new Waypoint(wpMid[mdNm].getPosition(), mdNm + 1));
        insrPoly.setMap(null);
        redrawPath();
        for (let i = 0; i < waypoints.length; i++) {
            waypoints[i].index = i;
            waypoints[i].refreshMarkers();
        }

        for (let i = 0; i < waypoints.length - 1; i++) {
            waypoints[i].azimuth = positionToAzimuth(waypoints[i].position, waypoints[i + 1].position);
            waypoints[i].refreshMarkers();
        }

    }
}

function redrawPath() {

    path = [];
    for (let i = 0; i < waypoints.length; i++) {
        path.push(waypoints[i].position);
        waypoints[i].refreshMarkers;
    }

	poly.setPath(path)


    for (let i = 1; i < waypoints.length - 1; i++) {
        pth = waypoints[i].bezierPath(true, 30, waypoints[i - 1], waypoints[i + 1]);
    }

    for (let i = 0; i < wpMid.length; i++) {
        google.maps.event.clearInstanceListeners(wpMid[i]);
        wpMid[i].setMap(null);
    }
    wpMid = [];
    for (let i = 1; i < waypoints.length; i++) {
        dis = parseInt(distance(waypoints[i - 1].position, waypoints[i].position), 10);
        pt = " M -5,3 5,3 5,-3 -5,-3  z ";
        if (dis > 10) {
            pt = " M -6,3 6,3 6,-3 -6,-3  z ";
        }
        if (dis > 100) {
            pt = " M -7,3 7,3 7,-3 -7,-3  z ";
        }
        if (dis > 1000) {
            pt = " M -8,3 8,3 8,-3 -8,-3  z ";
        }
        const lbl = {
            path: pt,
            fillColor: "#300",
            fillOpacity: 1.0,
            strokeWeight: 1,
            strokeColor: "#100",
            rotation: 0,
            scale: 3,
            anchor: new google.maps.Point(0, 0),
        };

        const md = new google.maps.Marker({
            position: middle(waypoints[i - 1].position, waypoints[i].position),
            icon: lbl,
            label: {
                text: dis.toString() + " m",
                color: '#fc0',
                fontSize: "10px"
            },

            map: map,
            draggable: true,
        });

        wpMid.push(md);
        md.addListener("dragstart", () => {
            dragMd(wpMid.indexOf(md), 1);
        });

        md.addListener("drag", () => {
            dragMd(wpMid.indexOf(md), 2);
        });

        md.addListener("dragend", () => {
            dragMd(wpMid.indexOf(md), 3);
        });
    }

}

//==============================================================

var latlng;
function addYourLocationButton(map) {
    var controlDiv = document.createElement('div');

    var firstChild = document.createElement('button');
    firstChild.style.backgroundColor = '#fff';
    firstChild.style.border = 'none';
    firstChild.style.outline = 'none';
    firstChild.style.width = '28px';
    firstChild.style.height = '28px';
    firstChild.style.borderRadius = '2px';
    firstChild.style.boxShadow = '0 1px 4px rgba(0,0,0,0.3)';
    firstChild.style.cursor = 'pointer';
    firstChild.style.marginRight = '10px';
    firstChild.style.padding = '0px';
    firstChild.title = 'Your Location';
    controlDiv.appendChild(firstChild);

    var secondChild = document.createElement('div');
    secondChild.style.margin = '5px';
    secondChild.style.width = '18px';
    secondChild.style.height = '18px';
    secondChild.style.backgroundImage = 'url(https://maps.gstatic.com/tactile/mylocation/mylocation-sprite-1x.png)';
    secondChild.style.backgroundSize = '180px 18px';
    secondChild.style.backgroundPosition = '0px 0px';
    secondChild.style.backgroundRepeat = 'no-repeat';
    secondChild.id = 'you_location_img';
    firstChild.appendChild(secondChild);

    google.maps.event.addListener(map, 'dragend', function () {
        $('#you_location_img').css('background-position', '0px 0px');
    });

    firstChild.addEventListener('click', function () {

        if (latlng != undefined) {
            map.setCenter(latlng);
            return;
        }

        var imgX = '0';
        var animationInterval = setInterval(function () {
            if (imgX == '-18')
                imgX = '0';
            else
                imgX = '-18';
            $('#you_location_img').css('background-position', imgX + 'px 0px');
        }, 500);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                map.setCenter(latlng);
                clearInterval(animationInterval);
                $('#you_location_img').css('background-position', '-144px 0px');
            });
        } else {
            clearInterval(animationInterval);
            $('#you_location_img').css('background-position', '0px 0px');
        }
    });

    controlDiv.index = 1;
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(controlDiv);
}

//=============================================================


//***********************************************
//***********************************************
//***********************************************


function middle(vx1, vx2) {

    var lat = (vx1.lat() + vx2.lat()) / 2;

    var lng = (vx1.lng() + vx2.lng()) / 2;
    vx = new google.maps.LatLng(lat, lng);

    return vx;
}

function pixelDistance(vx1, vx2, $zoom) {
    return distance(vx1, vx2) * pxPerKm21 >> (21 - $zoom);
}
