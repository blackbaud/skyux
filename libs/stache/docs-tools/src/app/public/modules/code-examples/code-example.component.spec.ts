import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  expect
} from '@skyux-sdk/testing';

import {
  SkyTheme,
  SkyThemeMode,
  SkyThemeService,
  SkyThemeSettings
} from '@skyux/theme';

import {
  SkyDocsCodeExampleTheme
} from './code-example-theme';

import {
  CodeExampleFixtureComponent
} from './fixtures/code-example-fixture.component';

import {
  CodeExampleFixturesModule
} from './fixtures/code-example-fixtures.module';

import {
  CodeExampleWithThemeServiceFixtureComponent
} from './fixtures/code-example-with-theme-service-fixture.component';

import {
  SkyDocsCodeExampleComponent
} from './code-example.component';

describe('Code example component', () => {
  let fixture: ComponentFixture<CodeExampleFixtureComponent>;
  let component: CodeExampleFixtureComponent;
  let codeExampleComponent: SkyDocsCodeExampleComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CodeExampleFixturesModule
      ]
    });

    fixture = TestBed.createComponent(CodeExampleFixtureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    codeExampleComponent = component.codeExampleComponents;
  });

  it('should default theme property to default', () => {
    expect(codeExampleComponent.theme).toEqual(SkyDocsCodeExampleTheme.Default);
  });

  it('should set theme property', () => {
    component.theme = 'modern';
    fixture.detectChanges();

    expect(codeExampleComponent.theme).toEqual(SkyDocsCodeExampleTheme.Modern);
  });

  it('should allow resetting of theme setting', () => {
    component.theme = 'modern';
    fixture.detectChanges();

    expect(codeExampleComponent.theme).toEqual(SkyDocsCodeExampleTheme.Modern);

    component.theme = undefined;
    fixture.detectChanges();

    expect(codeExampleComponent.theme).toEqual(SkyDocsCodeExampleTheme.Default);
  });
});

describe('Code example component with SkyThemeService', () => {
  let fixture: ComponentFixture<CodeExampleWithThemeServiceFixtureComponent>;
  let component: CodeExampleWithThemeServiceFixtureComponent;
  let codeExampleComponent: SkyDocsCodeExampleComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CodeExampleFixturesModule
      ],
      providers: [
        SkyThemeService
      ]
    });

    fixture = TestBed.createComponent(CodeExampleWithThemeServiceFixtureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    codeExampleComponent = component.codeExampleComponents.first;
  });

  it('should update theme property using SkyThemeService', () => {
    expect(codeExampleComponent.theme).toEqual(SkyDocsCodeExampleTheme.Modern);

    component.setTheme(new SkyThemeSettings(
      SkyTheme.presets.default,
      SkyThemeMode.presets.light
    ));
    fixture.detectChanges();

    expect(codeExampleComponent.theme).toEqual(SkyDocsCodeExampleTheme.Default);
  });
});
