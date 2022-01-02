const {v4: uuidv4} = require('uuid');
const Message = require('./Message');

class Client {
	constructor(webSocket) {
		this._id = `Client:${uuidv4()}`;
		this._socket = webSocket;
		this._room = undefined;
		this._socket._id = this._id;
	}

	get id() {
		return this._id;
	}

	get socket() {
		return this._socket;
	}

	get room() {
		return this._room;
	}

	setRoom(roomId) {
		return this._room = roomId;
	}

	/**
	 * Отправить сообщение данному клиенту.
	 * @param message
	 */
	send(message) {
		if(!(message instanceof Message)){
			throw new Error('SHOULD_BE_MESSAGE');
		}
		this.socket.send(JSON.stringify(message));
	}

	getPublicInfo() {
		return {
			id: this.id,
		}
	}
}

module.exports = Client;
