'use strict';

const START_COMMAND = '/';
const [, , ...players] = process.argv;
const Card = require('./classes/Card');

process.stdin.resume();
process.stdin.setEncoding('utf-8');


const commands = {
	'help': {
		description: `Отображает доступные команды игры`,
		example: '\x1b[32m/help\x1b[0m'
	},
	// Ход. Перечисляет какими картами ходит.
	'attack': {
		description: `Пойти с перечисленных карт`,
		example: '\x1b[32m/attack \x1b[34mC:10 C:6 C:A\x1b[0m'
	},
	// Бью. Перечисляет карты которыми собирается бить
	'hit': {
		description: `Отбиться перечисленными картами`,
		example: '\x1b[32m/hit \x1b[34mD:A D:7 S:A\x1b[0m'
	},
	// Пропуск. (не чем бить или тактический ход)
	'pass': {
		description: `Пропуск хода, забрать карты с кона`,
		example: '\x1b[32m/pass\x1b[0m'
	},
	// Отображается вся игровая информация о текущей игре.
	'debug': {
		description: `Для разработчиков`,
		example: '\x1b[32m/debug\x1b[0m'
	},
};
const errors = {
	WRONG_SUIT_TYPE_CARD: `Неверно передана масть карты. Доступны: ${Object.keys(Card.suits)}`,
	ATTACK_NO_CARD: `Передайте карты в формате: ${commands.attack.example}`,
	ATTACK_SUIT_NOT_EQUALS: `В свой ход можно пойти только картами одной масти`,
	ATTACK_CARD_NOT_IN_HAND: `Указанной карты нет в вашей руке`,
	ATTACK_UNAVAILABLE: `Используйте команду \x1b[32m/hit\x1b[33m чтобы отбится или \x1b[32m/pass\x1b[33m чтобы пропустить ход\x1b[0m`,
	ATTACK_PROTECTION_PLAYER_HAVE_LESS_CARD: 'Нельзя атаковать большим кол-вом карт чем есть у защищающегося игрока в руке',
	HIT_UNAVAILABLE: 'Используйте команду \x1b[32m/attack\x1b[33m чтобы сделать свой ход',
	HIT_NO_CARD: 'Положите карты которыми хотите побить карты на поле.',
	HIT_CARD_COUNT_NOT_EQUAL_FIELD_COUNT: 'Кол-во переданных карт не равно кол-ву карт на поле',
	HIT_CANT_FIGHT: 'Переданными картами нельзя побить карты на поле.',
	HIT_CARD_NOT_IN_HAND: `Указанной карты нет в вашей руке`,
	THROW_UNAVAILABLE: ``,
	THROW_ALL_ATTACK_CARDS_SHOULD_BE_PROTECTION: ``, //Все карты на поле должны быть побиты.
	THROW_UNAVAILABLE_VALUE_CARD: ``, //Нельзя подкинуть карту значение которой нет на поле.
	THROW_MAX_ALLOWABLE_CARDS_ON_FILED: ``, // Чисто подкидываемых карт и карт на столе не может превышать 6 в первый ход вообще 5.
};

// process.stdin.on('end', _ => {
// 	inputString = inputString.trim().split('\n').map(string => {
// 		return string.trim();
// 	});
// 	console.log('end: ', inputStdin);
// });

// console.log({players})

const Fool = require('./classes/Fool');

const game = new Fool(players);

function showView() {
	console.clear();
	console.log('\x1b[34mХод: \x1b[0m', game.currentPlayer.name);
	console.log('\x1b[34mКозырь: \x1b[0m', game.deck.trump);
	console.log('\x1b[34mКарты на столе: \x1b[0m', game.field.attack.map(card => card.toString()));
	console.log('\x1b[34mКарты в руке: \x1b[0m', game.currentPlayer.hand.sort(Card.sortBySeniority()).map(card => card.toString()));
	console.log('Чтобы сделать ход: \x1b[32m/attack \x1b[34m<Card> <Card> ...')

	console.log('\x1b[0m') //Color - reset;
}

function showHelp(keys = Object.keys(commands)) {
	keys.forEach(key => {
		console.log(`${`\x1b[32m/${key}\x1b[0m`.padEnd(18)}${` - ${commands[key].description}.`.padEnd(40)}\x1b[33m Пример: ${commands[key].example}\x1b[0m`);
	})
}

process.stdin.on('data', inputStdin => {
	const comKeys = Object.keys(commands);
	try {
		const executed = comKeys.some((command, i) => {
			const fullComm = `${START_COMMAND}${command}`;
			if (!inputStdin.startsWith(fullComm)) {
				return false;
			}
			// Отрезаем из строки команду и достаём только переданные аргументы.
			const data = inputStdin
				.replace(`${fullComm} `, '')
				.replace('\n', '')
				.split(' ')
				.filter(Boolean)
				.map(val => val.toString().toUpperCase());
			switch (command) {
				case 'help':
					showHelp(Object.keys(commands));
					break;
				case 'attack':
				case 'hit':
				case 'pass':
					game[command](data);
					break;
				case 'debug':
					console.log(game.debug());
					break;
			}
			showView();
			return true;
		});

		if (!executed) {
			showView();
			console.log('\x1b[31mERROR:\x1b[33m Неизвестная команда. Используйте \x1b[32m/help \x1b[33mдля помощи\x1b[0m');
		}
	} catch (err) {
		if (errors[err.message]) {
			showView();
			console.log(`\x1b[31mERROR:\x1b[33m ${errors[err.message]}\x1b[0m`);
			return false;
		} else {
			console.log(err);
		}
	}
	// process.exit(0);
});

showView();
