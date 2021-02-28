var text;
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

function setUpData(t){
	text = t;
	frequency = getFrequency(text);
	data = getHuffmanTree(frequency);
}