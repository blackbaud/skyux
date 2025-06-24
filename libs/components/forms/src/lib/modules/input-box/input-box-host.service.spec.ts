import { TestBed } from '@angular/core/testing';

import { Observable, ReplaySubject, firstValueFrom } from 'rxjs';

import { SkyInputBoxHostService } from './input-box-host.service';
import { SkyInputBoxComponent } from './input-box.component';

describe('Input box host service', () => {
  let hostService: SkyInputBoxHostService;
  let mockInputBox: jasmine.SpyObj<SkyInputBoxComponent>;

  beforeEach(() => {
    mockInputBox = jasmine.createSpyObj(
      'SkyInputBoxComponent',
      [
        'containsElement',
        'queryPopulatedElement',
        'populate',
        'setHostHintText',
        'setHintTextHidden',
        'setHintTextScreenReaderOnly',
      ],
      {
        ariaDescribedBy: new ReplaySubject<string>(1),
        controlId: 'controlId',
        labelId: 'labelId',
        labelText: 'labelText',
      },
    );

    TestBed.configureTestingModule({
      providers: [SkyInputBoxHostService],
    });

    hostService = TestBed.inject(SkyInputBoxHostService);
  });

  it('should throw an error if the populate method is called prior to initialization', () => {
    expect(() =>
      hostService.populate({
        inputTemplate: jasmine.createSpyObj('TemplateRef', [
          'createEmbeddedView',
        ]),
      }),
    ).toThrowError(
      'Cannot populate the input box because `SkyInputBoxHostService` has not yet been initialized. Try running the `populate` method within an Angular lifecycle hook, such as `ngOnInit`.',
    );
  });

  it('should should populate the input box component if the populate method is called after initialization', () => {
    const mockTemplateRef = jasmine.createSpyObj('TemplateRef', [
      'createEmbeddedView',
    ]);

    hostService.init(mockInputBox);
    hostService.populate({ inputTemplate: mockTemplateRef });
    expect(mockInputBox.populate).toHaveBeenCalledWith({
      inputTemplate: mockTemplateRef,
    });
  });

  it('should throw an error if the `setHintTextHidden` method is called prior to initialization', () => {
    expect(() => hostService.setHintTextHidden(true)).toThrowError(
      'Cannot hide hint text on the input box because `SkyInputBoxHostService` has not yet been initialized.',
    );
  });

  it('should populate the input box component if the `setHintTextHidden` method is called after initialization', () => {
    hostService.init(mockInputBox);
    hostService.setHintTextHidden(true);
    expect(mockInputBox.setHintTextHidden).toHaveBeenCalledWith(true);
  });

  it('should throw an error if the `focusIsInInput` method is called prior to initialization', () => {
    const targetElement = document.createElement('div');
    expect(() =>
      hostService.focusIsInInput(targetElement as EventTarget),
    ).toThrowError(
      'Cannot get whether the focus is in the input box because `SkyInputBoxHostService` has not yet been initialized.',
    );
  });

  it('should call the input box `containsElement` method if the `focusIsInInput` is called after initialization', () => {
    hostService.init(mockInputBox);
    const targetElement = document.createElement('div');
    hostService.focusIsInInput(targetElement as EventTarget);
    expect(mockInputBox.containsElement).toHaveBeenCalledWith(targetElement);
  });

  it('should throw an error if the `queryHost` method is called prior to initialization', () => {
    expect(() => hostService.queryHost('query string')).toThrowError(
      'Cannot query input box host because `SkyInputBoxHostService` has not yet been initialized.',
    );
  });

  it('should call the input box `queryPopulatedElement` method if the `queryHost` is called after initialization', () => {
    hostService.init(mockInputBox);
    hostService.queryHost('query string');
    expect(mockInputBox.queryPopulatedElement).toHaveBeenCalledWith(
      'query string',
    );
  });

  it('should throw an error if the `setHintText` method is called prior to initialization', () => {
    expect(() => hostService.setHintText('Test')).toThrowError(
      'Cannot set hint text on the input box because `SkyInputBoxHostService` has not yet been initialized.',
    );
  });

  it('should populate the input box component if the `setHintText` method is called after initialization', () => {
    hostService.init(mockInputBox);
    hostService.setHintText('Test');
    expect(mockInputBox.setHostHintText).toHaveBeenCalledWith('Test');
  });

  it('should throw an error if the `setHintTextScreenReaderOnly` method is called prior to initialization', () => {
    expect(() => hostService.setHintTextScreenReaderOnly(true)).toThrowError(
      'Cannot remove hint text on the input box because `SkyInputBoxHostService` has not yet been initialized.',
    );
  });

  it('should populate the input box component if the `setHintTextScreenReaderOnly` method is called after initialization', () => {
    hostService.init(mockInputBox);
    hostService.setHintTextScreenReaderOnly(true);
    expect(mockInputBox.setHintTextScreenReaderOnly).toHaveBeenCalledWith(true);
  });

  it('should return an observable for ariaDescribedBy after initialization', async () => {
    hostService.init(mockInputBox);

    mockInputBox.ariaDescribedBy.next('test');

    await expectAsync(
      firstValueFrom(hostService.ariaDescribedBy as Observable<string>),
    ).toBeResolvedTo('test');
  });

  it('should return an empty string for control ID when host is undefined', () => {
    expect(hostService.controlId).toBe('');
  });

  it('should return control ID when host is defined', () => {
    hostService.init(mockInputBox);

    expect(hostService.controlId).toBe('controlId');
  });

  it('should return an empty string for label ID when host is undefined', () => {
    expect(hostService.labelId).toBe('');
  });

  it('should return label ID when host is defined', () => {
    hostService.init(mockInputBox);

    expect(hostService.labelId).toBe('labelId');
  });

  it('should return label ID when host is defined but label text is undefined', () => {
    mockInputBox.labelText = undefined;
    hostService.init(mockInputBox);

    expect(hostService.labelId).toBe('labelId');
  });

  it('should return an empty string for label text when host is undefined', () => {
    expect(hostService.labelText).toBe('');
  });

  it('should return label text when host is defined', () => {
    hostService.init(mockInputBox);

    expect(hostService.labelText).toBe('labelText');
  });

  it('should undefined for ariaDescribedBy when host is undefined', () => {
    expect(hostService.ariaDescribedBy).toBeUndefined();
  });

  it('should emit inputFocusin observable when triggerFocusin is called', async () => {
    hostService.init(mockInputBox);
    
    const focusinPromise = firstValueFrom(hostService.inputFocusin);
    hostService.triggerFocusin();
    
    await expectAsync(focusinPromise).toBeResolved();
  });

  it('should emit inputFocusout observable when triggerFocusout is called', async () => {
    hostService.init(mockInputBox);
    
    const focusoutPromise = firstValueFrom(hostService.inputFocusout);
    hostService.triggerFocusout();
    
    await expectAsync(focusoutPromise).toBeResolved();
  });
});
