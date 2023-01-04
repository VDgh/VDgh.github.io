

let selWp = -1;
let selPoi = -1;

let radioWp;
let wp;
let poi;
let display;
let locationText;
let selLookAt;

function initSettings() {
    radioWp = document.getElementById("radioWp");
    wp = document.getElementById("Waypoints");
    poi = document.getElementById("POI");
    display = document.getElementById("display");
    locationText = document.getElementById("locTxt");
    selLookAt = document.getElementById("selLookAt");

    var radios = document.querySelectorAll('input[type=radio]'); //  'input[type=radio][name=".."]'
    radios.forEach(radio => radio.addEventListener('change', () => displayChange(0)));
}

function updateSettings(upNmb) {

    if (radioWp.checked) {
        selWp = upNmb;

        waypoints[upNmb].markColor = markerColor;

        locationText.value = waypoints[upNmb].position.lat() + "\n" + waypoints[upNmb].position.lng() + "\n" + waypoints[upNmb].elevation;
        altitudeVal(waypoints[upNmb].altitude);
        speedVal(2, waypoints[upNmb].speed);
        bezierVal(2, waypoints[upNmb].smoothing);

        selLookAt = document.getElementById("selLookAt");
        editLookAt();
        pos = null;
        altDif = 0;
        selLookAt.value = "Free Selection";
        if (upNmb < waypoints.length - 1 && waypoints[upNmb].headingId == waypoints[upNmb + 1].id) {
            selLookAt.value = "Next Waypoint";
            pos = waypoints[upNmb + 1].position;
            altDif = waypoints[upNmb].altitude - waypoints[upNmb + 1].altitude;
        } else if (upNmb > 0 && waypoints[upNmb].headingId == waypoints[upNmb - 1].id) {
            selLookAt.value = "Previous Waypoint";
            pos = waypoints[upNmb - 1].position;
            altDif = waypoints[upNmb].altitude - waypoints[upNmb - 1].altitude;
        } else {

            for (let i = 0; i < pois.length; i++) {
                if (waypoints[upNmb].headingId == pois[i].id) {
                    selLookAt.value = "POI - " + (i + 1);
                    pos = pois[i].position;
                    waypoints[upNmb].markColor = pois[i].markColor;
                    altDif = waypoints[upNmb].altitude - pois[i].altitude;
                }
            }
        }
        if (selLookAt.value == "Free Selection") {
            waypoints[upNmb].headingId = 0;
        }

        if (pos != null) {
            waypoints[upNmb].azimuth = positionToAzimuth(waypoints[upNmb].position, pos);
            dis = distance(waypoints[upNmb].position, pos);
            waypoints[upNmb].pitchAngle = Math.round(toDegrees(Math.atan2(altDif, dis)));
        }

        waypoints[upNmb].refreshMarkers();

        azimithVal(waypoints[upNmb].azimuth);
        pitchVal(waypoints[upNmb].pitchAngle);

        let container = document.getElementById("actCont");
        for (i = container.children.length - 1; i > 1; i--)
            container.removeChild(container.children[i]);

        for (i = 0; i < waypoints[upNmb].listActivities.length; i++) {
            per = addAction();

            selLookAt = per.querySelector("#selLookAt");
            degInput = per.querySelector("#degInput");
            degLabel = per.querySelector("#degLabel");
            secInput = per.querySelector("#secInput");
            secLabel = per.querySelector("#secLabel");
            btnCCW = per.querySelector("#btnCCW");

            selLookAt.value = waypoints[upNmb].listActivities[i][0];

            if (String(waypoints[upNmb].listActivities[i][1]) != 'null') {
                degInput.hidden = false;
                degInput.value = waypoints[upNmb].listActivities[i][1];
                degLabel.hidden = false;
            }
            if (String(waypoints[upNmb].listActivities[i][2]) != 'null') {
                secInput.hidden = false;
                secInput.value = waypoints[upNmb].listActivities[i][2];
                secLabel.hidden = false;
            }
            if (String(waypoints[upNmb].listActivities[i][3]) != 'null') {
                btnCCW.hidden = false;
                btnCCW.innerHTML = waypoints[upNmb].listActivities[i][3];
            }

        }

    } else {
		
	    locationText.value = pois[upNmb].position.lat() + "\n" + pois[upNmb].position.lng() + "\n" + pois[upNmb].elevation;
		altitudeValP(pois[upNmb].altitude);
	}
}

function plusOne() {
    nmb = parseInt(display.value);
    if (isNaN(nmb))
        nmb = 0;
    displayChange(nmb + 1, true);
}

function minusOne() {
    nmb = parseInt(display.value);
    if (isNaN(nmb))
        nmb = 0;
    displayChange(nmb - 1, true)
}

function displayChange(nmb, center) {

    var dsp;
    if (isNaN(nmb))
        dsp = 0;
    else
        dsp = parseInt(nmb);

    if (radioWp.checked) {
        if (waypoints.length > 0) {
            if (dsp > waypoints.length) {
                dsp = waypoints.length;
            } else if (dsp < 1) {
                dsp = 1;
            }

            selWp = dsp - 1;
            if (center)
                map.setCenter(waypoints[selWp].position);

        } else {
            dsp = "";
            selWp = -1;
        }
    } else {
        if (pois.length > 0) {
            if (dsp > pois.length) {
                dsp = pois.length;
            } else if (dsp < 1) {
                dsp = 1;
            }
            selPoi = dsp - 1;
            if (center)
                map.setCenter(pois[selPoi].position);

        } else {
            dsp = "";
            selPoi = -1;
        }
    }

    display.value = dsp;
    if (dsp == "") {
        $(".panel").hide("slow");
    } else {
        updateSettings(dsp - 1);
    }

}

function deleteWpPoi() {

    selNmb = parseInt(display.value) - 1;
    delId = 0;
    if (radioWp.checked) {
        delId = waypoints[selNmb].id;
        waypoints[selNmb].deleteWp();
        waypoints.splice(selNmb, 1);
        for (let i = 0; i < waypoints.length; i++) {
            waypoints[i].index = i;
            waypoints[i].refreshMarkers();
        }
    } else {
        delId = pois[selNmb].id;
        pois[selNmb].deletePoi();
        pois.splice(selNmb, 1);
        for (let i = 0; i < pois.length; i++) {
            pois[i].index = i;
            pois[i].refreshMarkers();
        }
    }

    for (let i = 0; i < waypoints.length; i++) {
        if (waypoints[i].headingId == delId) {
            waypoints[i].headingId = 0;
            waypoints[i].azimuth = 0;
            waypoints[i].pitchAngle = 0;
            waypoints[i].refreshMarkers();
        }
    }

    redrawPath();
}

function selectAction(sel, id) {

    sel.old = sel.recent;
    sel.recent = sel.value;

    let container = document.getElementById("actCont");
    let per = document.getElementById(sel.parentElement.id);

    actIx = Array.from(container.children).indexOf(per) - 2;

    degInput = per.querySelector("#degInput");
    degLabel = per.querySelector("#degLabel");
    secInput = per.querySelector("#secInput");
    secLabel = per.querySelector("#secLabel");
    btnCCW = per.querySelector("#btnCCW");

    switch (sel.value) {
    case "Select":
    case "Take Photo":
    case "Start Video":
    case "Stop Video":
        degInput.hidden = true;
        degLabel.hidden = true;
        secInput.hidden = true;
        secLabel.hidden = true;
        btnCCW.hidden = true;
        break;
    case "Stay For":
        degInput.hidden = true;
        degLabel.hidden = true;
        secInput.hidden = false;
        secLabel.hidden = false;
        btnCCW.hidden = true;
        break;
    case "Rotate Aircraft":
    case "Orbit":
        degInput.hidden = false;
        degLabel.hidden = false;
        secInput.hidden = true;
        secLabel.hidden = true;
        btnCCW.hidden = false;
        break;
    case "Tilt Camera":
        degInput.hidden = false;
        degLabel.hidden = false;
        secInput.hidden = true;
        secLabel.hidden = true;
        btnCCW.hidden = true;
        break;
    case "Delete":
        container.removeChild(per);
        if (container.children.length == 2) {
            let bzrCont = document.getElementById("bzrCont");
            bzrCont.disabled = false;
        }
        break;
    case "Insert":
        sel.value = sel.old;
        let node = document.getElementById("act100");
        let clone = node.cloneNode(true);
        clone.hidden = false;
        clone.id = parseInt(Math.random() * 1000000)
            container.insertBefore(clone, per);
        break;
    }
    readWpActivities();
}

function addAction() {

    let node = document.getElementById("act100");
    let clone = node.cloneNode(true);
    let container = document.getElementById("actCont");
    clone.hidden = false;
    clone.id = parseInt(Math.random() * 1000000);
    container.appendChild(clone);

    bezierVal(2, 0);
    let bzrCont = document.getElementById("bzrCont");
    bzrCont.disabled = true;
    return clone;
}

function rotCCW(btn) {
    if (btn.innerHTML != "CW")
        btn.innerHTML = "CW";
    else
        btn.innerHTML = "CCW"
            readWpActivities();
}

function readWpActivities() {

    waypoints[selWp].listActivities = [];
    let container = document.getElementById("actCont");
    for (i = 2; i < container.children.length; i++) {
        per = container.children[i];
        selLookAt = per.querySelector("#selLookAt");
        degInput = per.querySelector("#degInput");
        secInput = per.querySelector("#secInput");
        btnCCW = per.querySelector("#btnCCW");
        sngAct = [];
        sngAct.push(selLookAt.value);
        if (degInput.hidden)
            sngAct.push(null);
        else
            sngAct.push(degInput.value);
        if (secInput.hidden)
            sngAct.push(null);
        else
            sngAct.push(secInput.value);
        if (btnCCW.hidden)
            sngAct.push(null);
        else
            sngAct.push(btnCCW.innerHTML);

        waypoints[selWp].listActivities.push(sngAct);
    }

}
//------------------------------------------------------------------------
function editLookAt() {

    var sl = document.getElementById("selLookAt");
    for (let i = sl.length - 1; i >= 0; i--) {
        sl.remove(i);
    }
    var option;
    if (selWp < waypoints.length - 1) {
        option = document.createElement("option");
        option.text = "Next Waypoint";
        sl.add(option);
    }
    if (selWp > 0) {
        option = document.createElement("option");
        option.text = "Previous Waypoint";
        sl.add(option);
    }
    option = document.createElement("option");
    option.text = "Free Selection";
    sl.add(option);
    for (let i = 0; i < pois.length; i++) {
        option = document.createElement("option");
        option.text = "POI - " + (i + 1);
        sl.add(option);
    }
}

function selectLookAt(el) {
    en = document.getElementById("enLaser");
    if (el.includes("Free")) {
        en.disabled = false;
    } else {
        en.disabled = true;
    }

    waypoints[selWp].headingId = 0;

    pos = null;
    altDif = 0;
    if (el.includes('POI - ')) {
        po = parseInt(el.replace("POI - ", ""));

        waypoints[selWp].headingId = pois[po - 1].id;
        waypoints[selWp].markColor = pois[po - 1].markColor;
        pos = pois[po - 1].position;
        altDif = waypoints[selWp].altitude - pois[po - 1].altitude;
    }
    if (el.includes('Next')) {
        waypoints[selWp].headingId = waypoints[selWp + 1].id;
        waypoints[selWp].markColor = markerColor;
        pos = waypoints[selWp + 1].position;
        altDif = waypoints[selWp].altitude - waypoints[selWp + 1].altitude;
    }
    if (el.includes('Previous')) {
        waypoints[selWp].headingId = waypoints[selWp - 1].id;
        waypoints[selWp].markColor = markerColor;
        pos = waypoints[selWp - 1].position;
        altDif = waypoints[selWp].altitude - waypoints[selWp - 1].altitude;
    }

    if (pos != null) {
        waypoints[selWp].azimuth = positionToAzimuth(waypoints[selWp].position, pos);
        dis = distance(waypoints[selWp].position, pos);
        waypoints[selWp].pitchAngle = Math.round(toDegrees(Math.atan2(altDif, dis)));
    } else {
        waypoints[selWp].azimuth = 0;
        waypoints[selWp].pitchAngle = 0;
    }
    waypoints[selWp].refreshMarkers();
    azimithVal(waypoints[selWp].azimuth);
    pitchVal(waypoints[selWp].azimuth);
}

function bezierVal(src, vl) {
    if (selWp == 0)
        vl = 0;
    //if(selWp==waypoints.length-1) vl=0;
    sl = document.getElementById("bzSlider");
    inp = document.getElementById("bzInpit");
    if (src == 1)
        vll = parseFloat(vl) / 100;
    else
        vll = parseFloat(vl);
    mn = parseFloat(sl.min) / 100;
    mx = parseFloat(sl.max) / 100;
    if (vll < mn)
        vll = mn;
    if (vll > mx)
        vll = mx;
    sl.value = vll * 100;
    inp.value = vll;
    waypoints[selWp].smoothing = vll;
    if (selWp > 0 && selWp < waypoints.length - 1)
        waypoints[selWp].bezierPath(true, 30, waypoints[selWp - 1], waypoints[selWp + 1]);

}

function azimithVal(vl) {

    sl = document.getElementById("yawSlider");
    inp = document.getElementById("yawInpit");
    vll = parseInt(vl);
    mn = parseInt(sl.min);
    mx = parseInt(sl.max);
    if (vll < mn)
        vll = mn;
    if (vll > mx)
        vll = mx;
    sl.value = vll;
    inp.value = vll;
    waypoints[selWp].azimuth = vll;
    waypoints[selWp].refreshMarkers();
}

function pitchVal(vl) {
    sl = document.getElementById("pitchSlider");
    inp = document.getElementById("pitchInpit");
    vll = parseInt(vl);
    mn = parseInt(sl.min);
    mx = parseInt(sl.max);
    if (vll < mn)
        vll = mn;
    if (vll > mx)
        vll = mx;
    sl.value = vll;
    inp.value = vll;
    waypoints[selWp].pitchAngle = vll;

}

function speedVal(src, vl) {
    sl = document.getElementById("spSlider");
    inp = document.getElementById("spInpit");
    if (src == 1)
        vll = parseFloat(vl) / 10;
    else
        vll = parseFloat(vl);
    mn = parseFloat(sl.min) / 10;
    mx = parseFloat(sl.max) / 10;
    if (vll < mn)
        vll = mn;
    if (vll > mx)
        vll = mx;
    sl.value = vll * 10;
    inp.value = vll;
    waypoints[selWp].speed = vll;
}

function altitudeVal(vl) {


    sl = document.getElementById("altSlider");
    inp = document.getElementById("altInpit");
    vll = parseInt(vl);
    mn = parseInt(sl.min);
    mx = parseInt(sl.max);
    if (vll < mn)
        vll = mn;
    if (vll > mx)
        vll = mx;
    sl.value = vll;
    inp.value = vll;

    waypoints[selWp].altitude = vll;
	updateSettings(selWp);
	waypoints[selWp].refreshMarkers();
	
}


function altitudeValP(vl) {


    sl = document.getElementById("altSliderP");
    inp = document.getElementById("altInpitP");
    vll = parseInt(vl);
    mn = parseInt(sl.min);
    mx = parseInt(sl.max);
    if (vll < mn)
        vll = mn;
    if (vll > mx)
        vll = mx;
    sl.value = vll;
    inp.value = vll;

    pois[selPoi].altitude = vll;
	pois[selPoi].refreshMarkers();
}

function radioChange(src) {

    if (radioWp.checked) {
        poi.style.display = "none";
        wp.style.display = "block";

    } else {
        poi.style.display = "block";
        wp.style.display = "none";
     }

}
//============================================================================================
//============================================================================================

function saveBtn() {
    document.getElementById("saveDropdown").classList.toggle("show");
}
imp;
function openBtn() {
    imp = document.getElementById("fileimport");
    imp.hidden = !imp.hidden;
}

window.onclick = function (event) {
    if (!event.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}

function saveFl(type) {

    var flNm = "wp.xml";
    var txType = "text/xml;charset=utf-8;";
    var blStr = "aaa";
    if (type == "xml") {
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

        for (let i = 0; i < waypoints.length; i++) {
            wpElem1.appendChild(waypoints[i].getXml(doc));
        }

        miElem.appendChild(wpElem1);
        var poiElem1 = doc.createElement("PointsOfInterest");
        for (let i = 0; i < pois.length; i++) {
            poiElem1.appendChild(pois[i].getXml(doc));
        }
        miElem.appendChild(poiElem1);

        doc.appendChild(miElem);

        const serializer = new XMLSerializer();
        const docStr = serializer.serializeToString(doc);

        blStr = xmlStr + docStr;
    } else if (type.includes("wp csv")) {
        flNm = "wp.csv";
        txType = "text/csv;charset=utf-8;";
        var tb = ",";
        var hd = "latitude" + tb + "longitude" + tb + "altitude(m)" + tb + "heading(deg)" + tb;
        hd += "curvesize(m)" + tb + "rotationdir" + tb + "gimbalmode" + tb + "gimbalpitchangle" + tb;
        for (i = 1; i <= 15; i++)
            hd += "actiontype" + i + tb + "actionparam" + i + tb;
        hd += "altitudemode" + tb + "speed(m/s)" + tb + "poi_latitude" + tb + "poi_longitude" + tb
        hd += "poi_altitude(m)" + tb + "poi_altitudemode" + tb + "photo_timeinterval" + tb + "photo_distinterval";

        blStr = hd;
        for (let i = 0; i < waypoints.length; i++) {
            let ps = null;
            for (let j = 0; j < waypoints.length; j++) {
                if (waypoints[i].headingId == waypoints[j].id)
                    ps = waypoints[j];
            }
            for (let j = 0; j < pois.length; j++) {
                if (waypoints[i].headingId == pois[j].id)
                    ps = pois[j];
            }
            blStr += "\r\n" + waypoints[i].getCsv(tb, ps);

        }
    } else if (type.includes("tl csv")) {
        flNm = "tl.csv";
        txType = "text/csv;charset=utf-8;";
        var tb = ",";
        var hd = "latitude" + tb + "longitude" + tb + "altitude(m)" + tb + "heading(deg)" + tb;
        hd += "curvesize(m)" + tb + "rotationdir" + tb + "gimbalmode" + tb + "gimbalpitchangle" + tb;
        for (i = 1; i <= 15; i++)
            hd += "actiontype" + i + tb + "actionparam" + i + tb;
        hd += "altitudemode" + tb + "speed(m/s)" + tb + "poi_latitude" + tb + "poi_longitude" + tb
        hd += "poi_altitude(m)" + tb + "poi_altitudemode" + tb + "photo_timeinterval" + tb + "photo_distinterval";

        blStr = hd;
        for (let i = 0; i < tmLn.length; i++) {
            let ps = null;
            for (let j = 0; j < tmLn.length; j++) {
                if (tmLn[i].headingId == tmLn[j].id)
                    ps = tmLn[j];
            }
            for (let j = 0; j < pois.length; j++) {
                if (tmLn[i].headingId == pois[j].id)
                    ps = pois[j];
            }
            blStr += "\r\n" + tmLn[i].getCsv(tb, ps);
        }

    }

    const link = document.createElement("a");
    const file = new Blob([blStr], {
        type: txType
    });
    link.href = URL.createObjectURL(file);
    link.download = flNm;
    link.click();
    URL.revokeObjectURL(link.href);

}

function openFl(type) {

    clearBtn();

    var fl = $("#fileimport").get(0).files[0];

    if (/\.xml$/i.test(fl.name)) {
        var reader = new FileReader();
        reader.readAsText(fl); //.readAsDataURL(fl);
        reader.onload = function () {
            var xmlDoc = new DOMParser().parseFromString(reader.result, "text/xml");

            w = xmlDoc.getElementsByTagName("Waypoint");
            for (let i = 0; i < w.length; i++) {
                wpt = new Waypoint(null, i);
                wpt.setFromXml(w[i]);
                //wpt.refreshMarkers();
                waypoints.push(wpt);
            }

            p = xmlDoc.getElementsByTagName("POI");
            for (let i = 0; i < p.length; i++) {
                po = new Poi(null, i);
                po.setFromXml(p[i]);
                po.refreshMarkers();
                pois.push(po);
            }


            for (let i = 0; i < waypoints.length; i++) {
                for (let j = 0; j < waypoints.length; j++) {
                    if (waypoints[i].headingId == waypoints[j].id) {
                        waypoints[i].azimuth = positionToAzimuth(waypoints[i].position, waypoints[j].position);
                        dis = distance(waypoints[i].position, waypoints[j].position);
                        waypoints[i].pitchAngle = Math.round(toDegrees(Math.atan2((waypoints[i].altitude - waypoints[j].altitude), dis)));
                        waypoints[i].refreshMarkers();
                    }
                }
                for (let j = 0; j < pois.length; j++) {
                    if (waypoints[i].headingId == pois[j].id) {
                        waypoints[i].markColor = pois[j].markColor;
                        waypoints[i].azimuth = positionToAzimuth(waypoints[i].position, pois[j].position);
                        dis = distance(waypoints[i].position, pois[j].position);
                        waypoints[i].pitchAngle = Math.round(toDegrees(Math.atan2((waypoints[i].altitude - pois[j].altitude), dis)));
                        waypoints[i].refreshMarkers();
                    }
                }
            }

            redrawPath();
            if (waypoints.length > 0) {
                display.value = waypoints.length;
                radioWp.checked = true;
                radioChange();
            }
        }
    } else if (/\.csv$/i.test(fl.name)) {
        var reader = new FileReader();
        reader.readAsText(fl);
        reader.onload = function () {
            alert(reader.result);
        }

        //redrawPath();
    }

    imp = document.getElementById("fileimport");
    imp.hidden = true;
    $("#panelM").hide("slow");
}

function path3d(val) {
    redraw3D();
}

function clearBtn() {

    for (let i = 0; i < waypoints.length; i++) {
        waypoints[i].deleteWp();
    }
    waypoints = [];

    for (let i = 0; i < pois.length; i++) {
        pois[i].deletePoi();
    }
    pois = [];

    redrawPath();
    display.value = "";
}

function map3d() {

    if (tiltRotBtns[0].style.visibility == 'visible') {

        for (i = 0; i < tiltRotBtns.length; i++) {
            tiltRotBtns[i].style.visibility = 'hidden';
        }
        for (i = 0; i < waypoints.length; i++) {
            waypoints[i].showMarkers();
        }
        for (i = 0; i < wpMid.length; i++) {
            wpMid[i].setMap(map);
        }
        map.setHeading(0);
        map.setTilt(0);
        for (i = 0; i < polyArr.length; i++) {
            polyArr[i].setMap(null);
        }
        polyArr = [];

    } else {

        for (i = 0; i < tiltRotBtns.length; i++) {
            tiltRotBtns[i].style.visibility = 'visible';
        }
        for (i = 0; i < waypoints.length; i++) {
            waypoints[i].hideMarkers();
        }
        for (i = 0; i < wpMid.length; i++) {
            wpMid[i].setMap(null);
        }
        map.setHeading(90);
        map.setTilt(60);

        timeLine();
        redraw3D();
    }
}

function toggleSettings() {

    if ($("#panelS").is(":visible")) {

        for (let i = 0; i < waypoints.length; i++) {
            ic = waypoints[i].marker.getIcon();
            ic.fillColor = waypoints[i].markColor;
            waypoints[i].marker.setIcon(ic);
        }
        for (let i = 0; i < pois.length; i++) {
            ic = pois[i].marker.getIcon();
            ic.fillColor = pois[i].markColor;
            pois[i].marker.setIcon(ic);
        }
    }

    if (display.value == "")
        $("#panelS").hide("slow");
    else
        $("#panelS").slideToggle("fast");
    //$(".panel").show("slow");
    //$(".panel").hide("slow");
}

function toggleMission() {

    //if(display.value == "") $("#panelM").hide("slow");
    //else
    $("#panelM").slideToggle("fast");

}
