#include "jerry.h"

#define __UNSED__ __attribute__((unused))
#define DELCARE_HANDLER(NAME) \
static bool \
NAME ## _handler (const jerry_api_object_t * function_obj_p __UNSED__, \
                  const jerry_api_value_t *  this_p __UNSED__, \
                  jerry_api_value_t *        ret_val_p __UNSED__, \
                  const jerry_api_value_t    args_p[], \
                  const jerry_api_length_t   args_cnt)

#define REGISTER_HANDLER(NAME) \
  register_native_function ( # NAME, NAME ## _handler)

static bool register_native_function (
  const char* name,
  jerry_external_handler_t handler)
{
  jerry_api_object_t *global_obj_p;
  jerry_api_object_t *reg_func_p;
  jerry_api_value_t reg_value;
  bool bok;

  global_obj_p = jerry_api_get_global ();
  reg_func_p = jerry_api_create_external_function (handler);

  if (!(reg_func_p != NULL
                && jerry_api_is_function (reg_func_p)
                && jerry_api_is_constructor (reg_func_p)))
  {
    printf ("!!! create_external_function failed !!!\r\n");
    jerry_api_release_object (global_obj_p);
    return false;
  }

  jerry_api_acquire_object (reg_func_p);
  reg_value.type = JERRY_API_DATA_TYPE_OBJECT;
  reg_value.v_object = reg_func_p;

  bok = jerry_api_set_object_field_value (global_obj_p,
                                          (jerry_api_char_t *)name,
                                          &reg_value);

  jerry_api_release_value (&reg_value);
  jerry_api_release_object (reg_func_p);
  jerry_api_release_object (global_obj_p);

  if (!bok) {
    printf ("!!! register_native_function failed: [%s]\r\n", name);
  }

  return bok;
}

