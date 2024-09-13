let log = console.log
import Game from "./game.js"
import Xr from "./xr/xr.js"
import XrControllers from "./xr/controllers.js"


const canvas = document.getElementById('application');
const app = new pc.Application(canvas, { elementInput: new pc.ElementInput(canvas) });
app.setCanvasResolution(pc.RESOLUTION_AUTO);
app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
app.start();
log(app.batcher)


//document.getElementById("application-console").style.visibility = 'hidden'

var game = new Game(app)
app.mouse = new pc.Mouse(document.body);
app.keyboard = new pc.Keyboard(document.body);

app.mouse.disableContextMenu();

app.mouse.on(pc.EVENT_MOUSEMOVE, game.onMouseMove, game);
app.mouse.on(pc.EVENT_MOUSEDOWN, game.onMouseClick, game);
app.mouse.on(pc.EVENT_MOUSEUP, game.onMouseUp, game);
app.on("vr_action", game.onVrAction, game);

let xr = new Xr(app, game)
var xrControllers = new XrControllers(app)



app.on('update', update);
window.addEventListener('resize', () => app.resizeCanvas());

function update(dt) {
	game.update(dt)
	for (let c of xrControllers.controllerList) {
		if (c && app.xr.active) c.update()
	}

	if (app.keyboard.wasPressed(pc.KEY_R)) game.level.loadLevelJson(game.lvl)

}