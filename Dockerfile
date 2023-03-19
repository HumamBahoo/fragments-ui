# Stage 01: install dependencies
################################
FROM node:18.14.2-alpine3.16@sha256:72c0b366821377f04d816cd0287360e372cc55782d045e557e2640cb8040d3ea AS dependencies

# define work directory for our app
WORKDIR /fragments-ui

# copy our package*.json dependencies
COPY package.json package-lock.json /fragments-ui/

# install app dependencies
RUN npm ci

# Stage 02: build our app
#########################
FROM node:18.14.2-alpine3.16@sha256:72c0b366821377f04d816cd0287360e372cc55782d045e557e2640cb8040d3ea AS build

# set build args
ARG AWS_COGNITO_POOL_ID
ARG AWS_COGNITO_CLIENT_ID
ARG AWS_COGNITO_HOSTED_UI_DOMAIN
ARG OAUTH_SIGN_IN_REDIRECT_URL
ARG OAUTH_SIGN_OUT_REDIRECT_URL

# set env variables
ENV AWS_COGNITO_POOL_ID=$AWS_COGNITO_POOL_ID
ENV AWS_COGNITO_CLIENT_ID=$AWS_COGNITO_CLIENT_ID
ENV AWS_COGNITO_HOSTED_UI_DOMAIN=$AWS_COGNITO_HOSTED_UI_DOMAIN
ENV OAUTH_SIGN_IN_REDIRECT_URL=$OAUTH_SIGN_IN_REDIRECT_URL
ENV OAUTH_SIGN_OUT_REDIRECT_URL=$OAUTH_SIGN_OUT_REDIRECT_URL

# define work directory for our app
WORKDIR /fragments-ui

# copy the generated node_modules folder from our dependencies layer
COPY --from=dependencies /fragments-ui /fragments-ui/

# copy our source code into our image
COPY ./src/ /fragments-ui/src/

# install parcel
RUN npm install parcel@2.8.3

# build site
RUN npm run build

# Stage 03: deploy the site
###########################
FROM nginx:1.22.1-alpine@sha256:a9e4fce28ad7cc7de45772686a22dbeaeeb54758b16f25bf8f64ce33f3bff636 AS deploy

# copy the built dirctory into nginx target directory
COPY --from=build /fragments-ui/dist/ /usr/share/nginx/html

# nginx exposes port 80
EXPOSE 80
