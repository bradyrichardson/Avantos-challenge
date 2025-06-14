interface PayloadField {
  type: string;
  [key: string]: unknown
}

interface DynamicFieldConfigProperty {
  endpoint_id: string;
  output_key: string;
  payload_fields: {
    [key: string]: PayloadField;
  };
  selector_field: string;
}

export interface FieldSchema {
  additionalProperties: {
    [key: string]: unknown;
  };
  properties: {
    [key: string]: unknown;
  };
  required: Array<unknown>;
  type: string;
}

interface UiSchema {
  elements: Array<unknown>;
  type: string;
}

export interface Form {
  $schema: string;
  created_at: string;
  created_by: string;
  custom_javascript: string;
  custom_javascript_triggering_fields: string[];
  description: string;
  dynamic_field_config: {
    [key: string]: DynamicFieldConfigProperty;
  };
  field_schema: FieldSchema;
  id: string;
  is_reusable: boolean;
  name: string;
  ui_schema: UiSchema;
  updated_at: string;
}

export interface FormNode {
  data: {
    [key: string]: unknown
    component_key: string
    component_id: string
    name: string
    prerequisites: string[]
    input_mapping: {
      [key: string]: string
    }
  }
  id: string
  position: {
    x: number
    y: number
  }
  type: 'form' | 'branch' | 'trigger' | 'configuration'
}

export interface FormEdge {
  source: string
  target: string
}

export interface DataSource {
  title: string
  options: string[]
}
