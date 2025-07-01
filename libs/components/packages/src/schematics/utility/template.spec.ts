import {
  getElementsByTagName,
  isParentNode,
  parseTemplate,
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
});
