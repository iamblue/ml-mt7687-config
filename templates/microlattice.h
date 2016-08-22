#include "jerry-api.h"
#include "jerry_extapi.h"

extern int fota_mode ;
extern char script;
extern void js_lib_init();
extern void js_init();

#define __UNSED__ __attribute__((unused))
#define DELCARE_HANDLER(NAME) \
static jerry_value_t \
NAME ## _handler (const jerry_value_t  function_obj_p __UNSED__, \
                  const jerry_value_t  this_p __UNSED__, \
                  const jerry_value_t  args_p[], \
                  const jerry_length_t  args_cnt)

#define REGISTER_HANDLER(NAME) \
  register_native_function ( # NAME, NAME ## _handler)

static bool
register_native_function (const char* name,
                          jerry_external_handler_t handler)
{
  jerry_value_t global_obj_val;
  jerry_value_t reg_func_val;
  jerry_value_t prop_name_val;
  jerry_value_t res;
  bool bok;

  global_obj_val = jerry_get_global_object ();
  reg_func_val = jerry_create_external_function (handler);
  bok = true;

  if (!(jerry_value_is_function (reg_func_val)
        && jerry_value_is_constructor (reg_func_val)))
  {
    printf ("!!! create_external_function failed !!!\r\n");
    jerry_release_value (reg_func_val);
    jerry_release_value (global_obj_val);
    return false;
  }

  prop_name_val = jerry_create_string ((const jerry_char_t *) name);
  res = jerry_set_property (global_obj_val, prop_name_val, reg_func_val);

  if (jerry_value_has_error_flag (res))
  {
    bok = false;
  }

  jerry_release_value (res);
  jerry_release_value (prop_name_val);
  jerry_release_value (reg_func_val);
  jerry_release_value (global_obj_val);

  if (!bok)
  {
    printf ("!!! register_native_function failed: [%s]\r\n", name);
  }

  return bok;
}