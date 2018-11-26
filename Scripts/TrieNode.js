class TrieNode
{
	constructor(count, coord, scene)
	{
		this.count = 0;
		this.children = new Array(26);
		this.child_lines = new Array(26);

		let cyl = new THREE.CylinderGeometry(.5, .5, 1, 50);
		cyl.applyMatrix(new THREE.Matrix4().makeTranslation(coord.getComponent(0), coord.getComponent(1), coord.getComponent(2)));
		this.coord = coord;

		this.cylinder = new THREE.Mesh(cyl, new THREE.MeshBasicMaterial({color: 0xFFFF00}));
		scene.add(this.cylinder);
	}

	insertWord(root, word, scene, idx)
	{
		// at root of trie
		if(idx == undefined)
			return root.insertWord(root, word, scene, 0);
		console.log(idx);
		console.log(word.charAt(idx));

		let ch = word.charCodeAt(idx) - "a".charCodeAt(0);
		let coord = root.computePosition(root, ch);

		if(root.children[ch] != undefined)
		{
			root.insertWord(root.children[ch], word, scene, ++idx);
		}
		else
		{
			root.children[ch] = new TrieNode(0, coord, scene);
		}

		if(idx == word.length)
			return undefined;
		if(idx == word.length - 1)
		{
			root.children[ch].count++;
			return root.children[ch];
		}

		return root.insertWord(root.children[ch], word, scene, ++idx);
	}

	computePosition(root, ch)
	{
		let pos = new THREE.Vector3();
		pos.y = -4;
		
		pos.x = Math.cos(((2 * Math.PI) / 25) * root.coord.getComponent(0));
		console.log("x: " + pos.x);
		pos.z = Math.sin(((2 * Math.PI) / 25) * root.coord.getComponent(2));
		console.log("z: " + pos.z);

		return pos;
	}
}
