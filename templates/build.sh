ml build:js && ml build:init && ml build:js2c && rm -rf ./_output.js && rm -rf ./tmp

cd sdk && ./build.sh mt7687_hdk iot_sdk_demo && cd .. &&

ml burn ./sdk/out/mt7687_hdk/iot_sdk_demo/mt7687_iot_sdk_demo.bin