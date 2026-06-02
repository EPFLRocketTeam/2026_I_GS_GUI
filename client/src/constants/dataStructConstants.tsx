export enum STRUCT_TABLE_FIELDS {
    nbr = "#",
    fieldName = "Field name",
    type = "type",
    bits = "bits",
    comment = "comment"
}

export type StructField = {
  key: number;  // represents the index of the location of the field in the data table (usually 1,2,3..)
  name: string;
  type: typeof TYPE_MAP[keyof typeof TYPE_MAP];
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

export const MAX_BITS_STRUCT = 64
export const MIN_BITS_STRUCT = 1

export const DATA_STRUCT_TABLE_COLS = 6

export const TYPE_MAP = {
  int_8: "int8",
  int_16: "int16",
  int_32: "int32",
  uint_8: "uint8",
  uint_16: "uint16",
  uint_32: "uint32",
  uint8: "uint8",
  uint16: "uint16",
  uint32: "uint32",
  int8: "int8",
  int16: "int16",
  int32: "int32",
  float_8: "float8",
  float_16: "float16",
  float_32: "float32",
  float_64: "float64",
  bool: "bool",
  enum: "enum",
};