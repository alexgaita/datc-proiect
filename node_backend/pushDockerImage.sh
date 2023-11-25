#!/bin/bash

docker build . -t proiect-datc:latest

docker tag proiect-datc alexgaita/proiect-datc

docker push alexgaita/proiect-datc