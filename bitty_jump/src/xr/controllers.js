import Controller from "./controller.js"

export default class XrControllers {
	controllerList = []

	constructor(app) {
		this.app = app
		this.cameraParent = this.app.root.findByName("Camera Offset")
		this.app.xr.input.on('add', this.onAdd, this);
	}
	onAdd(source) {

		//var entity = this.controllerTemplate.resource.instantiate();

		//entity.script.controller.setInputSource(source);

		console.log("add controller")
		let entity = new pc.Entity()
		this.cameraParent.addChild(entity);

		let model = new pc.Entity()

		model.addComponent("render", { type: "box" })
		model.setLocalScale(0.06, 0.06, 0.06)
		model.setEulerAngles(-40, 0, 0)
		entity.addChild(model)


		let controller = new Controller(entity, this.app, this.controllerList);
		controller.setInputSource(source);

		this.controllerList.push(controller)

	}

}