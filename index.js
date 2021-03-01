const padding = 100;
const radius = 10;
const labelSpace = 10;
const delay = 500;
const period = 1000;
const quick = 200;
var motionOn;
var offset;
var root;
var svg;
var stop;
var transformationStep;

function render(){
	svg.selectAll('line.link')
	.transition().duration(period)
	.on("start", () => motionOn = true)
	.on("end", () => motionOn = false)
	.attr('y1', d => offset+d.source.x)
	.attr('x1', d => offset+d.source.y)
	.attr('y2', d => offset+d.target.x)
	.attr('x2', d => offset+d.target.y)
	.style('stroke', 'lightgrey')
	.style("opacity", d => d.target.height);

	svg.selectAll('circle.node')
	.transition().duration(period)
	.on("start", () => motionOn = true)
	.on("end", () => motionOn = false)
	.attr('cy', d => offset+d.x)
	.attr('cx', d => offset+d.y)
	.attr('r', d => radius)
	.style("opacity", d => d.height);

	// svg.selectAll('text')
	// .transition().duration(quick)
	// .style("opacity", 1);

	svg.selectAll("text.count")
	.transition().duration(period)
	.on("start", () => motionOn = true)
	.on("end", () => motionOn = false)
	.attr("y", d => offset+d.x)
	.attr("x", d => offset+d.y)
	.text(d => d.data.value);

	svg.selectAll("text.label")
	.transition().duration(period)
	.on("start", () => motionOn = true)
	.on("end", () => motionOn = false)
	.attr("y", d => offset+d.x)
	.attr("x", d => offset+d.y)
	.text(d => d.data.name + "\u00A0\u00A0\u00A0" + table[d.data.key]);

	svg.selectAll('text.link')
	.style("opacity", d => d.target.height)
	.transition().duration(period)
	.on("start", () => motionOn = true)
	.on("end", () => motionOn = false)
	.attr("y", d => offset+(d.target.x+d.source.x)/2)
	.attr("x", d => offset+(d.target.y+d.source.y)/2)
	.text(d => d.target.data.key.substr(-1));

}

function highlight(){
	svg.selectAll('line.link')
	.transition().duration(quick)
	.style('stroke', d => d.target.highlight?'aqua':'lightgrey');
	svg.selectAll('circle.node')
	.transition().duration(quick)
	.style('fill', d => d.highlight?'aqua':'lightcyan')
	.attr('r', d => radius*(d.highlight?1.5:1));
	svg.selectAll('text.link')
	.transition().duration(quick)
	.style('font-weight', d => d.highlight?'bold':'regular');

}

function mouseOver(d){
	if(motionOn)	return;
	ancestors = d.ancestors().forEach(x => x.highlight = true);
	highlight();
	d3.selectAll('span.c'+d.data.key.charCodeAt().toString()).style("background-color", 'aqua');
}

function mouseOut(d){
	if(motionOn)	return;
	ancestors = d.ancestors().forEach(x => x.highlight = false);
	highlight();
	d3.selectAll('span.c'+d.data.key.charCodeAt().toString()).style("background-color", null);
}

function outputText(){
	out_text = d3.select("#output_text");
	out_text.html("");
	for(var i=0; i<text.length; i++){
		out_text.append('span')
		.classed("c"+text[i].charCodeAt().toString(),true)
		.text(table[text[i]]);
	}
}

function onTextChange(t){
	motionOn = false;
	transformationStep = 0;
	if(stop)	handlePlay();
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
	.style('fill', 'lightcyan');

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
	.attr("fill", "black");

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
	.on('mouseover', mouseOver)
	.on('mouseout', mouseOut);

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
	.attr("fill", "black");

	text_link
	.exit()
	.remove();

	render();
	outputText();
}

function init(){
	offset = 2*radius;
	width = window.innerWidth - 20;
	height = window.innerHeight - 20;

	w = width/2 - 2*offset - 2*padding;
	h = height - 2*offset;

	document.getElementById('input_text').value = text;
	svg = d3.select("svg").attr("width", width/2).attr("height", height);
	d3.select("div.text_div").style("width", width/2).style("height", height)
	.style("top",0).style("left", width/2);
	d3.select("#input_text").style("width", width/2).style("height", height/2);
	d3.select("#output_text").style("width", width/2).style("height", height/2);
	onTextChange(text);

	svg.append('rect').classed('play', true)
	.attr('width', 2*offset).attr('height', 2*offset)
	.attr('x', offset).attr('y', offset)
	.style('fill', 'aqua')
	.on('click', handlePlay);

	svg.append('rect').classed('next', true)
	.attr('width', 2*offset).attr('height', 2*offset)
	.attr('x', 3.1*offset).attr('y', offset)
	.style('fill', 'lightcyan')
	.on('click', function(){
		if(stop)	handlePlay();
		handleNext();
	});

}

function handlePlay(){
	if(stop){
		clearInterval(stop);
		stop = 0;
	}
	else{
		handleNext();
		stop = setInterval(handleNext, delay);
	}
}

function handleNext(){
	formationStep(transformationStep++);
}

function handleInput(){
	text = document.getElementById('input_text').value;
	onTextChange(text);
}

function formationStep(n){
	if(!n){
		showTreeFormation();
		return;
	}
	if(n>root.data.formationId){
		render();
		if(stop)	handlePlay();
		motionOn = false;
		transformationStep = 0;
		return;
	}
	svg.selectAll('line.link')
	.filter(d => d.source.data.formationId == n)
	.transition().duration(quick)
	.attr('y1', d => offset+d.source.x)
	.attr('x1', d => offset+d.source.y)
	.attr('y2', d => offset+d.target.x)
	.attr('x2', d => offset+d.target.y);

	svg.selectAll('circle.node')
	.filter(d => d.data.formationId == n)
	.transition().duration(quick)
	.attr('r', 2*radius)
	.transition().duration(quick)
	.style('fill', 'aqua')
	.attr('r', radius);

	svg.selectAll('circle.node')
	.filter(d => d.parent&&d.parent.data.formationId == n)
	.transition().duration(quick)
	.style('fill', 'lightcyan');

	svg.selectAll("text.count")
	.filter(d => d.data.formationId == n)
	.transition().duration(quick)
	.style("opacity", 1);
}

function showTreeFormation(){
	svg.selectAll('line.link')
	.attr('y1', d => offset+d.target.x)
	.attr('x1', d => offset+d.target.y)
	.attr('y2', d => offset+d.target.x)
	.attr('x2', d => offset+d.target.y);

	svg.selectAll('circle.node')
	.attr('r', 0);

	svg.selectAll("text.count")
	.style("opacity", 0);

	svg.selectAll("text.label")
	.text(d => d.data.name);

	svg.selectAll('text.link')
	.style("opacity", 0);

	motionOn = true;
}

function nextStep(){
	if(transformationStep<root.data.formationId){
		formationStep(++transformationStep);
		return;
	}
	render();
	motionOn = false;
}

init();