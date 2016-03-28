#include <stdio.h>
#include <stdarg.h>

#include "cli.h"

#include "jerry-port.h"

int jerry_port_logmsg (FILE* stream, const char* format, ...)
{
    va_list ap;
    int     n;

    cli_puts("jLOG: ");
    va_start(ap, format);
    n = vprintf(format, ap);
    va_end(ap);

    return n;
}

int jerry_port_errormsg (const char* format, ...)
{
    va_list ap;
    int     n;

    cli_puts("jERR: ");
    va_start(ap, format);
    n = vprintf(format, ap);
    va_end(ap);

    return n;
}

int jerry_port_putchar (int c)
{
    cli_puts(c);
    return 0;
}
