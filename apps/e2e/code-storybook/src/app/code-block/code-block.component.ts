import { Component } from '@angular/core';
import { SkyCodeBlock } from '@skyux/code';

@Component({
  imports: [SkyCodeBlock],
  selector: 'app-code-block',
  templateUrl: './code-block.component.html',
  styleUrls: ['./code-block.component.scss'],
})
export class CodeBlockComponent {
  // Together with the CSS, Markdown, and Bash blocks, uses every syntax style.
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

  protected readonly cssCode = `
    main .card#featured:hover,
    input[type='text'] {
      color: red;
    }
  `;

  protected readonly markdownCode = `
    # Getting started

    Read the *guide* for **important** steps, or see [the docs](https://developer.blackbaud.com/skyux).
  `;

  protected readonly bashCode = `
    echo "Installing in $HOME"
  `;

  protected readonly htmlCode = `<sky-box headingText="Box">Content</sky-box>`;

  protected readonly longCode = `const message = '${'This line is long enough to scroll horizontally. '.repeat(4)}';`;
}
