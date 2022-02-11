#!/bin/sh

yarn install
make protogen
yarn build
