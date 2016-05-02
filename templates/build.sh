ml parse:js && ml build:js && ml build:init

cd sdk && ./build.sh mt7687_hdk iot_sdk && cd .. &&

ml burn ./sdk/out/mt7687_hdk/iot_sdk/mt7687_iot_sdk_xip.bin