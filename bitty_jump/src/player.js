import Game from "./game.js";
export default class Player {
	/**@type {pc.Entity} */   entity
	/**@type {pc.Entity} */   body
	/**@type {pc.AppBase} */  app
	/**@type {Game} */  g

	/** @type {Boolean}*/     isMove = false;
	/** @type {number}*/      speed = 15;
	/** @type {pc.Vec3}*/     playerMoveDir = new pc.Vec3(-1, 0, 0);
	/** @type {pc.Vec3}*/     camDir = new pc.Vec3(0, 0, 1);
	/** @type {pc.Vec3}*/     endPos = new pc.Vec3();
	/** @type {pc.Vec3}*/     playerPos = new pc.Vec3();  // !!!!
	stopTimer = 0
	scale1 = pc.Vec3.o

	isActive = true
	isUndead = false

	constructor(entity, app, game) {
		this.entity = entity
		this.app = app
		this.g = game

	}
	update(dt) {

		if (this.stopTimer > 0) {
			let s = this.body.getLocalScale()
			this.moveVecTowards(s, pc.Vec3.ONE, dt * 2)
			this.body.setLocalScale(s)

			let p = this.body.getLocalPosition()
			this.moveVecTowards(p, pc.Vec3.ZERO, dt * 0.7)
			this.body.setLocalPosition(p)



		}
		if (this.isMove && this.isActive) {
			this.playerPos = this.entity.getPosition()

			this.moveVecTowards(this.playerPos, this.endPos, this.speed * dt)
			this.entity.setPosition(this.playerPos)
			if (this.playerPos.equals(this.endPos)) {
				this.isMove = false
				this.g.control.showArrows()
				this.orient(true)

			}
		}
	}
	move(dir, endPos) {
		this.playerMoveDir.copy(dir)
		this.endPos.copy(endPos)
		this.isMove = true
		this.orient()
	}
	/** @param{pc.Vec3} current
		 @param{pc.Vec3} target
		 @param{number} maxDistanceDelta*/
	moveVecTowards(current, target, maxDistanceDelta) {
		let toVector_x = target.x - current.x;
		let toVector_y = target.y - current.y;
		let toVector_z = target.z - current.z;

		let sqDist = toVector_x * toVector_x + toVector_y * toVector_y + toVector_z * toVector_z;
		if (sqDist == 0 || (maxDistanceDelta >= 0 && sqDist <= maxDistanceDelta * maxDistanceDelta)) {
			current.copy(target)
			return;
		}

		let dist = Math.sqrt(sqDist);

		current.x += toVector_x / dist * maxDistanceDelta
		current.y += toVector_y / dist * maxDistanceDelta
		current.z += toVector_z / dist * maxDistanceDelta
	}
	hide() {
		this.isMove = false
		this.isActive = false
		this.entity.enabled = false
		this.g.control.hideArrows()

	}
	reset() {
		this.isMove = false
		this.isActive = true
		this.playerMoveDir.set(-1, 0, 0)
		this.body = this.entity.children[0]


	}
	orient(isStop = false) {
		let pos = this.entity.getPosition()
		let dir = this.playerMoveDir
		if (dir.x != 0 && pos.z < 0) this.camDir.set(0, 0, 1)
		if (dir.x != 0 && pos.z > 0) this.camDir.set(0, 0, -1)

		if (dir.z != 0 && pos.x < 0) this.camDir.set(1, 0, 0)
		if (dir.z != 0 && pos.x > 0) this.camDir.set(-1, 0, 0)

		let tpos = pos.clone()
		if (isStop) tpos.sub(dir)
		else tpos.add(dir)

		this.entity.lookAt(tpos, this.camDir)

		if (!isStop) this.body.setLocalScale(0.8, 0.8, 1.4)
		else {
			this.body.setLocalScale(1.2, 1.2, 0.8)
			this.body.setLocalPosition(0, 0, 0.1)
			this.stopTimer = 0.5
		}

	}

}

