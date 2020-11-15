require('./config/envLoader');
const puppeteer = require("puppeteer");
const { boolean } = require('boolean');
const getCases = require('./util/getCases');
const getNormalCaseContents = require('./util/getCaseContents');
const getSpecialItems = require('./util/getSpecialItems');

const uri = `${process.env.MONGODB_URL}:${process.env.MONGO_PORT}`;

(async () => {
  const browser = await puppeteer.launch({ 
    headless: boolean(process.env.PUPPETEER_HEADLESS), 
  });
  let page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.setRequestInterception(true);
  
  page.on('request', (req) => {
      if(req.resourceType() == 'stylesheet' || req.resourceType() == 'font' || req.resourceType() == 'image' || req.resourceType() === "script"){
          req.abort();
      }
      else {
          req.continue();
      }
  });

  await page.goto(`${process.env.SCRAPE_URL}`, {
    waitUntil: 'domcontentloaded',
  });

  const startPageContent = await page.content();
  const cases = getCases(startPageContent);

  console.log(`Total cases: ${cases.length}`);

  for (let i = 0; i < cases.length; i++) {
    await page.goto(cases[i].contentLink, {
        waitUntil: 'domcontentloaded',
    });
    const casePageContent = await page.content();
    const caseContents = getNormalCaseContents(casePageContent, cases[i].name);
    cases[i].items = caseContents.items;
    
    if (caseContents.specialItemsLink) {
      try {
        await page.goto(caseContents.specialItemsLink);
        const specialPageContent = await page.content();
        const specialItems = getSpecialItems(specialPageContent, cases[i].name);
        cases[i].specialItems = specialItems;
      } catch (e) {
        console.log(e);
        console.log(`tried URL: ${caseContents.specialItemsLink}`)
      }
    }
  }

  process.on('unhandledRejection', (reason, p) => {
    console.error('Unhandled Rejection at: Promise', p, 'reason:', reason);
    browser.close();
  });

  await browser.close();

  var MongoClient = require("mongodb").MongoClient;

  async function addJSONBlobToDataBase() {
    let client = null;
    try {
      client = await MongoClient.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      const db = await client.db(process.env.MONGO_DB_NAME);
      // data must be array
      await db.collection(process.env.MONGO_COLLECTION_NAME).insertMany(cases);
    } catch (e) {
      console.error(`Function addJSONBlobToDataBase threw eror: ${e}`);
    } finally {
      if (client) {
        client.close()
      }
    }
  }

  addJSONBlobToDataBase();
})();
