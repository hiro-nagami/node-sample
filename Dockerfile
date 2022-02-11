FROM node:14-slim

RUN apt-get update
RUN apt-get install -y make gcc g++ bash

ENV HOST 0.0.0.0

CMD [ "/bin/bash" ]