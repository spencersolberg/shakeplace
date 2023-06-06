<div align="center">
  <h1>Shakeplace</h1>
  
  <p>
    r/Place clone using Handshake names 
  </p>
  
  
<!-- Badges -->
<p>
  <a href="https://github.com/spencersolberg/shakeplace/graphs/contributors">
    <img src="https://img.shields.io/github/contributors/spencersolberg/shakeplace" alt="contributors" />
  </a>
  <a href="">
    <img src="https://img.shields.io/github/last-commit/spencersolberg/shakeplace" alt="last update" />
  </a>
  <a href="https://github.com/spencersolberg/shakeplace/network/members">
    <img src="https://img.shields.io/github/forks/spencersolberg/shakeplace" alt="forks" />
  </a>
  <a href="https://github.com/spencersolberg/shakeplace/stargazers">
    <img src="https://img.shields.io/github/stars/spencersolberg/shakeplace" alt="stars" />
  </a>
  <a href="https://github.com/spencersolberg/shakeplace/issues/">
    <img src="https://img.shields.io/github/issues/spencersolberg/shakeplace" alt="open issues" />
  </a>
  <a href="https://github.com/spencersolberg/shakeplace/blob/master/LICENSE">
    <img src="https://img.shields.io/github/license/spencersolberg/shakeplace.svg" alt="license" />
  </a>
</p>
   
<h4>
    <a href="https://shakeplace/">Visit Site</a>
  <span> · </span>
    <a href="https://github.com/spencersolberg/shakeplace/">Report Bug</a>
  <span> · </span>
    <a href="https://github.com/spencersolberg/shakeplace/">Request Feature</a>
  </h4>
</div>

<br />

<!-- Table of Contents -->
# Table of Contents

- [Table of Contents](#table-of-contents)
  - [About the Project](#about-the-project)
    - [Screenshots](#screenshots)
    - [Tech Stack](#tech-stack)
    - [Environment Variables](#environment-variables)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Running](#running)
    - [Building](#building)
  - [Contact](#contact)
  - [Acknowledgements](#acknowledgements)

  

<!-- About the Project -->
## About the Project

[Shakeplace](https://shakeplace/) is an [r/Place](https://www.redditinc.com/blog/the-day-redditors-broke-the-internet-again) that uses [Handshake name signing](https://hsd-dev.org/api-docs/#signmessagewithname) to authenticate pixel placement.

<!-- Screenshots -->
### Screenshots

<div align="center"> 
  <img src="https://file.coffee/u/VAzz5ZJfYWNZqo.png" alt="screenshot of login page">
  <img src="https://file.coffee/u/wv5SFhEA9B6Qvp.png" alt="screenshot of shakeplace canvas" />
  <img src="https://file.coffee/u/6G7ARzdHJcqRqF.png" alt="screenshot of handshake pixel signing">
  <img src="https://file.coffee/u/upZOF3RmZ5y_g2.png" alt="screenshot of pixel info">
</div>


<!-- TechStack -->
### Tech Stack
  <ul>
    <li><a href="https://remix.run">Remix</a></li>
    <li><a href="https://tailwindcss.com/">TailwindCSS</a></li>
    <li><a href="https://www.prisma.io/">Prisma</a></li>
    <li><a href="https://socket.io/">Socket.io</a></li>
  </ul>




<!-- Env Variables -->
### Environment Variables

To run this project, you will need to add the following environment variables to your .env file

```env
VITE_DB_ADMIN_USERNAME=admin
VITE_DB_ADMIN_PASSWORD=password
VITE_DB_BACKEND_HOST=localhost
VITE_DB_FRONTEND_HOST=localhost
VITE_DB_BACKEND_PORT=1234
VITE_DB_FRONTEND_PORT=1234
```

<!-- Getting Started -->
## Getting Started

<!-- Prerequisites -->
### Prerequisites

* [Node.js (v16.13.0) / NPM (8.1.0)](https://github.com/nvm-sh/nvm)
* [HSD](https://github.com/handshake-org/hsd/blob/master/docs/install.md)

#### OR

* [Docker](https://docs.docker.com/get-docker/)

---
You will need a lot of space for the Handshake blockchain.

<!-- Installation -->
### Installation

Clone Shakeplace repo and install dependencies with NPM

```bash
git clone https://github.com/spencersolberg/shakeplace
cd shakeplace
```
   
<!-- Run Locally -->
### Running

Run HSD

```bash
hsd --no-wallet
```

Install node modules and launch run script

```bash
npm i
npm run dev
```

#### OR

Run with Docker

```bash
docker build --no-cache -t shakeplace .
docker run -p 3000:3000 shakeplace
```

<!-- Building -->
### Building

Launch build script

```bash
npm run build
```

Run a local server with

```bash
npm run start
```

<!-- Contact -->
## Contact

* Twitter - [@spencersolberg_](https://twitter.com/spencersolberg_)
* Discord - spencer#3767



<!-- Acknowledgments -->
## Acknowledgements


* [Minipax Typeface](http://www.velvetyne.fr/fonts/minipax/) by Raphaël Ronot from Velvetyne Type Foundry
* [Awesome Readme Template](https://github.com/Louis3797/awesome-readme-template) by Louis3797