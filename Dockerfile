FROM node:latest
MAINTAINER linmadan <772181827@qq.com>
COPY ./package.json /home/data-visual/
WORKDIR /home/data-visual
RUN ["npm","config","set","registry","http://registry.npm.taobao.org"]
RUN ["npm","install","--save-dev","mocha@3.2.0"]
RUN ["npm","install","--save-dev","muk@0.5.3"]
RUN ["npm","install","--save-dev","should@11.1.2"]
RUN ["npm","install","--save-dev","supertest@2.0.1"]
RUN ["npm","install","--save","body-parser@1.16.0"]
RUN ["npm","install","--save","co@4.6.0"]
RUN ["npm","install","--save","express@4.14.1"]
RUN ["npm","install","--save","underscore@1.8.3"]
RUN ["npm","install","--save","mongodb@2.2.22"]
RUN ["npm","install","--save","gridvo-common-js@0.0.17"]
COPY ./app.js app.js
COPY ./lib lib
COPY ./test test
VOLUME ["/home/data-visual"]
ENTRYPOINT ["node"]
CMD ["app.js"]