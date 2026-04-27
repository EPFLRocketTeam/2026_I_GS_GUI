/* eslint-disable import/no-webpack-loader-syntax */
import uplinkRaw from "!!raw-loader!./uplink.radio.h";
import downlinkRaw from "!!raw-loader!./downlink.radio.h";
import payloadRaw from "!!raw-loader!./payload.radio.h";

export const RADIO_PROFILE_FILES = {
  uplink: {
    label: "Uplink Radio",
    raw: uplinkRaw,
  },
  downlink: {
    label: "Downlink Radio",
    raw: downlinkRaw,
  },
  payload: { 
    label: "Payload Radio", 
    raw: payloadRaw },
};