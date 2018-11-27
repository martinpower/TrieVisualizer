class TrieNode
{
	constructor(count, coord, scene, ch, lvl)
	{
		this.count = 0;
		this.lvl = lvl;
		this.children = new Array(26);
		this.child_lines = new Array(26);

		this.coord = coord;

		this.createCylinder(ch, scene);
	}

	insertWord(word, scene, idx)
	{
		// at root of trie
		if(idx == undefined)
		{
			return this.insertWord(word, scene, 0);
		}

		let ch = word.charCodeAt(idx) - "a".charCodeAt(0);

		if(this.children[ch] != undefined)
		{
			this.children[ch].insertWord(word, scene, ++idx);
			return this.children[ch];
		}
		else
		{
			let coord = this.computePosition(ch);
			this.children[ch] = new TrieNode(0, coord, scene, ch, this.lvl + 1);
			this.child_lines[ch] = this.createLine(this.children[ch], scene);
		}

		if(idx == word.length)
			return undefined;
		if(idx == word.length - 1)
		{
			this.children[ch].count++;
			return this.children[ch];
		}

		return this.children[ch].insertWord(word, scene, ++idx);
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

	createCylinder(ch, scene)
	{
		let cyl = new THREE.CylinderGeometry(.5, .5, 1, 50);
		cyl.applyMatrix(new THREE.Matrix4().makeTranslation(this.coord.getComponent(0), this.coord.getComponent(1), this.coord.getComponent(2)));

		let col = 10000 + (10000000 / 25) * ch;
		this.cylinder = new THREE.Mesh(cyl, new THREE.MeshBasicMaterial({color: col}))
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

		line = new THREE.Mesh(geom, new THREE.MeshBasicMaterial({color: 0xFFFFFF}));
		scene.add(line);

		return line;
	}
}
