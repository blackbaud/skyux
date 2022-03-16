import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/**
 * Specifies a section of page content.
 * @example
 * ```
 * <sky-docs-demo-page-section
 *   heading="Section heading"
 * >
 *   Section content here.
 * </sky-docs-demo-page-section>
 * ```
 */
@Component({
  selector: 'sky-docs-demo-page-section',
  templateUrl: './demo-page-section.component.html',
  styleUrls: ['./demo-page-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyDocsDemoPageSectionComponent {
  /**
   * The heading text to print above the section.
   */
  @Input()
  public heading: string;

  public get anchorId(): string {
    return `section-${this.getSanitizedName(this.heading)}`;
  }

  private getSanitizedName(value: string): string {
    if (!value) {
      return;
    }

    const sanitized = value
      .toLowerCase()

      // Remove special characters.
      .replace(/[_~`@!#$%^&*()[\]{};:'/\\<>,.?=+|"]/g, '')

      // Replace space characters with a dash.
      .replace(/\s/g, '-')

      // Remove any double-dashes.
      .replace(/--/g, '-');

    return sanitized;
  }
}
