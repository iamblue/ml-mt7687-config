<%= content %>

ifeq ($(MTK_JR_ENABLE),y)
CFLAGS += -I$(SOURCE_DIR)/middleware/jerryscript/inc
CFLAGS += -DMTK_JR_ENABLE
endif

ifeq ($(ml-mcs),y)
CFLAGS += -Dml-mcs
endif
