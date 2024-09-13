var log = console.log
import Xr from "./xr/xr.js";
import Level from "./level.js";
import Game from "./game.js";
export default class Control {
	/** @type {pc.AppBase}*/    app;
	/** @type {Game}*/          g;

	/** @type {pc.Entity}*/     cameraEntity;

	/** @type {pc.Vec3}*/       hitPosition = new pc.Vec3();
	/** @type {pc.Ray}*/        ray = new pc.Ray();
	/** @type {[Arrow]}*/       arrowList = []
	/** @type {Arrow}*/         activeArrow
	/** @type {pc.Entity}*/     arrowBase;
	/** @type {[Button]}*/      buttonList = []
	/** @type {Button}*/        activeBtn
	/** @type {pc.StandardMaterial}*/        arrowMat


	debugColor = new pc.Color(1, 1, 1, 0.2)
	debugColorActive = new pc.Color(1, 1, 1, 1)

	rndID = Math.random()

	constructor(app, game) {
		// init
		this.app = app
		this.g = game

		this.cameraEntity = this.app.root.findByName("Camera")




		// control arrows


		let arrowBase = new pc.Entity()
		app.root.addChild(arrowBase)
		this.arrowList.push(new Arrow(new pc.Vec3(1, 0, 0), arrowBase))
		this.arrowList.push(new Arrow(new pc.Vec3(-1, 0, 0), arrowBase))
		this.arrowList.push(new Arrow(new pc.Vec3(0, 1, 0), arrowBase))
		this.arrowList.push(new Arrow(new pc.Vec3(0, -1, 0), arrowBase))
		this.arrowList.push(new Arrow(new pc.Vec3(0, 0, 1), arrowBase))
		this.arrowList.push(new Arrow(new pc.Vec3(0, 0, -1), arrowBase))
		this.arrowBase = arrowBase


		let btnReset = new pc.Entity("BtnRestart")
		btnReset.tags.add("vrButton")


		let m = new pc.StandardMaterial()
		m.diffuseMap = this.g.level.resetBtnTexture

		btnReset.addComponent("render", {
			type: "plane", material: m, castShadows: false
		})
		this.app.root.addChild(btnReset)
		btnReset.setPosition(0, -0.35, -5)

		this.createButtons()


		m = new pc.StandardMaterial()
		m.diffuseMap = this.g.level.titleTexture
		m.alphaTest = 0
		m.opacity = 0.5

		let title = new pc.Entity("Title")
		title.addComponent("render", {
			type: "plane", material: m, castShadows: false
		})
		this.app.root.addChild(title)
		title.setPosition(0, -0.45, -4.6)
		title.setLocalScale(4, 0, 4)


	}
	update(dt) {
		//
		let activeArrow = null
		let activeBtn = null

		this.ray.origin.copy(this.cameraEntity.getPosition())
		this.ray.direction.copy(this.cameraEntity.forward)

		if (this.app.xr.active && Xr.controllerRayList.length > 0) {
			this.ray.copy(Xr.controllerRayList[0])
		}

		for (let arrow of this.arrowList) {
			if (!arrow.isVisible) continue
			arrow.isActive = false

			if (arrow.aabb.intersectsRay(this.ray)) {
				if (!activeArrow) activeArrow = arrow
				let d1 = activeArrow.aabb.center.distance(this.cameraEntity.getPosition())
				let d2 = arrow.aabb.center.distance(this.cameraEntity.getPosition())
				if (d2 < d1) activeArrow = arrow
			}
		}

		if (activeArrow) activeArrow.isActive = true
		this.activeArrow = activeArrow

		// btns
		for (let btn of this.buttonList) {
			btn.isActive = false
			if (btn.aabb.intersectsRay(this.ray)) activeBtn = btn

		}
		if (activeBtn) { activeBtn.isActive = true }
		this.activeBtn = activeBtn

		// update arrows
		for (let arrow of this.arrowList) {
			arrow.repos(this.g.player.entity.getPosition())
			if (!arrow.isVisible) continue
			if (arrow.isActive) {
				arrow.mat.opacity = 1
				arrow.mat.emissiveIntensity = 1
				arrow.mat.update()
				//this.app.drawWireAlignedBox(arrow.aabb.getMin(), arrow.aabb.getMax(), this.debugColorActive)
			}
			else {
				arrow.mat.opacity = 0.3
				arrow.mat.emissiveIntensity = 0

				arrow.mat.update()

				//this.app.drawWireAlignedBox(arrow.aabb.getMin(), arrow.aabb.getMax(), this.debugColor)
			}
		}

		// update buttons
		for (let btn of this.buttonList) {
			if (btn.isActive) btn.entity.setLocalScale(1.1, 1.1, 1.1)
			else btn.entity.setLocalScale(1, 1, 1)
		}

	}

	showArrows() {
		this.arrowBase.setPosition(this.g.player.entity.getPosition())

		this.arrowList.forEach(arrow => {
			let playerPos = this.g.player.entity.getPosition()
			let ray = new pc.Ray(playerPos, arrow.dir)
			let p = new pc.Vec3()

			if (this.g.level.rayCast(ray, p))
				p.sub(playerPos)
			else p = ray.direction

			if (p.length() > 0.5) arrow.isVisible = true
			else arrow.isVisible = false

			if (Math.abs(playerPos.x) < 7.5 && arrow.dir.z != 0) arrow.isVisible = false
			if (Math.abs(playerPos.z) < 7.5 && arrow.dir.x != 0) arrow.isVisible = false

		}, this)

	}
	hideArrows() {
		this.arrowList.forEach(arrow => { arrow.isVisible = false })
	}
	onMouseClick(event) {  // rename -> onClick  | onAction
		if (this.activeArrow && !this.g.player.isMove) {

			let dir = new pc.Vec3().copy(this.activeArrow.dir)
			let ray = new pc.Ray(this.g.player.entity.getPosition(), dir)
			let p = new pc.Vec3()
			let d = dir.clone()
			if (this.g.level.rayCast(ray, p)) {
				d.mulScalar(0.5)
				p.sub(d)
			}
			else {
				p.copy(this.g.player.entity.getPosition())
				d.mulScalar(50)
				p.add(d)
			}
			//log(dir, p)
			this.g.player.move(dir, p)
			this.hideArrows()
		}
		if (this.activeBtn) {
			if (this.activeBtn.entity.name == "BtnRestart") this.g.level.loadLevelJson(this.g.lvl)

		}
	}
	onMouseMove(event) {

	}
	createButtons() {
		this.buttonList = []
		let btns = this.app.root.findByTag("vrButton")
		for (let btn of btns) {
			this.buttonList.push(new Button(btn))
		}
		//log("buttons", this.buttonList)
	}

	rayCastButtons(ray) {
		for (let button of this.buttonList) {
			if (button.aabb.intersectsRay(ray)) {
				log("button hit")
			}
		}
	}

}
var Arrow = class {
	dir = new pc.Vec3()
	_isVisible = true

	isActive = false
	aabb = new pc.BoundingBox()
	/** @type {pc.Entity}*/
	entity = null
	/** @type {pc.StandardMaterial}*/
	mat = null

	set isVisible(value) {
		this._isVisible = value
		this.entity.enabled = value

	}
	get isVisible() {
		return this._isVisible
	}

	/** @param{pc.Vec3}dir 
		 @param{pc.Entity}arrowBase
		 
		 @param{pc.StandardMaterial}mat
		 
		  */

	constructor(dir, arrowBase) {
		let aabb = this.aabb
		aabb.halfExtents.set(0.8, 0.8, 0.8)
		this.dir.copy(dir)
		if (dir.x != 0) aabb.halfExtents.x = 2
		if (dir.y != 0) aabb.halfExtents.y = 2
		if (dir.z != 0) aabb.halfExtents.z = 2

		let a = new pc.Entity()
		a.addComponent("render", { type: 'cone' })

		arrowBase.addChild(a)

		let r = new pc.Vec3()
		r.set(dir.z * 90, 0, dir.y < 0 ? 180 : -dir.x * 90)
		a.rotate(r)

		dir.mulScalar(1.2)
		a.setLocalPosition(dir)
		a.setLocalScale(0.5, 1, 0.5)

		this.entity = a

		let mat = new pc.StandardMaterial()
		mat.diffuse.set(0, 0.5, 0)
		mat.emissive.set(0.4, 1, 0.4)
		mat.emissiveIntensity = 0
		mat.update()
		a.render.material = mat
		a.render.castShadows = false
		a.render.receiveShadows = false
		mat.opacity = 0.3
		mat.blendType = pc.BLEND_NORMAL

		mat.update()
		this.mat = mat

	}
	/**@param{pc.Vec3}pos */
	repos(pos) {
		let v = new pc.Vec3()
		v.copy(this.dir)
		v.mulScalar(2.5)
		pos.add(v)
		this.aabb.center.copy(pos)

	}

}

var Button = class Button {
	isActive = false
	aabb = new pc.BoundingBox()
	entity

	/**@param {pc.Entity} entity */
	constructor(entity) {
		this.entity = entity
		this.aabb.copy(entity.render.meshInstances[0].aabb)
	}


}