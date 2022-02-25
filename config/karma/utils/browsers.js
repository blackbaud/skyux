function getBrowserStackLaunchers() {
  const browserSet = [
    {
      base: 'BrowserStack',
      browser: 'Edge',
      os: 'Windows',
      os_version: '10',
    },
    // {
    //   base: 'BrowserStack',
    //   browser: 'Firefox',
    //   os: 'Windows',
    //   os_version: '10',
    // },
    {
      base: 'BrowserStack',
      browser: 'Safari',
      os: 'OS X',
      os_version: 'Monterey',
    },
  ];

  const launchers = {};
  for (const browser of browserSet) {
    // Generate a key based on the browser information.
    const key = [
      browser.os || 'osDefault',
      browser.os_version || 'osVersionDefault',
      browser.browser || 'browserDefault',
      browser.browser_version || 'browserVersionDefault',
    ].join('_');

    launchers[key] = browser;
  }

  return launchers;
}

module.exports = getBrowserStackLaunchers;
