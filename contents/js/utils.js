function getBrowser() {
  let browser = 'unknown';
  const ua = navigator.userAgent;
  if ((ua.indexOf('Opera') || ua.indexOf('OPR')) != -1) {
    browser = 'Opera';
  } else if (ua.indexOf('Edge') != -1) {
    browser = 'Edge';
  } else if (ua.indexOf('Chrome') != -1) {
    browser = 'Chrome';
  } else if (ua.indexOf('Safari') != -1) {
    browser = 'Safari';
  } else if (ua.indexOf('Firefox') != -1) {
    browser = 'Firefox';
  } else if ((ua.indexOf('MSIE') != -1) || (!!document.documentMode == true)) // IF IE > 10
  {
    browser = 'IE';
  } else {
    browser = 'unknown';
  }
  return browser;
}

window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('install').onclick = () => {
    let installUrl;
    const browser = getBrowser();

    switch (browser) {
      case 'Firefox':
        installUrl = 'https://addons.mozilla.org/en-US/firefox/addon/get-set-fetch-web-scraper/';
        break;
      case 'Chrome':
        installUrl = 'https://chrome.google.com/webstore/detail/get-set-fetch-web-scraper/obanemoliijohdnhjjkdbekbhdjeolnk';
        break;
      default:
        installUrl = null;
    }

    if (installUrl) {
      window.open(installUrl, '_blank');
    }

    return false;
  };
});
