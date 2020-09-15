FROM docker.io/node:12.18.2-alpine

COPY . /kie-ci-bot/

RUN chown 1001:1001 -R /kie-ci-bot/

RUN mkdir /.npm && chown -R 1001:0 "/.npm"
RUN  mkdir /.config && chown -R 1001:1001 /.config
USER 1001

WORKDIR /kie-ci-bot/ 

RUN npm install

ENTRYPOINT ["npm","start"]
