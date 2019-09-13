import {
  ChangeDetectionStrategy,
  Component,
  Input
} from '@angular/core';

@Component({
  selector: 'sky-docs-demo-page-section',
  templateUrl: './demo-page-section.component.html',
  styleUrls: ['./demo-page-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDocsDemoPageSectionComponent {

  @Input()
  public heading: string;

  public get anchorId(): string {
    return `section-${this.getSanitizedName(this.heading)}`;
  }

  private getSanitizedName(value: string): string {
    if (!value) {
      return;
    }

    const sanitized = value.toLowerCase()

      // Remove special characters.
      .replace(/[\_\~\`\@\!\#\$\%\^\&\*\(\)\[\]\{\}\;\:\'\/\\\<\>\,\.\?\=\+\|"]/g, '')

      // Replace space characters with a dash.
      .replace(/\s/g, '-')

      // Remove any double-dashes.
      .replace(/--/g, '-');

    return sanitized;
  }

}
