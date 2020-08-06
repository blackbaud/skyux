/**
 * Inspired by Angular 4's `BrowserDetection` utility:
 * https://github.com/angular/angular/blob/4.4.x/packages/platform-browser/testing/src/browser_util.ts
 * @internal
 */
export class SkyBrowserDetector {

  public static isChromeDesktop = (
    navigator.userAgent.indexOf('Chrome') > -1 &&
      navigator.userAgent.indexOf('Mobile Safari') === -1 &&
      navigator.userAgent.indexOf('Edge') === -1
  );

}
