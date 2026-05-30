export enum STRUCT_TABLE_FIELDS {
    nbr = "#",
    fieldName = "Field name",
    type = "type",
    bits = "bits",
    comment = "comment"
}

type StructField = {
  key: string;
  name: string;
  type: string;
  bits: number | string;
  comment: string;
};

export type DataStructProps = {
    fields: StructField[], 
    onUpdateField: (
    key: StructField["key"],
    field: keyof Omit<StructField, "key">,
    value: string
  ) => void;
  onRemoveField: (key: StructField["key"]) => void; 
}

export const EMPTY_FIELD_MESSAGE = "No fields yet - add one below"