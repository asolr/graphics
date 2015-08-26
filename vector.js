
/*

Vector() : HTML Standard Vector Graphics .svg

*/

function Vector(element) {
	/* create element */
	this.ns = 'http://www.w3.org/2000/svg';
	this.xlink = 'http://www.w3.org/1999/xlink';
	var name = "svg";
	this.svg = document.createElementNS(this.ns, name);
	element == undefined ? document.body.appendChild(this.svg) : element.appendChild(this.svg);
}

Vector.prototype.circle = function(center, radius, style) {
	var circle = document.createElementNS(this.ns, "circle");
	circle.setAttribute("cx", center[0]);
	circle.setAttribute("cy", center[1]);
	circle.setAttribute("r", radius);
	circle.setAttribute("style", "fill: purple; opacity: 0.3;");
	this.svg.appendChild(circle);
}

// http://www.dashingd3js.com/svg-paths-and-d3js
Vector.prototype.path = function(points, style) {
	if(style == undefined) {
		style = new Object;
		style.stroke = this.color();
		style.strokewidth = "2";
		style.fill = "none";
	}
	var path = document.createElementNS(this.ns, "path");
	var d = "M " + points[0][0] + " " + points[0][1] + " ";
	for (var index = 1; index < points.length; index++) {
		d += "L " + points[index][0] + " " + points[index][1] + " ";
	}
	path.setAttribute("d", d);
	for (var index in style) {
		path.setAttribute(index, style[index]);
	}
	this.svg.appendChild(path);
}
// polyline
// http://www.dashingd3js.com/svg-basic-shapes-and-d3js
