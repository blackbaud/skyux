import { TestBed } from '@angular/core/testing';

import { Observable, ReplaySubject, firstValueFrom } from 'rxjs';

import { SkyInputBoxHostService } from './input-box-host.service';
import { SkyInputBoxComponent } from './input-box.component';

describe('Input box host service', () => {
  let hostService: SkyInputBoxHostService;
  let mockInputBox: jasmine.SpyObj<SkyInputBoxComponent>;

  beforeEach(() => {
    mockInputBox = jasmine.createSpyObj('SkyInputBoxComponent', ['populate'], {
      ariaDescribedBy: new ReplaySubject<string>(1),
    });

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
      })
    ).toThrowError(
      'Cannot populate the input box because `SkyInputBoxHostService` has not yet been initialized. Try running the `populate` method within an Angular lifecycle hook, such as `ngOnInit`.'
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

  it('should return an observable for ariaDescribedBy after initialization', async () => {
    hostService.init(mockInputBox);

    mockInputBox.ariaDescribedBy.next('test');

    await expectAsync(
      firstValueFrom(hostService.ariaDescribedBy as Observable<string>)
    ).toBeResolvedTo('test');
  });

  it('should return an empty string for control ID when host is undefined', () => {
    expect(hostService.controlId).toBe('');
  });

  it('should return an empty string for label text when host is undefined', () => {
    expect(hostService.labelText).toBe('');
  });

  it('should undefined for ariaDescribedBy when host is undefined', () => {
    expect(hostService.ariaDescribedBy).toBeUndefined();
  });
});
