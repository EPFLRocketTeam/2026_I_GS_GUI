import { RadioConfigControl, RadioConfigOption, RadioStatus } from "../types/types";

export interface RadioConfigParam {
  key: string;
  label: string;
  value: string;
  control: RadioConfigControl;
  options?: RadioConfigOption[];
  min?: number;
  max?: number;
  maxLength?: number;
};

export interface Radio {
  id: string | number;
  status: RadioStatus;
  configParams?: RadioConfigParam[];
};