'use strict';

const { WebSocketServer } = require('ws');
const gameServer = require('./classes/GameServer');
const Client = require('./classes/Client');

const wss = new WebSocketServer({port: 5000});
const clients = new Map();

wss.on('connection', (ws) => {
    const client = new Client(ws);
    clients.set(client.id, client);
    console.log('Connection: ', client.id);
    gameServer.addClient(client)
    ws.on('message',  (data) => {
        let message;
        try {
            message = JSON.parse(data);
        } catch(err) {
            console.error('CANT_PARSE_MESSAGE', err)
        }
        gameServer.onMessage(client, message);
    });
    ws.on('close',  (code) => {
        clients.delete(client.id);
        gameServer.removeClient(client);
    });
});

process.on('uncaughtException', (err) => {
    console.error('uncaughtException', err);
    process.exit(1);
});

process.on('unhandledRejection', (err) => {
    console.error('unhandledRejection', err);
    process.exit(1);
});
