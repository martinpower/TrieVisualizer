class TrieNode
{
	constructor(count, coord, scene)
	{
		this.count = 0;
		this.children = new Array(26);
		this.child_lines = new Array(26);

		let cyl = new THREE.CylinderGeometry(.5, .5, 1, 50);
		cyl.applyMatrix(new THREE.Matrix4().makeTranslation(coord.getComponent(0), coord.getComponent(1), coord.getComponent(2)));
		
		this.cylinder = new THREE.Mesh(cyl, new THREE.MeshBasicMaterial({color: 0xFFFF00}));
		scene.add(this.cylinder);
	}

	function insertWord(root, word, scene, idx)
	{
		// at root of trie
		if(typeof idx == undefined)
			return insertWord(root, word, scene, 0);
		if(idx == word.length)
			return undefined;

		let ch = word.charCodeAt(idx) - "a".charCodeAt(0);
		let coord = computePosition(root, ch);

		if(root.children[ch] != undefined)
		{
			insertWord(root.children[ch], word, scene, idx + 1);
		}
		else
		{
			root.children[ch] = new TrieNode(0, coord, scene);
		}

		if(idx == word.length - 1)
		{
			root.children[ch].count++;
		}
	}
}
