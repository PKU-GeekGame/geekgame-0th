# 题目描述合集

题目名称后面的 (x@k) 表示此题基础分值为 x，且有 k 人解出。

题面中的文件链接已经失效。可以在 `attachment` 目录找到附件。可以在题目源码目录里找到题目运行环境。




[toc]

## Misc



### →签到←（100@99）signin

请进入选手 QQ 群 939856833。随着比赛进行，我们可能会发布通知、对题目的补充说明或提示，届时将在本平台和 QQ 群发布，敬请留意。

<b>请在群公告中找到签到题，根据群公告中编码的数据解出 Flag</b>

*群公告中的内容是：*
*c3ludHtKM3lwYnpyIGdiIDBndSBDWEggVGhUaFRoLCByYXdibCBndXIgdG56ciF9*

<blockquote><p><i>如果你此前没有打过 CTF 比赛，下面是一些说明：</i></p><p>虽然每道题的目标不同，但都对应一个形如 <code>flag{...}</code> 的字符串。按照要求解出题目之后，可以获得 Flag。将这个字符串输入到下面的文本框即可得分。</p><p>另外，某些题会要求输入 Token 来确认你的身份。点页面底部的 “复制个人 Token” 按钮来获得自己的 Token。</p></blockquote>



### 主的替代品（200@94）mian

替代赎罪是一个令人生畏的短语，所以让我们对其进行分解。最简单的形式是，如果有人用自己代替我们赎罪，那么他们就是在代替我们偿还我们所欠的款项。我们欠上帝的钱确实很多。他是完美的本质，因此不能在他的存在下出现瑕疵。不幸的是，我们是核心的不完美罪人。因此，我们不需要在外部简单地“变得更好”，而在内部需要完美无瑕的完美。这是我们无法提供的，因此我们必须依靠其他东西：替代品。

请向评测机提交一个 C 程序，输出任意包含 <code>main</code> 的字符串。但评测机会把代码中所有的 <code>main</code> 字符串替换成 <code>mian</code> 再编译运行。

评测机上的编译命令形如：
<pre><code>gcc test.c -o test</code></pre>
<b>点击 “打开/下载题目” 将打开网页终端，你也可以通过命令 <code>nc prob04.geekgame.pku.edu.cn 10004</code> 手动连接到题目</b>

<blockquote><p><i>如果你此前没有打过 CTF 比赛，下面是一些说明：</i></p><p><code>nc</code> 是 Linux 系统的一个命令行工具，可用于连接到服务器的指定端口。除此之外，也可以使用任意编程语言带 socket 通信功能的库（如 Python 的 pwntools）连接到题目。对于不需要自动化交互的题目，使用网页终端可能比较方便。</p></blockquote>



### 小北问答 1202（150@80 + 150@49）choice

<span class="you-name">You</span> 酱善于使用十种搜索引擎，别人不知道的事情她能一秒钟搜索出来。别人都不相信她，因为别人每次在百度搜索自己的代码为什么报错，都只能搜到一些意义不明的 CSDN 博客。

这两天，又有人拿着计概 B 的代码来问 <span class="you-name">You</span> 酱。<span class="you-name">You</span> 酱看到满屏幕的全角括号之后彻底忍受不了了，她灵机一动，决定把回答问题的工作外包出去。

“这些是别人问我的问题列表，帮我答出至少五道就可以获得一个 Flag，全都答出来就可以获得第二个 Flag。” <span class="you-name">You</span> 酱如是说。

<b>补充说明：</b>此题考查的是收集和运用信息的能力，解题所需的所有信息都可以在网上公开找到，不需要选手具有特定生活经验。

<b>点击 “打开/下载题目” 进入题目网页</b>



### 与佛论禅网大会员（100@69 + 200@42）gifcode

<span class="you-name">You</span> 酱有着二十年网龄，从论坛黑话到图种的制作方法都十分熟悉。某天，<span class="you-name">You</span> 酱在树洞发了一个 RSA 公钥，试图实践加密聊天，然而洞里没有一个人理她。

她很伤心。她不明白这届年轻人怎么连这种简单的 Trick 都不会了。

这回 <span class="you-name">You</span> 酱把两个 Flag 藏在了一张 GIF 图里，希望你能找出来。

<b>点击 “打开/下载题目” 下载题目附件</b>



### 2038 年的银行（300@66）bank

兆京市是知名的金融中心，许多银行都在此设立总部。然而在 2038 年的某一天，这里有 3 家历史悠久的银行突然凭空消失了。

为挽回储户们的损失，时间管理局费尽心思恢复了这几家银行的程序与数据。这些银行能让钱消失，那是不是也能让钱变多呢？你带着 500 元来到了这几家银行前，试图买到一个 Flag。

<b>点击 “打开/下载题目” 进入题目网页</b>



## Web



### 人类行为研究实验（200@80 + 200@54）proxy

小 Y 所在的兆京大学某实验室主要研究方向是动物行为模式。

他们为了研究动物的智能行为，设计了一个游戏，并用这个游戏测试了多种动物的智能行为。

他们让猴子游玩这个游戏：猴子获得的分数越多，就能获得更多的香蕉。

但他们需要做对比实验才能获得更详细的数据。因此他们找到了你。作为你配合实验的报酬，他们会给你 Flag。

为了获取你的详细信息以进行更好的数据分析，你需要进行登记并主动上传成绩。

据小 Y 本人说，他们实验室的网络安全工作十分差劲。虽然整个实验室内网有防火墙，但是某位同学为了在宿舍就能工作，偷偷开了一个代理，使用这个代理便可接入他们内网。而这个成绩登记系统本应直接申请接入学校的 IAAA 登录，但权限还没批下来。为了让实验能尽快进行，他从网上随便抄了一份代码作为身份认证的后端。由于时间匆忙，他没有研究并设置任何的可配置参数。

现在你在宿舍，并不想下楼的你希望不出宿舍也能拿到 Flag。

实验室内网代理： http://prob01.geekgame.pku.edu.cn:10001/

<b>注意：</b>该代理只能访问实验室内网。其他网站（包括本平台）无法通过该代理访问。

<b>点击 “打开/下载题目” 进入游戏网页，该网页只有内网可以访问</b>



### 人生苦短（400@38）session

<span class="you-name">You</span> 酱最喜欢用的 Python 库是 Flask。她回忆自己给兆京大学千年讲堂做后端开发的那段时光，感叹道：那个购票系统只写了一百多行就写完了，不愧是 Python。

现在，有一门课的老师找到她，让她写一个程序来演示什么是 “自举”。具体来说，这个系统在登录之后就可以获得 Flag，但是 Flag 恰好就是登录密码。

对这个奇怪的需求，<span class="you-name">You</span> 酱感觉莫名其妙，但她还是很快就把系统写出来了。

然而，由于在系统上线前的一处小疏忽，使得看似不可能被拿到的 Flag 实际是可以被拿到的。你能找到程序中的问题吗？

<b>点击 “打开/下载题目” 进入题目网页</b>



### 千年讲堂的方形轮子（250@24 + 250@22）oracle

<span class="you-name">You</span> 酱受邀为兆京大学千年讲堂开发了一套在线购票系统。她在看了几篇公众号文章之后，觉得密码学很神奇，想开发一个基于密码学的购票系统。

<span class="you-name">You</span> 酱随手找了段 AES 加密的代码，打开编辑器一顿操作，很快就把系统开发出来了。于是，千年讲堂全新的购票系统堂堂开张了，购票后还可获得一个 Flag 作为礼品。

后来，在年底的财务审计中，千年讲堂发现竟然有黑客伪造出了假的电子票。由于 <span class="you-name">You</span> 酱已经毕业，千年讲堂只好找了一个临时工帮忙修复漏洞。临时工指出，漏洞在于 <span class="you-name">You</span> 酱用的 AES-CBC 加密方式不安全。临时工把它修改成了 AES-ECB 方式，然后重新生成了一个 AES 秘钥。

领了一笔可观的报酬后，临时工满意地离开了。然而……

<b>点击 “打开/下载题目” 进入题目网页</b>



## Binary



### 皮浪的解码器（300@12）decoder

皮浪（前365——前275）是古希腊怀疑论者，他是从怀疑论陷入不可知论的，因为他总是怀疑有人不知道 Flag 却可以猜出它的 Base64 编码。

古希腊的富贵人外出时都是喜欢乘坐马车。有一次皮浪和几个朋友一起在大街上散步，朋友知道他是不可知论者，于是故意出题目刁难他。朋友说：“皮浪！前面跑过来来一辆马车，你说说看，到底客观上有没有马车，人能否正确认识马车的存在？”皮浪立即回答：“这个问题是不能回答的，因为我们人不可能正确认识外界事物，甚至不能说事物是否真的存在。”朋友马上反驳道：“既然你不承认马车的存在，你敢不敢躺在马车底下，让它从你身上轧过？”皮浪说：“敢！”说完，皮浪一个箭步冲到马车前，躺在地上。车夫见此情景立即拉住车闸，马车停了下来，皮浪安全无恙。但是，像这样的玩笑不能总开。在皮浪90岁的时候，有人又对皮浪开了这样的玩笑，结果皮浪死于马车的车轮之下。

请输入 Flag 的 Base64 编码，这样皮浪的解码器就能解码并输出 Flag 了。

<b>你可以 <a href="/media/fd4ffe2b-9c43-4034-a42b-9f5d687629f5.zip">下载本题的程序</a></b>

<b>点击 “打开/下载题目” 将打开网页终端，你也可以通过命令 <code>nc prob06.geekgame.pku.edu.cn 10006</code> 手动连接到题目</b>

<blockquote><p><i>如果你此前没有做过 Pwn 类型的题目，下面是一些说明：</i></p><p>服务器上有一个特定的程序，可以将它下载到本地（例如此题为 Linux 系统的 ELF 格式文件）。请通过各种办法分析出其中的漏洞，并利用漏洞攻击服务器获得 Flag。每次通过终端连接到题目时，服务器上就会启动这个程序，允许你向它输入内容，并读取输出。</p><p>你可能需要使用一些反编译 ELF 文件的工具，例如 IDA（Hex-Rays Decompiler）、Ghidra 或 Binary Ninja。其他类型的机器码（例如 Python 字节码）也能在网上找到反编译工具。</p></blockquote>



### 弗拉梅尔的宝石商店（400@22）toctou

尼可·勒梅生于 1330 年，精通拉丁文、希腊文。他在巴黎依靠卖书与抄写文章为生，也收学生，教他们抄写和画插图。经常有贵族花钱请他抄录珍稀稿本，所以他有可能抄到了炼制 Flag 的文稿。

他平凡无奇的人生在一个夜晚产生戏剧性的大转变，一位天使来到他的梦境中，告诉他将收到一本神奇书册，他必须努力研读并且透彻了解，就可获得非凡惊奇的力量。
这部神秘的文献名为《犹太亚伯拉罕之书》（Book of Abraham the Jew）。尼可·勒梅在解读它之前，花费了 21 年时间来收集资料，最后在一位希伯莱学者的帮助下，尼可·勒梅于 1382 年 4 月 25 日记载了以下的话：“我总是逐字确实地随着书的指示，根据相同数量的水银来推演红石……然后就真的将水银转变成黄金了，确实比普通的金子好，更柔软也更具可塑性。”

请想办法从弗拉梅尔的宝石商店里购买 Flag。

<b>你可以 <a href="/media/46142981-101b-417b-850e-61163ca65a4c.zip">下载本题的程序</a></b>

<b>点击 “打开/下载题目” 将打开网页终端，你也可以通过命令 <code>nc prob03.geekgame.pku.edu.cn 10003</code> 手动连接到题目</b>



### 未来的机器（400@29）wasm

来自未来的人使用未来的高级语言编写了一份源代码，用来自未来的 Flag 传达她对现在的你的问候。她担心现在的你无法理解未来的高级语言，便将其编译到未来的机器语言。她将把未来的可执行文件与未来的机器一同赠送给你。

《未来设备限制出口条例》出台，她不得不把已经贴好的运单从箱子上撕下。她仍希望你能收到她的问候。她将未来的可执行文件转为未来人类可读的未来汇编语言，她用在未来已过时的语言编写了一份汇编解释器，她将这些文件一同传输给你。

但她傲娇。她不愿直接表达自己的问候。她希望你能猜到她的问候。

当你猜到问候语，并将其输入程序后，程序会确认你的猜测是否正确。

<b>点击 “打开/下载题目” 下载题目附件</b>



### 庄子的回文（500@16）rop

在《庄子》中，逍遥而遊的自由存在内蕴着一个逍遥主体与 Flag 之间的深刻而复杂的关系，这一关系必须置于一个回文过程中来理解。

逍遥作为艰苦的历程，其要义在于它经由对自身的出离而与异于自身的他者相遇，并与他者共同构成彼此相聚的整体，在此整体中确证自身且返回自身。《庄子》对逍遥的诗意言说方式本身，并不掩盖逍遥观念自身的过程本质。撇开了如此艰苦的历程，逍遥就会成为毫无内容的仅仅溢于言表的虚幻的托辞。逍遥必须回到其艰苦而丰富的展开过程，才是真实的。 ——郭美华

请把字符串交给庄子，设法让庄子在计算回文串时，在服务器上执行代码或命令，读取文件系统中某处存储的 Flag。

<b>你可以 <a href="/media/04260e32-858a-455b-8b58-1f3d857a3767.zip">下载本题的程序</a></b>

<b>点击 “打开/下载题目” 将打开网页终端，你也可以通过命令 <code>nc prob05.geekgame.pku.edu.cn 10005</code> 手动连接到题目</b>



## Algorithm



### 无法预料的问答（200@37）emoji

<blockquote><p>Now, it's up to you to do the next one.</p></blockquote>
命题人 <span class="you-name">You</span> 酱收到了来自组委会的投诉：“关于小北问答这道题，怎么几个小时才能提交一次？选手们反映说这样不讲武德。” <span class="you-name">You</span> 酱很无奈，因为如果不限制提交频率，万一有人用爬虫枚举答案，就成命题事故了。

无论如何，收到投诉不能不处理。<span class="you-name">You</span> 酱决定再出一道问答题，不再限制提交频率……呃，这样服务器大概撑不住，限制一秒可以提交一次总行吧。

“既然放开了提交频率，就需要把题目出难一点，干脆都出只有我自己知道答案的题，这样就没人能做出来了。” —— <span class="you-name">You</span> 酱

<b>点击 “打开/下载题目” 进入题目网页</b>



### 安全的密钥交换（150@20 + 150@20）dh

Alice 和 Bob 听说了兆京大学千年讲堂票务系统被黑客破解的消息，对票务系统工程师的信息安全水平提出了质疑。他们指出，票务系统被破解的一个重要原因是采用了固定的密钥。因此他们决定，在他们间每次发起对话的时候，使用一个全新的密钥，并用 AES 算法加密他们的通讯。

每次会话他们都生成一个全新的密钥并用此加密通讯，因而需要有一个算法保证他们总能拿到相同的密钥。考虑到黑客可能在他们的网络链路间布下窃听设备，他们必须采用一个安全的算法来进行密钥的协商。他们找到了一种密钥交换方法， Alice 迫不及待地想尝试这个算法。她向 Bob 加密发送了她的 Flag。

然而他们都不知道，黑客早已从他们的电脑中复制了通讯程序。他们更不知道，黑客已经掌握了他们链路中交换机的所有权限……

<i>注：题目背景只对该题负责，与其他题目无关</i>

<b>你可以 <a href="/media/164ad9b4-5afe-4c0a-9b7d-4d1800101207.zip">下载本题的源代码</a></b>

<b>点击 “打开/下载题目” 将打开网页终端，你也可以通过命令 <code>nc prob02.geekgame.pku.edu.cn 10002</code> 手动连接到题目</b>



### 计算概论B（400@41）huffman

又㕛叒叕有人拿着计概 B 的代码来问 <span class="you-name">You</span> 酱了，这不是什么稀奇的事情。

不过，这次的代码确实有点意思。因为这个人打算尝试一个算法，却不慎在运行完之后把输入文件删掉了。所幸这个人用的是 Jupyter Notebook，所以还保留着算法的输出。

你能帮忙还原出被删掉的输入文件吗？<span class="you-name">You</span> 酱愿意用输入文件中的一个 Flag 作为酬谢。

<b>点击 “打开/下载题目” 下载题目附件</b>



### 巴别压缩包（400@27）zipquine

<p>宇宙（有的人把它叫做图书馆）由一个结构不明确的，也许是无限复杂的 <a href="https://pkware.cachefly.net/webdocs/casestudies/APPNOTE.TXT">ZIP文件</a> 所构成，每一个 ZIP 文件由至少一个局部文件记录与一个中央目录记录组成。局部文件记录包含局部文件首部与文件数据，局部文件首部总是由 <code>0x04034b50</code> 开始，其后的数据决定了这个文件的版本、压缩方式、修改时间、校验码、文件长度、文件名等信息。中央目录记录包含若干个中央目录首部与一个中央目录尾部，中央目录首部与局部文件记录一一对应，总是由 <code>0x02014b50</code> 开始，包含了与局部文件首部的位置，与其相似的信息以及其他信息。中央目录尾部总是由 <code>0x06054b50</code> 开始，记录了中央目录记录的位置以及记录的数量。</p>
<p>通过解压程序，每个局部文件解压后都可以是一个 ZIP 文件，从数目不定的子文件中又会解压出新的 ZIP 文件，形成了一个树状的迷宫。每一个 ZIP 文件的文件名都由数字、字母与一些符号组成，有些文件仅以不断递增的数字命名，还有的文件则像是葡萄牙文、意大利文或是什么其他语言或是方言或是原始语言的组合，其他文件则看上去纯粹是一堆乱码。</p>
<p>有的时候可能会在大量的乱码文件中找到一段可读的文本，它可能描述了一个从 42KB 文件中解压出 4.5PB 的故事，也可能指示了其他 ZIP 文件在文件树中的位置。有时候它声称 ZIP 文件的嵌套深度是无限的，虽然文件的大小总是有限的，而且总是由 256 种字节为符号组合起来。一种可能的解读是所有的 ZIP 文件都是由一个叫做 quine.zip 的文件衍生出来的，这个不到 1KB 的文件永远也无法解压到底，确切地说每一层 quine.zip 解压出一个也叫做 quine.zip 的压缩文件，它和上一层的 quine.zip 大小一样，内容也完全相同。</p>
<p>然而按此描述找到的 quine.zip 文件却不如传说那般完美，它的 CRC32 校验码与其解压的文件总是对不上。可能是创建压缩文件时出的错误，也可能是遭到了恶意的篡改。总之这个问题在另外的文件中被指出，并声称只要在合适的位置找到正确的数据来修复 quine.zip，就可以得到完美的 ZIP 文件。这样做有什么意义呢？也许从它可以得到某个比赛的特殊标志（Flag）吧。</p>

<p><b>文件内容（“**” 符号表示损坏的数据）</b></p>

<pre style="line-height: 1.25em; opacity: .85"><code>    $ hexdump -Cv quine.zip 
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
</code></pre>
<p><b>Flag 格式:</b></p>
<blockquote>
<p>flag{QUINE_XXXXXXXX_XXXXXXXX_XXXXXXXX_XXXXXXXX}</p>
</blockquote>
<p>其中 “XXXXXXXX” 为四段被损坏的数据的<strong>大写十六进制</strong>编码。</p>

<p><b>点击 “打开/下载题目” 下载题目附件</b></p>



## Binary (Hard)



### ←签退→（600@3）qiantui

<i>本题由赞助商提供。本题较难。</i>

Just pwn it :)

<b>你可以 <a href="/media/f4c18a54-6f9f-49d7-9c4a-177580b1de6f.zip">下载本题的程序</a></b>

<b>点击 “打开/下载题目” 将打开网页终端，你也可以通过命令 <code>nc prob07.geekgame.pku.edu.cn 10007</code> 手动连接到题目</b>

