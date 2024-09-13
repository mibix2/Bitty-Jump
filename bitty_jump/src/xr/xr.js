var log = console.log
import Game from "../game.js"

export default class Xr {
	/** @type {pc.AppBase} */ 	app
	/** @type {Game}  */  		game

	static controllerRayList = []
	constructor(app, game) {
		this.game = game
		this.app = app
		//this.buttonVr = this.app.root.findByName("Button VR")
		this.buttonVr = this.app.root.findByName("Button VR2")
		this.cameraEntity = this.app.root.findByName("Camera")

		this.app.xr.start(this.cameraEntity.camera, pc.XRTYPE_VR, pc.XRSPACE_LOCALFLOOR);

		this.buttonVr.button.active = this.app.xr.supported && this.app.xr.isAvailable(pc.XRTYPE_VR);

		// click button
		this.buttonVr.element.on('click', function (e) {
			e.stopPropagation();
			// check support
			log("--", this.app.xr.isAvailable(pc.XRTYPE_VR))

			if (this.app.xr.isAvailable(pc.XRTYPE_VR)) {
				// ask for motion permissions if we can
				if (window.DeviceOrientationEvent && window.DeviceOrientationEvent.requestPermission) {
					DeviceOrientationEvent.requestPermission().then(
						function (response) {
							log("response")

							if (response == 'granted') {
								window.addEventListener('deviceorientation', function (e) {
									// start session
									Xr.controllerRayList = []
									this.cameraEntity.camera.startXr(pc.XRTYPE_VR, pc.XRSPACE_LOCAL);
								}.bind(this));
							}
						}.bind(this)).catch(console.error);
				} else {
					// start session
					log("start vr")
					Xr.controllerRayList = []
					//this.cameraEntity.camera.startXr(pc.XRTYPE_VR, pc.XRSPACE_LOCAL);
					this.app.xr.start(this.cameraEntity.camera, pc.XRTYPE_VR, pc.XRSPACE_LOCAL);

				}
			}
		}, this);

		this.app.keyboard.on('keydown', function (evt) {
			if (evt.key === pc.KEY_ESCAPE) {
				this.app.xr.end();
			}
		}, this);

		this.app.xr.on('start', function () {
			console.log("xr start")
			this.buttonVr.enabled = false;

		}, this);

		this.app.xr.on('end', function () {
			this.buttonVr.enabled = true;
			Game.dot.enabled = true
		}, this);

		this.app.xr.on('available', function () {
			this.buttonVr.button.active = this.app.xr.supported && this.app.xr.isAvailable(pc.XRTYPE_VR);
		}, this);
	};
}