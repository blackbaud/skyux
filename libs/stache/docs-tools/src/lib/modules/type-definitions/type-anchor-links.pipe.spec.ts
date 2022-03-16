import { ComponentFixture, TestBed } from '@angular/core/testing';

import { By } from '@angular/platform-browser';

import { TypeAnchorLinksPipeFixtureComponent } from './fixtures/type-anchor-links.pipe.component.fixture';

import { TypeDefinitionsFixturesModule } from './fixtures/type-definitions.module.fixture';

import { SkyDocsTypeDefinitionsProvider } from './type-definitions-provider';

describe('Anchor links pipe', () => {
  let fixture: ComponentFixture<TypeAnchorLinksPipeFixtureComponent>;
  let mockTypeDefinitionsProvider: SkyDocsTypeDefinitionsProvider;

  beforeEach(() => {
    mockTypeDefinitionsProvider = {
      anchorIds: {
        FooUser: 'foo-user',
      },
      typeDefinitions: [
        {
          name: 'FooUser',
        },
      ],
    };

    TestBed.configureTestingModule({
      imports: [TypeDefinitionsFixturesModule],
      providers: [
        {
          provide: SkyDocsTypeDefinitionsProvider,
          useValue: mockTypeDefinitionsProvider,
        },
      ],
    });

    fixture = TestBed.createComponent(TypeAnchorLinksPipeFixtureComponent);
  });

  it('should apply anchor tags to known types', () => {
    fixture.detectChanges();
    const result = fixture.debugElement.query(By.css('[data-sky-id="basic"]'))
      .nativeElement.textContent;
    expect(result).toEqual(
      '<code><a class="sky-docs-anchor-link" href="#foo-user">FooUser</a></code>'
    );
  });

  it('should allow omitting code tag formatting', () => {
    fixture.detectChanges();
    const result = fixture.debugElement.query(
      By.css('[data-sky-id="no-code-tags"]')
    ).nativeElement.textContent;
    expect(result).toEqual(
      '<a class="sky-docs-anchor-link" href="#foo-user">FooUser</a>'
    );
  });
});
