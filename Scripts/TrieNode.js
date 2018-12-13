	/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	*  	TrieNode Class																*
	*  		count denotes how many times that word is represented in the Trie		*
	*		lvl denotes how many letters are contained in the word					*
	*			- used to allow Trie to expand as it grows more						*
	*		children is an array of TrieNodes										*
	*		child_lines is an array of Cylinder meshes that represent the lines   	*
	*			which connect the nodes together									*
	*		letters is an array of textures used to show what letter the node		* 
	*			represents															*
	*		coord is the coordinate of the center of the node						*
	*		cube is the Box mesh that represents the node							*
	* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
class TrieNode
{

	constructor(count, coord, scene, ch, lvl, letters)
	{
		this.count = 0;
		this.lvl = lvl;
		this.children = new Array(26);
		this.child_lines = new Array(26);
		this.letters = letters;

		this.coord = coord;

		this.createCube(ch, scene, this.letters);
	}

	// uses Trie insertion algorithm to construct visual of Trie
	insertWord(word, scene, idx, letters)
	{
		// at root of trie
		if(idx == undefined)
		{
			return this.insertWord(word, scene, 0);
		}

		if(idx == word.length)
			return undefined;

		// integer which maps the ascii value of a character to the range 0-25
		let ch = word.charCodeAt(idx) - "a".charCodeAt(0);

		if(this.children[ch] != undefined)
		{
			this.children[ch].insertWord(word, scene, ++idx);
			return this.children[ch];
		}
		else
		{
			let coord = this.computePosition(ch);
			this.children[ch] = new TrieNode(0, coord, scene, ch, this.lvl + 1, this.letters);
			this.child_lines[ch] = this.createLine(this.children[ch], scene);
		}

		// at end of word, so count must be set
		if(idx == word.length - 1)
		{
			this.children[ch].count = 1;
			return this.children[ch];
		}

		return this.children[ch].insertWord(word, scene, ++idx);
	}

	// uses Trie deletion algorithm to remove nodes and their lines from the Trie
	deleteWord(word, scene)
	{
		let continueDeleting = false;

		if(word == "")
		{
			this.count = 0;
			if(this.hasChildren())
				return false;
			return true;
		}
		
		let ch = word.charCodeAt(0) - "a".charCodeAt(0);
		if(this.children[ch] != undefined)
		{
			continueDeleting = this.children[ch].deleteWord(word.slice(1, word.length), scene);
		}
		else
			return false;

		// only executes if a node that represents a word hasn't been found or
		// 		no nodes which have children have been found
		if(continueDeleting)
		{
			scene.remove(this.children[ch].cube);
			scene.remove(this.child_lines[ch]);

			this.children[ch] = undefined;
			this.child_lines[ch] = undefined;

			if(this.count == 1)
				continueDeleting = false;
			if(this.hasChildren())
				continueDeleting = false;
		}
		
		return continueDeleting;
	}

	// function which determines if a given node has any children
	// used in deleteWord() function to determine if deletion should continue
	hasChildren()
	{
		for(let i = 0; i < 25; i++)
			if(this.children[i] != undefined)
				return true;
		return false;
	}

	// maps a character to a 3D position based on the location of the parent node
	// and what character the new node is meant to represent
	computePosition(ch)
	{
		let pos = new THREE.Vector3();
		pos.y = this.coord.getComponent(1) - 4;

		let map = ((Math.PI) / 25) * ch;
		pos.x = (this.coord.getComponent(0) + 1) + 4 * Math.sin(2 * map);
		pos.z = (this.coord.getComponent(2) + 1) + 4 * Math.cos(2 * map);

		return pos;
	}

	// creates Cube mesh based on the letter which the node is meant to represent
	createCube(ch, scene, letters)
	{
		let cyl = new THREE.BoxGeometry(1, 1, 1);
		cyl.applyMatrix(new THREE.Matrix4().makeTranslation(this.coord.getComponent(0), this.coord.getComponent(1), this.coord.getComponent(2)));

		let col = 100000 + (10000000 / 25) * ch;
		let tex = undefined;

		// 50 is a magic number which is used to denote the root node, which does not
		// have a letter texture
		if(ch != 50)
			tex = letters[ch];

		let mat = new THREE.MeshToonMaterial({specular: col, color: col, map:tex});
		this.cube = new THREE.Mesh(cyl, mat);
		
		scene.add(this.cube);
	}

	// creates Line mesh at proper location and angle to connect two nodes
	createLine(child, scene)
	{
		let parentCenter = this.coord.clone();
		parentCenter.setY(parentCenter.getComponent(1) - 0.5);

		let childCenter = child.coord.clone();
		childCenter.setY(childCenter.getComponent(1) + 0.5);

		let line = new THREE.LineCurve3(parentCenter, childCenter);

		let geom = new THREE.TubeGeometry(line, 1, .1);
		let mat = new THREE.MeshToonMaterial({color: 0xFFFFFF});

		line = new THREE.Mesh(geom, mat);
		scene.add(line);

		return line;
	}
}
