import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';

import {
  expect
} from '@skyux-sdk/testing';

import {
  DirectiveDefinitionFixtureComponent
} from './fixtures/directive-definition.component.fixture';

import {
  TypeDefinitionsFixturesModule
} from './fixtures/type-definitions.module.fixture';

import {
  SkyDocsTypeDefinitionsProvider
} from './type-definitions-provider';

describe('Directive definition component', function () {

  let fixture: ComponentFixture<DirectiveDefinitionFixtureComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TypeDefinitionsFixturesModule
      ],
      providers: [
        {
          provide: SkyDocsTypeDefinitionsProvider,
          useValue: {
            anchorIds: {
              'FooUser': 'foo-user'
            },
            typeDefinitions: [
              {
                name: 'FooUser'
              }
            ]
          }
        }
      ]
    });

    fixture = TestBed.createComponent(DirectiveDefinitionFixtureComponent);
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should set defaults', () => {
    fixture.detectChanges();
    const directiveDefinitionRef = fixture.componentInstance.directiveDefinitionRef;
    expect(directiveDefinitionRef.config).toBeUndefined();
  });

  it('should display the selector', () => {
    fixture.componentInstance.config = {
      name: 'FooComponent',
      selector: 'app-foo'
    };

    fixture.detectChanges();

    const selectorElement = fixture.nativeElement.querySelector('.sky-docs-directive-selector');

    expect(selectorElement.innerText).toEqual('app-foo');
  });

  it('should order Input properties first and then Output properties', () => {
    fixture.componentInstance.config = {
      name: 'FooComponent',
      selector: 'app-foo',
      properties: [
        {
          decorator: 'Output',
          isOptional: true,
          name: 'bar',
          type: 'EventEmitter&lt;void&gt;'
        },
        {
          decorator: 'Input',
          isOptional: true,
          name: 'foo',
          type: 'string'
        }
      ]
    };

    fixture.detectChanges();

    const rowElements = fixture.nativeElement.querySelectorAll('.sky-docs-property-definitions-table-cell-name');

    expect(rowElements.item(0).innerText).toContain('@Input()');
    expect(rowElements.item(1).innerText).toContain('@Output()');
  });

  it('should add links to types within description', fakeAsync(() => {
    fixture.componentInstance.config = {
      name: 'FooComponent',
      description: 'This description has a [[FooUser]].',
      selector: 'app-foo'
    };

    fixture.detectChanges();
    tick();

    const descriptionElement = fixture.nativeElement.querySelector(
      '.sky-docs-directive-definition-description'
    );

    expect(descriptionElement.innerHTML).toContain(
      '<a class="sky-docs-anchor-link" href="#foo-user">FooUser</a>'
    );
  }));

});
