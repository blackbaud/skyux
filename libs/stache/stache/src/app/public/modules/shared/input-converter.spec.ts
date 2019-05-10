import {
  InputConverter,
  booleanConverter,
  stringConverter,
  numberConverter
} from './input-converter';

class MockComponent {
  @InputConverter()
  public myBoolean: boolean;

  @InputConverter()
  public myString: string;

  @InputConverter()
  public myNumber: number;
}

class MockComponentExplicit {
  @InputConverter(booleanConverter)
  public myBoolean: boolean;

  @InputConverter(stringConverter)
  public myString: string;

  @InputConverter(numberConverter)
  public myNumber: number;
}

describe('InputConverter', () => {
  it('should convert values when using explicit converters', () => {
    const component = new MockComponentExplicit();

    component.myBoolean = 'true' as any;
    expect(component.myBoolean).toBe(true);

    component.myBoolean = 'false' as any;
    expect(component.myBoolean).toBe(false);

    component.myString = 5 as any;
    expect(component.myString).toBe('5');

    component.myString = 'hello' as any;
    expect(component.myString).toBe('hello');

    component.myNumber = '7' as any;
    expect(component.myNumber).toBe(7);
  });

  it('should convert values using metadata', () => {
    const component = new MockComponent();

    component.myBoolean = 'true' as any;
    expect(component.myBoolean).toBe(true);

    component.myBoolean = 'false' as any;
    expect(component.myBoolean).toBe(false);

    component.myString = 5 as any;
    expect(component.myString).toBe('5');

    component.myString = 'hello' as any;
    expect(component.myString).toBe('hello');

    component.myNumber = '7' as any;
    expect(component.myNumber).toBe(7);
  });

  it('should throw an error if the converter does not exist', () => {
    let component;
    try {
      class BadMockComponent {
        @InputConverter()
        public myArray: number[];
      }
      component = new BadMockComponent();

      // Necessary to keep TS happy
      component.myArray = [];
    } catch (error) {
      expect(error.message).toBe('There is no converter for the given property type Array.');
    }
  });

  it('should throw an error if metadata cannot be found', () => {
    spyOn(Reflect, 'getMetadata').and.returnValue(undefined);
    let component;
    try {
      class BadMockComponent {
        @InputConverter()
        public myNumber: number;
      }
      component = new BadMockComponent();

      // Necessary to keep TS happy
      component.myNumber = 0;
    } catch (error) {
      expect(error.message).toBe('The reflection metadata could not be found.');
    }
  });
});
