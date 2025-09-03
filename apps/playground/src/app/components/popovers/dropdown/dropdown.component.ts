import { Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SkyCheckboxModule } from '@skyux/forms';

import { DropdownExampleComponent } from './dropdown-example.component';

@Component({
  selector: 'app-dropdown-demo',
  templateUrl: './dropdown.component.html',
  styles: [
    `
      .dropdown-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
      }

      .dropdown-grid-iframe > iframe {
        height: 172px;
        width: 100%;
        border: none;
        resize: both;
      }

      .space {
        height: calc(100vh - 200px - var(--sky-viewport-top, 0px));
        min-height: 200px;
        background-color: var(--sky-background-color-info-light);
        padding: var(--sky-padding-even-xl);

        :before {
          content: ' ';
        }
      }
    `,
  ],
  imports: [SkyCheckboxModule, FormsModule, DropdownExampleComponent],
})
export class DropdownComponent {
  protected disabledState = model(true);
  protected moveToBottom = model(false);
}
