import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { expectAsync } from '@skyux-sdk/testing';
import { SkyBoxHarness } from '@skyux/layout/testing';

import { SkyDocsCodeExampleViewerComponent } from './code-example-viewer.component';
import { SkyDocsCodeExampleViewerModule } from './code-example-viewer.module';
import { SkyDocsStackBlitzService } from './stackblitz.service';

interface SetupConfig {
  componentName: string;
  componentSelector: string;
  files: Record<string, string>;
  primaryFile: string;
  headingText: string;
}

const EXAMPLE_TEMPLATE = `<div class="foo-example">Hello, from Foo.</div>`;

@Component({
  selector: 'foo-example',
  template: EXAMPLE_TEMPLATE,
})
class FooExampleComponent {}

describe('code-example-viewer.component', () => {
  let defaults: SetupConfig;

  function setupTest(config: SetupConfig): {
    fixture: ComponentFixture<SkyDocsCodeExampleViewerComponent>;
    loader: HarnessLoader;
  } {
    const fixture = TestBed.createComponent(SkyDocsCodeExampleViewerComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);

    const componentRef = fixture.componentRef;
    componentRef.setInput('componentName', config.componentName);
    componentRef.setInput('componentSelector', config.componentSelector);
    componentRef.setInput('componentType', FooExampleComponent);
    componentRef.setInput('files', config.files);
    componentRef.setInput('primaryFile', config.primaryFile);
    componentRef.setInput('headingText', config.headingText);

    return { fixture, loader };
  }

  function getDemoWrapper(
    fixture: ComponentFixture<SkyDocsCodeExampleViewerComponent>,
  ): HTMLDivElement | null {
    return (fixture.nativeElement as HTMLElement).querySelector<HTMLDivElement>(
      '.sky-docs-code-example-viewer-demo',
    );
  }

  function toggleCodeVisibility(
    fixture: ComponentFixture<SkyDocsCodeExampleViewerComponent>,
  ): void {
    const toggleCodeButton = (
      fixture.nativeElement as HTMLElement
    ).querySelector<HTMLButtonElement>(
      'button[data-sky-id="toggle-code-visibility-btn"]',
    );

    toggleCodeButton?.click();
    fixture.detectChanges();
  }

  function expectCodeVisible(
    fixture: ComponentFixture<SkyDocsCodeExampleViewerComponent>,
    visible: boolean,
  ): void {
    const codeWrapper = (
      fixture.nativeElement as HTMLElement
    ).querySelector<HTMLDivElement>('sky-vertical-tabset');

    if (visible) {
      expect(codeWrapper?.getAttribute('hidden')).toBeNull();
    } else {
      expect(codeWrapper?.getAttribute('hidden')).toEqual('');
    }
  }

  beforeEach(() => {
    defaults = {
      componentName: 'FooExampleComponent',
      componentSelector: 'foo-example',
      files: {
        'example.component.html': EXAMPLE_TEMPLATE,
        'example.component.scss': `.foo-example { color: red; }`,
        'example.component.ts': `@Component({
  selector: 'foo-example',
  template: \`${EXAMPLE_TEMPLATE}\`
})
class FooExampleComponent {}`,
      },
      primaryFile: 'example.component.ts',
      headingText: 'Foo basic example',
    };

    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, SkyDocsCodeExampleViewerModule],
    });
  });

  it('should display a code example', async () => {
    const { fixture, loader } = setupTest(defaults);

    fixture.detectChanges();

    const boxHarness = await loader.getHarness(SkyBoxHarness);

    await expectAsync(boxHarness.getHeadingLevel()).toBeResolvedTo(3);
    await expectAsync(boxHarness.getHeadingStyle()).toBeResolvedTo(3);
    await expectAsync(boxHarness.getHeadingText()).toBeResolvedTo(
      'Foo basic example',
    );

    const demoEl = getDemoWrapper(fixture);

    expect(demoEl?.textContent).toContain('Hello, from Foo.');

    expectCodeVisible(fixture, false);

    await expectAsync(fixture.nativeElement).toBeAccessible();
  });

  it('should toggle code visibility', async () => {
    const { fixture } = setupTest(defaults);

    fixture.detectChanges();

    expectCodeVisible(fixture, false);

    toggleCodeVisibility(fixture);

    expectCodeVisible(fixture, true);

    await expectAsync(fixture.nativeElement).toBeAccessible();

    toggleCodeVisibility(fixture);

    expectCodeVisible(fixture, false);
  });

  it('should open in StackBlitz', () => {
    const { fixture } = setupTest(defaults);

    fixture.detectChanges();

    const stackblitzSpy = spyOn(
      TestBed.inject(SkyDocsStackBlitzService),
      'launch',
    );

    const stackblitzButton = (
      fixture.nativeElement as HTMLElement
    ).querySelector<HTMLButtonElement>('button[data-sky-id="stackblitz-btn"]');

    stackblitzButton?.click();
    fixture.detectChanges();

    expect(stackblitzSpy).toHaveBeenCalledWith({
      componentName: defaults.componentName,
      componentSelector: defaults.componentSelector,
      files: defaults.files,
      primaryFile: defaults.primaryFile,
      title: defaults.headingText,
    });
  });

  it('should hide the demo', () => {
    const { fixture } = setupTest(defaults);

    fixture.componentRef.setInput('demoHidden', true);
    fixture.detectChanges();

    expect(getDemoWrapper(fixture)?.textContent).toContain(
      'Open this code example in StackBlitz to view the demo.',
    );
  });

  it('should throw if language not recognized', () => {
    const { fixture } = setupTest(defaults);

    const { files } = defaults;

    // Add an unsupported file type.
    files['foo.cs'] = ``;

    fixture.componentRef.setInput('files', files);

    expect(() => fixture.detectChanges()).toThrowError(
      'Value "cs" is not a supported language type.',
    );
  });
});
