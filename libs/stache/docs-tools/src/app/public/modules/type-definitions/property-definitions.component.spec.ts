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
  PropertyDefinitionsFixtureComponent
} from './fixtures/property-definitions.component.fixture';

import {
  TypeDefinitionsFixturesModule
} from './fixtures/type-definitions.module.fixture';

import {
  SkyDocsTypeDefinitionsProvider
} from './type-definitions-provider';

describe('Property definitions component', function () {

  let fixture: ComponentFixture<PropertyDefinitionsFixtureComponent>;

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
              'Foo': 'foo',
              'FooUser': 'foo-user'
            },
            typeDefinitions: [
              {
                name: 'Foo'
              },
              {
                name: 'FooUser'
              }
            ]
          }
        }
      ]
    });

    fixture = TestBed.createComponent(PropertyDefinitionsFixtureComponent);
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should set defaults', () => {
    fixture.detectChanges();
    const propertyDefinitionRef = fixture.componentInstance.propertyDefinitionRef;
    expect(propertyDefinitionRef.defaultValue).toBeUndefined();
    expect(propertyDefinitionRef.deprecationWarning).toBeUndefined();
    expect(propertyDefinitionRef.isOptional).toEqual(false);
    expect(propertyDefinitionRef.propertyDecorator).toBeUndefined();
    expect(propertyDefinitionRef.propertyName).toBeUndefined();
    expect(propertyDefinitionRef.propertyType).toBeUndefined();
    expect(propertyDefinitionRef.templateRef).toBeDefined();
  });

  it('should display the property\'s signature', fakeAsync(() => {
    fixture.componentInstance.defaultValue = 'string';
    fixture.componentInstance.isOptional = true;
    fixture.componentInstance.propertyDecorator = 'Input';
    fixture.componentInstance.propertyName = 'foobar';
    fixture.componentInstance.propertyType = 'number';

    fixture.detectChanges();
    tick();

    const signatureElement = fixture.nativeElement.querySelector(
      '.sky-docs-property-definitions-table-cell-name'
    );

    expect(signatureElement.textContent).toEqual('@Input()foobar: number');
  }));

  it('should should display call signature types', fakeAsync(() => {
    fixture.componentInstance.isOptional = true;
    fixture.componentInstance.propertyName = 'foobar';
    fixture.componentInstance.propertyType = {
      callSignature: {
        returnType: 'string[]',
        parameters: [
          {
            isOptional: false,
            name: 'userId',
            type: 'number'
          }
        ]
      }
    };

    fixture.detectChanges();
    tick();

    const signatureElement = fixture.nativeElement.querySelector(
      '.sky-docs-property-definitions-table-cell-name'
    );

    expect(signatureElement.textContent).toEqual('foobar?: (userId: number) => string[]');
  }));

  it('should display default value', fakeAsync(() => {
    fixture.componentInstance.propertyName = 'foobar';
    fixture.componentInstance.propertyType = 'number';
    fixture.componentInstance.defaultValue = '5';
    fixture.componentInstance.isOptional = true;

    fixture.detectChanges();
    tick();

    const descriptionElement = fixture.nativeElement.querySelector(
      '.sky-docs-property-definitions-table-cell-description'
    );

    expect(descriptionElement.innerText).toContain(
      'Optional. Default is 5.'
    );
  }));

  it('should display deprecation messages', fakeAsync(() => {
    fixture.componentInstance.deprecationWarning = 'Do not use this feature.';
    fixture.componentInstance.description = 'This is the description.';
    fixture.componentInstance.propertyName = 'foobar';
    fixture.componentInstance.propertyType = 'number';

    fixture.detectChanges();
    tick();

    const descriptionElement = fixture.nativeElement.querySelector(
      '.sky-docs-property-definitions-table-cell-description .sky-text-warning'
    );

    expect(descriptionElement.innerText).toContain(
      'Do not use this feature.'
    );
  }));

  it('should add links and code tags to types within deprecation messages', fakeAsync(() => {
    fixture.componentInstance.deprecationWarning = 'Use Foo from FooUser instead, because Foo is now supported.';
    fixture.componentInstance.propertyName = 'foobar';
    fixture.componentInstance.propertyType = 'number';

    fixture.detectChanges();
    tick();

    const descriptionElement = fixture.nativeElement.querySelector(
      '.sky-docs-property-definitions-table-cell-description .sky-text-warning'
    );

    expect(descriptionElement.innerHTML).toContain([
      'Use <code><a class="sky-docs-anchor-link" href="#foo">Foo</a></code> from',
      '<code><a class="sky-docs-anchor-link" href="#foo-user">FooUser</a></code> instead,',
      'because <code><a class="sky-docs-anchor-link" href="#foo">Foo</a></code> is now supported.'
    ].join(' '));
  }));

  it('should add links around property types', fakeAsync(() => {
    fixture.componentInstance.propertyName = 'user';
    fixture.componentInstance.propertyType = 'Foo';

    fixture.detectChanges();
    tick();

    const nameElement = fixture.nativeElement.querySelector(
      '.sky-docs-property-definitions-table-cell-name'
    );

    expect(nameElement.innerHTML).toContain(
      '<a class="sky-docs-anchor-link" href="#foo">Foo</a>'
    );
  }));

  it('should add links around default value', fakeAsync(() => {
    fixture.componentInstance.propertyName = 'foobar';
    fixture.componentInstance.propertyType = 'FooUser';
    fixture.componentInstance.defaultValue = 'new FooUser()';
    fixture.componentInstance.isOptional = true;

    fixture.detectChanges();
    tick();

    const descriptionElement = fixture.nativeElement.querySelector(
      '.sky-docs-property-definitions-table-cell-description'
    );

    expect(descriptionElement.innerHTML).toContain(
      'new <a class="sky-docs-anchor-link" href="#foo-user">FooUser</a>()'
    );
  }));

});
