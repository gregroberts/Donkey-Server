#!/bin/sh -

cd /home/donkey/Donkey-Server
nohup rqworker default &
nohup rqworker collections &


