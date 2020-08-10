FROM node

COPY . .
RUN npm install
RUN npm install -g typescript
RUN npm run build

EXPOSE 3001

# CMD node index.js
CMD node ./dist/main.js
