FROM registry.redhat.io/rhel8/nodejs-12

COPY . /kie-ci-bot/

WORKDIR /kie-ci-bot/ 

RUN npm install

ENTRYPOINT ["npm","start"]
