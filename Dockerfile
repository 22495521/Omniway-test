
FROM node:20

WORKDIR /app
COPY . .

RUN npm install

RUN npm run build


EXPOSE 3005


ENV PORT=3005 \
    NODE_ENV=production

CMD ["npm","start"]
