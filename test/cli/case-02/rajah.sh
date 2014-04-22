../../bin/rajah ./case-02/ > ./tmp/case-02-noOption
../../bin/rajah ./case-02/ -m spec\\.js > ./tmp/case-02-noNum
../../bin/rajah ./case-02/ -m spec-.+\\.js > ./tmp/case-02-num
