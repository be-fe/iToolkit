#!/bin/bash
DIR=$(pwd)
filePath="$DIR""/build/tag/"
sourcePath="$DIR""/src/"
str=$1
arr=(${str//,/ })
cat ${sourcePath}lib/riot.js > ${filePath}../iToolkit_lite.js &&
cat ${sourcePath}lib/common.js >> ${filePath}../iToolkit_lite.js &&
for i in ${arr[@]}
do
    cat "$filePath""$i".js >> ${filePath}../iToolkit_lite.js
done
echo "done"
exit 0