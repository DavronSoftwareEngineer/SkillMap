FROM node:22-alpine

WORKDIR /app
COPY package.json ./
COPY src ./src
COPY test ./test

RUN addgroup -S app && adduser -S app -G app
USER app
EXPOSE 3000
CMD ["npm", "run", "start"]
