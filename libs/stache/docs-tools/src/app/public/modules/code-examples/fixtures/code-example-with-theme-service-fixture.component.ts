import {
  Component,
  ElementRef,
  QueryList,
  Renderer2,
  ViewChildren
} from '@angular/core';

import {
  SkyTheme,
  SkyThemeMode,
  SkyThemeService,
  SkyThemeSettings
} from '@skyux/theme';

import {
  SkyDocsCodeExampleComponent
} from '../code-example.component';

@Component({
  selector: 'code-example-fixture',
  template: `
    <sky-docs-code-example
      heading="My code example"
      sourceCodePath="src/app/public/plugin-resources/foobar"
    >
    </sky-docs-code-example>`
})
export class CodeExampleWithThemeServiceFixtureComponent {

  @ViewChildren(SkyDocsCodeExampleComponent)
  public codeExampleComponents: QueryList<SkyDocsCodeExampleComponent>;

  constructor(
    private elRef: ElementRef,
    private renderer: Renderer2,
    private themeSvc: SkyThemeService
  ) {
    this.themeSvc.init(
      this.elRef.nativeElement,
      this.renderer,
      new SkyThemeSettings(
        SkyTheme.presets.modern,
        SkyThemeMode.presets.light
      )
    );
  }

  public setTheme(themeSettings: SkyThemeSettings): void {
    this.themeSvc.setTheme(themeSettings);
  }

}
