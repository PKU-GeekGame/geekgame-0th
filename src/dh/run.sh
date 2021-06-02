#!/bin/bash
 
python server.py > /dev/null 2>&1 &

nc 127.0.0.1 1919