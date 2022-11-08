import { SkyTextEditorService } from './text-editor.service';

describe('Text editor service', () => {
  it('should throw an error when accessing editor without setting it first', () => {
    const svc = new SkyTextEditorService();
    expect(() => {
      const editor = svc.editor;
      editor.toString();
    }).toThrowError('Editor has not been initialized.');
  });
});
