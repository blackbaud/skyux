import { TmplAstElement } from '@angular-eslint/bundled-angular-compiler';

export function getChildNodeOf(
  el: TmplAstElement,
  childNodeName: string,
): TmplAstElement | undefined {
  const traverseChildNodes = ({
    children,
  }: TmplAstElement): TmplAstElement | undefined => {
    return children.find(
      (child) =>
        child instanceof TmplAstElement &&
        (child.name === childNodeName || traverseChildNodes(child)),
    ) as TmplAstElement | undefined;
  };

  return traverseChildNodes(el);
}
