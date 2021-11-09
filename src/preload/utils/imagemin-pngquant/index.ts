
import ow from 'ow';
import isPng from 'is-png';
import execa from 'execa';
import { isStream } from 'is-stream';
import { Options } from './types';

/**
 * imagemin插件，压缩png
 * @param options
 * @returns
 */
export const imageminPngquant = (options: Options = {}) => (input: Buffer) => {
	const isBuffer = Buffer.isBuffer(input);

  let pngquant = require('pngquant-bin');

	if (!isBuffer && !isStream(input)) {
		return Promise.reject(new TypeError(`Expected a Buffer or Stream, got ${typeof input}`));
	}

	if (isBuffer && !isPng(input)) {
		return Promise.resolve(input);
	}

	if (typeof options.getPngquantPath !== 'undefined') {
		if (typeof options.getPngquantPath === 'string' ) {
			pngquant = options.getPngquantPath;
		} else {
			ow(options.getPngquantPath, ow.function);

			pngquant = options.getPngquantPath(pngquant);
		}
	}

	const args = ['-'];

	if (typeof options.speed !== 'undefined') {
		ow(options.speed, ow.number.integer.inRange(1, 11));
		args.push('--speed', options.speed + '');
	}

	if (typeof options.strip !== 'undefined') {
		ow(options.strip, ow.boolean);
		args.push('--strip');
	}

	if (typeof options.quality !== 'undefined') {
		ow(options.quality, ow.array.length(2).ofType(ow.number.inRange(0, 1)));
		const [min, max] = options.quality;
		args.push('--quality', `${Math.round(min * 100)}-${Math.round(max * 100)}`);
	}

	if (typeof options.dithering !== 'undefined') {
		ow(options.dithering, ow.any(ow.number.inRange(0, 1), ow.boolean.false));

		if (typeof options.dithering === 'number') {
			args.push(`--floyd=${options.dithering}`);
		} else if (options.dithering === false) {
			args.push('--ordered');
		}
	}

	if (typeof options.posterize !== 'undefined') {
		ow(options.posterize, ow.number);
		args.push('--posterize', options.posterize + '');
	}

	if (typeof options.verbose !== 'undefined') {
		ow(options.verbose, ow.boolean);
		args.push('--verbose');
	}

	const subprocess = execa(pngquant, args, {
		encoding: null,
		maxBuffer: Infinity,
		input
	});

	const promise = subprocess
		.then(result => result.stdout)
		.catch(error => {
			if (error.code === 99) {
				return input;
			}

			error.message = error.stderr || error.message;
			throw error;
		});

  // @ts-ignore
	subprocess.stdout.then = promise.then.bind(promise);
	// @ts-ignore
  subprocess.stdout.catch = promise.catch.bind(promise);

	return subprocess.stdout;
};

export default imageminPngquant;
