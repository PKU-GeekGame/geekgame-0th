## quinezip //cheshire_cat

### **巴别压缩包**

#### 题目描述
宇宙（有的人把它叫做图书馆）由一个结构不明确的，也许是无限复杂的[zip文件](https://pkware.cachefly.net/webdocs/casestudies/APPNOTE.TXT)所构成，每一个zip文件由至少一个局部文件记录与一个中央目录记录组成。局部文件记录包含局部文件首部与文件数据，局部文件首部总是由`0x04034b50`开始，其后的数据决定了这个文件的版本、压缩方式、修改时间、校验码、文件长度、文件名等信息。中央目录记录包含若干个中央目录首部与一个中央目录尾部，中央目录首部与局部文件记录一一对应，总是由`0x02014b50`开始，包含了与局部文件首部的位置，与其相似的信息以及其他信息。中央目录尾部总是由`0x06054b50`开始，记录了中央目录记录的位置以及记录的数量。

通过解压程序，每个局部文件解压后都可以是一个zip文件，从数目不定的子文件中又会解压出新的zip文件，形成了一个树状的迷宫。每一个zip文件的文件名都由数字、字母与一些符号组成，有些文件仅以不断递增的数字命名，还有的文件则像是葡萄牙文、意大利文或是什么其他语言或是方言或是原始语言的组合，其他文件则看上去纯粹是一堆乱码。

有的时候可能会在大量的乱码文件中找到一段可读的文本，它可能描述了一个从42KB的zip文件中解压出4.5PB的故事，也可能指示了其他zip文件在文件树中的位置。有时候它声称zip文件的嵌套深度是无限的，虽然文件的大小总是有限的，而且总是由256种字节为符号组合起来。一种可能的解读是所有的zip文件都是由一个叫做quine.zip的文件衍生出来的，这个不到1KB的zip文件永远也无法解压到底，确切地说每一层quine.zip解压出一个也叫做quine.zip的压缩文件，它和上一层的quine.zip大小一样，内容也完全相同。

然而按此描述找到的quine.zip文件却不如传说那般完美，它的CRC32校验码与其解压的文件总是对不上。可能是创建压缩文件时出的错误，也可能是遭到了恶意的篡改。总之这个问题在另外的文件中被指出，并声称只要在合适的位置找到正确的数据来修复quine.zip，就可以得到完美的zip文件。这样做有什么意义呢？也许从它可以得到某个比赛的特殊标志（flag）吧。

#### 文件内容（用“*”符号标出了损坏的数据）

		$ hexdump -Cv quine.zip 
		00000000  50 4b 03 04 14 00 00 00  08 00 7d bf a1 52 ** **  
		00000010  ** ** 45 01 00 00 1e 02  00 00 09 00 1c 00 71 75  
		00000020  69 6e 65 2e 7a 69 70 55  54 09 00 03 ff 7a 8d 60  
		00000030  ff 7a 8d 60 75 78 0b 00  01 04 e8 03 00 00 04 e8  
		00000040  03 00 00 00 48 00 b7 ff  50 4b 03 04 14 00 00 00  
		00000050  08 00 7d bf a1 52 ** **  ** ** 45 01 00 00 1e 02  
		00000060  00 00 09 00 1c 00 71 75  69 6e 65 2e 7a 69 70 55  
		00000070  54 09 00 03 ff 7a 8d 60  ff 7a 8d 60 75 78 0b 00  
		00000080  01 04 e8 03 00 00 04 e8  03 00 00 00 48 00 b7 ff  
		00000090  22 c6 1c 62 cc 01 00 00  00 ff ff 00 10 00 ef ff  
		000000a0  22 c6 1c 62 cc 01 00 00  00 ff ff 00 10 00 ef ff  
		000000b0  42 e7 03 00 10 00 ef ff  42 e7 03 00 10 00 ef ff  
		000000c0  42 e7 03 00 10 00 ef ff  42 e7 03 00 10 00 ef ff  
		000000d0  82 d1 00 00 9b 00 64 ff  82 d1 00 00 9b 00 64 ff  
		000000e0  82 d1 00 00 9b 00 64 ff  1b c4 4e 03 00 50 4b 01  
		000000f0  02 1e 03 14 00 00 00 08  00 7d bf a1 52 ** ** **  
		00000100  ** 45 01 00 00 1e 02 00  00 09 00 18 00 00 00 00  
		00000110  00 01 00 00 00 a4 81 00  00 00 00 71 75 69 6e 65  
		00000120  2e 7a 69 70 55 54 05 00  03 ff 7a 8d 60 75 78 0b  
		00000130  00 01 04 e8 03 00 00 04  e8 03 00 00 50 4b 05 06  
		00000140  00 00 00 00 01 00 01 00  4f 00 00 00 88 01 00 00  
		00000150  31 00 71 75 69 6e 65 2e  7a 69 70 20 66 6f 72 20  
		00000160  32 30 32 31 50 4b 55 47  47 47 30 20 2d 2d 20 6d  
		00000170  61 64 65 20 62 79 20 63  68 65 73 68 69 72 65 5f  
		00000180  63 61 74 1b c4 4e 03 00  50 4b 01 02 1e 03 14 00  
		00000190  00 00 08 00 7d bf a1 52  ** ** ** ** 45 01 00 00  
		000001a0  1e 02 00 00 09 00 18 00  00 00 00 00 01 00 00 00  
		000001b0  a4 81 00 00 00 00 71 75  69 6e 65 2e 7a 69 70 55  
		000001c0  54 05 00 03 ff 7a 8d 60  75 78 0b 00 01 04 e8 03  
		000001d0  00 00 04 e8 03 00 00 50  4b 05 06 00 00 00 00 01  
		000001e0  00 01 00 4f 00 00 00 88  01 00 00 31 00 71 75 69  
		000001f0  6e 65 2e 7a 69 70 20 66  6f 72 20 32 30 32 31 50  
		00000200  4b 55 47 47 47 30 20 2d  2d 20 6d 61 64 65 20 62  
		00000210  79 20 63 68 65 73 68 69  72 65 5f 63 61 74        
		0000021e
		
#### 文件下载
[quine.zip](/quine.zip)

#### flag格式:
>flag{QUINE_XXXXXXXX_XXXXXXXX_XXXXXXXX_XXXXXXXX}

其中“XXXXXXXX”为四段被损坏的数据的**大写十六进制**编码。
