#!/bin/bash

file=$(mktemp -p /tmp --suffix=.c)
exe=$(mktemp -p /tmp)
sed 's/main/mian/g' < $1 > $file
gcc $file -o $exe || exit 1
( $exe | grep main ) > /dev/null 2>&1 || exit 1
printf "pass_6b8956e69246b7bedf4f40c72a789e80"
