<h1 align="center">
<br>
  <img src="https://raw.githubusercontent.com/ReeceM/h-bar/master/docs/clockworks.png" alt="ClockWorks">
  <br>
    <br>
    ClockWorks
  <br>
</h1>

Webworker for managing timers and intervals

[![Latest Version on npm](https://img.shields.io/npm/v/@reecem/clockworks.svg?style=flat-square)](https://www.npmjs.com/package/@reecem/clockworks)
[![Total Downloads](https://img.shields.io/npm/dt/@reecem/clockworks.svg?style=flat-square)](https://www.npmjs.com/package/@reecem/clockworks)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/@reecem/clockworks)


## Installation

You can install the package via npm:

```bash
npm i @reecem/clockworks
```

Or use jsDelivr:
```html
	...
	<script src="https://unpkg.com/@reecem/clockworks?umd"></script>
    ...
```

> If you are customising the styling and overriding it with your own styling then you will also need an instance of your css or a tailwindcss file installed as only the classes needed are packaged with clockworks

## Usage

With ClockWorks you can create a new instance of it and specify an array of timers to install in the worker.

Each timer has a set of define values as an object and a callback. These definitions can be added at when instantiating the class or via the `push`/`pull` methods on the class once it has been created.

### Simple Print to console clock that self terminates

```js
/**
 * Create a new instance of the class and then print the time to the console.
 *
 * We will also remove the clock after 5 seconds, by counting a variable.
 */
let triggers = 0;
let clockWorks = new ClockWorks([
	{
		name: 'clock',
		time: 1000,
		callback: () => {
			console.log((new Date()).toLocaleString())
		}
	},
	{
		name: 'remove-clock',
		time: 1000,
		callback: () => {
			if (++triggers >= 5) {
				$clock.pull('clock')
				$clock.pull('remove-clock')
			}
		}
	}
])
```

The above example will print the time to the terminal, then it will remove itself and the timer printing the time to the console;

### Web Worker

The package installs it's own Web Worker that has been bundled, so there is no need to worry about the specifics of the web worker or it conflicting with other workers that you may have on the webpage. See it here [worker.js](./src/worker.js)

### Timer Definitions

The ClockWorks library takes a standard style of interval or timer definition, this allows it to track them to be able to clear them or add them.

```js

{
	/**
	 * A unique name for the timer being created.
	 *
	 * This name is used to track the timer.
	 */
	name: 'Timer',
	/**
	 * The interval of the timer that should be firing in ms
	 */
	time: 1000,
	/**
	 * The callback function is fired when the timer or interval triggers.
	 */
	callback: () => {
		console.log((new Date()).toLocaleString())
	}
}
```

### Pushing a Single Timer

To add a single timer you will use the instance of the class that you have created and call the `push` method with a timer object.

```js
const clockWorks = new ClockWorks();

clockWorks.push({
	name: 'new-timer',
	time: 5000,
	callback: () => {
		console.log('New interval has fired at [%s]', (new Date()).toLocaleString());
	}
})
```

> ***Important*** An error will be thrown when you try to add a timer with the same name twice to the same instance.

**push** Method
```js
	/**
	 * Add timers to the list.
	 *
	 * @param {Object} timer
	 * @param {String} timer.name
	 * @param {Number} timer.time
	 * @param {Function} timer.callback
	 *
	 * @return {Number} the index of the timer on the stack
	 */
	push(timer)
```

### Removing a Single Timer Instance

To remove a timer, you will use the name that you have defined when pushing it onto the timer stack.

```js
const clockWorks = new ClockWorks();

// timer that has been defined
clockWorks.push({ name: 'new-timer', ... })

/**
 * Removing the timer you will use the name that you assigned the timer.
 */
clockWorks.pull('new-timer');
```

**pull** Method
```js
	/**
	 * Remove timer from the stack
	 *
	 * @param {String} timer this is the timer name
	 */
	pull(timer)
```

## Features

- [x] Installable Web Worker bundled
- [x] Multiple `setIntervals` Definable from the main class on construction
- [x] Individually add or remove a timer
- [ ] Have a fallback to the main page thread
- [ ] Allow defining timeout functions
- [ ] More definitions for the timers
- [ ] Hash IDs for the functions and definitions
- [ ] Improve management of timers.
- [ ] Cross tab session persistance ??

## Testing

PENDING...

## Changelog

Please see [CHANGELOG](CHANGELOG.md) for more information on what has changed recently.

## Contributing

Please see [CONTRIBUTING](CONTRIBUTING.md) for details.

## Security

If you discover any security related issues, please email zsh.rce@gmail.com instead of using the issue tracker. You can also use the [SECURITY](SECURITY.md) doc.

## Credits

- [ReeceM](https://github.com/ReeceM)
- [All Contributors](../../contributors) (Thanks to any who help)

## Support

I enjoy building things and making all manner of programs and helping in open-source projects. If it has been really useful to you and you appreciate it you can leave a star on the repo.

If you have the means, a simple coffee would be also appreciated too.

<a href="https://www.buymeacoffee.com/ReeceM" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height: 41px !important;width: 174px !important;box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;" ></a>

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.
