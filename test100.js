'use strict';

const Fool = require('./classes/Fool');

const arr = [];
for (let i = 0; i < 100; i++) {
	arr.push(new Fool(['Player1', 'Player2', 'Player3']))
}

console.log(JSON.stringify(arr));
