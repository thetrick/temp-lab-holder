FROM mhart/alpine-node:4.4

WORKDIR /root
RUN npm install node-redis
ADD ./app.js  ./app.js

EXPOSE 4040
CMD ["node", "app.js"]