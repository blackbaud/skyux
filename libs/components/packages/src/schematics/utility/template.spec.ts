import {
  getElementsByTagName,
  getText,
  isParentNode,
  parseTemplate,
  swapAttributes,
  swapTags,
} from './template';

describe('template', () => {
  it('should parse a template string into a ParentNode', () => {
    const template = `<div>Test.</div>`;
    const parsed = parseTemplate(template);
    expect(parsed).toBeDefined();
    expect(parsed.childNodes.length).toBe(1);
    expect(parsed.childNodes[0].nodeName).toBe('div');
    expect(isParentNode(parsed)).toBe(true);
    expect(getElementsByTagName('div', parsed)).toHaveLength(1);
  });

  it('should swap tags', () => {
    const template = `<h1>Test.</h1><span>Example</span>`;
    const parsed = parseTemplate(template);
    expect(parsed).toBeDefined();
    const recorder = {
      insertLeft: jest.fn(),
      insertRight: jest.fn(),
      remove: jest.fn(),
    };
    const offset = 0;
    swapTags(
      template,
      recorder,
      offset,
      ['h1', 'span'],
      (position, oldTag) => {
        const char = position === 'open' ? '<' : '</';
        if (oldTag === 'h1') {
          return `${char}h2>`;
        } else if (oldTag === 'span') {
          return `${char}p>`;
        }
        throw new Error(`Unknown tag: ${oldTag}`);
      },
      parsed,
    );
    expect(recorder.remove).toHaveBeenCalledWith(0, 4);
    expect(recorder.remove).toHaveBeenCalledWith(9, 5);
    expect(recorder.insertLeft).toHaveBeenCalledWith(0, '<h2>');
    expect(recorder.insertLeft).toHaveBeenCalledWith(27, '</p>');
  });

  it('should swap attributes', () => {
    // Test basic attribute swapping
    const template = `<div class="old-class" id="test" data-old="value"></div>`;
    const parsed = parseTemplate(template);
    const divElement = getElementsByTagName('div', parsed)[0];

    const attributeSwaps = {
      class: 'className',
      'data-old': 'data-new',
    } as const;

    const result = swapAttributes(divElement, attributeSwaps, template);
    expect(result).toContain('className="old-class"');
    expect(result).toContain('data-new="value"');
    expect(result).toContain('id="test"'); // unchanged attribute should remain

    // Test with custom callback
    const customCallback = (
      oldAttr: string,
      newAttr: string,
      node: any,
      content: string,
    ) => {
      if (oldAttr === 'class') {
        return `${newAttr}="custom-value"`;
      }
      return null; // Skip this attribute
    };

    const customResult = swapAttributes(
      divElement,
      attributeSwaps,
      template,
      customCallback,
    );
    expect(customResult).toContain('className="custom-value"');
    expect(customResult).not.toContain('data-new'); // Should be skipped due to null return

    // Test element with no attributes
    const noAttrsTemplate = `<div></div>`;
    const noAttrsParsed = parseTemplate(noAttrsTemplate);
    const noAttrsElement = getElementsByTagName('div', noAttrsParsed)[0];
    const noAttrsResult = swapAttributes(
      noAttrsElement,
      attributeSwaps,
      noAttrsTemplate,
    );
    expect(noAttrsResult).toBe('');

    // Test element with single attribute
    const singleAttrTemplate = `<div class="test"></div>`;
    const singleAttrParsed = parseTemplate(singleAttrTemplate);
    const singleAttrElement = getElementsByTagName('div', singleAttrParsed)[0];
    const singleAttrResult = swapAttributes(
      singleAttrElement,
      { class: 'className' },
      singleAttrTemplate,
    );
    expect(singleAttrResult).toContain('className="test"');
  });

  it('should get text', () => {
    // Should retrieve text from a single text node
    const singleTextTemplate = `<div>Hello World</div>`;
    const singleTextParsed = parseTemplate(singleTextTemplate);
    const divElement = getElementsByTagName('div', singleTextParsed)[0];
    const singleTextResult = getText(divElement.childNodes);
    expect(singleTextResult).toBe('Hello World');

    // Should return empty string if text is falsy or empty
    const emptyTemplate = `<div></div>`;
    const emptyParsed = parseTemplate(emptyTemplate);
    const emptyDivElement = getElementsByTagName('div', emptyParsed)[0];
    const emptyResult = getText(emptyDivElement.childNodes);
    expect(emptyResult).toBe('');

    const whitespaceTemplate = `<div>   </div>`;
    const whitespaceParsed = parseTemplate(whitespaceTemplate);
    const whitespaceDivElement = getElementsByTagName(
      'div',
      whitespaceParsed,
    )[0];
    const whitespaceResult = getText(whitespaceDivElement.childNodes);
    expect(whitespaceResult).toBe('');

    // Should throw an error if there are multiple nodes provided
    const multipleNodesTemplate = `<div>Text <span>more text</span></div>`;
    const multipleNodesParsed = parseTemplate(multipleNodesTemplate);
    const multipleDivElement = getElementsByTagName(
      'div',
      multipleNodesParsed,
    )[0];
    expect(() => getText(multipleDivElement.childNodes)).toThrow(
      'The element contains additional markup that cannot be processed.',
    );
  });
});
