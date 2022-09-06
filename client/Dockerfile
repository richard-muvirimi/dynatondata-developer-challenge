FROM node:alpine

WORKDIR /dynaton
# COPY package.json /dynaton
COPY . /dynaton

RUN yarn

# COPY . /dynaton

EXPOSE 3000

CMD ["npm", "run", "start"]