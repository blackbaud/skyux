import { Component } from '@angular/core';
import { SkyCodeBlock } from '@skyux/code';
import { SkyBoxModule } from '@skyux/layout';
import { SkyPageModule } from '@skyux/pages';

@Component({
  imports: [SkyBoxModule, SkyCodeBlock, SkyPageModule],
  selector: 'app-code-block',
  templateUrl: './code-block-playground.html',
})
export default class CodeBlockPlayground {
  protected readonly typescriptCode = `
    import { Component } from '@angular/core';

    @Component({
      selector: 'app-root',
      template: '<h1>{{ title }}</h1>',
    })
    export class AppComponent {
      // Greets the user.
      public title = 'Hello';
    }
  `;

  protected readonly jsonCode = `{
  "name": "my-app",
  "private": true,
  "dependencies": { "@skyux/code": "^15.14.0" }
}`;

  protected readonly unknownLanguageCode = `<note>Unknown languages fall back to markup.</note>`;

  protected readonly longCode = `const message = '${'This line is long enough to scroll horizontally. '.repeat(6)}';`;
}
