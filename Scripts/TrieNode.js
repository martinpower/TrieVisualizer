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
		if(typeof idx == undefined)
			return insertWord(root, word, scene, 0);
		console.log(word);
		console.log(word.charAt(idx));
		if(idx == word.length)
			return undefined;

		let ch = word.charCodeAt(idx) - "a".charCodeAt(0);
		let coord = root.computePosition(root, ch);

		if(root.children[ch] != undefined)
		{
			root.insertWord(root.children[ch], word, scene, idx + 1);
		}
		else
		{
			root.children[ch] = new TrieNode(0, coord, scene);
		}

		if(idx == word.length - 1)
		{
			root.children[ch].count++;
			return root.children[ch];
		}

		//root.insertWord(root.children[ch], word, scene, idx + 1);
	}

	computePosition(root, ch)
	{
		let pos = new THREE.Vector3();
		pos.y = -4;
		
		pos.x = Math.cos((1 / 25) * root.coord.getComponent(0));
		pos.z = Math.sin((1 / 25) * root.coord.getComponent(2));

		return pos;
	}
}
