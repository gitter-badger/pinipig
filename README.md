# Pinipig

![](https://img.shields.io/github/issues/jmdisuanco/pinipig.svg)
![](https://img.shields.io/github/license/jmdisuanco/pinipig.svg) ![](https://img.shields.io/twitter/url/https/github.com/jmdisuanco/pinipig.svg?style=social)
![](https://img.shields.io/github/commit-activity/y/jmdisuanco/pinipig.svg)

A super `simple` `REST` webservice framework

Version 1 released!

## What's in version 1.2.0

- Routes
- Async Hooks
  - before
  - after
- Inbuilt file upload
- CORS
- preflight handling
- Async Functional Flow
- WebSockets
- a lot faster than previous version

## What are Hooks

hooks are functions that run before of after the main methods

hooks inside before

```javascript
hooks: {
  before: [hook1, hook2, hook3];
} // arrays
```

will run in consecutive order before the main method

hooks inside afer

```javascript
hooks: {
  before: [hook4, hook5, hook6];
} // arrays
```

will run in consecutive order after the main method is invoke

here's how the flow will look like

```
hook1 -> hook2 -> hook3 -> MainMethod -> hook4 ->hook5 -> hook6
```

## Getting Started

using Pinipig toolkit is pretty easy

installing the pinipig toolkit via npm

`npm install --save pinipig`

# Methods available inside context (ctx)

## res

| Method                        | Description                                                       | Usage                                                              |
| ----------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------ |
| writeStatus                   | send response status                                              | `res.writeStatus('200')`                                           |
| end                           | send end response                                                 | `res.end('Message HERE')`                                          |
| write                         | send message to cliend                                            | `res.send('Hello Client')`                                         |
| writeHeader alias `setHeader` | send the header part                                              | `res.writeHeader('content-type','text/json')`                      |
| writeHead                     | send the header part in sets and with status (node http polyfill) | `res.writeHead(200, { accept: "*", "content-type": "text/json" })` |

## req

| Method       | Description                        | Usage                                                                                                   |
| ------------ | ---------------------------------- | ------------------------------------------------------------------------------------------------------- |
| getHeader    | get Header of the request          | `req.getHeader('content-type')`                                                                         |
| getParameter | get paramater based on index       | `req.getParameter(0)` to retrieve name value on `\user\:name` route data also available via `data.name` |
| getUrl       | get URL of the request             | `req.getUrl()`                                                                                          |  |
| getMethod    | get Method of the request          | `req.getMethod()`                                                                                       |
| getQuery     |                                    | `req.getQuery()`                                                                                        |
| getHeaders   | get all the Headers sent by client | `req.getHeaders()`                                                                                      |

## ws

| Method            | Description |
| ----------------- | ----------- |
| send              |             |
| end               |             |
| close             |             |
| getBufferedAmount |             |
| subscribe         |             |
| publish           |             |

# Options

| Options | Type                      | Description                            | Posible Values (example)                     | Optional |
| ------- | ------------------------- | -------------------------------------- | -------------------------------------------- | -------- |
| routes  | (Object)                  | routes object see sample               | see examples                                 | No       |
| port    | (Integer)                 | port where to serve our Pinipig Server | 9090                                         | No       |
| banner  | (String / String Literal) | Message when Server start is succesful | `` `Pinipig Server is listening on 9090 ` `` | Yes      |

## Websockets

### Options

| Options           |
| ----------------- |
| compression       |
| maxPayloadLength  |
| idleTimeout: 3000 |

### Handlers

| Handlers |
| -------- |
| open     |
| message  |
| drain    |
| close    |

### Data Store Context

| From                                    | Where is it stored in context  |
| --------------------------------------- | ------------------------------ |
| URL parameter `/url/:username`          | `ctx.data.parameters.username` |
| Forms submitted via POST                | `ctx.data.fields` [Object]     |
| Files submitted vai multipart form-data | `ctx.data.files` [Array]       |

~Code Snippet~ inside route object

```javascript
//post: PostHandler,
//get: getHandler,
//...
ws: {
            options: {
                compression: 0,
                maxPayloadLength: 16 * 1024 * 1024,
                idleTimeout: 3000
            },
            open: WSPost,
            message: WSMessage,
            drain: null,
            close: null
        }
```

# Examples

## Pinipig in action! , Let's do the Pinipig crunch!

- ## Basic Example

```javascript
/**
 * This is a barebone example using the HTTP module of Nodejs
 * and taking advantage of pinipig's REST handler
 *
 */

const pinipig = require("pinipig");

let HelloWorld = function(ctx) {
  ctx.res.setHeader("Content-Type", "text/html");
  ctx.res.writeHead(200, {
    "Content-Type": "text/html"
  });
  ctx.res.write("Working"); //write a response to the client
  ctx.res.end(); //end the response
};

let Query = ctx => {
  ctx.res.setHeader("Content-Type", "text/html");
  ctx.res.writeHead(200, {
    "Content-Type": "text/html"
  });
  ctx.res.write("<H1>Hello " + ctx.data.name + "</H1>"); //write a response to the client
  ctx.res.end(); //end the response
};

let routes = [
  {
    url: "/",
    GET: HelloWorld
  },
  {
    url: "/user/:name", // http://localhost:9090/user/[NAME]
    GET: Query
  }
];

let options = {
  port: 9090,
  routes: routes
};

pinipig.createServer(options);
```

---

- ## Simple Hooks usage Example

```javascript
/**
 * This is an example with Hooks
 * and taking advantage of pinipig's REST handler
 *
 */

const pinipig = require("pinipig");

let HelloWorld = function(ctx) {
  ctx.res.setHeader("Content-Type", "text/html");
  ctx.res.writeHead(200, {
    "Content-Type": "text/html"
  });
  ctx.res.write("Working"); //write a response to the client
  ctx.res.end(); //end the response
};

let Query = ctx => {
  ctx.res.setHeader("Content-Type", "text/html");
  ctx.res.writeHead(200, {
    "Content-Type": "text/html"
  });
  ctx.res.write(`<H1> ${ctx.data.num} + 1 =  ${ctx.data.total}</H1>`); //iuput the processed data
  ctx.res.end(); //end the response
  return ctx;
};

let addOne = ctx => {
  ctx.data.total = parseInt(ctx.data.num) + 1;
  return ctx;
};

let sytemOut = ctx => {
  console.log(ctx.data); //console log to the system
};
let routes = [
  {
    url: "/",
    GET: HelloWorld
  },
  {
    url: "/add/:num", // http://localhost:9090/add/[Number]
    GET: Query,
    hooks: {
      before: addOne,
      after: sytemOut //console log to the system
    }
  }
];

let options = {
  port: 9090,
  routes: routes
};

pinipig.createServer(options);
```

---

- ## File Upload handling example

```javascript
/**
 * This is a example of handling upload in Pinipig server
 *
 *  -- > Make sure you created uploads folder in your App root. < --
 */

const pinipig = require("pinipig");

let UploadForm = context => {
  context.res.writeHead(200, {
    "content-type": "text/html"
  });
  context.res.write(
    '<form action="/upload" enctype="multipart/form-data" method="post">' +
      '<input type="text" name="title"/><br>' +
      '<input type="file" name="upload" multiple="multiple"><br>' +
      '<input type="submit" value="Upload">' +
      "</form>"
  );
  context.res.end();
  return context.res.end();
};

let UploadFormProcess = context => {
  let data = context.data;
  let tmpPath = data.files.upload.path;
  let newPath = "./examples/uploads/" + data.files.upload.name; //Make sure you created uploads folder in your App root.
  fs.rename(tmpPath, newPath, function(err) {
    if (err) throw err;
    context.res.write("File uploaded with title " + data.fields.title + "!");
    context.res.end();
  });
};

let routes = [
  {
    url: "/",
    GET: UploadForm
  },
  {
    url: "/upload",
    POST: UploadFormProcess
  }
];

let options = {
  port: 9090,
  routes: routes
};

pinipig.createServer(options);
```

---

- ## CORS example

```javascript
const pinipig = require("pinipig");

let { cors, preFlight } = pinipig.utils;
let HelloWorld = function(ctx) {
  ctx.res.setHeader("Content-Type", "text/html");
  ctx.res.writeHead(200, {
    "Content-Type": "text/html"
  });
  ctx.res.write("Working"); //write a response to the client
  ctx.res.end(); //end the response
};

let Query = ctx => {
  cors(ctx.res);
  ctx.res.setHeader("Content-Type", "text/html");
  ctx.res.writeHead(200, {
    "Content-Type": "text/html"
  });
  ctx.res.write("<H1>Hello " + ctx.data.name + "</H1>"); //write a response to the client
  ctx.res.end(); //end the response
};

let routes = [
  {
    url: "/",
    GET: HelloWorld
  },
  {
    url: "/user/:name", // http://localhost:9090/user/[NAME]
    GET: Query,
    OPTIONS: preFlight // Preflight check by browser
  }
];

let options = {
  port: 9090,
  routes: routes
};

pinipig.createServer(options);
```

---

## ** Breaking Changes for updates from 0.4.0 to 1.0.0 **

1. The res and req methods are now inside the context object
2. query and data objects are in data objects

this is how it looks like

```javascript
context = {
  res: res,
  req: req,
  data: dataObjectHere
};
```

If you are coming from lower version this is how you update your routes methods

```javascript
//from this
let HelloWorld = (req, res) => {
  console.log("helloWorld");
  res.setHeader("Content-Type", "text/html");
  res.writeHead(200, { "Content-Type": "text/html" });
  res.write("Working"); //write a response to the client
  res.end(); //end the response
};

//to this
let HelloWorld = context => {
  let res = context.res; // <--- assign this
  console.log("helloWorld");
  context.res.setHeader("Content-Type", "text/html"); //<-- you can have it like this
  res.writeHead(200, { "Content-Type": "text/html" });
  res.write("Working"); //write a response to the client
  res.end(); //end the response
};

//another example
//from this below version 1
var Query = (req, res, query) => {
  console.log("Query");
  res.setHeader("Content-Type", "text/html");
  res.writeHead(200, { "Content-Type": "text/html" });
  res.write("<H1>Hello " + query.name + "</H1>"); //write a response to the client
  res.end(); //end the response
};

//to this
var Query = context => {
  let res = context.res;
  let query = context.data;
  console.log("Query");
  res.setHeader("Content-Type", "text/html");
  res.writeHead(200, { "Content-Type": "text/html" });
  res.write("<H1>Hello " + query.name + "</H1>"); //write a response to the client
  res.end(); //end the response
};
```

```
  _____    _           _           _
 |  __ \  (_)         (_)         (_)
 | |__) |  _   _ __    _   _ __    _    __ _
 |  ___/  | | | '_ \  | | | '_ \  | |  / _` |
 | |      | | | | | | | | | |_) | | | | (_| |
 |_|      |_| |_| |_| |_| | .__/  |_|  \__, |
                          | |           __/ |
                          |_|          |___/
```

# License

MIT &copy; JOHN MARTIN DISUANCO
