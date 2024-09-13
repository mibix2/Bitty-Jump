
//import zipPack from "vite-plugin-zip-pack";

export default {
	// config options
	base: './',
	assetsDir: "static",
	//pulicDir: './asset',
	build: {
		assetsDir: "./",
		//outDir: "./../backend/src/main/resources/static/app/",
	},
	server: {
		host: '127.0.0.1',
		port: 5500,
	},
	// plugins: [zipPack()],

}

