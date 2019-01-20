FROM ubuntu

RUN apt-get update
RUN apt-get update && apt-get install -y git
RUN apt-get update && apt-get install -y nodejs
RUN apt-get update && apt-get install -y npm

WORKDIR C:\Users\Ivan Grigorov\Desktop\FootballPredictionsV3

COPY package*.json ./

RUN npm install

COPY . .
