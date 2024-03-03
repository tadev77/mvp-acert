import * as cheerio from 'cheerio';

let $;

function enforceCenteredText() {
  $('text[text-align="center"]').each((_, element) => {
    $(element).children().removeAttr('x').removeAttr('y');
  });
}

const sanitizeData = (...sanitizers) => (svg) => {
  $ = cheerio.load(svg, {
		xmlMode: true
	});
  
  sanitizers.forEach(sanitizer => {
    try {
      sanitizer();
    } catch (err) {
      throw Error(`Got an error in '${sanitizer.name}: ${err}`);
    }
  });

  return $.html();
}

export default sanitizeData(enforceCenteredText);