var cluster = require('cluster');
var os = require('os');

var config = require('./config').config;

var numCPUs = os.cpus().length;

var workers = {};

if (cluster.isMaster) {
	// 主进程
	cluster.on('death', function (worker) {
		delete workers[worker.pid];
		worker = cluster.fork();
		workers[worker.pid] = worker;
	});
	// 利用多核CPU
	for (var i = 0; i < numCPUs; i++) {
		var worker = cluster.fork();
		workers[worker.pid] = worker;
	}
} else {
	// 工作进程分支
	// 通过cluster启动的工作进程可以直接实现端口复用,因此所有工作进程只需监听同一端口
	var app = require('./app');
	app.listen(Number(config.port));

	console.log("MyStars listening on port %d in %s mode", config.port, app.settings.env);
  console.log("God bless love....");
  console.log("You can debug your app with http://" + config.host + ':' + config.port);
}

process.on('SIGTERM', function () {
	for (var pid in workers) {
		process.kill(pid);
	}
	process.exit(0);
});
