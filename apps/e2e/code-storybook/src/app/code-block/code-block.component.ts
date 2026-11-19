import { Component } from '@angular/core';
import { SkyCodeBlock } from '@skyux/code';

@Component({
  imports: [SkyCodeBlock],
  selector: 'app-code-block',
  templateUrl: './code-block.component.html',
  styleUrls: ['./code-block.component.scss'],
})
export class CodeBlockComponent {
  // Uses every syntax color.
  protected readonly typescriptCode = `
    import { Component } from '@angular/core';

    const MAX_RETRIES = 3;
    const ID_PATTERN = /^[a-z]+-\\d+$/i;

    /**
     * Greets a user.
     * @param name The user's name.
     */
    @Component({ selector: 'app-greeting', template: '<p>Hi</p>' })
    export class GreetingComponent {
      public greet(name: string, excited = false): string {
        return \`Hello, \${name}\${excited ? '!' : '.'}\`;
      }

      public retry(): number {
        // Try again.
        return Math.min(this.count + 1, MAX_RETRIES);
      }
    }
  `;

  protected readonly jsonCode = `{
  "name": "my-app",
  "private": true,
  "version": 1
}`;

  protected readonly htmlCode = `<sky-box headingText="Box">Content</sky-box>`;

  protected readonly longCode = `const message = '${'This line is long enough to scroll horizontally. '.repeat(4)}';`;
}
