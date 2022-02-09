export interface TypeDocComment {
  shortText?: string;

  tags?: {
    param?: string;
    tag:
      | 'default'
      | 'defaultValue'
      | 'deprecated'
      | 'example'
      | 'param'
      | 'required';
    text: string;
  }[];

  text?: string;
}

export interface TypeDocSource {
  fileName: string;
}

export interface TypeDocSignature {
  comment?: TypeDocComment;

  kindString?: 'Call signature' | 'Index signature';

  name: string;

  parameters?: TypeDocParameter[];

  type: TypeDocType;

  typeParameter?: TypeDocTypeParameter[];
}

export interface TypeDocTypeParameter {
  name: string;
  kindString: 'Type parameter';
  type?: TypeDocType;
}

export interface TypeDocType {
  constraint?: {
    name: string;
  };

  declaration?: {
    children?: TypeDocEntryChild[];
    indexSignature?: TypeDocSignature;
    signatures?: TypeDocSignature[];
  };

  elementType?: TypeDocType;

  name?: string;

  operator?: 'keyof';

  target?: {
    name: string;
  };

  type?:
    | 'array'
    | 'intrinsic'
    | 'reference'
    | 'reflection'
    | 'stringLiteral'
    | 'typeParameter'
    | 'typeOperator'
    | 'union'
    | 'unknown';

  typeArguments?: TypeDocType[];

  types?: TypeDocType[];

  value?: string;
}

export interface TypeDocParameter {
  comment?: TypeDocComment;

  defaultValue?: string;

  kindString: 'Parameter';

  name: string;

  type: TypeDocType;

  flags?: {
    isOptional?: boolean;
  };
}

export interface TypeDocEntryChild {
  comment?: TypeDocComment;

  decorators?: {
    arguments?: {
      bindingPropertyName?: string;
    };
    name: 'Input' | 'Output';
    type: TypeDocType;
  }[];

  defaultValue?: string;

  flags?: {
    isOptional?: boolean;
  };

  kindString?:
    | 'Accessor'
    | 'Call signature'
    | 'Index signature'
    | 'Enumeration member'
    | 'Parameter'
    | 'Property'
    | 'Method';

  getSignature?: {
    comment: TypeDocComment;
    name: string;
    type: TypeDocType;
  }[];

  name?: string;

  setSignature?: {
    comment: TypeDocComment;
    name: string;
    parameters?: TypeDocParameter[];
    type: TypeDocType;
  }[];

  signatures?: TypeDocSignature[];

  sources?: TypeDocSource[];

  type?: TypeDocType;
}

export interface TypeDocEntry {
  anchorId?: string;

  children?: TypeDocEntryChild[];

  comment?: TypeDocComment;

  decorators?: {
    arguments?: {
      obj?: string;
    };
    name: 'Component' | 'Directive' | 'Injectable' | 'NgModule' | 'Pipe';
    type: TypeDocType;
  }[];

  kindString?: 'Class' | 'Enumeration' | 'Interface' | 'Type alias';

  indexSignature?: TypeDocSignature;

  name?: string;

  sources?: TypeDocSource[];

  type?: TypeDocType;

  typeParameter?: TypeDocTypeParameter[];
}
