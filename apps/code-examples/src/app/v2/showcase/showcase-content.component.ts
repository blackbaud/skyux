import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'sky-showcase-content',
  template: `<ng-content />

    <!--
  <sky-showcase [codeExamples]="" [typeDefinitions]="" [testingTypeDefinitions]="">
    <sky-showcase-description>
      Description here.
    </sky-showcase-description>

    <sky-showcase-demo>
      Demo here.
    </sky-showcase-demo>

    <sky-showcase-content category="design">
      This describes the design guidelines
    </sky-showcase-content>

    <sky-design-guidelines>
      <sky-design-guideline></sky-design-guideline>
      <sky-design-guideline></sky-design-guideline>
      <sky-design-guideline></sky-design-guideline>
      <sky-design-guideline></sky-design-guideline>
    </sky-design-guidelines>

    <sky-showcase-content category="development">
      This describes the development guidelines
    </sky-showcase-content>
  </sky-showcase>
  --> `,
})
export class SkyShowcaseContentComponent {
  public category = input.required<
    'design' | 'development' | 'testing' | 'examples'
  >();
}
