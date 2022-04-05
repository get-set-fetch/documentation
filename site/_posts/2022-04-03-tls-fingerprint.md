---
title: "Randomize the TLS fingerprint"
tags: "advanced"
date: "2022-04-03"
---

Modify the default nodejs TLS cipher list. \\
Shuffle it so that the scraper can no longer be identified as a nodejs app during the TLS handshake.

@get-set-fetch/scraper supports both [browser clients](/node/clients.html#browser-clients) (Puppeteer, Playwright) and [DOM-like clients](/node/clients.html#dom-clients) (Cheerio, JSDOM).

A browser client opening a real browser simulates as close as possible a real user interaction with a site. Launching a browser may prove expensive in terms of CPU and memory usage especially on large scale scraping projects. \\
The alternative is using the nodejs HTTP/HTTPS APIs to fetch the page content and scrape it using lighter, DOM-like clients. The CPU and memory usage is significantly smaller but a site may block you as not being a real user using a real browser.

There are pros and cons for each approach and you may even end up combining the two. For example, you can use a browser client to retrieve some uniquely generated headers and subsequently use those headers when making nodejs HTTP/HTTPS calls. There is no one-size-fits-all solution.

This post applies when you're using nodejs HTTPS API via the built-in [NodeFetchPlugin](/node/plugins.html#node-fetch-plugin). The corresponding source code is available under [examples/tls-fingerprinting](https://github.com/get-set-fetch/scraper/tree/main/examples/tls-fingerprinting).

When fetching content from an `https://` URL the communication is encrypted using SSL/TLS. The process kicking off the secure communication session is called a TLS handshake. Think of it as a negotiation between a client requesting a web page and a server sending the page content. The client sends a list of supported features - like SSL/TLS version, supported cipher suites - and the server selects and sends back one of the client's cipher suites. This cipher will be used to encrypt communications throughout the session. The TLS handshake continues with the server sending its certificate containing its public key and a few more steps not relevant to the current discussion.

Using an algorithm like [JA3](https://github.com/salesforce/ja3#how-it-works){:target="_blank"} information sent by the client during the TLS handshake - SSL/TLS version, cipher list, TLS extension list, elliptic curves and elliptic curve formats lists - can be used to uniquely identify a client. All the parameters are concatenated and then MD5 hashed to produce a 32-character fingerprint.

Some fingerprints examples:
- Tor: `e7d705a3286e19ea42f587b344ee6865`
- Chrome 97: `b32309a26951912be7dba376398abc3b`
- Nodejs v16: `c4aac137ff0b0ac82f3c138cf174b427`

By simply changing the order of the supported cipher suites we can modify the nodejs `HTTPS.request` fingerprint. \\
The new fingerprint will not be present in any precalculated fingerprint list and the scraper will not be flagged as a nodejs application.

We don't need to shuffle the entire cipher list. Any change in the cipher list, just moving a single cipher up or down or removing it altogether, will result in a new MD5 hash being generated. Since the server may pick the first client cipher it supports and nodejs default ciphers are listed based on security preferences, it's safe to leave the first entries untouched and only shuffle the remaining ones.

```js
getShuffledCipherList():string[] {
  const nodeOrderedCipherList = crypto.constants.defaultCipherList.split(':');

  // keep the most important ciphers in the same order
  const fixedCipherList = nodeOrderedCipherList.slice(0, 3);

  // shuffle the rest
  const shuffledCipherList = nodeOrderedCipherList.slice(3)
    .map(cipher => ({ cipher, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ cipher }) => cipher);

  return [
    ...fixedCipherList,
    ...shuffledCipherList,
  ];
}
```

During a scraping session each plugin is instantiated once. \\
You can easily extend [NodeFetchPlugin](/node/plugins.html#node-fetch-plugin) and override `getRequestOptions` invoked on each HTTP/HTTPS request to return the options you want, including the supported cipher list. If the ciphers are not already shuffled a one-time cipher shuffling takes place.

```js
export default class RandomTlsFingerprintFetch extends NodeFetchPlugin {
  shuffledCipherList: string[];

  async getRequestOptions(url:URL, resource: Resource) {
    const reqOpts = await super.getRequestOptions(url, resource);

    if (url.protocol === Protocol.HTTPS) {
      // one time initialization of random ordered ciphers
      if (!this.shuffledCipherList) {
        this.shuffledCipherList = this.getShuffledCipherList();
        this.logger.info(this.shuffledCipherList, 'using shuffled cipherlist');
      }

      reqOpts.ciphers = this.shuffledCipherList.join(':');
    }
    return reqOpts;
  }
}
```
