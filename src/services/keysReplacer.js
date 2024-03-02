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

function replaceKeys(svg, substitutions) {

	const $ = cheerio.load(svg, {
		xmlMode: true
	});

	$('text').each((_, element) => {
		const replacedText = replaceInSentence($(element).text(), substitutions);
		$(element).text(replacedText);
	});

	return $.html();
}

export {
	replaceKeys
}