import { RadioConfigControl, RadioConfigOption, RadioStatus} from "../types/types";
import {RADIO_TYPES} from "../constants/radioProfileConstants";

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
  id: string | number;  //TODO: shouldn't be null
  status: RadioStatus;
  configParams?: RadioConfigParam[];
};

export interface RadioProfile {
  DEFAULT_TX_POWER: number,
  DEFAULT_BW: number,
  DEFAULT_SF: number,
  DEFAULT_CR: number,
  DEFAULT_PREAMBLE_LENGTH: number,
  DEFAULT_CRC: boolean,
  RADIO_TYPE: RADIO_TYPES;
}