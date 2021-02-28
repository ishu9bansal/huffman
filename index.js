var padding = 100;
var radius = 10;
var labelSpace = 10;
var period = 2000;
var quick = 100;
var offset;
var root;
var svg;

function render(){
	svg.selectAll('line.link')
	.transition().duration(period)
	.attr('y1', d => offset+d.source.x)
	.attr('x1', d => offset+d.source.y)
	.attr('y2', d => offset+d.target.x)
	.attr('x2', d => offset+d.target.y)
	.style("opacity", d => d.target.height);

	svg.selectAll('circle.node')
	.transition().duration(period)
	.attr('cy', d => offset+d.x)
	.attr('cx', d => offset+d.y)
	.attr('r', d => d.height?radius:0);

	// svg.selectAll('text')
	// .transition().duration(quick)
	// .style("opacity", 1);

	svg.selectAll("text.count")
	.transition().duration(period)
	.attr("y", d => offset+d.x)
	.attr("x", d => offset+d.y)
	.text(d => d.data.value);

	svg.selectAll("text.label")
	.transition().duration(period)
	.attr("y", d => offset+d.x)
	.attr("x", d => offset+d.y)
	.text(d => d.data.name + "\u00A0\u00A0\u00A0" + d.data.key);

	svg.selectAll('text.link')
	.style("opacity", d => d.target.height)
	.transition().duration(period)
	.attr("y", d => offset+(d.target.x+d.source.x)/2)
	.attr("x", d => offset+(d.target.y+d.source.y)/2)
	.text(d => d.target.data.key.substr(-1));

}

function onTextChange(t){
	setUpData(t);
	root = d3.hierarchy(data);
	var treeLayout = d3.cluster();
	treeLayout.size([h,w])
	treeLayout(root);

	var line_link = svg
	.selectAll('line.link')
	.data(root.links(), d => d.target.data.key);

	line_link
	.enter()
	.filter(d => d.target.height)
	.append('line').classed('link', true)
	.attr('y1', d => offset+d.source.x)
	.attr('x1', d => offset+d.source.y)
	.attr('y2', d => offset+d.source.x)
	.attr('x2', d => offset+d.source.y);
	
	line_link
	.exit()
	// .filter(d => d.target.height)
	// .transition().duration(period)
	// .attr('y1', d => offset+d.target.x)
	// .attr('x1', d => offset+d.target.y)
	// .attr('y2', d => offset+d.target.x)
	// .attr('x2', d => offset+d.target.y)
	.remove();

	var circle_node = svg
	.selectAll('circle.node')
	.data(root.descendants(), d => d.data.key)

	circle_node
	.enter()
	// .filter(d => d.height)
	.append('circle')
	.classed('node', true)
	.attr('cy', d => offset+d.x)
	.attr('cx', d => offset+d.y)
	.attr('r', d => 0)

	circle_node
	.exit()
	// .filter(d => d.height)
	// .transition().duration(period)
	// .attr('r', d => 0)
	.remove();

	var text_count = svg.selectAll("text.count")
	.data(root.descendants(), d => d.data.key);

	text_count
	.enter()
	.filter(d => d.height)
	.append("text")
	.classed("count", d => d.height)
	.attr("y", d => offset+d.x)
	.attr("x", d => offset+d.y)
	.attr("dominant-baseline", "middle")
	.attr("text-anchor", "middle")
	.attr("fill", "black")
	// .style("opacity", 0)
	.text(d => d.data.value);

	text_count
	.exit()
	.remove();

	text_label = svg.selectAll("text.label")
	.data(root.leaves(), d => d.data.key);
	
	text_label
	.enter()
	.append("text")
	.classed("label", true)
	.attr("y", d => offset+d.x)
	.attr("x", d => offset+d.y)
	.attr("dominant-baseline", "middle")
	// .attr("text-anchor", "middle")
	.attr("fill", "black")
	// .style("opacity", 0)
	.text(d => d.data.name + "\u00A0\u00A0\u00A0" + d.data.key);

	text_label
	.exit()
	.remove();

	text_link = svg.selectAll('text.link')
	.data(root.links(), d => d.target.data.key);

	text_link
	.enter()
	.filter(d => d.target.height)
	.append('text')
	.classed('link', true)
	.attr("y", d => offset+(d.target.x+d.source.x)/2)
	.attr("x", d => offset+(d.target.y+d.source.y)/2)
	.attr("text-anchor", "middle")
	.attr("fill", "black")
	// .style("opacity", 0)
	.text(d => d.target.data.key.substr(-1));

	text_link
	.exit()
	.remove();

	render();
}

function init(){
	offset = 2*radius;
	width = window.innerWidth - 20;
	height = window.innerHeight - 20;

	w = width/2 - 2*offset - 2*padding;
	h = height - 2*offset;

	svg = d3.select("svg").attr("width", width/2).attr("height", height);
	onTextChange(text);
}

init();