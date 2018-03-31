// # Image Scrapper

// import the get-set-fetch dependency
const GetSetFetch = require('get-set-fetch');

// the entire code is async for image scrapper,
// declare an async function in order to make use of await
async function imgCrawl() {
  // init db connection, by default in memory sqlite
  const { Site } = await GetSetFetch.init();

  // load site if already present,
  // otherwise create it by specifying a name and the first url to crawl,
  // only links from this location down will be subject to further crawling
  let site = await Site.get('imgSite');
  if (!site) {
    site = new Site(
      'imgSite',
      'https://imgSite/index.html',
    );


    // by default ExtractUrlPlugin only extracts html resources,
    // overide the default plugin instance with a new one containing suitable options
    site.use(new GetSetFetch.plugins.ExtractUrlPlugin({
      extensionRe: /^(jpg|png)$/i,
    }));

    // add persistencePlugin to the current site,
    // specify what extensions to save and where
    site.use(new GetSetFetch.plugins.PersistResourcePlugin({
      target: './myTargetDir',
      extensionRe: /^(jpg|png)$/i,
    }));

    await site.save();
  }

  // keep crawling site until there are no more resources to crawl
  await site.crawl();

// end async function
}

// start crawling
imgCrawl();
