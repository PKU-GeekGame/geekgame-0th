#!/bin/bash
 
python proxy.py > /dev/null 2>&1 &
python web.py > /dev/null 2>&1 &
python max.py > /dev/null 2>&1 &
 
while [[ true ]]; do
    sleep 10;
done
