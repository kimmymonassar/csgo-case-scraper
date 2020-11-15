const cheerio = require("cheerio");
const { nanoid } = require('nanoid');

function getSpecialItems(pageContent, caseName) {
  const $ = cheerio.load(pageContent);
  let specialItems = [];

  $('.result-box').each(function (i, item) {
      const name = $(item).find('h3').text();
      const id = nanoid();

      if (name) {
        const rarityValue = () => {
          const rarity = $(item).find('.quality > p').text().split(' ')[0];
          if (rarity === 'Extraordinary || Covert') {
            return 'Special'
          }
          return rarity;
        }

        specialItems.push({
          id,
          name,
          rarity: rarityValue(),
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
          rarity: rarityValue(),
          statTrakable: !!$(item).find('.stattrak > p').text().split(' ')[0],
          image: $(item).find('a > img').attr('src'),
          inspectInGame: $(item).find('.inspect-button-skin').attr('href'),
          inspectInGameText: `Inspect ${name} in game (Factory new)`,
          gunMarketLink: $(item).find('.market-button-skin').attr('href'),
          fromCase: caseName
        })
      }
    });
  
  return specialItems;
}

module.exports = getSpecialItems;
