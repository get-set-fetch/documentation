// # Getting Started

// import the get-set-fetch dependency
const GetSetFetch = require("get-set-fetch");

// the entire code is async,
// declare an async function in order to make use of await
async function easyCrawl(){
	// init db connection, by default in memory sqlite
    ({ Site } = await GetSetFetch.init();
    
	// load site if already present, 
	// otherwise create it by specifying a name and the first url to crawl, 
	// only links from this location down will be subject to further crawling
    let site = await Site.get("siteA");
    if (!site) {
        site = new Site('siteA', 
        'https://siteA/index.html');
    
        await site.save();
    }
    
	// keep crawling site until there are no more resources to crawl
    await site.crawl();
    
// end async function
}

// start crawling
easyCrawl();