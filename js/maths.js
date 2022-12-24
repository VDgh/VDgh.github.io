 let EARTH_RADIUS = 6378137;



	function bezierCurve3Wp( steps,  p1,  p2,  p3) {
        lat = bezierCurve3(steps, p1.lat(), p2.lat(), p3.lat());
        lng = bezierCurve3(steps, p1.lng(), p2.lng(), p3.lng());
 		retVl = [steps];
 	   for (let i = 0; i < steps; i++) {
            retVl[i] = new google.maps.LatLng(lat[i], lng[i]);
      }
  	   return retVl;
    }
	
	
	
	
    function bezierCurve3( steps,  p1,  p2,  p3) {
		retVl= [steps];
		for (let i = 0; i < steps; i++) {
             t =  i / ( steps - 1.0);
             q = 1.0 - t;
            retVl[i] = q * q * p1 + 2 * q * t * p2 + t * t * p3;
  		}
 	   return retVl;
    }

	function bezierCurve2( steps,  p1,  p2) {
		retVl= [steps];
		for (let i = 0; i < steps; i++) {
             t =  i / ( steps - 1.0);
             q = 1.0 - t;
            retVl[i] =  q * p1 + t * p2;
  		}
 	   return retVl;
    }




function distance(vx1,  vx2) {


   

    var rlat1 = vx1.lat() * (Math.PI/180); // Convert degrees to radians
    var rlat2 = vx2.lat() * (Math.PI/180); // Convert degrees to radians
    var difflat = rlat2-rlat1; // Radian difference (latitudes)
    var rlng1 = vx1.lng() * (Math.PI/180); // Convert degrees to radians
    var rlng2 = vx2.lng() * (Math.PI/180); // Convert degrees to radians
    var difflng = rlng2-rlng1; // Radian difference (latitudes)
    var d = 2 *EARTH_RADIUS * Math.asin(Math.sqrt(Math.sin(difflat/2)*Math.sin(difflat/2)+Math.cos(rlat1)*Math.cos(rlat2)*Math.sin(difflng/2)*Math.sin(difflng/2)));
 
  return d;

}


   function positionToAzimuth( from,  to) {
         fromLat = toRadians(from.lat());
         fromLng = toRadians(from.lng());
         toLat = toRadians(to.lat());
         toLng = toRadians(to.lng());
         dLng = toLng - fromLng;
		heading = Math.atan2(
                Math.sin(dLng) * Math.cos(toLat),
                Math.cos(fromLat) * Math.sin(toLat) - Math.sin(fromLat) * Math.cos(toLat) * Math.cos(dLng));
 	   return wrap(toDegrees(heading), -180, 180);
    }

    function wrap( n,  min,  max) {
        return (n >= min && n < max) ? n : (mod(n - min, max - min) + min);
    }

	function mod( x,  m) {
        return ((x % m) + m) % m;
    }
//=========================================================================================================================

function timeline( stepSec, path, speed) {

        if (path.length != speed.length || path.length == 0) {
            return [];
        }
        var timeLine = [];
        var timeAcum = 1;
        var timeStep = stepSec;  //sec
        var totTime=0;  //sec

        for (let i = 0; i < path.length - 1; i++) {

            sp = (speed[i] + speed[i + 1]) / 2.0;
  			dis = distance(path[i], path[i + 1]);
			if (sp > 0 && dis>0) {                   
					per = dis / sp;
                                   
				totTime+=per;
				tSteps = per / timeStep;
                if (timeAcum + tSteps < 1) {
					timeAcum += tSteps;
                } else {
                    rc = (1 - timeAcum);
                    timeLine.push((i + rc / tSteps));//    <<<<<<<<<<<<<<<
                    per -= rc * timeStep;
 					steps = per / timeStep;
                    intPart = Math.floor(steps);
  					fracPart = per - intPart * timeStep;
                    for (let j = 1; j <= intPart; j++) {
                        timeLine.push((i + (rc + j) / tSteps)); //    <<<<<<<<<<<<<<<
                    }
                    timeAcum = fracPart / timeStep;
                }
            }
		}
       
	   return timeLine;
    }


//=========================================================================================================================



function matrix_1(){
   // Build 3d matrix                                                                                                        
	var mx = [3];
	mx[0]=[1,0,0];
	mx[1]=[0,1,0];
	mx[2]=[0,0,1];
 return mx;
}


function Matrix(w, h){
    let mx = Array(w);
    for(let i of mx.keys())
        mx[i] = Array(h);
    return mx;
}

	
function multiply_matrices(mx1,mx2){

	ro_m1 = mx1.length;  
	cl_m1 = mx1[0].length;    
	ro_m2 = mx2.length;  
	cl_m2 = mx2[0].length;
	if (cl_m1 != ro_m2) throw "Matrices cannot be multiplied";

	let mlp = new Array(ro_m1);  
	for (x=0; x<mlp.length;x++)      
		mlp[x] = new Array(cl_m2).fill(0);

	for (x=0; x < mlp.length; x++) {      
		for (y=0; y < mlp[x].length; y++) {   
			for (z=0; z<cl_m1; z++) {              
               mlp[x][y] += mx1[x][z]*mx2[z][y]; 
			}      
		}  
	}
	return mlp;
}	


function rotate_X(theta,mat){
    // Build a rotation matrix                                                                                                        
   var mx = [3];
	mx[0]=[1,0,0];
	mx[1]=[0,Math.cos(theta),-Math.sin(theta)];
    mx[2]=[0,Math.sin(theta),Math.cos(theta)];
    // Rotate                                                                                                                         
	return multiply_matrices(mx,mat);
}

function rotate_Y(theta,mat){
    // Build a rotation matrix                                                                                                        
    var mx = [3];
	mx[0]=[Math.cos(theta),0,Math.sin(theta)];
    mx[1]=[0,1,0];
    mx[2]=[-Math.sin(theta),0,Math.cos(theta)];
    // Rotate                                                                                                                         
	return multiply_matrices(mx,mat);
}

function rotate_Z(theta,mat){
    // Build a rotation matrix                                                                                                        
 	var mx = [3];
	mx[0]=[Math.cos(theta),-Math.sin(theta),0];
    mx[1]=[Math.sin(theta),Math.cos(theta),0];
	mx[2]=[0,0,1];
     // Rotate                                                                                                                         
	return multiply_matrices(mx,mat);
  }



//---------------------------------------------------------------------------------------------------------------------------


//=========================================================================================================================
const TILE_SIZE = 256;

function pixelCoordinate(latLng, zoom) {
  const scale = Math.pow(2,zoom); // 1 << zoom;
  const worldCoordinate = project(latLng);
  const pixelCoordinate = new google.maps.Point(
    Math.floor(worldCoordinate.x * scale),
    Math.floor(worldCoordinate.y * scale)
  );
 return pixelCoordinate;
 }

// The mapping between latitude, longitude and pixels is defined by the web
// mercator projection.
function project(latLng) {
  let siny = Math.sin((latLng.lat() * Math.PI) / 180);

  // Truncating to 0.9999 effectively limits latitude to 89.189. This is
  // about a third of a tile past the edge of the world tile.
  siny = Math.min(Math.max(siny, -0.999999), 0.999999);
  return new google.maps.Point(
    TILE_SIZE * (0.5 + latLng.lng() / 360),
    TILE_SIZE * (0.5 - Math.log((1 + siny) / (1 - siny)) / (4 * Math.PI))
  );
}

function angleRatio(angFix,angRel,rt){
	df=angFix-angRel;
	if(Math.abs(df)>Math.abs(df+360)){angRel-=360;}
	else if(Math.abs(df)>Math.abs(df-360)){angRel+=360;}
    return angRel*rt+(1-rt)*angFix ;
}



	function toRadians( deg) {
		return Math.PI * deg / 180.0;
    }


    function toDegrees( rad) {
        return rad / Math.PI * 180.0;
    }
	
	//====================================================================================
function GeoPoint(x, y, z)    // double x, y, z
{
   this.x = x;
   this.y = y;
   this.z = z;   
}

// public Instance method to simulate overloading binary operator add (GeoPoint + GeoPoint)
GeoPoint.prototype.add = function(a) // GeoPoint a
{
	r = new GeoPoint(0,0,0);
	r.x=this.x+a.x;
	r.y=this.y+a.y;
	r.z=this.z+a.z;
	return r;
};

GeoPoint.prototype.rotate = function(mtx) // GeoPoint p
{
	r = new GeoPoint(0,0,0);
	r.x=this.x*mtx[0][0]+this.y*mtx[0][1]+this.z*mtx[0][2];
	r.y=this.x*mtx[1][0]+this.y*mtx[1][1]+this.z*mtx[1][2];
	r.z=this.x*mtx[2][0]+this.y*mtx[2][1]+this.z*mtx[2][2];
	return r;
};


/*
function GeoVector(p0, p1) // GeoPoint p0, p1
{
   // vector begin point
	this.p0 = p0;
	this.p1 = p1;

	qSum=(p1.x - p0.x)*(p1.x - p0.x);
	qSum+=(p1.y - p0.y)*(p1.y - p0.y);
	qSum+=(p1.z - p0.z)*(p1.z - p0.z);
    
	if(qSum>0){
		qSum=Math.sqrt(qSum);
		this.x = (p1.x - p0.x)/qSum;
		this.y = (p1.y - p0.y)/qSum;
		this.z = (p1.z - p0.z)/qSum;
	}
}

GeoVector.prototype.multiply = function(v) // GeoVector v
{
   var x = this.y * v.z - this.z * v.y;
   
   var y = this.z * v.x - this.x * v.z;
   
   var z = this.x * v.y - this.y * v.x;
 
   var p0 = v.p0; // GeoPoint
   
   var p1 = p0.Add(new GeoPoint(x, y, z)); // GeoPoint

   return new GeoVector(p0, p1);
};

GeoVector.prototype.rotate = function(mtx) // GeoPoint p
{
	r = new GeoVector(this.p0, this.p1);
	r.x=this.x*mtx[0][0]+this.y*mtx[0][1]+this.z*mtx[0][2];
	r.y=this.x*mtx[1][0]+this.y*mtx[1][1]+this.z*mtx[1][2];
	r.z=this.x*mtx[2][0]+this.y*mtx[2][1]+this.z*mtx[2][2];
	r.p0=this.p0.rotate(mtx);
	r.p1=this.p1.rotate(mtx);
	return r;
};

GeoVector.prototype.toMatix = function()
{
	mx=Matrix(1, 3);
	mx[0][0]=this.x;
	mx[0][1]=this.y;
	mx[0][2]=this.z;
   return new mx;
};
GeoVector.prototype.fromMatix = function(mx)
{
	this.x=mx[0][0];
	this.y=mx[0][1];
	this.z=mx[0][2];
};

	function GeoPlane(a, b, c, d) // double a, b, c, d
{
   this.a = a;
   
   this.b = b;
   
   this.c = c;
   
   this.d = d;   
};

// public Static method to simulate the second constructor
GeoPlane.Create = function(p0, p1, p2) // GeoPoint p0, p1, p2
{
   var v = new GeoVector(p0, p1);

   var u = new GeoVector(p0, p2);

   // normal vector.
   var n = u.Multiple(v); // GeoVector

   var a = n.x; // double

   var b = n.y; // double

   var c = n.z; // double

   var d = - (a * p0.x + b * p0.y + c * p0.z); // double
   
   return new GeoPlane(a, b, c, d);
}


// public Instance method to simulate overloading binary operator multiple 
// (GeoPlane * GeoPoint)
GeoPlane.prototype.Multiple = function(p) // GeoPoint p
{
   return (this.a * p.x + this.b * p.y + this.c * p.z + this.d); // double   
};
	*/
	
	
	
	