FROM node:19-bullseye
WORKDIR /usr/server/app

# Install dependencies
RUN apt-get update && apt-get install -y openssl sqlite3 python3
ENV PYTHONUNBUFFERED=1
# RUN pip3 install --no-cache --upgrade pip setuptools


# Install shakeplace
COPY ./package.json ./
RUN npm install

COPY ./ .

# Configure database
ENV DEBUG="*"
RUN npx prisma generate
RUN npx prisma db push
RUN npx prisma db seed

# Build app
RUN npm run build
ENV NODE_ENV=production

# Install HSD
RUN npm install -g https://github.com/handshake-org/hsd.git

# Install concurrently
RUN npm install -g concurrently

# Start app
CMD concurrently "hsd --no-wallet" "npm run start"