import * as cheerio from 'cheerio';

const regexp = /\[.+\]/g;
let verifiedKeys;

function replaceInSentence(textInput, substitutions) {
	const matches = textInput.matchAll(regexp);
	let key;

	for (const match of matches) {
		key = match[0].slice(1,-1);

		if(substitutions[key] !== undefined) {
			verifiedKeys.push(key);
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

const replaceKeys = (svg, substitutions, templateId) => {
	verifiedKeys = [];
	const replacedSvg = loopThroughSvg(svg, (element, $) => {
		const replacedText = replaceInSentence($(element).text(), substitutions);
		$(element).text(replacedText);
	});

	global.cpr.validateParameters(verifiedKeys, templateId);

	return replacedSvg;
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