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
  ParameterDefinitionsFixtureComponent
} from './fixtures/parameter-definitions.component.fixture';

import {
  TypeDefinitionsFixturesModule
} from './fixtures/type-definitions.module.fixture';

import {
  SkyDocsTypeDefinitionsProvider
} from './type-definitions-provider';

describe('Parameter definitions component', function () {

  let fixture: ComponentFixture<ParameterDefinitionsFixtureComponent>;

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

    fixture = TestBed.createComponent(ParameterDefinitionsFixtureComponent);
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should set defaults', () => {
    fixture.detectChanges();
    const parameterDefinitionRef = fixture.componentInstance.parameterDefinitionRef;
    expect(parameterDefinitionRef.defaultValue).toBeUndefined();
    expect(parameterDefinitionRef.isOptional).toEqual(false);
    expect(parameterDefinitionRef.parameterName).toBeUndefined();
    expect(parameterDefinitionRef.parameterType).toBeUndefined();
    expect(parameterDefinitionRef.templateRef).toBeDefined();
  });

  it('should display the parameter\'s signature', fakeAsync(() => {
    fixture.componentInstance.defaultValue = 'string';
    fixture.componentInstance.isOptional = true;
    fixture.componentInstance.parameterName = 'foobar';
    fixture.componentInstance.parameterType = 'number';

    fixture.detectChanges();
    tick();

    const signatureElement = fixture.nativeElement.querySelector(
      '.sky-docs-parameter-definition-header'
    );

    expect(signatureElement.textContent).toEqual('foobar: number = string');
  }));

  it('should display default value', fakeAsync(() => {
    fixture.componentInstance.parameterName = 'foobar';
    fixture.componentInstance.parameterType = 'number';
    fixture.componentInstance.defaultValue = '5';
    fixture.componentInstance.isOptional = true;

    fixture.detectChanges();
    tick();

    const optionalElement = fixture.nativeElement.querySelector(
      '.sky-docs-parameter-definition-label-optional'
    );

    expect(optionalElement.innerText).toContain(
      'Optional. Default is 5.'
    );
  }));

  it('should add links around parameter types', fakeAsync(() => {
    fixture.componentInstance.parameterName = 'user';
    fixture.componentInstance.parameterType = 'FooUser';

    fixture.detectChanges();
    tick();

    const signatureElement = fixture.nativeElement.querySelector(
      '.sky-docs-parameter-definition-header'
    );

    expect(signatureElement.innerHTML).toContain(
      '<a class="sky-docs-anchor-link" href="#foo-user">FooUser</a>'
    );
  }));

  it('should add links around default value', fakeAsync(() => {
    fixture.componentInstance.parameterName = 'foobar';
    fixture.componentInstance.parameterType = 'FooUser';
    fixture.componentInstance.defaultValue = 'new FooUser()';
    fixture.componentInstance.isOptional = true;

    fixture.detectChanges();
    tick();

    const optionalElement = fixture.nativeElement.querySelector(
      '.sky-docs-parameter-definition-label-optional'
    );

    expect(optionalElement.innerHTML).toContain(
      'new <a class="sky-docs-anchor-link" href="#foo-user">FooUser</a>()'
    );
  }));

  it('should format parameters with call signature types', fakeAsync(() => {
    fixture.componentInstance.isOptional = true;
    fixture.componentInstance.parameterName = 'foobar';
    fixture.componentInstance.parameterType = {
      callSignature: {
        returnType: 'void',
        parameters: [
          {
            name: 'user',
            type: 'FooUser',
            isOptional: false
          },
          {
            name: 'search',
            type: {
              callSignature: {
                returnType: 'FooUser',
                parameters: []
              }
            },
            isOptional: true
          }
        ]
      }
    };

    fixture.detectChanges();
    tick();

    const signatureElement = fixture.nativeElement.querySelector(
      '.sky-docs-parameter-definition-header'
    );

    expect(signatureElement.textContent).toEqual(
      'foobar?: (user: FooUser, search?: () => FooUser) => void'
    );
  }));

});
