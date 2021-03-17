import {
  Component,
  ElementRef,
  ViewChild
} from '@angular/core';

import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  SkyActionButtonAdapterService
} from './action-button-adapter-service';

@Component({
  selector: 'sky-test-cmp',
  template: `
    <div
      [style.width]="parentWidth"
    >
      <div #el>
        Hello world
      </div>
    </div>
  `
})
class SkyActionButtonAdapterTestComponent {

  public parentWidth: string;

  @ViewChild('el', {
    read: ElementRef,
    static: true
  })
  public input: ElementRef;

}

describe('Action button adapter service', () => {
  let fixture: ComponentFixture<SkyActionButtonAdapterTestComponent>;
  let inputRef: ElementRef;
  let adapter: SkyActionButtonAdapterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        SkyActionButtonAdapterTestComponent
      ],
      providers: [
        SkyActionButtonAdapterService
      ]
    });

    fixture = TestBed.createComponent(SkyActionButtonAdapterTestComponent);
    fixture.detectChanges();
    inputRef = fixture.componentInstance.input;
    adapter = TestBed.inject(SkyActionButtonAdapterService);
  });

  it('should return width for parent', () => {
    fixture.componentInstance.parentWidth = '900px';
    fixture.detectChanges();
    const width = adapter.getParentWidth(inputRef);
    expect(width).toEqual(900);
  });

  it('should set responsive sm class when width is under 937', () => {
    adapter.setResponsiveClass(inputRef, 937);
    fixture.detectChanges();

    expect(inputRef.nativeElement).toHaveClass('sky-action-button-container-sm');
    expect(inputRef.nativeElement).not.toHaveClass('sky-action-button-container-md');
    expect(inputRef.nativeElement).not.toHaveClass('sky-action-button-container-lg');
  });

  it('should set responsive md class when width is under 1398', () => {
    adapter.setResponsiveClass(inputRef, 1398);
    fixture.detectChanges();

    expect(inputRef.nativeElement).not.toHaveClass('sky-action-button-container-sm');
    expect(inputRef.nativeElement).toHaveClass('sky-action-button-container-md');
    expect(inputRef.nativeElement).not.toHaveClass('sky-action-button-container-lg');
  });

  it('should set responsive lg class when width is above 1399', () => {
    adapter.setResponsiveClass(inputRef, 1399);
    fixture.detectChanges();

    expect(inputRef.nativeElement).not.toHaveClass('sky-action-button-container-sm');
    expect(inputRef.nativeElement).not.toHaveClass('sky-action-button-container-md');
    expect(inputRef.nativeElement).toHaveClass('sky-action-button-container-lg');
  });

});
