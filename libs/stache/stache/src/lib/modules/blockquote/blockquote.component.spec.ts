import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { expect } from '@skyux-sdk/testing';

import { StacheBlockquoteComponent } from './blockquote.component';
import { StacheBlockquoteModule } from './blockquote.module';

describe('StacheBlockquoteComponent', () => {
  let component: StacheBlockquoteComponent;
  let fixture: ComponentFixture<StacheBlockquoteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StacheBlockquoteModule],
    }).compileComponents();

    fixture = TestBed.createComponent(StacheBlockquoteComponent);
    component = fixture.componentInstance;
  });

  it('should render the component', () => {
    expect(fixture).toExist();
  });

  it('should display a source if author or quoteSource are provided', () => {
    component.author = 'Some Author';
    fixture.detectChanges();
    const testFixture = fixture.debugElement.query(
      By.css('.stache-blockquote')
    ).nativeElement;
    expect(testFixture.innerHTML).toContain('stache-blockquote-source');
  });

  it('should not display a source if author and quoteSource are not provided', () => {
    component.author = undefined;
    component.quoteSource = undefined;
    fixture.detectChanges();
    const testFixture = fixture.debugElement.query(
      By.css('.stache-blockquote')
    ).nativeElement;
    expect(testFixture.innerHTML).not.toContain('stache-blockquote-source');
  });

  it('should display the author name if author attribute is provided', () => {
    component.author = 'Some Author';
    fixture.detectChanges();
    const testFixture = fixture.debugElement.query(
      By.css('.stache-blockquote-source')
    ).nativeElement;
    expect(testFixture.textContent).toContain('Some Author');
  });

  it('should link the author name to a source if sourceQuote is provided', () => {
    component.author = 'Some Author';
    component.quoteSource = 'http://source.html';
    fixture.detectChanges();
    const testFixture = fixture.debugElement.query(
      By.css('.stache-blockquote-source > a')
    ).nativeElement;
    expect(testFixture.href).toContain('http://source.html');
    expect(testFixture.textContent).toContain('Some Author');
  });

  it('should set author to "Source" on init if quoteSource is provided without an author', () => {
    component.author = undefined;
    component.quoteSource = 'http://source.html';
    component.ngOnInit();
    fixture.detectChanges();
    const testFixture = fixture.debugElement.query(
      By.css('.stache-blockquote-source > a')
    ).nativeElement;
    expect(component.author).toBe('Source');
    expect(testFixture.href).toContain('http://source.html');
    expect(testFixture.textContent).toContain('Source');
  });

  it('should return a boolean from hasAuthor whether the author has been set', () => {
    component.author = 'Test Author';
    fixture.detectChanges();
    const withAuthor = component.hasAuthor();
    component.author = undefined;
    fixture.detectChanges();
    const noAuthor = component.hasAuthor();
    expect(withAuthor).toBe(true);
    expect(noAuthor).toBe(false);
  });

  it('should return a boolean from hasQuoteSource whether a quoteSource has been set', () => {
    component.quoteSource = 'https://some-source.html';
    fixture.detectChanges();
    const withSource = component.hasQuoteSource();
    component.quoteSource = undefined;
    fixture.detectChanges();
    const noSource = component.hasQuoteSource();
    expect(withSource).toBe(true);
    expect(noSource).toBe(false);
  });
});
