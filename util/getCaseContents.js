const cheerio = require("cheerio");
const { nanoid } = require('nanoid');

function getNormalCaseContents(pageContent, caseName) {
  const $ = cheerio.load(pageContent);
  let items = [];

  const operationsSpecialItemsName = caseName.replace('Operation', '')
  const specialItemsLink = $('.result-box').find('h3').text().includes(operationsSpecialItemsName) ? 
  $('.result-box').find('h3 > a').attr('href') :
  false;

  $('.result-box').each(function (i, item) {
      const name = $(item).find('h3').text();
      const id = nanoid();
      if (name && !name.includes(caseName)) {
        items.push({
          id,
          name,
          rarity: $(item).find('.quality > p').text().split(' ')[0],
          statTrakable: !!$(item).find('.stattrak > p').text().split(' ')[0],
          image: $(item).find('a > img').attr('src'),
          inspectInGame: $(item).find('.inspect-button-skin').attr('href'),
          inspectInGameText: `Inspect ${name} in game (Factory new)`,
          gunMarketLink: $(item).find('.market-button-skin').attr('href'),
          fromCase: caseName
        })
        console.log({
          id,
          name,
          rarity: $(item).find('.quality > p').text().split(' ')[0],
          statTrakable: !!$(item).find('.stattrak > p').text().split(' ')[0],
          image: $(item).find('a > img').attr('src'),
          inspectInGame: $(item).find('.inspect-button-skin').attr('href'),
          inspectInGameText: `Inspect ${name} in game (Factory new)`,
          gunMarketLink: $(item).find('.market-button-skin').attr('href'),
          fromCase: caseName
        })
      }
    });
  
  return {
    items,
    specialItemsLink
  };
}

module.exports = getNormalCaseContents;
