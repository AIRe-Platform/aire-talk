#!/bin/bash
HASH=$(git rev-parse --short HEAD)
TAG=$(git tag --points-at HEAD)
JSON="{ \"hash\": \"$HASH\", \"gitTag\": \"$TAG\" }"
echo "$JSON" > version.json