import {
  Component
} from '@angular/core';

@Component({
  selector: 'sky-text-highlight-demo',
  templateUrl: './text-highlight-demo.component.html'
})
export class SkyTextHighlightDemoComponent {
  public normalSearchTerm = 'enter';
  public blankSearchTerm = '';
  public notMatchedSearchTerm = 'xnotmatched';
}
