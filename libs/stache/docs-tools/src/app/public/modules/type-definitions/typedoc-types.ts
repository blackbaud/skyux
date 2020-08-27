export interface TypeDocComment {

  shortText?: string;

  tags?: {
    param?: string;
    tag: 'default' | 'defaultvalue' | 'defaultValue' | 'deprecated' | 'example' | 'param';
    text: string;
  }[];

  text?: string;

}

export interface TypeDocSource {

  fileName: string;

}

export interface TypeDocSignature {

  comment?: TypeDocComment;

  name: string;

  parameters?: TypeDocParameter[];

  type: TypeDocType;

}

export interface TypeDocType {

  declaration?: {
    signatures?: TypeDocSignature[];
    indexSignature?: TypeDocSignature[];
  };

  elementType?: TypeDocType;

  type: 'array' | 'intrinsic' | 'reference' | 'reflection' | 'stringLiteral' | 'typeParameter' | 'union';

  typeArguments?: TypeDocType[];

  types?: {
    name: string;
    type: 'intrinsic' | 'reference' | 'stringLiteral';
    value: string;
  }[];

  name: string;

  constraint?: {
    name: string;
  };

}

export interface TypeDocParameter {

  comment?: TypeDocComment;

  name: string;

  type: TypeDocType;

  flags?: {
    isOptional?: boolean;
  };

}

export interface TypeDocItemMember {

  comment?: TypeDocComment;

  decorators?: {
    arguments?: {
      bindingPropertyName: string;
    };
    name: 'Input' | 'Output';
    type: TypeDocType;
  }[];

  defaultValue?: string;

  flags?: {
    isOptional?: boolean;
  };

  kindString?: 'Accessor' | 'Parameter' | 'Property' | 'Method';

  getSignature?: {
    comment: TypeDocComment;
    name: string;
    type: TypeDocType;
  }[];

  name: string;

  setSignature?: {
    comment: TypeDocComment;
    parameters?: TypeDocParameter[];
    type: TypeDocType;
  }[];

  signatures?: TypeDocSignature[];

  sources?: TypeDocSource[];

  type?: TypeDocType;
}

export interface TypeDocItem {

  anchorId?: string;

  children?: TypeDocItemMember[];

  comment?: TypeDocComment;

  decorators?: {
    arguments?: {
      obj: string;
    };
    name: 'Component' | 'Injectable';
    type: TypeDocType;
  }[];

  kindString?: 'Class' | 'Enumeration' | 'Interface' | 'Type alias';

  indexSignature?: TypeDocSignature[];

  name: string;

  sources?: TypeDocSource[];

  type?: TypeDocType;

  typeParameter?: {
    name: string;
    type: TypeDocType;
  }[];

}
