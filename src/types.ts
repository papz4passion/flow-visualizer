export interface ApiField {
    field: string;
    type: string;
    description: string;
  }
  
  export interface Transformer {
    incomingField: string;
    actualField: string;
  }
  
  export interface ApiDetailType {
    id: string;
    name: string;
    endpoint: string;
    request: ApiField[];
    response: ApiField[];
    transformers: Transformer[];
  }
  