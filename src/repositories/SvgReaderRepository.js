import * as cheerio from 'cheerio';

function replaceInSentence(textInput, substitutions, keyRegExp, verifiedKeys) {
	const matches = textInput.matchAll(keyRegExp);
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

export default class CheerioSvgReader {

  constructor(keyRegExp) {
    this.keyRegExp = keyRegExp;
    this.extractKeys = this.extractKeys.bind(this);
    this.replaceKeys = this.replaceKeys.bind(this);
  }

  enforceCenteredText($) {
    $('text[text-align="center"]').each((_, element) => {
      $(element).children().removeAttr('x').removeAttr('y');
    });
  }
  
  sanitizeData = (...sanitizers) => (svg) => {
    const $ = cheerio.load(svg, {
      xmlMode: true
    });
    
    sanitizers.forEach(sanitizer => {
      try {
        sanitizer($);
      } catch (err) {
        throw Error(`Got an error in '${sanitizer.name}: ${err}`);
      }
    });
  
    return $.html();
  }

  replaceKeys (svg, substitutions) {
    const verifiedKeys = [];
    const replacedSvg = loopThroughSvg(svg, (element, $) => {
      const replacedText = replaceInSentence($(element).text(), substitutions, this.keyRegExp, verifiedKeys);
      $(element).text(replacedText);
    });
    
    return { replacedSvg, verifiedKeys };
  }
  
  extractKeys(svg) {
    const keys = [];
    loopThroughSvg(svg, (element, $) => {
      const matches = $(element).text().matchAll(this.keyRegExp);
      for (const match of matches) {
        keys.push(match[0].slice(1,-1));
      }
    });
    return keys;
  }
}