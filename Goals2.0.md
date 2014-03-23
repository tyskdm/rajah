
Usage:
````js
rajah specfiles [ options ]
````

rajah.json:
(grunt-contrib-jasmineのoptionsと同じ設定でよいのではないか)
````
{
    "spec": [
        "test/spec",
        "lib/spec"
    ],
    "source": [
        "src"
    ],
    "vevder": [
        "vender/jquery"
    ],
    "outfile": "out.js"
}
````

あるいは、package.json 形式のファイルを用意してこれを rajah.json とし、

$ code rajah.json

とパックするのが簡単かな・・。
単にjasmineを動かすだけなら、特に設定はいらないのだから。
（code がメインファイルとして package.json だけでなく任意の json を受け取れるように変更する）

-p 指定で、package.json の代わりに指定されたパッケージファイルを読み込むようにするか。。

そのほうがよいかな。
覚えることが少なくて済むし。
でも情報が少し足りないか・・。

gruntにするか。
それで、rajah のプラグインは option から rajah.json を書き出した上で rajah を起動・・
やりすぎか。
