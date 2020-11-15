const cheerio = require("cheerio");
const { nanoid } = require('nanoid');

function getCases(pageContent) {
  const $ = cheerio.load(pageContent);
  let casesArray = [];

  $('.result-box').each(function (i, item) {
      const name = $(item).find('h4').text();
      const id = nanoid();
      if (name) {
        casesArray.push({
          id,
          name,
          image: $(item).find('img').attr('src'),
          contentLink: $(item).children('a').attr('href'),
          marketLink: $(item).find('.market-button-item').attr('href')
        })
      }
    });
  
  return casesArray;
}

module.exports = getCases;
