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

		this.createCylinder(ch, scene, this.letters);
	}

	insertWord(word, scene, idx, letters)
	{
		// at root of trie
		if(idx == undefined)
		{
			return this.insertWord(word, scene, 0);
		}

		let ch = word.charCodeAt(idx) - "a".charCodeAt(0);

		if(idx == word.length)
			return undefined;

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

		if(idx == word.length - 1)
		{
			this.children[ch].count = 1;
			return this.children[ch];
		}

		return this.children[ch].insertWord(word, scene, ++idx);
	}

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

		if(continueDeleting)
		{
			scene.remove(this.children[ch].cylinder);
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

	hasChildren()
	{
		for(let i = 0; i < 25; i++)
			if(this.children[i] != undefined)
				return true;
		return false;
	}

	computePosition(ch)
	{
		let pos = new THREE.Vector3();
		pos.y = this.coord.getComponent(1) - 4;

		let map = ((Math.PI) / 25) * ch;
		pos.x = (this.coord.getComponent(0) + 1) + 4 * Math.sin(2 * map);
		pos.z = (this.coord.getComponent(2) + 1) + 4 * Math.cos(2 * map);

		return pos;
	}

	createCylinder(ch, scene, letters)
	{
		//let cyl = new THREE.CylinderGeometry(.5, .5, 1, 50);
		let cyl = new THREE.BoxGeometry(1, 1, 1);
		cyl.applyMatrix(new THREE.Matrix4().makeTranslation(this.coord.getComponent(0), this.coord.getComponent(1), this.coord.getComponent(2)));

		console.log(ch);
		let col = 100000 + (10000000 / 25) * ch;
		let tex = undefined;
		if(ch != 50)
			tex = letters[ch];
		let mat = new THREE.MeshToonMaterial({specular: col, color: col, map:tex});
		this.cylinder = new THREE.Mesh(cyl, mat);
		
		scene.add(this.cylinder);
	}

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
