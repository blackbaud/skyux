import { TestBed } from '@angular/core/testing';
import { SkyInputBoxHostService } from '@skyux/forms';

describe('Input box host service', () => {
  let hostService: SkyInputBoxHostService;

  beforeEach(() => {
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

  it('should not an error and should populate the input box component if the populate method is called prior to initialization', () => {
    const mockTemplateRef = jasmine.createSpyObj('TemplateRef', [
      'createEmbeddedView',
    ]);
    const mockInputBox = jasmine.createSpyObj('SkyInputBoxComponent', [
      'populate',
    ]);

    hostService.init(mockInputBox);
    hostService.populate({ inputTemplate: mockTemplateRef });
    expect(mockInputBox.populate).toHaveBeenCalledWith({
      inputTemplate: mockTemplateRef,
    });
  });
});
