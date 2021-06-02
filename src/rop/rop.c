#include <stdio.h>
#include <string.h>

int check(char *s, int n)
{
    for (int i = 0; i < n; ++i)
        if (s[i] != s[n-i-1])
            return 0;
    return 1;
}

void run()
{
    char s[100];
    scanf("%s", s);
    int n = strlen(s);
    int ansi, ansl = 0;
    for (int i = 0; i < n; ++i)
        for (int j = i+1; j <= n; ++j)
            if (check(s+i, j-i))
            {
                if (j-i > ansl)
                {
                    ansl = j-i;
                    ansi = i;
                }
            }
    for (int i = ansi; i < ansi+ansl; ++i)
        putchar(s[i]);
    putchar('\n');
}

void banner()
{
    /*
    描述
    给定一个字符串，寻找并输出字符串中最长回文子串。回文串即从左到右和从右到左读都一样的字符串。
    如果字符串中包含多个回文子串，则返回第一个。
    输入
        第一行是整数n,字符串的个数(n < 20)
    输出
        接下来n行，每行一个字符串
        字符串的长度不超过100
    */
    const char *url = "http://bailian.openjudge.cn/xlylx2019/B/";
    printf("This is a solution for this problem: %s\n", url);
    puts("PWN it!");
}

int main()
{
    setbuf(stdout, NULL);
    setbuf(stderr, NULL);
    banner();
    int T;
    scanf("%d", &T);
    while (T--)
        run();
    return 0;
}
