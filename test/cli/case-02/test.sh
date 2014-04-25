./bin/rajah test/cli/case-02/ > ./test/cli/tmp/case-02-noOption
./bin/rajah test/cli/case-02/ -m spec\\.js > ./test/cli/tmp/case-02-noNum
./bin/rajah test/cli/case-02/ -m spec-.+\\.js > ./test/cli/tmp/case-02-num
