export default class Enemy {
	/**@type {pc.Entity} */   entity
	/**@type {pc.AppBase} */  app
	/**@type {Game} */  game

	/** @type {Boolean}*/     isMove = true;
	/** @type {number}*/      speed = 4;
	/** @type {pc.Vec3}*/     startPos = new pc.Vec3();
	/** @type {pc.Vec3}*/     endPos = new pc.Vec3();
	/** @type {pc.Vec3}*/     pos = new pc.Vec3();
	/** @type {pc.Vec3}*/     dir = new pc.Vec3();
	/** @type {pc.Vec3}*/     vel = new pc.Vec3();

	pauseTimer = 0

	constructor(entity, app, game) {
		this.entity = entity
		this.app = app
		this.game = game
		this.startPos.copy(entity.getPosition())
		this.dir.copy(pc.Vec3.DOWN)

		if (this.entity.tags.has("enemy_x")) this.dir.copy(pc.Vec3.RIGHT)
		if (this.entity.tags.has("enemy_z")) this.dir.copy(pc.Vec3.BACK)


		let ray = new pc.Ray(entity.getPosition(), this.dir)
		let p = new pc.Vec3()
		if (game.level.rayCast(ray, p)) {
			this.dir.mulScalar(.5)
			p.sub(this.dir)
			this.endPos.copy(p)
		}


	}
	update(dt) {
		if (this.pauseTimer > 0) {
			this.pauseTimer -= dt
			return
		}
		this.pos = this.entity.getPosition()
		this.moveVecTowards(this.pos, this.endPos, dt * this.speed)
		this.entity.setPosition(this.pos)

		if (this.pos.equals(this.endPos)) {
			let a = this.startPos
			this.startPos = this.endPos
			this.endPos = a

			this.pauseTimer = 0.3
		}

	}
	move(dir, endPos) {

	}
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


}