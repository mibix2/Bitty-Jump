var log = console.log
import Level from "./level.js";
import Player from "./player.js";
import Control from "./control.js";
import Enemy from "./enemy.js";

export default class Game {

	lvl = 1
	nLvl = 4

	levelRestartTimer = -1
	nextLevelTimer = -1
	trapTimer = 0.1
	trapActive = true

	/** @type {pc.AppBase}*/    app;
	/** @type {pc.Entity}*/     entity;
	/** @type {Player}*/        player;
	/** @type {pc.Entity}*/     camera;
	/** @type {Level}*/         level;
	/** @type {Control}*/       control;
	/** @type {[pc.Entity]}*/   enemyList = [];
	/** @type {[pc.Entity]}*/   partsList = [];

	controllerList = []


	/** @type {[pc.Entity]}*/   blockList;
	/** @type {[pc.BoundingBox]}*/ aabbList = [];
	/** @type {pc.Vec3}*/     endPos = new pc.Vec3();
	/** @type {pc.Vec3}*/     eulers = new pc.Vec3();
	/** @type {pc.LightComponent}*/     light;
	/** @type {pc.LightComponent}*/     light2;

	/** @type {pc.Entity}*/     static dot;

	isMouseControl = true

	eulers = new pc.Vec3();
	lookSpeed = 0.1

	rndID = Math.round(Math.random() * 1000)

	constructor(app, entity) {
		/* let s = localStorage.getItem("mibjs13k_jump")
		if (s) this.lvl = s
		else {
			localStorage.setItem("mibjs13k_jump", this.lvl)
		} */

		log("--init")
		const device = pc.Application.getApplication().graphicsDevice;

		device.maxPixelRatio = Math.min(window.devicePixelRatio, 2);
		//device.maxPixelRatio = 1;

		this.app = app
		this.entity = entity

		this.createLights()


		let camOffset = new pc.Entity("Camera Offset")
		this.app.root.addChild(camOffset)
		camOffset.setPosition(0, 5, 0)

		this.camera = new pc.Entity("Camera")
		this.camera.addComponent("camera")
		camOffset.addChild(this.camera)
		this.camera.camera.fov = 75


		this.player = new Player(null, this.app, this)
		this.level = new Level(this.app, this) // <- level entity !!!!!!

		this.control = new Control(app, this);
		this.level.loadLevelJson(this.lvl)

		this.control.createButtons()

		//this.eulers.copy(lastCameraEulers)

		let floor = new pc.Entity()
		floor.addComponent("render", { type: "plane" })
		floor.setLocalScale(15, 0, 15)
		floor.setPosition(0, -0.5, 0)
		this.app.root.addChild(floor)

		let floormat = new pc.StandardMaterial()
		floormat.diffuse.fromString("#644f66")
		floor.render.material = floormat


		for (let i = 0; i < 15; i++) {
			let part = new pc.Entity()
			part.addComponent("render", { type: "box", material: this.level.playerMat })
			this.app.root.addChild(part)
			part.enabled = false;
			this.partsList.push(part)
		}

		const screen = new pc.Entity();
		screen.addComponent('screen', {
			referenceResolution: new pc.Vec2(1280, 720),
			scaleBlend: 0.5,
			scaleMode: pc.SCALEMODE_BLEND,
			screenSpace: true
		});
		app.root.addChild(screen);

		const btn = new pc.Entity("Button VR2");
		btn.addComponent('button',
			{
				active: true,
				hoverTint: new pc.Color().fromString("#f3b96e"),
				inactiveTint: [1, 1, 1, 0],
				imageEntity: btn,
			}
		);

		btn.addComponent('element', {
			anchor: [1, 0, 1, 0],
			height: 60,
			pivot: [1, 0],
			type: pc.ELEMENTTYPE_IMAGE,
			width: 120,
			useInput: true,
			color: new pc.Color().fromString("#ffffff"),
			opacity: 0.5


		});

		screen.addChild(btn);

		btn.setLocalPosition(-10, 10, 0)
		btn.element.texture = this.level.vrTexture

		btn.element.on("click", function (e) {
			log("click")
		});


		let dot = new pc.Entity("Dot");
		dot.addComponent('element', {
			anchor: [0.5, 0.5, 0.5, 0.5],
			height: 5,
			pivot: [0.5, 0.5],
			type: pc.ELEMENTTYPE_IMAGE,
			width: 5,
			color: [1, 1, 1],
			opacity: 0.7,

		});


		screen.addChild(dot)
		Game.dot = dot





		this.createSky()

	}
	update(dt) {
		if (this.levelRestartTimer < 0 && this.nextLevelTimer < 0) {
			if (this.app.scene.skyboxIntensity < 1) this.app.scene.skyboxIntensity += dt
			if (this.light.light.intensity < 1) this.light.light.intensity += dt
			if (this.light2.light.intensity < 1) this.light2.light.intensity += dt
			if (this.app.scene.ambientLight.intensity < 1) this.app.scene.ambientLight.intensity += dt
		}
		//log(this.app.stats.drawCalls.total)

		this.control.update(dt)
		this.player.update(dt)
		//lastCameraRot.copy(this.camera.getRotation())
		//lastCameraEulers.copy(this.eulers)

		//debud draw
		let color = new pc.Color(1, 1, 1)           //  => level
		for (let aabb of this.level.aabbList) {
			// this.app.drawWireAlignedBox(aabb.getMin(), aabb.getMax(), color)
		}

		// camera
		this.camera.setLocalEulerAngles(this.eulers.x, this.eulers.y, 0);

		if (this.player.entity.getPosition().lengthSq() > 1000)         // restart level
			this.level.loadLevelJson(lvl)

		//if (this.app.keyboard.wasPressed(pc.KEY_SPACE)) this.level.loadLevelJson(lvl)
		//if (this.app.keyboard.wasPressed(pc.KEY_E)) this.app.scenes.changeScene("LevelEditor")

		if (this.levelRestartTimer > 0) {
			this.levelRestartTimer -= dt
			this.partsList.forEach(function (part) {
				let p = part.getPosition()
				p.add(part.dir)
				part.setPosition(p)
				let s = part.getLocalScale()
				s.mulScalar(0.95)
				part.setLocalScale(s)
			})
			this.app.scene.skyboxIntensity -= dt / 2
			this.light.light.intensity -= dt / 2
			if (this.levelRestartTimer <= 0) this.level.loadLevelJson(this.lvl)
		}
		if (this.nextLevelTimer > 0) {
			this.app.scene.skyboxIntensity -= dt / 2
			this.light.light.intensity -= dt / 2
			this.nextLevelTimer -= dt
			if (this.nextLevelTimer <= 0) this.level.nextLevel()

		}


		this.trapTimer += dt
		if (this.trapTimer >= 2) {
			this.trapTimer = 0
			this.trapActive = !this.trapActive

		}

		for (let enemy of this.enemyList) {
			enemy.update(dt)

			if (this.player.isActive && !this.player.isUndead)
				if (this.player.entity.getPosition().distance(enemy.entity.getPosition()) < 1) {
					this.levelRestartTimer = 1;
					this.player.hide()
					this.partsEmit()
				}
		}

		for (let trap of this.level.trapList) {

			if (this.trapTimer == 0) {
				if (this.trapActive) trap.children[0].setLocalPosition(0, 0, 0)
				else trap.children[0].setLocalPosition(0, -0.5, 0)
			}

			if (!this.trapActive) continue

			if (this.player.isActive && !this.player.isUndead)
				if (this.player.entity.getPosition().distance(trap.getPosition()) < 1) {
					this.levelRestartTimer = 1;
					this.player.hide()
					this.partsEmit()

				}
		}

		let nCoins = 0
		for (let coin of this.level.coinList) {
			if (this.player.entity.getPosition().distance(coin.getPosition()) < 1) coin.enabled = false
			if (!coin.enabled) nCoins++

		}
		if (nCoins == this.level.coinList.length && this.nextLevelTimer < 0) this.nextLevelTimer = 1


	}
	swap(old) {
	}
	onMouseClick(e) {

		// this.control.onMouseClick(event)
		if (e.buttons[2]) {
			this.app.mouse.disablePointerLock()
			return
		}
		if (this.app.xr.active) return

		if (pc.Mouse.isPointerLocked())

			this.control.onMouseClick(e)

	}
	onMouseUp(e) {

		if (this.app.xr.active) return
		if (!pc.Mouse.isPointerLocked())
			setTimeout(function (self) {
				self.app.mouse.enablePointerLock()
			}, 10, this)



	}
	onMouseMove(e) {
		if (this.app.xr.active) return



		if (pc.Mouse.isPointerLocked()) {

			this.eulers.y -= this.lookSpeed * e.dx;
			this.eulers.x -= this.lookSpeed * e.dy;
		}
	}
	onVrAction(e) {
		//log("act", e)
		this.control.onMouseClick(e)

	}
	partsEmit() {
		let pos = new pc.Vec3()
		for (const part of this.partsList) {
			pos.copy(this.player.entity.getPosition())
			let dir = this.player.playerMoveDir.clone()
			dir.mulScalar(0.5)
			pos.add(dir)
			dir.x = 1 - Math.random() * 2
			dir.y = 1 - Math.random() * 2
			dir.z = 1 - Math.random() * 2
			dir.normalize()
			dir.mulScalar(0.5)
			pos.add(dir)

			part.setPosition(pos)
			part.setLocalScale(0.3, 0.3, 0.3)
			dir.normalize()
			dir.mulScalar(0.05)
			part.dir = dir
			part.enabled = true


		}
	}
	createLights() {
		let lightEntity = new pc.Entity("Light")
		this.light = lightEntity.addComponent("light",
			{
				type: 'directional',
				shadowUpdateMode: pc.SHADOWUPDATE_THISFRAME,
				shadowType: pc.SHADOW_PCF3,
				shadowResolution: 2024,
				isStatic: true,
				castShadows: false,
				shadowBias: 0.3,
				"vsmBias": 0.01,
				"vsmBlurMode": 1,

				normalOffsetBias: 0.05,
				shadowIntensity: 0.4,

				//color: new pc.Color(0.8, 0, 0)
				color: new pc.Color().fromString("#ffffff")

			})

		this.app.root.addChild(lightEntity)
		lightEntity.setEulerAngles(-30, 150, 0)

		let c = new pc.Color()
		let lightEntity2 = new pc.Entity("Light")
		this.light2 = lightEntity2.addComponent("light",
			{
				type: 'directional',
				isStatic: true,
				castShadows: false,
				color: new pc.Color().fromString("#6388cc"),
				intensity: 1

			})
		this.app.root.addChild(lightEntity2)

		lightEntity2.setEulerAngles(-90, -80, 0)


	}
	createSky() {

		const canvas = document.createElement('canvas');
		canvas.width = 100
		canvas.height = 100
		let ctx = canvas.getContext("2d")

		const gradient = ctx.createLinearGradient(0, 0, 0, 100);

		gradient.addColorStop(.2, "#5eb4df");
		gradient.addColorStop(0.6, "#ccdee9");
		gradient.addColorStop(0.8, "#662dc2");

		ctx.fillStyle = gradient;
		ctx.fillRect(0, 0, 100, 100);

		const texture = new pc.Texture(this.app.graphicsDevice, {
			minFilter: pc.FILTER_LINEAR,
			magFilter: pc.FILTER_LINEAR,
			addressU: pc.ADDRESS_CLAMP_TO_EDGE,
			addressV: pc.ADDRESS_CLAMP_TO_EDGE,

		});



		texture.setSource(canvas);


		var textureCube = new pc.Texture(this.app.graphicsDevice, {
			cubemap: true,
			width: 1024,
			height: 1024,

		});

		var textureAtlas = new pc.Texture(this.app.graphicsDevice, {
			width: 1024,
			height: 1024
		});

		pc.reprojectTexture(texture, textureCube, {})
		this.app.scene.skybox = textureCube


		this.app.scene.ambientLight.fromString("#5b5e51")

		pc.EnvLighting.generateAtlas(textureCube, { target: textureAtlas })

		//this.app.scene.envAtlas = textureAtlas;



	}

}