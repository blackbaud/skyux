// Inspired by Angular 4's `BrowserDetection` utility:
// https://github.com/angular/angular/blob/4.4.x/packages/platform-browser/testing/src/browser_util.ts

export class SkyBrowserDetector {

  public static isIE = (
    navigator.userAgent.indexOf('Trident') > -1
  );

  public static isWindows7 = (
    navigator.userAgent.indexOf('Windows NT 6.1') > -1
  );
}
