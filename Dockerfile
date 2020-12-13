FROM node:14.14.0-alpine3.12 as intermediate
# ARG REV_NO

# Create app directory
WORKDIR /src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
ADD package.json yarn.lock ./

RUN yarn
# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
COPY . .
RUN yarn  build

# Generate DEV dist

FROM node:14.14.0-alpine3.12 
RUN yarn global add serve
WORKDIR /src/app


COPY --from=intermediate /src/app/build ./
# COPY ./env.sh .env ./

# Add bash
RUN apk add --no-cache bash
# RUN chmod +x ./env.sh

# export container port
EXPOSE 3000

CMD ["/bin/bash", "-c", "serve ./ -p 3000 -s"]



