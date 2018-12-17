import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { expect } from '@blackbaud/skyux-lib-testing';
import { StacheCopyToClipboardComponent } from '../clipboard';
import { SkyClipboardModule } from '@blackbaud/skyux-lib-clipboard';

describe('StacheCopyToClipboardComponent', () => {
  let fixture: ComponentFixture<StacheCopyToClipboardComponent>;
  let element: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        StacheCopyToClipboardComponent
      ],
      providers: [ ],
      imports: [
        SkyClipboardModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StacheCopyToClipboardComponent);
    element = fixture.nativeElement;
  });

  it('should wrap the sky-clipboard component', () => {
    const skyclipboard = element.querySelector('sky-copy-to-clipboard');
    expect(skyclipboard).toExist();
    expect(skyclipboard).toBeTruthy();
  });

  it('should pass accessibility', async(() => {
    fixture.detectChanges();
    expect(element).toBeAccessible();
  }));
});
