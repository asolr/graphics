/*

canvas.js : A simple library for drawing images in PNG on HTML

License: (FREE & OPEN SOURCE)

Ideas from: Astronomer's Paradise (Vimeo Video - https://vimeo.com/36972668):
The European South Observatory (ES0 - South America)
Images to look at for fun: http://www.eso.org/public/images/

Date: August 2015

Version: 0.1 pre

// Example of drawing two points and "scaled" relative to the canvas size
// if you want to use the actual pixel position don't scale the image
var draw = new Canvas();
points = [[100,100],[200,200]];
draw.scale(points);
draw.circle(points, 5);

*/

/*

Canvas() : Image code for drawing a .PNG in HTML

*/

// Example: var draw = new Canvas(document.getElementById("sketch"));
function Canvas(canvas) {
	if (canvas == undefined) {
		this.canvas = document.createElement("canvas");
		// https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
		this.context = this.canvas.getContext('2d');
		this.canvas.id = "";
		// default values for canvas if (canvas = undefined)
		var style = {"width" : "1000", "height" : "1000"};
		for(var index in style) {
			this.canvas[index] = style[index];
		}
		document.body.appendChild(this.canvas);
	}
	else { // predefined canvas
		this.canvas = canvas;
		this.context = this.canvas.getContext('2d');
	}
	this.canvas.addEventListener("click", this.click.bind(this), false);
}

// draw any image to the canvas
Canvas.prototype.drawImage = function(image)
{
	this.context.drawImage(image, 0,0);
}

Canvas.prototype.getImageData = function()
{
	this.canvas.data = this.context.getImageData(0,0,this.canvas.width,this.canvas.height);
	return this.canvas.data;
}

Canvas.prototype.createImageData = function(width, height)
{
	this.context.createImageData(width, height);
}

Canvas.prototype.putImageData = function(data)
{
	// var idata = this.context.getImageData(0,0,width,height);
	// idata.data = data;
	this.context.putImageData(data, 0, 0);
}

/*

Prototypes for Canvas.* functions

*/

// Example: draw.circle([1,1], 5) or draw.circle([[1,1], [4,4], 5)
Canvas.prototype.circle = function(center, radius, style) {
	var context = this.context;
	if(style == undefined) {
		style = new Object;
		context.strokeStyle = this.randcolor();
		context.fillStyle = this.randcolor();
		context.lineWidth = 4;
	} else {
		for(var index in style) {
			context[index] = style[index];
		}
	}
	center[0].length > 1 ? center = center : center = [center]; // is it one circle or an array of circles?
	for(var index = 0; index < center.length; index++) {
		context.beginPath();
		var c = [];
		this.scaling == true ? c = this.on(center[index]) : c = center[index];
		context.arc(c[0], c[1], radius, 0, 2 * Math.PI, false);
		context.stroke();
		context.fill();
		context.closePath();
	}
}

Canvas.prototype.square = function(center, side, style) {
	var context = this.context;
	if(style == undefined) {
		style = new Object;
		context.strokeStyle = this.randcolor();
		context.fillStyle = this.randcolor();
		context.lineWidth = 4;
	} else {
		for(var index in style) {
			context[index] = style[index];
		}
	}
	for (var index = 0; index < center.length; index++) {
		var half = Math.round(side/2);
		if(this.scaling == true) {
			center = this.on(center);
		}
		var upper = [center[0] - half, center[1] - half];
		var lower = [center[0] + half, center[1] + half];
		context.fillRect(upper[0],upper[1],lower[0],lower[1]);
	}
}

// Example: draw.line([[1,1],[5,12],[7,13]]);
Canvas.prototype.line = function(path, style) {
	var context = this.context;
	if(style == undefined) {
		style = new Object;
		context.strokeStyle = this.randcolor();
		context.lineCap = "round";
		context.lineWidth = 2;
	} else {
		for(var index in style) {
			context[index] = style[index];
		}
	}
	context.beginPath();
	for(var index = 0; index+1 < path.length; index++) {
		var from = path[index];
		var to = path[index+1];
		if(this.scaling == true) {
			from = this.on(from);
			to = this.on(to);
		}
		context.moveTo(from[0], from[1]);
		context.lineTo(to[0], to[1]);
		context.stroke();
	}
	//context.closePath();
}

// Example: draw.fan([x, y], [[x1, y1], [x2, y2]], style);
Canvas.prototype.fan = function(focus, fans, radius, style) {
	var context = this.context;
	if(style == undefined) {
		style = new Object;
		style.strokeStyle = this.randcolor();
		style.lineCap = "round";
		style.lineWidth = 2;
	} else {
		for(var index in style) {
			context[index] = style[index];
		}
	}
	for(var index = 0; index < fans.length; index++) {
		this.line([fans[index], focus], style);
	}
	for(var index = 0; index < focus.length; index++) {
		this.circle([focus], radius, style);
	}
}

// Example: draw.curve([[1,1],[5,10],[10,9]);  Todo: (has a bug in the final point)
Canvas.prototype.curve = function(paths, style) {
	var context = this.context;
	var path = paths;
	if(style == undefined) {
		style = new Object;
		style.strokeStyle = this.randcolor();
		style.lineCap = "round";
		style.lineWidth = 2;
	} else {
		for(var index in style) {
			context[index] = style[index];
		}
	}
	context.beginPath();
	var index = 0;
	for(index = 0; index +2 < path.length; index = index+ 2){
		var start = path[index];
		var control = path[index+1];
		var end = path[index+2];
		if(this.scaling == true) {
			start = this.on(start);
			control = this.on(control);
			end = this.on(end);
		} // else use the natural
		context.moveTo(start[0], start[1]);
		context.quadraticCurveTo(control[0], control[1], end[0], end[1]);
	}
	context.stroke();
}

// Example: draw.polygon([[1,1],[5,10],[10,9]]);
Canvas.prototype.polygon = function(path, style) {
	var context = this.context;
	if(style == undefined) {
		style = new Object;
		style.strokeStyle = this.randcolor();
		style.lineCap = "round";
		style.lineWidth = 4;
	} else {
		for(var index in style) {
			context[index] = style[index];
		}
	}
	this.line(path, style)
	context.closePath();
}

// Example: draw.fill([[2,1],[8,10],[4,20],[9,11]]);
// (fills a polygon)
Canvas.prototype.fill = function(path, style) {
	if(style.fillStyle == undefined) {
		context.fillStyle = this.randcolor();
	}
	this.polygon(path, style);
	context.fill();
}

Canvas.prototype.maxmin = function(data) {
	var mnm = [];
	for(var dimension = 0; dimension < data[0].length; dimension++){
		var vector = [];
		for(var index = 0; index < data.length; index++) {
			vector.push(data[index][dimension]);
		}
		mnm.push({max : Math.max.apply( Math, vector ), min : Math.min.apply( Math, vector )});
	}
	return mnm
}

// Scale the Axis
Canvas.prototype.scale = function(data){
	this.scaling = true;
	this.range = this.maxmin(data);
}

// Convert and Scale a Point
Canvas.prototype.on = function(point){
	var ally = [];
	var space = [this.canvas.width, this.canvas.height];
	for(var dimension = 0; dimension < point.length; dimension++){
		ally.push(Math.round(point[dimension]*this.range[dimension].min/this.range[dimension].max*space[dimension]));
	}
	return ally;
}

// Convert and Scale a Point
Canvas.prototype.of = function(point, obj){
	var ally = [];
	obj == undefined ? obj = this : obj = obj;
	var space = [this.canvas.width, this.canvas.height];
	for(var dimension = 0; dimension < point.length; dimension++){
		ally.push(Math.round(point[dimension]*obj.range[dimension].max/obj.range[dimension].min/space[dimension]));
	}
	return ally;
}

Canvas.prototype.near = function(point) {

}

// TODO: Mouse Click Detection
Canvas.prototype.click = function(e) {
	this.mouse = [e.clientX, e.clientY];
	var point = this.of(this.mouse);
	this.circle(point, 10);
}

// TODO: Element Click Detection
Canvas.prototype.selected = function (mouse) {
	for(var index in this.elements) {
		if(DistanceTo(this.elements[index], mouse) <= this.elements[index].radius){
			return(this.elements[index]);
		}
	}
	return false;
}

/*
var Color = {
neon : function neon() {return Math.round(Math.rand(0xFFFFFF))};
red : function red() {return Math.round(Math.rand(0xFFFFFF))}
}

Color - Wavelength
Black: #000000
Red: #FF0000 - 650 nm
Orange: #FF9900 - 590 nm (unknown)
Yellow: #FFFF00 - 570 nm to 589 nm
Green: #00FF00 - 510 nm
Blue: #0000FF - 475 nm
Purple: #FF00FF - 400 nm or 750 nm (unknown)
White: #FFFFFF

*/

Canvas.prototype.randcolor = function () {
	var red = Math.round(Math.random()*255);
	var green = Math.round(Math.random()*255);
	var blue = Math.round(Math.random()*255);
	var color = "rgba(" + red + ", " + green + ", " + blue + ", 1)";
	//var color = Math.round(Math.random()*(0xFFFFFF)).toString(16);
	return color;
}

Canvas.prototype.plot = function(data) {
	// Draw background graphic grid
	this.context.fillStyle = '#131';
	this.context.fillRect(0, Math.round(this.canvas.height/2), this.canvas.width, 1);
	this.context.fillStyle = 'hsl(127,83%,66%)'; // green #60f070
	for(var i = 0; i < data.length; i++)
	{
		this.context.fillRect(data[i][0], data[i][1], 1, 1);
	}
}
