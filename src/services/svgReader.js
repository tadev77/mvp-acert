import * as cheerio from 'cheerio';

const regexp = /\[.+\]/g;

function replaceInSentence(textInput, substitutions) {
	const matches = textInput.matchAll(regexp);
	let key;

	for (const match of matches) {
		key = match[0].slice(1,-1);

		if(substitutions[key] !== undefined) {
			textInput = textInput.replace(match[0], substitutions[key]);
		}
	}

	return textInput;
}

function loopThroughSvg(svg, callback) {
	const $ = cheerio.load(svg, {
		xmlMode: true
	});

	$('text').each((_, element) => {
		callback(element, $);
	});

	return $.html();
}

const replaceKeys = (svg, substitutions) => {
	return loopThroughSvg(svg, (element, $) => {
		const replacedText = replaceInSentence($(element).text(), substitutions);
		$(element).text(replacedText);
	});
}

const extractKeys = (svg) => {
	const keys = [];
	loopThroughSvg(svg, (element, $) => {
		const matches = $(element).text().matchAll(regexp);
		for (const match of matches) {
			keys.push(match[0].slice(1,-1));
		}
	});
	return keys;
}

export {
	replaceKeys,
	extractKeys
}