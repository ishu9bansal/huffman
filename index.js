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

	setUpData();
	root = d3.hierarchy(data);
	var treeLayout = d3.cluster();
	treeLayout.size([h,w])
	treeLayout(root);

	svg
	.selectAll('line.link')
	.data(root.links())
	.enter()
	.append('line')
	.classed('link', d => d.target.height)
	.attr('y1', function(d) {return offset+d.source.x;})
	.attr('x1', function(d) {return offset+d.source.y;})
	.attr('y2', function(d) {return offset+d.target.x;})
	.attr('x2', function(d) {return offset+d.target.y;});

	svg
	.selectAll('circle.node')
	.data(root.descendants())
	.enter()
	.append('circle')
	.classed('node', d => d.height)
	.attr('cy', function(d) {return offset+d.x;})
	.attr('cx', function(d) {return offset+d.y;})
	.attr('r', d => d.height?radius:0);

	svg.selectAll("text")
	.data(root.descendants())
	.enter().append("text")
	.classed("count", d => d.height)
	.classed("label", d => !d.height)
	.attr("y", d => offset+d.x)
	.attr("x", d => offset+d.y)
	.attr("dominant-baseline", "middle")
	.attr("text-anchor", "middle")
	.attr("fill", "black")
	.text(d => d.height?d.data.value:d.data.name);

}

init();