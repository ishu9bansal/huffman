var text = "In computer science and information theory, a Huffman code is a particular type of optimal prefix code that is commonly used for lossless data compression. The process of finding or using such a code proceeds by means of Huffman coding, an algorithm developed by David A. Huffman while he was a Sc.D. student at MIT, and published in the 1952 paper \"A Method for the Construction of Minimum-Redundancy Codes\".\n\nThe output from Huffman's algorithm can be viewed as a variable-length code table for encoding a source symbol (such as a character in a file). The algorithm derives this table from the estimated probability or frequency of occurrence (weight) for each possible value of the source symbol. As in other entropy encoding methods, more common symbols are generally represented using fewer bits than less common symbols. Huffman's method can be efficiently implemented, finding a code in time linear to the number of input weights if these weights are sorted. However, although optimal among methods encoding symbols separately, Huffman coding is not always optimal among all compression methods - it is replaced with arithmetic coding or asymmetric numeral systems if better compression ratio is required.\n";
var frequency;
var data;
var table;
function getFrequency(text){
	f = {};
	t = Array.from(text);
	t.forEach(function(x){
		if(!f[x])	f[x] = 0;
		f[x]++;
	});
	return f;
}
function postProcessing(node, key = ""){
	if(!node.children){
		node.key = node.name;
		table[node.name] = key.slice(0,-1);
		return;
	}
	node.key = key;
	for(var i=0; i<node.children.length; i++){
		postProcessing(node.children[i],key+i.toString());
	}
}

function getHuffmanTree(f){
	var nodes = [];
	formationId = 1;
	for(var k in f){
		nodes.push({
			value: f[k],
			formationId: formationId,
			children: [
				{
					name: k
				}
			]
		});
	}
	nodes.sort((a,b) => a.value-b.value);
	var p = nodes.shift();
	var queue = [];
	while(nodes.length||queue.length){
		var q = (nodes.length&&queue.length?queue[0].value<nodes[0].value:queue.length)?queue.shift():nodes.shift();
		queue.push({
			value: p.value+q.value,
			formationId: ++formationId,
			children: [p,q]
		});
		p = (nodes.length&&queue.length?queue[0].value<nodes[0].value:queue.length)?queue.shift():nodes.shift();
	}
	postProcessing(p);
	return p;
}

function setUpData(t){
	table = {};
	if(!t)	t = ' ';
	text = t;
	frequency = getFrequency(text);
	data = getHuffmanTree(frequency);
}