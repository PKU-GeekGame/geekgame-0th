#include <stdio.h>
#include <ctype.h>
#include <string.h>
#include <stdlib.h>
#include <inttypes.h>
#include <limits.h>

char enc[1200]; // encode buffer
int enclen;
uint8_t dec[700]; // decode buffer
int declen;

const uint8_t dec64table[] = {255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 62, 255, 255, 255, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 255, 255, 255, 255, 255, 255, 255, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 255, 255, 255, 255, 255, 255, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 255, 255, 255, 255, 255};

void b64decode(const char *code, int code_len, uint8_t *result, int *result_len, int max_len)
{
    int x, y;

    uint8_t *ptr = result;

    *result_len = max_len;

    if (max_len <= 3 * (code_len / 4))
        return;

    while ((x = *code++) != 0) {
        if (isspace(x))
            continue;

        if (x > 127 || (x = dec64table[x]) == 255)
            return;

        while (isspace(y = *code++))
            ;

        if (y == 0 || (y = dec64table[y]) == 255)
            return;

        *result++ = (x << 2) | (y >> 4);

        while (isspace(x = *code++))
            ;

        if (x == '=') {
            while (isspace(x = *code++))
                ;

            if (x != '=')
                return;
            while (isspace(y = *code++))
                ;
            if (y != 0)
                return;

            break;
        } else {
            if (x > 127 || (x = dec64table[x]) == 255)
                return;
            *result++ = (y << 4) | (x >> 2);

            while (isspace(y = *code++))
                ;

            if (y == '=') {
                while (isspace(y = *code++))
                    ;
                if (y != 0)
                    return;

                break;
            } else {
                if (y > 127 || (y = dec64table[y]) == 255)
                    return;
                *result++ = (x << 6) | y;
            }
        }
    }

    *result_len = result - ptr;
}

char flag[100];

void read_flag()
{
    FILE *f = fopen("flag.txt", "r");
    fread(flag, 1, sizeof(flag), f);
    int flaglen = strlen(flag);
    printf("flag has %d bytes\n", flaglen);
    fclose(f);
}

void print_hex(const char *buf, int len)
{
    for (int i = 0; i < len; ++i)
        //printf("%02x", buf[i]);
        printf("%c", buf[i]);
}

int main() {
    setbuf(stdout, NULL);
    read_flag();
	printf("guess flag (base64): ");
    scanf("%s", enc);
    enclen = strlen(enc);
    b64decode(enc, enclen, dec, &declen, sizeof(dec));
    if (declen == sizeof(dec)) {
        puts("decode error");
        return 0;
    }
    if (strcmp(flag, dec) == 0) {
        printf("You already know the flag:\n");
        print_hex(dec, declen);
    }
    else {
        printf("This is not the flag:\n");
        print_hex(dec, declen);
    }
    return 0;
}
