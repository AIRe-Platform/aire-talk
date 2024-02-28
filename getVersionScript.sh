#!/bin/bash
HASH=$(git rev-parse --short HEAD)
TAG=$(git tag --points-at HEAD)
JSON="{ \"hash\": \"$HASH\", \"tag\": \"$TAG\" }"
echo "$JSON" > version.json
