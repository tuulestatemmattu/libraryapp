#!/bin/bash
trap "echo signal; exit 0" SIGINT
while :
do
    read -t 0.1 || true
done