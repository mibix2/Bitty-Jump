import Game from "../game.js";
import Xr from "./xr.js";
var log = console.log
export default class Controller {
	entity = null
	app = null
	list

	constructor(entity, app, list) {
		this.list = list
		this.entity = entity
		this.app = app
		log("controller init")

		this.vecA = new pc.Vec3();
		this.color = new pc.Color(1, 1, 1);
		this.color2 = new pc.Color(0.2, 0.8, 0.8);

		this.hoverEntity = null;

		//this.model = this.entity.findByName('model');
		this.model = this.entity.children[0]

		this.n = Xr.controllerRayList.length
		Xr.controllerRayList.push(new pc.Ray())
		this.selectDeleayTimer = 0
	};

	setInputSource(inputSource) {
		log(inputSource)

		this.inputSource = inputSource;
		this.inputSource.once('remove', this.onRemove, this);

	};

	onRemove() {
		log("remove")
		this.entity.destroy();
		const index = this.list.indexOf(this);
		if (index > -1) { // only splice array when item is found
			this.list.splice(index, 1); // 2nd parameter means remove one item only
		}
	};

	update(dt) {
		// ray line
		Xr.controllerRayList[this.n].origin.copy(this.inputSource.getOrigin())
		Xr.controllerRayList[this.n].direction.copy(this.inputSource.getDirection())
		if (this.selectDeleayTimer > 0) this.selectDeleayTimer--
		if (this.inputSource.selecting && this.selectDeleayTimer == 0) {
			this.color.set(0, 1, 0);

			let ray = new pc.Ray(this.inputSource.getOrigin(), this.inputSource.getDirection())
			this.app.fire("vr_action", ray)
			this.selectDeleayTimer = 20

		} else {
			this.color.set(1, 1, 1);
		}
		if (this.inputSource.grip) {
			Game.dot.enabled = false
			this.model.enabled = true;
			this.entity.setPosition(this.inputSource.getPosition());
			this.entity.setRotation(this.inputSource.getRotation());

			this.vecA.copy(this.inputSource.getDirection());
			this.vecA.scale(1000).add(this.inputSource.getOrigin());

			// debug ray
			this.app.renderLine(this.inputSource.getOrigin(), this.vecA, this.color);

		} else {
			this.model.enabled = false;
		}
	}
}