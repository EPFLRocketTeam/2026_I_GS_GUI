#ifndef RADIO_CONSTANTS_H
#define RADIO_CONSTANTS_H

#include <stdbool.h>

#define DEFAULT_TX_POWER 22
#define DEFAULT_BW 125
#define DEFAULT_SF 7
#define DEFAULT_CR 1
#define DEFAULT_PREAMBLE_LENGTH 8
#define DEFAULT_CRC true

typedef enum {
    RADIO_TYPE_EMITTER,
    RADIO_TYPE_RECEIVER
} RadioType;

#endif