import Enemy from "./enemy.js";
import Game from "./game.js";
var log = console.log

export default class Level {
	/** @type {pc.AppBase}*/    app;
	/** @type {Game}*/          g;
	/** @type {Player}*/        player;
	/** @type {pc.Entity}*/     levelEntity;
	/** @type {[pc.Entity]}*/   blockList;
	/** @type {[pc.BoundingBox]}*/ aabbList = [];
	/** @type {[pc.Entity]}*/   coinList = [];
	/** @type {[pc.Entity]}*/   trapList = [];

	/** @type {[pc.StandardMaterial]}*/   blockMat;
	/** @type {[pc.StandardMaterial]}*/   blockMatA;
	/** @type {[pc.StandardMaterial]}*/   playerMat;
	/** @type {[pc.StandardMaterial]}*/   coinMat;
	/** @type {[pc.StandardMaterial]}*/   enemyMat;
	/** @type {[pc.StandardMaterial]}*/   enemyMat2;
	/** @type {[pc.StandardMaterial]}*/   trapMat;
	/** @type {[pc.StandardMaterial]}*/   blackMat;

	/** @type {pc.Vec3}*/                 point = new pc.Vec3();
	/** @type {pc.Texture}*/              blockTexture;
	/** @type {pc.Texture}*/              vrTexture;
	/** @type {pc.Texture}*/              resetBtnTexture;
	/** @type {pc.Texture}*/              titleTexture;
	/** @type {pc.BatchGroup} */ 				batchGroupBlocks
	/** @type {pc.BatchGroup} */ 				batchGroupCoins
	/** @type {pc.BatchGroup} */ 				batchGroupTraps


	shortName = {
		"Block": "b",
		"Enemy1": "e1",
		"Enemy2": "e2",
		"Enemy3": "e3",
		"Player": "p",
		"Coin": "c",
		"Trap": "t",

		"b": "Block",
		"e1": "Enemy1",
		"e2": "Enemy2",
		"e3": "Enemy3",
		"p": "Player",
		"c": "Coin",
		"t": "Trap",

	}

	levelsAsset = {
		"Level1": "p,-6.5,8,-7.5:e1,7.5,8,0.5:e1,-5.5,8,7.5:e1,-7.5,8,-4.5:e3,-7.5,4,-1.5:c,-6.5,1,-7.5:c,0.5,5,-7.5:c,-3.5,5,-7.5:c,3.5,1,-7.5:c,2.5,8,-7.5:c,0.5,8,-7.5:c,7.5,8,-6.5:c,7.5,8,-3.5:c,7.5,8,2.5:c,7.5,6,-2.5:c,4.5,8,7.5:c,0.5,5,7.5:c,-6.5,8,7.5:c,-1.5,1,7.5:c,-6.5,1,7.5:c,0.5,3,7.5:c,6.5,1,7.5:c,-7.5,1,4.5:c,-7.5,5,4.5:c,-7.5,6,-1.5:c,-7.5,7,5:c,-7.5,5,-6.5:c,-7.5,1,-6.5:c,-7.5,6,-3.5:c,-7.5,2,-1.5:c,7.5,8,6.5:c,7.5,1,6.5:c,7.5,1,-0.5:c,7.5,3,2.5:c,6.5,8,-7.5:c,-0.5,1,-7.5:b,-7.5,0,-7.5:b,-7.5,1,-7.5:b,7.5,1,-8.5:b,7.5,2,-8.5:b,7.5,3,-8.5:b,7.5,0,-8.5:b,8.5,1,-7.5:b,8.5,2,-7.5:b,8.5,0,-7.5:b,-7.5,2,-7.5:b,-7.5,3,-7.5:b,7.5,3,-7.5:b,-7.5,4,-7.5:b,-7.5,7,-7.5:b,7.5,4,-7.5:b,7.5,7,-7.5:b,-7.5,5,-7.5:b,-7.5,8,-7.5:b,7.5,5,-7.5:b,7.5,8,-7.5:b,7.5,0,-7.5:b,0.5,0,-7.5:b,7.5,6,-7.5:b,7.5,9,-7.5:b,-7.5,6,-7.5:b,-7.5,9,-7.5:b,0.5,9,-7.5:b,-0.5,9,-7.5:b,-0.5,0,-7.5:b,-1.5,9,-7.5:b,6.5,9,-7.5:b,-1.5,0,-7.5:b,6.5,0,-7.5:b,-3.5,9,-7.5:b,4.5,9,-7.5:b,-3.5,0,-7.5:b,4.5,0,-7.5:b,4.5,1,-7.5:b,4.5,2,-7.5:b,4.5,3,-7.5:b,-4.5,9,-7.5:b,3.5,9,-7.5:b,1.5,8,-7.5:b,1.5,7,-7.5:b,1.5,6,-7.5:b,1.5,5,-7.5:b,1.5,4,-7.5:b,0.5,4,-7.5:b,-0.5,4,-7.5:b,-1.5,4,-7.5:b,-1.5,1,-7.5:b,-2.5,4,-7.5:b,-3.5,4,-7.5:b,-2.5,7,-7.5:b,-2.5,8,-7.5:b,-4.5,0,-7.5:b,3.5,0,-7.5:b,-5.5,9,-7.5:b,2.5,9,-7.5:b,-5.5,0,-7.5:b,2.5,0,-7.5:b,-6.5,9,-7.5:b,1.5,9,-7.5:b,-6.5,0,-7.5:b,1.5,0,-7.5:b,-2.5,9,-7.5:b,5.5,9,-7.5:b,-2.5,0,-7.5:b,5.5,0,-7.5:b,7.5,0,-6.5:b,7.5,0,-1.5:b,7.5,0,-1.5:b,7.5,0,3.5:b,7.5,2,3.5:b,7.5,1,0.5:b,7.5,2,0.5:b,7.5,3,0.5:b,7.5,2,4.5:b,7.5,4,3.5:b,7.5,0,-5.5:b,7.5,0,-0.5:b,7.5,0,4.5:b,7.5,0,-4.5:b,7.5,0,0.5:b,7.5,0,5.5:b,7.5,0,-3.5:b,7.5,0,1.5:b,7.5,0,6.5:b,7.5,0,-2.5:b,7.5,0,2.5:b,7.5,9,-6.5:b,7.5,9,-1.5:b,7.5,9,3.5:b,7.5,8,3.5:b,7.5,7,3.5:b,7.5,6,3.5:b,7.5,9,-5.5:b,7.5,9,-0.5:b,7.5,9,4.5:b,7.5,9,-4.5:b,7.5,9,0.5:b,7.5,9,5.5:b,7.5,9,-3.5:b,7.5,9,1.5:b,7.5,9,6.5:b,7.5,9,-2.5:b,7.5,8,-2.5:b,7.5,7.02117395401001,-2.5:b,7.5,4,1.5:b,7.5,4,0.5:b,7.5,4,-0.5:b,7.5,4,-1.5:b,7.5,3,-5.5:b,7.5,3,-4.5:b,7.5,3,-3.5:b,7.5,3,-6.5:b,7.5,1,7.5:b,7.5,4,2.5:b,7.5,9,2.5:b,-7.5,0,-6.5:b,-7.5,0,-1.5:b,-7.5,0,3.5:b,-7.5,0,-5.5:b,-7.5,0,-0.5:b,-7.5,0,4.5:b,-7.5,0,-4.5:b,-7.5,0,0.5:b,-7.5,0,5.5:b,-7.5,0,-3.5:b,-7.5,0,1.5:b,-7.5,0,6.5:b,-7.5,0,-2.5:b,-7.5,0,2.5:b,-7.5,9,-6.5:b,-7.5,9,-1.5:b,-7.5,9,3.5:b,-7.5,9,-5.5:b,-7.5,9,-0.5:b,-7.5,9,4.5:b,-7.5,9,-4.5:b,-7.5,9,0.5:b,-7.5,9,5.5:b,-7.5,9,-3.5:b,-7.5,9,1.5:b,-7.5,8,-2.5:b,-7.5,7,-2.5:b,-7.5,6,-2.5:b,-7.5,5,-2.5:b,-7.5,4,-2.5:b,-7.5,4,-3.5:b,-7.5,4,-4.5:b,-7.5,1,-1.5:b,-7.5,1,-4.5:b,-7.5,4,2.5:b,-7.5,3,2.5:b,-7.5,5,2.5:b,-7.5,6,2.5:b,-7.5,6,3.5:b,-7.5,6,4.5:b,-7.5,9,6.5:b,-7.5,9,-2.5:b,-7.5,9,2.5:b,-7.5,0,7.5:b,-7.5,1,7.5:b,8.5,5,8.5:b,8.5,4,8.5:b,8.5,3,8.5:b,8.5,4,7.5:b,8.5,3,7.5:b,8.5,2,7.5:b,7.5,4,8.5:b,7.5,3,8.5:b,7.5,2,8.5:b,8.5,5,7.5:b,7.5,5,8.5:b,-7.5,2,7.5:b,7.5,2,7.5:b,-7.5,3,7.5:b,-7.5,5,7.5:b,-6.5,3,7.5:b,-5.5,3,7.5:b,3.5,3,7.5:b,3.5,2,7.5:b,3.5,4,7.5:b,3.5,5,7.5:b,4.5,5,7.5:b,-7.5,7,7.5:b,7.5,7,7.5:b,-8.5,5,7.5:b,-8.5,4,7.5:b,-8.5,3,7.5:b,-7.5,4,8.5:b,-7.5,3,8.5:b,-7.5,5,8.5:b,-7.5,8,7.5:b,7.5,5,7.5:b,7.5,3,7.5:b,7.5,5,6.5:b,7.5,8,7.5:b,7.5,0,7.5:b,0.5,0,7.5:b,7.5,6,7.5:b,7.5,9,7.5:b,-7.5,6,7.5:b,-7.5,6,6.5:b,-7.5,6,5.5:b,-7.5,9,7.5:b,0.5,9,7.5:b,-0.5,9,7.5:b,-0.5,0,7.5:b,-1.5,9,7.5:b,6.5,9,7.5:b,-1.5,0,7.5:b,6.5,0,7.5:b,-3.5,9,7.5:b,4.5,9,7.5:b,-3.5,0,7.5:b,4.5,0,7.5:b,-4.5,9,7.5:b,3.5,9,7.5:b,-4.5,0,7.5:b,3.5,0,7.5:b,-5.5,9,7.5:b,2.5,9,7.5:b,-5.5,0,7.5:b,2.5,0,7.5:b,-6.5,9,7.5:b,1.5,9,7.5:b,0.5,8,7.5:b,0.5,7,7.5:b,0.5,4,7.5:b,-0.5,4,7.5:b,-0.5,3,7.5:b,-0.5,1,7.5:b,-0.5,2,7.5:b,1.5,2,7.5:b,2.5,2,7.5:b,1.5,4,7.5:b,-6.5,0,7.5:b,1.5,0,7.5:b,-2.5,9,7.5:b,5.5,9,7.5:b,-2.5,0,7.5:b,5.5,0,7.5:e2,2.5,5,-7.5:e2,1.5,7,7.5:e2,-4.5,3,7.5:t,7.5,4,-5,0,0,0:t,7.5,5,-0.5,0,0,0:t,7.5,5,1.5,0,0,0:t,3,1,7.5,0,0,0:t,-7.5,7,2.5,0,0,0:t,-0.5,5,-7.5,0,0,0:",
		"Level2": "p,-5.5,6,-7.5:e1,7.5,8,-5:e1,-7.5,7,0:e3,-7.5,2,3.5:e3,7.5,2,-1.5:c,-2.5,1,-7.5:c,6.5,8,-7.5:c,1.5,8,-7.5:c,-1.5,8,-7.5:c,-6.5,8,-7.5:c,-7.5,8,-6.5:c,-7.5,8,1:c,-7.5,4,-1.5:c,-7.5,1,-6.5:c,-7.5,1,-3.5:c,-7.5,3,3.5:c,-7.5,4,1.5:c,-7.5,8,6.5:c,-6.5,8,7.5:c,-3.5,8,7.5:c,1.5,4,7.5:c,3.5,5,7.5:c,5,1,7.5:c,6.5,8,7.5:c,7.5,8,6.5:c,7.5,6,3.5:c,7.5,8,3.5:c,7.5,1,6.5:c,7.5,1,2.5:c,7.5,8,-3.5:c,7.5,3,-1.5:c,7.5,5,-6.5:c,-6.5,1,7.5:c,-1.5,8,7.5:c,6.5,5,-7.5:c,4.5,1,-7.5:b,-7.5,0,-7.5:b,-7.5,1,-7.5:b,7.5,1,-8.5:b,7.5,0,-8.5:b,8.5,1,-7.5:b,8.5,0,-7.5:b,-7.5,2,-7.5:b,7.5,2,-7.5:b,-7.5,3,-7.5:b,7.5,3,-7.5:b,-7.5,4,-7.5:b,-7.5,7,-7.5:b,7.5,4,-7.5:b,7.5,7,-7.5:b,-7.5,5,-7.5:b,-7.5,8,-7.5:b,7.5,5,-7.5:b,7.5,4,-6.5:b,6.5,4,-7.5:b,5.5,4,-7.5:b,7.5,8,-7.5:b,7.5,0,-7.5:b,0.5,0,-7.5:b,7.5,6,-7.5:b,7.5,9,-7.5:b,-7.5,6,-7.5:b,-7.5,9,-7.5:b,0.5,9,-7.5:b,-0.5,9,-7.5:b,-0.5,8,-7.5:b,-0.5,6,-7.5:b,-6.5,6,-7.5:b,0.5,6,-7.5:b,1.5,6,-7.5:b,1.5,5,-7.5:b,1.5,4,-7.5:b,1.5,3,-7.5:b,0.5,3,-7.5:b,-0.5,3,-7.5:b,-1.5,3,-7.5:b,-0.5,5,-7.5:b,-1.5,5,-7.5:b,-1.5,4,-7.5:b,-0.5,0,-7.5:b,-1.5,9,-7.5:b,6.5,9,-7.5:b,-1.5,0,-7.5:b,6.5,0,-7.5:b,-3.5,9,-7.5:b,4.5,9,-7.5:b,-3.5,0,-7.5:b,4.5,0,-7.5:b,-4.5,9,-7.5:b,3.5,9,-7.5:b,-4.5,0,-7.5:b,3.5,0,-7.5:b,-5.5,9,-7.5:b,2.5,9,-7.5:b,-5.5,0,-7.5:b,2.5,0,-7.5:b,-6.5,9,-7.5:b,1.5,9,-7.5:b,-6.5,0,-7.5:b,1.5,0,-7.5:b,1.5,1,-7.5:b,-2.5,9,-7.5:b,5.5,9,-7.5:b,-2.5,0,-7.5:b,5.5,0,-7.5:b,7.5,0,-6.5:b,7.5,0,-1.5:b,7.5,0,-1.5:b,7.5,0,3.5:b,7.5,1,3.5:b,7.5,2,3.5:b,7.5,3,3.5:b,7.5,4,3.5:b,7.5,0,-5.5:b,7.5,0,-0.5:b,7.5,0,4.5:b,7.5,0,-4.5:b,7.5,0,0.5:b,7.5,0,5.5:b,7.5,0,-3.5:b,7.5,0,1.5:b,7.5,0,6.5:b,7.5,0,-2.5:b,7.5,0,2.5:b,7.5,9,-6.5:b,7.5,9,-1.5:b,7.5,9,3.5:b,7.5,8,2.5:b,7.5,5,3.5:b,7.5,5,4.5:b,7.5,9,-5.5:b,7.5,9,-0.5:b,7.5,9,4.5:b,7.5,9,-4.5:b,7.5,9,0.5:b,7.5,9,5.5:b,7.5,9,-3.5:b,7.5,9,1.5:b,7.5,9,6.5:b,7.5,9,-2.5:b,7.5,8,-2.5:b,7.5,7,-2.5:b,7.5,4,-2.5:b,7.5,3,-2.5:b,7.5,2,-2.5:b,7.5,1,-2.5:b,7.5,4,-1.5:b,7.5,4,-0.5:b,7.5,5,-0.5:b,7.5,9,2.5:b,-7.5,0,-6.5:b,-7.5,0,-1.5:b,-7.5,0,3.5:b,-7.5,0,-5.5:b,-7.5,0,-0.5:b,-7.5,0,4.5:b,-7.5,0,-4.5:b,-7.5,0,0.5:b,-7.5,0,5.5:b,-7.5,0,-3.5:b,-7.5,0,1.5:b,-7.5,0,6.5:b,-7.5,0,-2.5:b,-7.5,0,2.5:b,-7.5,9,-6.5:b,-7.5,9,-1.5:b,-7.5,9,3.5:b,-7.5,9,-5.5:b,-7.5,9,-0.5:b,-7.5,8,0:b,-7.5,9,4.5:b,-7.5,9,-4.5:b,-7.5,9,0.5:b,-7.5,9,5.5:b,-7.5,9,-3.5:b,-7.5,9,1.5:b,-7.5,3,2.5:b,-7.5,2,2.5:b,-7.5,1,2.5:b,-7.5,1,-2.5:b,-7.5,2,-2.5:b,-7.5,3,-2.5:b,-7.5,3,-1.5:b,-7.5,3,-0.5:b,-7.5,3,0.5:b,-7.5,3,1.5:b,-7.5,9,6.5:b,-7.5,9,-2.5:b,-7.5,9,2.5:b,-7.5,0,7.5:b,-7.5,1,7.5:b,8.5,4,8.5:b,8.5,5,8.5:b,8.5,3,8.5:b,8.5,2,8.5:b,8.5,3,7.5:b,8.5,2,7.5:b,7.5,3,8.5:b,7.5,2,8.5:b,8.5,4,7.5:b,8.5,5,7.5:b,7.5,4,8.5:b,7.5,5,8.5:b,-7.5,2,7.5:b,7.5,1,7.5:b,6.5,1,7.5:b,6.5,2,7.5:b,-7.5,3,7.5:b,7.5,2,7.5:b,-7.5,4,7.5:b,-1.5,1,7.5:b,-2.5,1,7.5:b,-7.5,7,7.5:b,7.5,7,7.5:b,-8.5,5,7.5:b,-7.5,5,8.5:b,-7.5,6,8.5:b,-7.5,4,8.5:b,-7.5,8,7.5:b,7.5,5,7.5:b,7.5,8,7.5:b,7.5,0,7.5:b,0.5,0,7.5:b,7.5,6,7.5:b,7.5,9,7.5:b,-7.5,6,7.5:b,-8.5,6,7.5:b,-8.5,4,7.5:b,-7.5,9,7.5:b,0.5,9,7.5:b,-0.5,9,7.5:b,-0.5,0,7.5:b,-1.5,9,7.5:b,-2.5,8,7.5:b,-2.5,7,7.5:b,-2.5,6,7.5:b,-2.5,5,7.5:b,-2.5,4,7.5:b,-3.5,4,7.5:b,6.5,9,7.5:b,-1.5,0,7.5:b,6.5,0,7.5:b,-3.5,9,7.5:b,4.5,9,7.5:b,-3.5,0,7.5:b,4.5,0,7.5:b,-4.5,9,7.5:b,3.5,9,7.5:b,-4.5,0,7.5:b,3.5,0,7.5:b,-5.5,9,7.5:b,2.5,9,7.5:b,2.5,8,7.5:b,2.5,7,7.5:b,2.5,6,7.5:b,2.5,5,7.5:b,2.5,4,7.5:b,3.5,4,7.5:b,-5.5,0,7.5:b,2.5,0,7.5:b,-6.5,9,7.5:b,1.5,9,7.5:b,-6.5,0,7.5:b,1.5,0,7.5:b,-2.5,9,7.5:b,5.5,9,7.5:b,-2.5,0,7.5:b,5.5,0,7.5:e2,-1.5,4,7.5:e2,-6.5,6,7.5:e2,3.5,6.5,7.5:e2,-6.5,4,-7.5:e2,2.5,4,-7.5:t,1.5,2,-7.5,0,0,0:t,3.5,1,7.5,0,0,0:t,-7.5,8,-5,180,0,0:t,7.5,4.5,2.5,-89.99999999999999,0,0:",
		"Level3": "p,-6.5,8,-7.5:e1,1.5,8,-7.5:e1,-4.5,4,7.5:e1,7.5,8,0:e1,7.5,8,5.5:e2,-6.5,7,7.5:e2,1.5,4,7.5:e3,-7.5,1,-1.5:e3,-7.5,8,-0.5:t,-1.5,1,-7.5,0,0,0:t,-2.5,8,7.5,180,0,0:t,7.5,1,-4.5,0,0,0:t,-7.5,5,-6.5,89.99999999999999,0,0:t,-0.5,2,7.5,0,0,89.99999999999999:c,-2.5,5,-7.5:c,-6.5,6,7.5:c,-6.5,8,7.5:c,0.5,8,7.5:c,-0.5,5,-7.5:c,4.5,3,-7.5:c,4.5,1,-7.5:c,-0.5,8,-7.5:c,4.5,8,-7.5:c,-6.5,7,-7.5:c,6.5,5,7.5:c,0.5,5,7.5:c,6.5,8,7.5:c,7.5,1.5,2.5:c,7.5,5,-2.5:c,7.5,5,3.5:c,7.5,5,-6.5:c,7.5,8,-6.5:c,7.5,5,6.5:c,7.5,8,6.5:c,-7.5,4,2.5:c,-7.5,1,-3.5:c,-7.5,1,2.5:c,-7.5,1,-1.5:c,-7.5,1,-6.5:c,-7.5,8,-2.5:c,-7.5,8,-6:c,-7.5,7,6.5:c,7.5,1,4.5:c,1.5,1,7.5:c,-6.5,1,7.5:b,-7.5,0,-7.5:b,-7.5,1,-7.5:b,7.5,1,-8.5:b,7.5,2,-8.5:b,7.5,0,-8.5:b,8.5,1,-7.5:b,8.5,0,-7.5:b,-7.5,2,-7.5:b,8.5,2,-7.5:b,8.5,3,-7.5:b,7.5,3,-8.5:b,-7.5,3,-7.5:b,7.5,3,-7.5:b,-7.5,4,-7.5:b,-7.5,7,-7.5:b,7.5,4,-7.5:b,7.5,7,-7.5:b,-7.5,5,-7.5:b,-7.5,8,-7.5:b,7.5,5,-7.5:b,7.5,8,-7.5:b,7.5,0,-7.5:b,0.5,0,-7.5:b,7.5,6,-7.5:b,7.5,9,-7.5:b,-7.5,6,-7.5:b,-7.5,9,-7.5:b,0.5,9,-7.5:b,-0.5,9,-7.5:b,-0.5,0,-7.5:b,-1.5,9,-7.5:b,6.5,9,-7.5:b,-1.5,0,-7.5:b,6.5,0,-7.5:b,-3.5,9,-7.5:b,4.5,9,-7.5:b,-3.5,0,-7.5:b,4.5,0,-7.5:b,-4.5,9,-7.5:b,3.5,9,-7.5:b,-4.5,0,-7.5:b,3.5,0,-7.5:b,-5.5,9,-7.5:b,2.5,9,-7.5:b,-5.5,0,-7.5:b,2.5,0,-7.5:b,3.5,1,-7.5:b,3.5,2,-7.5:b,3.5,3,-7.5:b,3.5,4,-7.5:b,4.5,4,-7.5:b,4.5,5,-7.5:b,4.5,6,-7.5:b,-6.5,9,-7.5:b,1.5,9,-7.5:b,-6.5,0,-7.5:b,1.5,0,-7.5:b,-2.5,9,-7.5:b,-1.5,8,-7.5:b,-1.5,7,-7.5:b,-1.5,6,-7.5:b,-1.5,5,-7.5:b,-1.5,4,-7.5:b,-0.5,4,-7.5:b,-2.5,4,-7.5:b,5.5,9,-7.5:b,-2.5,0,-7.5:b,5.5,0,-7.5:b,7.5,0,-6.5:b,7.5,0,-1.5:b,7.5,0,-1.5:b,7.5,0,3.5:b,7.5,1,3.5:b,7.5,2,3.5:b,7.5,3,3.5:b,7.5,4,3.5:b,7.5,0,-5.5:b,7.5,0,-0.5:b,7.5,0,4.5:b,7.5,0,-4.5:b,7.5,0,0.5:b,7.5,0,5.5:b,7.5,0,-3.5:b,7.5,0,1.5:b,7.5,0,6.5:b,7.5,0,-2.5:b,7.5,0,2.5:b,7.5,9,-6.5:b,7.5,9,-1.5:b,7.5,9,3.5:b,7.5,8,3.5:b,7.5,7,3.5:b,7.5,9,-5.5:b,7.5,9,-0.5:b,7.5,9,4.5:b,7.5,9,-4.5:b,7.5,9,0.5:b,7.5,9,5.5:b,7.5,9,-3.5:b,7.5,9,1.5:b,7.5,9,6.5:b,7.5,9,-2.5:b,7.5,8,-2.5:b,7.5,7,-2.5:b,7.5,4,-2.5:b,7.5,4,-3.5:b,7.5,4,-4.5:b,7.5,4,-5.5:b,7.5,4,-6.5:b,7.5,4,6.5:b,7.5,4,-1.5:b,7.5,9,2.5:b,-7.5,0,-6.5:b,-7.5,0,-1.5:b,-7.5,0,3.5:b,-7.5,0,-5.5:b,-7.5,0,-0.5:b,-7.5,0,4.5:b,-7.5,0,-4.5:b,-7.5,0,0.5:b,-7.5,0,5.5:b,-7.5,0,-3.5:b,-7.5,0,1.5:b,-7.5,0,6.5:b,-7.5,0,-2.5:b,-7.5,0,2.5:b,-7.5,9,-6.5:b,-7.5,9,-1.5:b,-7.5,9,3.5:b,-7.5,9,-5.5:b,-7.5,9,-0.5:b,-7.5,9,4.5:b,-7.5,9,-4.5:b,-7.5,9,0.5:b,-7.5,9,5.5:b,-7.5,9,-3.5:b,-7.5,9,1.5:b,-7.5,8,-1.5:b,-7.5,1,-2.5:b,-7.5,4,1.5:b,-7.5,5,1.5:b,-7.5,9,6.5:b,-7.5,9,-2.5:b,-7.5,9,2.5:b,-7.5,0,7.5:b,-7.5,1,7.5:b,8.5,1,8.5:b,8.5,0,8.5:b,8.5,0,7.5:b,7.5,0,8.5:b,8.5,1,7.5:b,7.5,1,8.5:b,-7.5,2,7.5:b,7.5,2,8.5:b,7.5,3,8.5:b,8.5,2,8.5:b,8.5,2,7.5:b,8.5,3,7.5:b,-8.5,3,7.5:b,-8.5,2,7.5:b,7.5,3,7.5:b,-7.5,5,7.5:b,-6.5,5,7.5:b,-5.5,5,7.5:b,-4.5,5,7.5:b,0.5,3,7.5:b,0.5,1,7.5:b,0.5,2,7.5:b,0.5,4,7.5:b,6.5,4,7.5:b,-7.5,7,7.5:b,7.5,4,7.5:b,7.5,7,7.5:b,-8.5,4,7.5:b,-8.5,5,7.5:b,-7.5,4,8.5:b,-7.5,5,8.5:b,-7.5,3,8.5:b,-7.5,2,8.5:b,-7.5,8,7.5:b,7.5,5,7.5:b,7.5,8,7.5:b,7.5,0,7.5:b,0.5,0,7.5:b,7.5,6,7.5:b,7.5,9,7.5:b,-7.5,6,7.5:b,-7.5,6,6.5:b,-7.5,6,5.5:b,-7.5,9,7.5:b,0.5,9,7.5:b,-0.5,9,7.5:b,-0.5,0,7.5:b,-1.5,9,7.5:b,6.5,9,7.5:b,-1.5,0,7.5:b,6.5,0,7.5:b,-3.5,9,7.5:b,4.5,9,7.5:b,-3.5,0,7.5:b,4.5,0,7.5:b,-4.5,9,7.5:b,3.5,9,7.5:b,-4.5,0,7.5:b,3.5,0,7.5:b,-5.5,9,7.5:b,2.5,9,7.5:b,-5.5,0,7.5:b,2.5,0,7.5:b,-6.5,9,7.5:b,1.5,9,7.5:b,-6.5,0,7.5:b,1.5,0,7.5:b,-2.5,9,7.5:b,5.5,9,7.5:b,-2.5,0,7.5:b,5.5,0,7.5:",
		"Level4": "p,-6.5,8,-7.5:e1,7.5,8,0.5:e3,-7.5,1,-6.5:c,0,1,-7.5:b,-7.5,0,-7.5:b,-7.5,1,-7.5:b,7.5,1,-7.5:b,-7.5,2,-7.5:b,7.5,2,-7.5:b,-7.5,3,-7.5:b,7.5,3,-7.5:b,-7.5,4,-7.5:b,-7.5,7,-7.5:b,7.5,4,-7.5:b,7.5,7,-7.5:b,-7.5,5,-7.5:b,-7.5,8,-7.5:b,7.5,5,-7.5:b,7.5,8,-7.5:b,7.5,0,-7.5:b,0.5,0,-7.5:b,7.5,6,-7.5:b,7.5,9,-7.5:b,-7.5,6,-7.5:b,-7.5,9,-7.5:b,0.5,9,-7.5:b,-1.5,6,-7.5:b,-1.5,5,-7.5:b,-0.5,5,-7.5:b,0.5,4,-7.5:b,1.5,4,-7.5:b,3.5,4,-7.5:b,1.5,3,-7.5:b,3.5,3,-7.5:b,1.5,2,-7.5:b,3.5,2,-7.5:b,1.5,5,-7.5:b,3.5,5,-7.5:b,1.5,6,-7.5:b,3.5,6,-7.5:b,4.5,6,-7.5:b,5.5,5.5,-7.5:b,5.5,5,-7.5:b,5.5,4,-7.5:b,5.5,3,-7.5:b,4.5,2,-7.5:b,-1.5,4,-7.5:b,-1.5,3,-7.5:b,-1.5,2,-7.5:b,-0.5,9,-7.5:b,-0.5,0,-7.5:b,-1.5,9,-7.5:b,6.5,9,-7.5:b,-1.5,0,-7.5:b,6.5,0,-7.5:b,-3.5,9,-7.5:b,-5.5,6,-7.5:b,-5.5,5,-7.5:b,-5.5,4,-7.5:b,-5.5,3,-7.5:b,-5.5,2,-7.5:b,-4.5,4,-7.5:b,-4.5,2,-7.5:b,-3.5,2,-7.5:b,-4.5,6,-7.5:b,-3.5,6,-7.5:b,4.5,9,-7.5:b,-3.5,0,-7.5:b,4.5,0,-7.5:b,-4.5,9,-7.5:b,3.5,9,-7.5:b,-4.5,0,-7.5:b,3.5,0,-7.5:b,-5.5,9,-7.5:b,2.5,9,-7.5:b,-5.5,0,-7.5:b,2.5,0,-7.5:b,-6.5,9,-7.5:b,1.5,9,-7.5:b,-6.5,0,-7.5:b,1.5,0,-7.5:b,-2.5,9,-7.5:b,5.5,9,-7.5:b,-2.5,0,-7.5:b,5.5,0,-7.5:b,7.5,0,-6.5:b,7.5,0,-1.5:b,7.5,0,-1.5:b,7.5,0,3.5:b,7.5,0,-5.5:b,7.5,0,-0.5:b,7.5,0,4.5:b,7.5,0,-4.5:b,7.5,0,0.5:b,7.5,0,5.5:b,7.5,0,-3.5:b,7.5,0,1.5:b,7.5,0,6.5:b,7.5,0,-2.5:b,7.5,0,2.5:b,7.5,9,-6.5:b,7.5,9,-1.5:b,7.5,9,3.5:b,7.5,9,-5.5:b,7.5,9,-0.5:b,7.5,9,4.5:b,7.5,9,-4.5:b,7.5,9,0.5:b,7.5,9,5.5:b,7.5,9,-3.5:b,7.5,9,1.5:b,7.5,9,6.5:b,7.5,9,-2.5:b,7.5,9,2.5:b,-7.5,0,-6.5:b,-7.5,0,-1.5:b,-7.5,0,3.5:b,-7.5,0,-5.5:b,-7.5,0,-0.5:b,-7.5,0,4.5:b,-7.5,0,-4.5:b,-7.5,0,0.5:b,-7.5,0,5.5:b,-7.5,0,-3.5:b,-7.5,0,1.5:b,-7.5,0,6.5:b,-7.5,0,-2.5:b,-7.5,0,2.5:b,-7.5,9,-6.5:b,-7.5,9,-1.5:b,-7.5,9,3.5:b,-7.5,9,-5.5:b,-7.5,9,-0.5:b,-7.5,9,4.5:b,-7.5,9,-4.5:b,-7.5,9,0.5:b,-7.5,9,5.5:b,-7.5,9,-3.5:b,-7.5,9,1.5:b,-7.5,9,6.5:b,-7.5,9,-2.5:b,-7.5,9,2.5:b,-7.5,0,7.5:b,-7.5,1,7.5:b,7.5,1,7.5:b,-7.5,2,7.5:b,7.5,2,7.5:b,-7.5,3,7.5:b,7.5,3,7.5:b,-7.5,4,7.5:b,-7.5,7,7.5:b,7.5,4,7.5:b,7.5,7,7.5:b,-7.5,5,7.5:b,-7.5,8,7.5:b,7.5,5,7.5:b,7.5,8,7.5:b,7.5,0,7.5:b,0.5,0,7.5:b,7.5,6,7.5:b,7.5,9,7.5:b,-7.5,6,7.5:b,-7.5,9,7.5:b,0.5,9,7.5:b,-0.5,9,7.5:b,-0.5,0,7.5:b,-1.5,9,7.5:b,6.5,9,7.5:b,-1.5,0,7.5:b,6.5,0,7.5:b,-3.5,9,7.5:b,4.5,9,7.5:b,-3.5,0,7.5:b,4.5,0,7.5:b,-4.5,9,7.5:b,3.5,9,7.5:b,-4.5,0,7.5:b,3.5,0,7.5:b,-5.5,9,7.5:b,2.5,9,7.5:b,-5.5,0,7.5:b,2.5,0,7.5:b,-6.5,9,7.5:b,1.5,9,7.5:b,-6.5,0,7.5:b,1.5,0,7.5:b,-2.5,9,7.5:b,5.5,9,7.5:b,-2.5,0,7.5:b,5.5,0,7.5:"
	}


	constructor(app, game) {
		this.app = app
		this.g = game
		this.blockList = (this.app.root.findByTag("block"))
		this.createAABBList()

		this.createTextures()

		this.blockMat = new pc.StandardMaterial()
		this.blockMat.diffuse.set(1, 1, 1)
		this.blockMat.diffuseTint = true
		//this.blockMat.diffuseMap = this.blockTexture
		this.blockMat.update()

		this.blockMatA = new pc.StandardMaterial()
		this.blockMatA.diffuse.fromString("#ffc400")
		this.blockMatA.diffuseTint = true
		//this.blockMatA.diffuseMap = this.blockTexture
		this.blockMatA.update()

		this.playerMat = new pc.StandardMaterial()
		this.playerMat.diffuse.fromString("#f0b71b")
		this.playerMat.emissive.fromString("#f0b71b")
		this.playerMat.emissiveIntensity = 0.4
		this.playerMat.update()

		this.coinMat = new pc.StandardMaterial()
		this.coinMat.diffuse.set(1, 1, 0.3)
		this.coinMat.emissive.set(1, 1, 0.3)
		this.coinMat.update()

		this.enemyMat = new pc.StandardMaterial()
		this.enemyMat.diffuse.set(1, 0.2, 0.2)
		this.enemyMat.update()

		this.enemyMat2 = new pc.StandardMaterial()
		this.enemyMat2.diffuse.set(0.7, 0.1, 0.1)
		this.enemyMat2.update()

		this.trapMat = new pc.StandardMaterial()
		this.trapMat.diffuse.set(0.3, 0.1, 0.1)
		this.trapMat.update()

		this.blackMat = new pc.StandardMaterial()
		this.blackMat.diffuse.fromString("#000000")
		this.blackMat.update()


		this.batchGroupBlocks = this.app.batcher.addGroup('Blocks', false, 100);
		this.batchGroupCoins = this.app.batcher.addGroup('Coins', false, 100);
		this.batchGroupTraps = this.app.batcher.addGroup('Spikes', true, 100);


	}
	loadLevelJson(lvl) {
		log("load level", lvl)
		let sceneLevel = this.app.root.findByName("Level")
		if (sceneLevel) sceneLevel.destroy()

		let levelTxt = this.levelsAsset["Level" + lvl]

		let levelColors = [
			"#ffffff", "#ffffff",
			"#72c296", "#59a79c",
			"#c485b4", "#b865b1",
			"#ece475", "#e0d56d",
			"#81dd6a", "#5dc46e",]


		this.blockMat.diffuse.fromString(levelColors[lvl * 2])
		this.blockMat.update()
		this.blockMatA.diffuse.fromString(levelColors[lvl * 2 + 1])
		this.blockMatA.update()


		//log(levelTxt)

		let level = new pc.Entity();
		level.name = "Level"
		this.app.root.addChild(level)
		this.levelEntity = level


		let ss = levelTxt.split(":")
		let n = 0
		for (let s of ss) {
			if (s == "") continue
			let arr = s.split(",")

			if (this.shortName.hasOwnProperty(arr[0])) {
				let entity = this.createUnit(this.shortName[arr[0]], arr[0])


				level.addChild(entity);

				entity.setPosition(arr[1], arr[2], arr[3])
				if (arr[0] === "t") entity.setEulerAngles(arr[4], arr[5], arr[6])
				if (entity.tags.has("enemy")) {
					if (entity.getPosition().z === 7.5) entity.setEulerAngles(0, 180, 0)
					if (entity.getPosition().x === 7.5) entity.setEulerAngles(0, -90, 0)
					if (entity.getPosition().x === -7.5) entity.setEulerAngles(0, 90, 0)
				}
				if (entity.tags.has("block")) {
					n++

					let y = entity.getPosition().y
					let x = entity.getPosition().x
					let z = entity.getPosition().z
					let a = true
					if ((x - 0.5) % 2 == 0) a = false
					if ((z - 0.5) % 2 == 0) a = !a
					if ((y) % 2 == 0) a = !a

					if (a) entity.render.material = this.blockMatA

				}
			} else {
				log("no shortName", arr[0])
			}

		}

		this.blockList = level.find((n) => { return n.name == "Block" })
		this.aabbList = []
		for (let block of this.blockList) {
			let aabb = new pc.BoundingBox()
			aabb.center.copy(block.getPosition())
			aabb.halfExtents.set(0.5, 0.5, 0.5)

			this.aabbList.push(aabb)

		}
		this.g.player.entity = level.findByName("Player")
		this.g.player.reset()
		this.g.player.orient(true)

		this.g.enemyList = []
		let enemies = this.app.root.findByTag("enemy")
		for (let enemy of enemies) {
			this.g.enemyList.push(new Enemy(enemy, this.app, this.g))
		}
		this.coinList = this.levelEntity.findByTag("coin")
		this.trapList = this.levelEntity.findByTag("trap")
		//log(this.coinList)

		this.g.control.showArrows()

		this.app.scene.skyboxIntensity = 0.5
		this.g.light.light.intensity = 0.5
		this.g.light2.light.intensity = 0.5


		// blocks color
		let mat = new pc.BasicMaterial()

		mat.diffuse = new pc.Color(0.6, 0.6, 0.3)
		mat.update()
		//if (lvl > 1) for (let block of this.blockList) block.render.meshInstances[0].material = mat
		this.g.partsList.forEach(p => p.enabled = false)
		this.g.levelRestartTimer = -1

		log("coins", this.coinList.length)
		log("traps", this.trapList.length)
		log("enemies", this.g.enemyList.length)
	}

	nextLevel() {
		this.g.lvl++
		if (this.g.lvl > this.g.nLvl) this.g.lvl = 1
		this.loadLevelJson(this.g.lvl)
	}
	createUnit(name, shortName) {
		let entity = new pc.Entity()
		entity.name = name

		if (name === "Player") {
			entity.tags.add("player")
			let entity2 = new pc.Entity()
			entity.addChild(entity2)

			let model = new pc.Entity()
			entity2.addChild(model)

			model.addComponent("render", { type: "box", castShadows: false })
			model.render.material = this.playerMat
			model.setLocalScale(0.5, 0.5, 0.8)
			model.setLocalPosition(0, 0, 0.1)

			model = new pc.Entity()
			entity2.addChild(model)

			model.addComponent("render", { type: "box", castShadows: false })
			model.render.material = this.playerMat
			model.setLocalScale(0.1, 0.1, 0.3)
			model.setLocalPosition(0.15, 0, -0.3)

			model = new pc.Entity()
			entity2.addChild(model)

			model.addComponent("render", { type: "box", castShadows: false })
			model.render.material = this.playerMat
			model.setLocalScale(0.1, 0.1, 0.3)
			model.setLocalPosition(-0.15, 0, -0.3)

			model = new pc.Entity()
			entity2.addChild(model)

			model.addComponent("render", { type: "box", castShadows: false })
			model.render.material = this.blackMat
			model.setLocalScale(0.1, 0.1, 0.1)
			model.setLocalPosition(0.13, 0.25, -0.1)

			model = new pc.Entity()
			entity2.addChild(model)

			model.addComponent("render", { type: "box", castShadows: false })
			model.render.material = this.blackMat
			model.setLocalScale(0.1, 0.1, 0.1)
			model.setLocalPosition(-0.13, 0.25, -0.1)



		}
		if (shortName == "e1" || shortName == "e2" || shortName == "e3") {
			entity.tags.add("enemy")
			if (shortName == "e2") entity.tags.add("enemy_x")
			if (shortName == "e3") entity.tags.add("enemy_z")

			let e = new pc.Entity()
			e.addComponent("render", { type: "box", castShadows: false })
			e.render.material = this.enemyMat
			e.setLocalScale(0.8, 0.8, 0.5)
			entity.addChild(e)

			e = new pc.Entity()
			e.addComponent("render", { type: "box", castShadows: false, material: this.blackMat })
			e.setLocalScale(0.13, 0.13, 0.13)
			e.setLocalPosition(-0.2, 0.1, 0.3)
			entity.addChild(e)

			e = new pc.Entity()
			e.addComponent("render", { type: "box", castShadows: false, material: this.blackMat })
			e.setLocalScale(0.13, 0.13, 0.13)
			e.setLocalPosition(0.2, 0.1, 0.3)
			entity.addChild(e)

			e = new pc.Entity()
			e.addComponent("render", { type: "cone", castShadows: false })
			e.render.material = this.enemyMat2
			e.setLocalScale(0.2, 0.2, 0.2)
			e.setLocalPosition(0, 0.5, 0)
			entity.addChild(e)

			e = new pc.Entity()
			e.addComponent("render", { type: "cone", castShadows: false })
			e.render.material = this.enemyMat2
			e.setLocalScale(0.2, 0.2, 0.2)
			e.setLocalPosition(0, -0.5, 0)
			e.setEulerAngles(0, 0, 180)
			entity.addChild(e)

			e = new pc.Entity()
			e.addComponent("render", { type: "cone", castShadows: false })
			e.render.material = this.enemyMat2
			e.setLocalScale(0.2, 0.2, 0.2)
			e.setLocalPosition(-0.5, 0, 0)
			e.setEulerAngles(0, 0, 90)
			entity.addChild(e)

			e = new pc.Entity()
			e.addComponent("render", { type: "cone", castShadows: false })
			e.render.material = this.enemyMat2
			e.setLocalScale(0.2, 0.2, 0.2)
			e.setLocalPosition(0.5, 0, 0)
			e.setEulerAngles(0, 0, -90)
			entity.addChild(e)

		}
		if (name === "Block") {
			entity.tags.add("block")
			entity.addComponent("render", { type: "box", isStatic: true, batchGroupId: this.batchGroupBlocks.id })
			//entity.addComponent("render", { type: "box", })
			entity.render.material = this.blockMat


		}
		if (name === "Coin") {
			entity.setLocalScale(0.2, 0.2, 0.2)
			entity.tags.add("coin")
			entity.addComponent("render", { type: "box", castShadows: false, batchGroupId: this.batchGroupCoins.id })
			entity.render.material = this.coinMat
			entity.render.isStatic = true

		}
		if (name === "Trap") {
			entity.setLocalScale(1, 1, 1)
			entity.tags.add("trap")

			let spikes = new pc.Entity()
			entity.addChild(spikes)
			let a = 0.3
			let b = -0.3

			let posList = [[a, -0.2, a], [-a, -0.2, -a], [a, -0.2, -a], [-a, -0.2, a]]
			for (let i = 0; i < 4; i++) {
				let spike = new pc.Entity()
				spikes.addChild(spike)

				spike.setLocalScale(0.2, 0.8, 0.2)
				spike.setLocalPosition(new pc.Vec3(posList[i]))
				spike.addComponent("render", {
					type: "cone", castShadows: false, batchGroupId: this.batchGroupTraps.id

				})
				spike.render.material = this.trapMat
			}


		}
		return entity

	}

	createAABBList() {
		for (let block of this.blockList) {
			let aabb = new pc.BoundingBox()
			aabb.center.copy(block.getPosition())
			aabb.halfExtents.set(0.5, 0.5, 0.5)
			this.aabbList.push(aabb)
		}
	}

	/**@param {pc.Ray} ray */
	rayCast(ray, hitPos) {
		let isHit = false
		let nearestPoint = new pc.Vec3(100, 100, 100)

		for (let aabb of this.aabbList) {
			if (aabb.intersectsRay(ray, this.point)) {
				isHit = true
				if (ray.origin.distance(this.point) < ray.origin.distance(nearestPoint)) nearestPoint.copy(this.point)

			}
		}
		if (isHit) {
			hitPos.copy(nearestPoint)
			return true
		}
		return false
	}
	/** @param {pc.Ray} ray 
		 @param {pc.BoundingBox} aabb */

	rayCastOne(ray, aabb) {

		if (aabb.intersectsRay(ray, this.point)) {

		}
		else this.point.set(0, 0, 0)
		return this.point
	}
	createTextures() {
		let canvas = document.createElement('canvas');
		canvas.width = 100
		canvas.height = 100
		let ctx = canvas.getContext("2d")



		/* ctx.fillStyle = "#4cad7d";
		ctx.fillRect(0, 0, 100, 100); */

		/* 	ctx.fillStyle = "#42867d";
			ctx.fillRect(30, 30, 40, 40);
			ctx.fillRect(20, 20, 60, 60); */


		let texture = new pc.Texture(this.app.graphicsDevice, {
			minFilter: pc.FILTER_LINEAR,
			magFilter: pc.FILTER_LINEAR,
			addressU: pc.ADDRESS_CLAMP_TO_EDGE,
			addressV: pc.ADDRESS_CLAMP_TO_EDGE,

		});

		texture.setSource(canvas);
		this.blockTexture = texture

		// VR texture
		canvas = document.createElement('canvas');
		canvas.width = 120
		canvas.height = 60
		ctx = canvas.getContext("2d")
		ctx.fillStyle = "#e9b91e";
		ctx.fillRect(0, 0, 120, 60);

		ctx.fillStyle = "#8d6d52";
		//ctx.clearRect(20, 15, 25, 25);
		//ctx.clearRect(70, 15, 25, 25);
		ctx.beginPath();
		ctx.arc(30, 30, 12, 0, 2 * Math.PI);
		ctx.fill();
		ctx.arc(90, 30, 12, 0, 2 * Math.PI);
		ctx.fill();

		ctx.moveTo(45, 60);
		ctx.lineTo(60, 45);
		ctx.lineTo(75, 60);
		ctx.fill();


		ctx.closePath



		texture = new pc.Texture(this.app.graphicsDevice, {
			minFilter: pc.FILTER_LINEAR,
			magFilter: pc.FILTER_LINEAR,
			addressU: pc.ADDRESS_CLAMP_TO_EDGE,
			addressV: pc.ADDRESS_CLAMP_TO_EDGE,

		});
		texture.setSource(canvas);
		this.vrTexture = texture


		// btn reset texture
		canvas = document.createElement('canvas');
		canvas.width = 100
		canvas.height = 100
		ctx = canvas.getContext("2d")
		ctx.fillStyle = "#e0ad3d";
		ctx.fillRect(0, 0, 100, 100);

		ctx.strokeStyle = "#644c18";

		ctx.lineWidth = 10
		ctx.moveTo(75, 75)
		ctx.lineTo(25, 75)
		ctx.lineTo(25, 25)
		ctx.lineTo(75, 25)
		ctx.lineTo(75, 55)
		ctx.stroke()
		ctx.lineWidth = 5

		ctx.moveTo(60, 45)
		ctx.lineTo(75, 55)
		ctx.lineTo(90, 45)



		ctx.stroke()



		texture = new pc.Texture(this.app.graphicsDevice, {
			minFilter: pc.FILTER_LINEAR,
			magFilter: pc.FILTER_LINEAR,
			addressU: pc.ADDRESS_CLAMP_TO_EDGE,
			addressV: pc.ADDRESS_CLAMP_TO_EDGE,

		});
		texture.setSource(canvas);
		this.resetBtnTexture = texture

		// title texture
		canvas = document.createElement('canvas');
		canvas.width = 300
		canvas.height = 300

		ctx = canvas.getContext("2d")


		ctx.fillStyle = "#644f66";
		ctx.fillRect(0, 0, 300, 300);
		ctx.textAlign = "center"

		ctx.fillStyle = "#aee4d4";
		ctx.font = "40px arial";
		ctx.fillText("BITTY JUMP", 150, 50);

		texture = new pc.Texture(this.app.graphicsDevice, {
			minFilter: pc.FILTER_LINEAR,
			magFilter: pc.FILTER_LINEAR,
			addressU: pc.ADDRESS_CLAMP_TO_EDGE,
			addressV: pc.ADDRESS_CLAMP_TO_EDGE,

		});
		texture.setSource(canvas);

		this.titleTexture = texture





	}
}




