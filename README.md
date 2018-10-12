### Usage

1. Ensure you Node.js installed. [See](https://nodejs.org/en/download/)

2. Clone this repo by running the command - `git clone https://erpprog@bitbucket.org/erpprog/node-reverse-proxy.git`

3. Navigate to the directory where the repo is cloned to. (e.g `cd node-reverse-proxy`)

4. Run `npm install` | `yarn` to install all the dependencies.

5. Start the application locally by running `npm start` | `yarn start`

6. You can use command line parameters on ENV variables to set remote url and local port, see sources.

#### Example:
- Run `npm start yandex.ru 82`
- Browse [http://localhost:82](http://localhost:82)

### Advandced
You can use injecton for replace pages / scripts content using public field spyFunction:

`import { ReverseProxy } from './ReverseProxy'`

    const p: ReverseProxy = new ReverseProxy()
    p.spyFunction = (strBody: string): string => strBody.replace(/\<(\/?)p\>/,"<$1h1>")`
This code replaces all `<p>` tags to `<h1>` tags :)

### License

[The MIT License](LICENSE).
