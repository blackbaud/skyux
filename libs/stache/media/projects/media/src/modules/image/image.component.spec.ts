import {
  async,
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  expect
} from '@skyux-sdk/testing';

import {
  SkyImageModule
} from './image.module';

import {
  SkyImageTestComponent
} from './fixtures/image.component.fixture';

function getCaptionElement(fixture: ComponentFixture<SkyImageTestComponent>): HTMLElement {
  return fixture.nativeElement.querySelector('.sky-image-caption');
}

describe('Image component', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        SkyImageTestComponent
      ],
      imports: [
        SkyImageModule
      ]
    });
  });

  it('should not display a caption or divider bar if no caption is present', async(() => {
    const fixture = TestBed.createComponent(SkyImageTestComponent);
    const cmp = fixture.componentInstance as SkyImageTestComponent;
    cmp.imageSource = '~/assets/demo-image.jpg';

    fixture.detectChanges();

    const captionElement = getCaptionElement(fixture);
    expect(cmp.caption).toBe(undefined);
    expect(captionElement).toBeFalsy();
  }));

  it('should display a caption and default divider bar when a caption is present', async(() => {
    const fixture = TestBed.createComponent(SkyImageTestComponent);
    const cmp = fixture.componentInstance as SkyImageTestComponent;
    cmp.imageSource = '~/assets/demo-image.jpg';
    cmp.caption = 'test caption';

    fixture.detectChanges();

    const captionElement = getCaptionElement(fixture);
    const caption = captionElement.textContent.trim();
    expect(caption).toBe('test caption');
    expect(cmp.captionType).toBe('default');
    expect(captionElement.classList.contains('sky-image-caption-default')).toBe(true);
  }));

  it('should display \'Do\' before the caption for success captionTypes', async(() => {
    const fixture = TestBed.createComponent(SkyImageTestComponent);
    const cmp = fixture.componentInstance as SkyImageTestComponent;
    cmp.imageSource = '~/assets/demo-image.jpg';
    cmp.caption = 'test caption';
    cmp.captionType = 'success';

    fixture.detectChanges();

    const captionElement = getCaptionElement(fixture);
    expect(captionElement.innerText.trim()).toBe('Do test caption');
    expect(captionElement.classList.contains('sky-image-caption-success')).toBe(true);
  }));

  it('should display \'Dont\' before the caption for danger captionTypes', async(() => {
    const fixture = TestBed.createComponent(SkyImageTestComponent);
    const cmp = fixture.componentInstance as SkyImageTestComponent;
    cmp.imageSource = '~/assets/demo-image.jpg';
    cmp.caption = 'test caption';
    cmp.captionType = 'danger';

    fixture.detectChanges();

    const captionElement = getCaptionElement(fixture);
    expect(captionElement.innerText.trim()).toBe('Don\'t test caption');
    expect(captionElement.classList.contains('sky-image-caption-danger')).toBe(true);
  }));

  it('should allow removing caption prefixes', async(() => {
    const fixture = TestBed.createComponent(SkyImageTestComponent);
    const cmp = fixture.componentInstance as SkyImageTestComponent;

    cmp.imageSource = '~/assets/demo-image.jpg';
    cmp.caption = 'test caption';
    cmp.captionType = 'success';
    cmp.showCaptionPrefix = false;

    fixture.detectChanges();

    const captionElement = getCaptionElement(fixture);
    expect(captionElement.innerText.trim()).toBe('test caption');
  }));

  it('should add a border with showBorder option set to true', async(() => {
    const fixture = TestBed.createComponent(SkyImageTestComponent);
    const cmp = fixture.componentInstance as SkyImageTestComponent;
    cmp.imageSource = '~/assets/demo-image.jpg';
    const el = fixture.nativeElement as HTMLElement;

    fixture.detectChanges();

    const imageRef: any = el.querySelector('.sky-image');
    expect(imageRef.classList.contains('sky-image-border')).toBe(false);
    cmp.showBorder = true;
    fixture.detectChanges();
    expect(imageRef.classList.contains('sky-image-border')).toBe(true);
  }));

  it('should set the alt text of an image', async(() => {
    const fixture = TestBed.createComponent(SkyImageTestComponent);
    const cmp = fixture.componentInstance as SkyImageTestComponent;
    cmp.imageSource = '~/assets/demo-image.jpg';
    const el = fixture.nativeElement as HTMLElement;
    cmp.imageAlt = 'test alt text';
    fixture.detectChanges();
    const imageRef: any = el.querySelector('.sky-image');

    expect(imageRef.alt).toBe('test alt text');
  }));

  it('should set the src of an image', async(() => {
    const fixture = TestBed.createComponent(SkyImageTestComponent);
    const cmp = fixture.componentInstance as SkyImageTestComponent;
    const el = fixture.nativeElement as HTMLElement;
    cmp.imageSource = '~/assets/demo-image.jpg';
    fixture.detectChanges();
    const imageRef: any = el.querySelector('.sky-image');

    expect(imageRef.src.indexOf('demo-image.jpg') !== -1).toBe(true);
  }));

  it('should be accessible', async(() => {
    const fixture = TestBed.createComponent(SkyImageTestComponent);
    const cmp = fixture.componentInstance as SkyImageTestComponent;
    cmp.imageSource = '~/assets/demo-image.jpg';
    cmp.imageAlt = 'demo image';
    cmp.caption = 'Sample caption.';
    fixture.detectChanges();
    expect(fixture.nativeElement).toBeAccessible();
  }));
});
