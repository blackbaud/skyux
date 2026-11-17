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

  // Exercises every syntax color: keywords, types, classes, functions,
  // decorators, strings, numbers and literals, regular expressions, doc tags,
  // comments, `this`, and default text.
  protected readonly allColorsCode = `
    import { Component, input } from '@angular/core';

    const MAX_RETRIES = 3;
    const ID_PATTERN = /^[a-z]+-\\d+$/i;

    /**
     * Greets a user by name.
     * @param name The user's name.
     */
    export function greet(name: string, excited = false): string {
      return \`Hello, \${name}\${excited ? '!' : '.'}\`;
    }

    @Component({
      selector: 'app-greeting',
      template: '<p>{{ message }}</p>',
    })
    export class GreetingComponent implements OnInit {
      public readonly name = input<string | undefined>(undefined);
      public retries = 0;
      #enabled = true;

      public ngOnInit(): void {
        // Fall back to a default name.
        console.log(greet(this.name() ?? 'world', this.#enabled), ID_PATTERN);
        this.retries = Math.min(this.retries + 1, MAX_RETRIES);
      }
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
