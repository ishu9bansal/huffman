var padding = 50;
var radius = 10;
var offset;
var root;

function init(){
	offset = 2*radius;
	width = window.innerWidth - 2*padding;
	height = window.innerHeight - 2*padding;

	w = width/2 - 2*padding;
	h = height - 2*padding

	svg = d3.select("svg").attr("width", width/2).attr("height", height);

	setUpData("jshbcksbiucbiwdvuyvadiyvciwboauw0dvbudyBV0P0YABWDOUHVBC0UYAWBD0UCYBAWEF");
	root = d3.hierarchy(data);
	var treeLayout = d3.cluster();
	treeLayout.size([h,w])
	treeLayout(root);

	svg
	.selectAll('line.link')
	.data(root.links())
	.enter()
	.append('line')
	.classed('link', true)
	.attr('y1', function(d) {return offset+d.source.x;})
	.attr('x1', function(d) {return offset+d.source.y;})
	.attr('y2', function(d) {return offset+d.target.x;})
	.attr('x2', function(d) {return offset+d.target.y;});

	svg
	.selectAll('circle.node')
	.data(root.descendants())
	.enter()
	.append('circle')
	.classed('node', true)
	.attr('cy', function(d) {return offset+d.x;})
	.attr('cx', function(d) {return offset+d.y;})
	.attr('r', radius);

}

init();