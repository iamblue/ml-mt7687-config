#include <stdint.h>
#include <stdio.h>
#include <string.h>
#include "FreeRTOS.h"
#include "task.h"
#ifdef MTK_JR_ENABLE
#include "jerry.h"
#endif

#ifdef ml-mcs
#include "./ml/src/mcs.h"
#endif

void js_lib_init() {
  /* <%= ML_INIT %> */
}

int fota_mode = 0;

void js_init() {
  // remember to add `var global={};`
  char script [] = <%- JS_CODE %>;

  jerry_init (JERRY_FLAG_EMPTY);
  jerry_api_value_t eval_ret;

  js_lib_init();

  jerry_api_eval (script, strlen (script), false, false, &eval_ret);
  jerry_api_release_value (&eval_ret);
  // jerry_cleanup ();
  vTaskDelete(NULL);
}

#ifdef ml-mcs
void tcp_callback(char *rcv_buf) {
}
#endif

void wifi_connect(void) {
  char script [] = "global.eventStatus.emit('wifiConnect', true);";
  jerry_api_value_t eval_ret;
  jerry_api_eval (script, strlen (script), false, false, &eval_ret);
  jerry_api_release_value (&eval_ret);
  #ifdef ml-mcs
  mcs_tcp_init(tcp_callback);
  #endif
  vTaskDelete(NULL);
}

/**
  * @brief  Main program
  * @param  None
  * @retval None
  */
int main(void)
{
    system_init();
    xTaskCreate(js_init,"js_init", 10096, NULL, 2, NULL);
    vTaskStartScheduler();
    while (1) {
    }
    return 0;
}

