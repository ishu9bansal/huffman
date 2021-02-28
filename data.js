var text = "In computer science and information theory, a Huffman code is a particular type of optimal prefix code that is commonly used for lossless data compression. The process of finding or using such a code proceeds by means of Huffman coding, an algorithm developed by David A. Huffman while he was a Sc.D. student at MIT, and published in the 1952 paper \"A Method for the Construction of Minimum-Redundancy Codes\".\n\nThe output from Huffman's algorithm can be viewed as a variable-length code table for encoding a source symbol (such as a character in a file). The algorithm derives this table from the estimated probability or frequency of occurrence (weight) for each possible value of the source symbol. As in other entropy encoding methods, more common symbols are generally represented using fewer bits than less common symbols. Huffman's method can be efficiently implemented, finding a code in time linear to the number of input weights if these weights are sorted. However, although optimal among methods encoding symbols separately, Huffman coding is not always optimal among all compression methods - it is replaced with arithmetic coding or asymmetric numeral systems if better compression ratio is required.\n";
var frequency;
var data;
function getFrequency(text){
	f = {};
	t = Array.from(text);
	t.forEach(function(x){
		if(!f[x])	f[x] = 0;
		f[x]++;
	});
	return f;
}
function getHuffmanTree(f){
	var nodes = [];
	for(var k in f){
		nodes.push({
			value: f[k],
			children: [
				{
					name: k
				}
			]
		});
	}
	nodes.sort((a,b) => b.value-a.value);
	var p = nodes.pop();
	while(nodes.length){
		var q = nodes.pop();
		p.index = '0';
		q.index = '1';
		node = {
			value: p.value+q.value,
			children: [p,q]
		};
		nodes.push(node);
		var l = nodes.length-1;
		while(l&&nodes[l].value>nodes[l-1].value){
			var temp = nodes[l];
			nodes[l] = nodes[l-1];
			nodes[l-1] = temp;
			l--;
		}
		p = nodes.pop();
	}
	return p;
}

function setUpData(){
	frequency = getFrequency(text);
	data = getHuffmanTree(frequency);
}