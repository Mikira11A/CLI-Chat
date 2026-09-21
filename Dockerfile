FROM node:24.15.0-alpine3.22

WORKDIR /home/node

USER root
COPY package*.json ./
RUN --mount=type=cache,target=/home/node/.npm,uid=1000,gid=1000 npm install 

USER node
CMD [ "node", "chatroom/server/server.js" ]