'use strict';

const WebSocket = require('ws');

const max = 9;
const clients = [];
for (let i = 0; i < max; i++) {
	const ws = new WebSocket('ws://localhost:5000');
	ws.idInFor = i;
	ws.on('open', () => {
		ws.send('something');
	});

	ws.on('message', (data) => {
		console.log('received: %s', data);
	});

	clients.push(ws);
}



