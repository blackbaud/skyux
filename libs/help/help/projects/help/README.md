# @blackbaud/skyux-lib-help

[![npm](https://img.shields.io/npm/v/@blackbaud/skyux-lib-help.svg)](https://www.npmjs.com/package/@blackbaud/skyux-lib-help)

Provides a SKYUX library for interacting with the Help Widget. Wraps much of the functionality of [@blackbaud/help-client] in SKYUX-compatible fashion. This module is a dependency of [@skyux-sdk/builder].

## SKYUX usage

Enable the help widget by providing a configuration in `skyuxconfig.json`. `@skyux-sdk/builder` will initialize the widget based on this config.

```json
{
  "help": {
    "helpMode": "menu"
  }
}
```
See [widget-config.ts] for more configuration properties.

Use the widget by injecting the `HelpWidgetService` into your desired directive/service.

```typescript
@Component({
  selector: 'my-comp',
  template: `
    <button (click)="open()">Help</button>
  `
})
export class MyComponent {
  public constructor(private helpSvc: HelpWidgetService) {
  }

  public open(): void {
    this.helpSvc.openToHelpKey('bb-custom-fields.html');
  }
}
```

# Menu vs legacy mode

See [@blackbaud/help-client] for more information on the `helpMode` property. `menu` is the recommended mode going forward.

[@skyux-sdk/builder]: https://github.com/blackbaud/skyux-sdk-builder
[@blackbaud/help-client]: https://github.com/blackbaud/help-client
[widget-config.ts]: src/widget-config.ts
