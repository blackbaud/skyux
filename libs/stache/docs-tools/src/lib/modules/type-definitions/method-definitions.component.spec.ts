import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { expect } from '@skyux-sdk/testing';

import { MethodDefinitionsFixtureComponent } from './fixtures/method-definitions.component.fixture';
import { TypeDefinitionsFixturesModule } from './fixtures/type-definitions.module.fixture';
import { SkyDocsTypeDefinitionsProvider } from './type-definitions-provider';

describe('Method definitions component', function () {
  let fixture: ComponentFixture<MethodDefinitionsFixtureComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TypeDefinitionsFixturesModule],
      providers: [
        {
          provide: SkyDocsTypeDefinitionsProvider,
          useValue: {
            anchorIds: {
              FooUser: 'foo-user',
            },
            typeDefinitions: [
              {
                name: 'FooUser',
              },
            ],
          },
        },
      ],
    });

    fixture = TestBed.createComponent(MethodDefinitionsFixtureComponent);
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should set defaults', () => {
    fixture.detectChanges();
    const methodDefinitionsRef = fixture.componentInstance.methodDefinitionsRef;
    expect(methodDefinitionsRef.config).toEqual({});
  });

  it('should add links to types within description', fakeAsync(() => {
    fixture.componentInstance.config = {
      methods: [
        {
          name: 'FooMethod',
          description: 'This description has a FooUser.',
          type: {
            callSignature: {
              returnType: {
                type: 'reference',
                name: 'FooUser',
              },
            },
          },
        },
      ],
    };

    fixture.detectChanges();
    tick();

    const element = fixture.nativeElement.querySelector(
      '.sky-docs-method-definition-description'
    );

    expect(element.innerHTML).toContain(
      '<a class="sky-docs-anchor-link" href="#foo-user">FooUser</a>'
    );
  }));

  it('should add links to types within deprecation warning', fakeAsync(() => {
    fixture.componentInstance.config = {
      methods: [
        {
          name: 'FooMethod',
          deprecationWarning: 'This description has a FooUser.',
          type: {
            callSignature: {
              returnType: {
                type: 'reference',
                name: 'FooUser',
              },
            },
          },
        },
      ],
    };

    fixture.detectChanges();
    tick();

    const element = fixture.nativeElement.querySelector(
      '.sky-docs-method-definition-deprecation-warning'
    );

    expect(element.innerHTML).toContain(
      '<a class="sky-docs-anchor-link" href="#foo-user">FooUser</a>'
    );
  }));
});
