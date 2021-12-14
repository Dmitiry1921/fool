'use strict';

const assert = require('assert');

const Fool = require('../classes/Fool');

function getTestData(round, step) {
	return require(`./data/rounds/${round}/${step}`);
}

function loadGame(data) {
	return Fool.load(data.before);
}

// show diff
// assert.deepStrictEqual(testData.after, testData.before);

describe('Testing Fool with 36 card and 3 Players', () => {
	beforeEach(() => {
		const game = new Fool(['Player1', 'Player2', 'Player3'], 36);
		game._debug = false;
		game.log();
	});
	afterEach(() => {

	});
	describe('Round #1', () => {
		it('#0', () => {
			const testData = getTestData(0, 0);
			const game = loadGame(testData);
			game[testData.command](...testData.args);
			game._debug = true;
			game.log();
			assert.deepStrictEqual(game, Fool.load(testData.after));
		});
		it('#1', () => {
			const testData = getTestData(0, 1);
			const game = loadGame(testData);
			game[testData.command](...testData.args);
			assert.deepStrictEqual(game, Fool.load(testData.after));
		});
		it('#2', () => {
			const testData = getTestData(0, 2);
			const game = loadGame(testData);
			game[testData.command](...testData.args);
			assert.deepStrictEqual(game, Fool.load(testData.after));
		});
		it('#3', () => {
			const testData = getTestData(0, 3);
			const game = loadGame(testData);
			game[testData.command](...testData.args);
			assert.deepStrictEqual(game, Fool.load(testData.after));
		});
		it('#4', () => {
			const testData = getTestData(0, 4);
			const game = loadGame(testData);
			game[testData.command](...testData.args);
			assert.deepStrictEqual(game, Fool.load(testData.after));
		});
		it('#5', () => {
			const testData = getTestData(0, 5);
			const game = loadGame(testData);
			game[testData.command](...testData.args);
			assert.deepStrictEqual(game, Fool.load(testData.after));
		});
		it('#6', () => {
			const testData = getTestData(0, 6);
			const game = loadGame(testData);
			game[testData.command](...testData.args);
			assert.deepStrictEqual(game, Fool.load(testData.after));
		});
		it('#7', () => {
			const testData = getTestData(0, 7);
			const game = loadGame(testData);
			game[testData.command](...testData.args);
			assert.deepStrictEqual(game, Fool.load(testData.after));
		});
		it('#8', () => {
			const testData = getTestData(0, 8);
			const game = loadGame(testData);
			game[testData.command](...testData.args);
			assert.deepStrictEqual(game, Fool.load(testData.after));
		});
		it('#9', () => {
			const testData = getTestData(0, 9);
			const game = loadGame(testData);
			game[testData.command](...testData.args);
			assert.deepStrictEqual(game, Fool.load(testData.after));
		});
		it('#10', () => {
			const testData = getTestData(0, 10);
			const game = loadGame(testData);
			game[testData.command](...testData.args);
			assert.deepStrictEqual(game, Fool.load(testData.after));
		});
		it('#11', () => {
			const testData = getTestData(0, 11);
			const game = loadGame(testData);
			game[testData.command](...testData.args);
			assert.deepStrictEqual(game, Fool.load(testData.after));
		});
		it('#12', () => {
			const testData = getTestData(0, 12);
			const game = loadGame(testData);
			game[testData.command](...testData.args);
			assert.deepStrictEqual(game, Fool.load(testData.after));
		});
		it('#13', () => {
			const testData = getTestData(0, 13);
			const game = loadGame(testData);
			game[testData.command](...testData.args);
			assert.deepStrictEqual(game, Fool.load(testData.after));
		});
		it('#14', () => {
			const testData = getTestData(0, 14);
			const game = loadGame(testData);
			game[testData.command](...testData.args);
			assert.deepStrictEqual(game, Fool.load(testData.after));
		});
		it('#15', () => {
			const testData = getTestData(0, 15);
			const game = loadGame(testData);
			game[testData.command](...testData.args);
			assert.deepStrictEqual(game, Fool.load(testData.after));
		});
		it('#16', () => {
			const testData = getTestData(0, 16);
			const game = loadGame(testData);
			game[testData.command](...testData.args);
			assert.deepStrictEqual(game, Fool.load(testData.after));
		});
		it('#17', () => {
			const testData = getTestData(0, 17);
			const game = loadGame(testData);
			game[testData.command](...testData.args);
			assert.deepStrictEqual(game, Fool.load(testData.after));
			game.log();
		});
		it('#18', () => {
			const testData = getTestData(0, 18);
			const game = loadGame(testData);
			game[testData.command](...testData.args);
			assert.deepStrictEqual(game, Fool.load(testData.after));
		});
		it('#19', () => {
			const testData = getTestData(0, 19);
			const game = loadGame(testData);
			game[testData.command](...testData.args);
			assert.deepStrictEqual(game, Fool.load(testData.after));
		});
		it('#20', () => {
			const testData = getTestData(0, 20);
			const game = loadGame(testData);
			game[testData.command](...testData.args);
			assert.deepStrictEqual(game, Fool.load(testData.after));
		});
		it('#21', () => {
			const testData = getTestData(0, 21);
			const game = loadGame(testData);
			game[testData.command](...testData.args);
			assert.deepStrictEqual(game, Fool.load(testData.after));
		});
		it('#22', () => {
			const testData = getTestData(0, 22);
			const game = loadGame(testData);
			game[testData.command](...testData.args);
			assert.deepStrictEqual(game, Fool.load(testData.after));
		});
		it('#23', () => {
			const testData = getTestData(0, 23);
			const game = loadGame(testData);
			game[testData.command](...testData.args);
			assert.deepStrictEqual(game, Fool.load(testData.after));
		});
		it('#24', () => {
			const testData = getTestData(0, 24);
			const game = loadGame(testData);
			game[testData.command](...testData.args);
			assert.deepStrictEqual(game, Fool.load(testData.after));
		});
		it('#25', () => {
			const testData = getTestData(0, 25);
			const game = loadGame(testData);
			game[testData.command](...testData.args);
			assert.deepStrictEqual(game, Fool.load(testData.after));
		});
		it('#26', () => {
			const testData = getTestData(0, 26);
			const game = loadGame(testData);
			game[testData.command](...testData.args);
			game._debug = true;
			game.log();
			assert.deepStrictEqual(game, Fool.load(testData.after));
			assert.deepStrictEqual(testData.after, testData.before);
		});
		// it('#<>', () => {
		// 	const testData = getTestData(0, 12);
		// 	const game = loadGame(testData);
		// 	game[testData.command](...testData.args);
		// 	game._debug = true;
		// 	game.log();
		// 	assert.deepStrictEqual(game, Fool.load(testData.after));
		// 	assert.deepStrictEqual(testData.after, testData.before);
		// });
	});
});
