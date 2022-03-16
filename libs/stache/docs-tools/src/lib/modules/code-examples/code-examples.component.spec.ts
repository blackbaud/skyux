import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkyDocsSourceCodeFile } from '../source-code/source-code-file';
import { SkyDocsSourceCodeService } from '../source-code/source-code.service';

import { SkyDocsCodeExampleTheme } from './code-example-theme';
import { SkyDocsCodeExamplesEditorService } from './code-examples-editor.service';
import { CodeExampleFixturesModule } from './fixtures/code-example-fixtures.module';
import { CodeExamplesFixtureComponent } from './fixtures/code-examples-fixture.component';

const MOCK_SOURCE_CODE = [
  {
    fileName: 'foobar.component.ts',
    filePath: 'src/lib/modules/foobar.component.ts',
    rawContents: 'FOO CONTENTS',
  },
  {
    fileName: 'foobar.component.html',
    filePath: 'src/lib/modules/foobar.component.html',
    rawContents: 'FOO CONTENTS',
  },
  {
    fileName: 'foobar.component.scss',
    filePath: 'src/lib/modules/foobar.component.scss',
    rawContents: 'FOO CONTENTS',
  },
];

class MockSourceCodeService {
  public getSourceCode(filePath: string): SkyDocsSourceCodeFile[] {
    if (filePath === 'src/app/public/plugin-resources/foobar/') {
      return MOCK_SOURCE_CODE;
    }

    return [];
  }
}

describe('Code example component', () => {
  let fixture: ComponentFixture<CodeExamplesFixtureComponent>;
  let component: CodeExamplesFixtureComponent;
  let editorService: SkyDocsCodeExamplesEditorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CodeExampleFixturesModule],
      providers: [
        {
          provide: SkyDocsSourceCodeService,
          useClass: MockSourceCodeService,
        },
      ],
    });

    fixture = TestBed.createComponent(CodeExamplesFixtureComponent);
    component = fixture.componentInstance;

    editorService = TestBed.inject(SkyDocsCodeExamplesEditorService);
    spyOn(editorService, 'launchEditor');
  });

  function launchEditor() {
    fixture.debugElement.nativeElement
      .querySelector('.sky-btn-default')
      .click();
  }

  it('should set defaults', () => {
    fixture.detectChanges();

    launchEditor();

    expect(editorService.launchEditor).toHaveBeenCalledWith({
      heading: 'Basic',
      packageDependencies: {},
      sourceCode: MOCK_SOURCE_CODE,
      theme: SkyDocsCodeExampleTheme.Default,
      stylesheets: undefined,
    });
  });

  it('should allow setting package dependencies', () => {
    component.packageDependencies = { foobar: 'latest' };

    fixture.detectChanges();

    launchEditor();

    expect(editorService.launchEditor).toHaveBeenCalledWith({
      heading: 'Basic',
      packageDependencies: {
        foobar: 'latest',
      },
      sourceCode: MOCK_SOURCE_CODE,
      theme: SkyDocsCodeExampleTheme.Default,
      stylesheets: undefined,
    });
  });

  it('should allow setting stylesheets', () => {
    component.stylesheets = ['styles.css'];

    fixture.detectChanges();

    launchEditor();

    expect(editorService.launchEditor).toHaveBeenCalledWith({
      heading: 'Basic',
      packageDependencies: {},
      sourceCode: MOCK_SOURCE_CODE,
      theme: SkyDocsCodeExampleTheme.Default,
      stylesheets: ['styles.css'],
    });
  });
});
