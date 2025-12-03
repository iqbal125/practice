# Node.js Interview Questions and Answers

## Basic Level Questions

### 1. What is Node.js?
Node.js is an open-source, cross-platform JavaScript runtime environment built on Chrome's V8 JavaScript engine. It allows developers to run JavaScript on the server-side, enabling the creation of scalable network applications. Node.js uses an event-driven, non-blocking I/O model that makes it lightweight and efficient.

### 2. What are the key features of Node.js?
- **Asynchronous and Event-Driven**: All APIs are asynchronous, meaning the server doesn't wait for an API to return data
- **Single-Threaded with Event Loop**: Uses a single-threaded model with event looping
- **Fast Execution**: Built on Google Chrome's V8 JavaScript Engine
- **No Buffering**: Node.js applications output data in chunks
- **Cross-Platform**: Can run on Windows, Linux, Unix, Mac OS X, etc.
- **NPM**: Comes with the largest ecosystem of open-source libraries

### 3. What is npm?
npm (Node Package Manager) is the default package manager for Node.js. It's used to install, share, and manage dependencies in Node.js projects. npm consists of:
- A command-line client
- An online repository of public and private packages
- The npm registry

### 4. What is the difference between Node.js and JavaScript?
- **JavaScript** is a programming language that runs in web browsers and other environments
- **Node.js** is a runtime environment that allows JavaScript to run on the server-side
- JavaScript in browsers has access to DOM and window objects, while Node.js has access to file system, network, and other server-side APIs
- Node.js provides additional modules like fs, http, crypto that aren't available in browser JavaScript

### 5. What is callback in Node.js?
A callback is a function passed as an argument to another function, which is executed after the completion of an operation. Node.js heavily uses callbacks for asynchronous operations.

```javascript
fs.readFile('file.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(data);
});
```

## Intermediate Level Questions

### 6. Explain the Event Loop in Node.js
The Event Loop is the core of Node.js's asynchronous behavior. It continuously checks the call stack and callback queue, pushing callbacks to the call stack when it's empty. The phases include:
1. **Timers**: Executes callbacks scheduled by setTimeout() and setInterval()
2. **Pending Callbacks**: Executes I/O callbacks deferred to the next loop iteration
3. **Idle, Prepare**: Internal use only
4. **Poll**: Retrieve new I/O events and execute I/O related callbacks
5. **Check**: setImmediate() callbacks are invoked here
6. **Close Callbacks**: Some close callbacks, e.g., socket.on('close', ...)

### 7. What is callback hell and how can you avoid it?
Callback hell refers to heavily nested callbacks that make code hard to read and maintain.

**Example of callback hell:**
```javascript
getData(function(a) {
  getMoreData(a, function(b) {
    getMoreData(b, function(c) {
      getMoreData(c, function(d) {
        // Deeply nested
      });
    });
  });
});
```

**Solutions:**
- Use Promises
- Use async/await
- Modularize code into smaller functions
- Use libraries like async.js

### 8. What are Promises in Node.js?
Promises are objects that represent the eventual completion or failure of an asynchronous operation. They provide a cleaner alternative to callbacks.

```javascript
const promise = new Promise((resolve, reject) => {
  // Async operation
  if (success) {
    resolve(result);
  } else {
    reject(error);
  }
});

promise
  .then(result => console.log(result))
  .catch(error => console.error(error));
```

### 9. Explain async/await in Node.js
Async/await is syntactic sugar built on top of Promises, making asynchronous code look synchronous.

```javascript
async function fetchData() {
  try {
    const data = await getData();
    const processed = await processData(data);
    return processed;
  } catch (error) {
    console.error(error);
  }
}
```

### 10. What is middleware in Express.js?
Middleware functions are functions that have access to the request object (req), response object (res), and the next middleware function in the application's request-response cycle.

```javascript
app.use((req, res, next) => {
  console.log('Time:', Date.now());
  next(); // Pass control to the next middleware
});
```

### 11. What are Streams in Node.js?
Streams are objects that let you read data from a source or write data to a destination in a continuous manner. There are four types:
- **Readable**: For reading operations
- **Writable**: For writing operations
- **Duplex**: For both reading and writing
- **Transform**: A type of duplex stream where output is computed based on input

```javascript
const fs = require('fs');
const readStream = fs.createReadStream('input.txt');
const writeStream = fs.createWriteStream('output.txt');
readStream.pipe(writeStream);
```

## Advanced Level Questions

### 12. What is the difference between process.nextTick() and setImmediate()?
- **process.nextTick()**: Executes immediately after the current operation completes, before the event loop continues
- **setImmediate()**: Executes on the next iteration of the event loop

```javascript
setImmediate(() => console.log('setImmediate'));
process.nextTick(() => console.log('nextTick'));
// Output: nextTick, then setImmediate
```

### 13. How does Node.js handle child processes?
Node.js provides the `child_process` module to spawn child processes. Methods include:
- **spawn()**: Launches a new process
- **exec()**: Spawns a shell and executes a command
- **execFile()**: Similar to exec() but doesn't spawn a shell
- **fork()**: Special case of spawn() for creating Node.js processes

```javascript
const { spawn } = require('child_process');
const ls = spawn('ls', ['-lh', '/usr']);

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});
```

### 14. What is clustering in Node.js?
Clustering allows you to create multiple worker processes that share the same server port, enabling better utilization of multi-core systems.

```javascript
const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
} else {
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end('Hello World\n');
  }).listen(8000);
}
```

### 15. Explain the Buffer class in Node.js
Buffer is a global class used to handle binary data directly. It's similar to an array of integers but corresponds to fixed-size raw memory allocation outside the V8 heap.

```javascript
// Create a Buffer
const buf1 = Buffer.alloc(10);
const buf2 = Buffer.from('Hello');
const buf3 = Buffer.from([1, 2, 3]);

// Write to Buffer
buf1.write('Node.js');

// Read from Buffer
console.log(buf2.toString());
```

### 16. What is EventEmitter in Node.js?
EventEmitter is a class that allows objects to emit named events that cause functions (listeners) to be called.

```javascript
const EventEmitter = require('events');

class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

myEmitter.on('event', () => {
  console.log('An event occurred!');
});

myEmitter.emit('event');
```

### 17. How do you handle errors in Node.js?
Error handling strategies include:
- **Try-catch blocks** for synchronous code
- **Callbacks with error-first pattern**
- **Promise rejection handling**
- **Event emitters for error events**
- **Global error handlers** for uncaught exceptions

```javascript
// Callback error handling
fs.readFile('file.txt', (err, data) => {
  if (err) return handleError(err);
  // Process data
});

// Promise error handling
promise.catch(error => handleError(error));

// Async/await error handling
try {
  const data = await asyncOperation();
} catch (error) {
  handleError(error);
}

// Global error handler
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});
```

### 18. What is the purpose of package-lock.json?
`package-lock.json` is automatically generated for any operations where npm modifies either the node_modules tree or package.json. It:
- Ensures that the same dependencies are installed on all machines
- Provides a single source of truth for the exact dependency tree
- Optimizes the installation process by allowing npm to skip repeated metadata resolutions
- Locks the versions of the entire dependency tree

### 19. Explain the difference between dependencies and devDependencies
- **dependencies**: Packages required for the application to run in production
- **devDependencies**: Packages only needed for development and testing

```json
{
  "dependencies": {
    "express": "^4.17.1",
    "mongoose": "^5.12.0"
  },
  "devDependencies": {
    "nodemon": "^2.0.7",
    "jest": "^26.6.3"
  }
}
```

### 20. What are some common security best practices in Node.js?
- **Validate and sanitize user input** to prevent injection attacks
- **Use HTTPS** for encrypted communication
- **Keep dependencies updated** to patch security vulnerabilities
- **Implement rate limiting** to prevent DoS attacks
- **Use helmet.js** for securing Express apps with various HTTP headers
- **Store sensitive data in environment variables**, not in code
- **Implement proper authentication and authorization**
- **Use parameterized queries** to prevent SQL injection
- **Enable CORS carefully** with specific origins
- **Avoid using eval()** or executing dynamic code

```javascript
// Example using helmet for security headers
const helmet = require('helmet');
app.use(helmet());

// Environment variables for sensitive data
const dbPassword = process.env.DB_PASSWORD;

// Rate limiting example
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests
});
app.use(limiter);
```

## Performance and Optimization Questions

### 21. How do you optimize Node.js application performance?
- **Use caching** (Redis, Memcached) to reduce database queries
- **Implement connection pooling** for database connections
- **Use compression** (gzip) for responses
- **Optimize database queries** and use indexes
- **Implement clustering** to utilize multiple CPU cores
- **Use PM2** or similar process managers
- **Monitor and profile** applications to identify bottlenecks
- **Minimize synchronous operations**
- **Use streaming for large data sets**
- **Implement proper logging levels** to avoid excessive I/O

### 22. What is the N+1 query problem and how do you solve it?
The N+1 problem occurs when fetching a list of items and then making additional queries for related data for each item. Solutions include:
- **Eager loading** relationships
- **Using JOINs** in SQL queries
- **Batch loading** with DataLoader pattern
- **Query optimization** and proper indexing

### 23. What are memory leaks in Node.js and how do you prevent them?
Memory leaks occur when memory is allocated but not released. Common causes and solutions:
- **Global variables**: Minimize their use
- **Closures**: Be careful with long-lived closures
- **Event listeners**: Remove listeners when no longer needed
- **Timers**: Clear intervals and timeouts
- **Large data structures**: Clean up after use

```javascript
// Remove event listeners
emitter.removeListener('data', callback);

// Clear timers
clearInterval(intervalId);
clearTimeout(timeoutId);

// Monitor memory usage
console.log(process.memoryUsage());
```

## Database and ORM Questions

### 24. What is Mongoose in Node.js?
Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js. It manages relationships between data, provides schema validation, and is used to translate between objects in code and the representation of those objects in MongoDB.

```javascript
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  age: Number,
  created: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
```

### 25. How do you handle database connections in Node.js?
Best practices for database connections:
- **Use connection pooling** to reuse connections
- **Handle connection errors gracefully**
- **Close connections when done**
- **Use environment variables for credentials**
- **Implement retry logic for failed connections**

```javascript
// MongoDB connection example
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10
});

// MySQL connection pool example
const mysql = require('mysql2');
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
```

## Testing Questions

### 26. What are the popular testing frameworks for Node.js?
- **Jest**: Full-featured testing framework by Facebook
- **Mocha**: Flexible testing framework
- **Chai**: Assertion library often used with Mocha
- **Supertest**: HTTP assertion library
- **Sinon**: For spies, stubs, and mocks

```javascript
// Jest example
describe('User Service', () => {
  test('should create a new user', async () => {
    const user = await createUser({ name: 'John' });
    expect(user.name).toBe('John');
  });
});

// Mocha + Chai example
describe('Calculator', () => {
  it('should add two numbers', () => {
    expect(add(2, 3)).to.equal(5);
  });
});
```

### 27. What is the difference between unit testing and integration testing?
- **Unit Testing**: Tests individual components/functions in isolation
- **Integration Testing**: Tests how different components work together

```javascript
// Unit test example
test('formatDate returns correct format', () => {
  const result = formatDate(new Date('2024-01-01'));
  expect(result).toBe('01/01/2024');
});

// Integration test example
test('API endpoint returns user data', async () => {
  const response = await request(app)
    .get('/api/users/1')
    .expect(200);
  
  expect(response.body).toHaveProperty('name');
});
```

## RESTful API Questions

### 28. What are the main HTTP methods used in RESTful APIs?
- **GET**: Retrieve data
- **POST**: Create new resource
- **PUT**: Update entire resource
- **PATCH**: Partial update
- **DELETE**: Remove resource
- **HEAD**: Get headers only
- **OPTIONS**: Get allowed methods

### 29. How do you implement authentication in Node.js?
Common authentication methods:
- **JWT (JSON Web Tokens)**
- **Session-based authentication**
- **OAuth 2.0**
- **Passport.js middleware**

```javascript
// JWT example
const jwt = require('jsonwebtoken');

// Generate token
const token = jwt.sign(
  { userId: user.id, email: user.email },
  process.env.JWT_SECRET,
  { expiresIn: '1h' }
);

// Verify token middleware
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  
  if (!token) {
    return res.status(401).json({ error: 'Access denied' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};
```

### 30. What is CORS and how do you handle it in Node.js?
CORS (Cross-Origin Resource Sharing) is a mechanism that allows restricted resources on a web page to be requested from another domain.

```javascript
// Using cors package
const cors = require('cors');

app.use(cors({
  origin: 'https://example.com',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Manual implementation
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
  next();
});
```

## Microservices and Architecture Questions

### 31. What are microservices and how do they relate to Node.js?
Microservices are an architectural style where applications are built as a collection of small, autonomous services. Node.js is well-suited for microservices because:
- Lightweight and fast startup
- Good for I/O intensive operations
- Easy to scale horizontally
- Rich ecosystem of packages

### 32. What is PM2?
PM2 is a production process manager for Node.js applications with features like:
- Automatic restarts on failure
- Load balancing
- Zero-downtime deployments
- Monitoring and logging
- Cluster mode support

```javascript
// PM2 ecosystem.config.js
module.exports = {
  apps: [{
    name: 'app',
    script: './index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production'
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log'
  }]
};
```

### 33. What is the purpose of .env files?
`.env` files store environment variables and configuration settings that shouldn't be hard-coded in the application. They're used for:
- Database credentials
- API keys
- Port numbers
- Environment-specific settings

```javascript
// Using dotenv package
require('dotenv').config();

const dbHost = process.env.DB_HOST;
const apiKey = process.env.API_KEY;
const port = process.env.PORT || 3000;
```

### 34. What is WebSocket and how is it implemented in Node.js?
WebSocket provides full-duplex communication channels over a single TCP connection. It's used for real-time applications.

```javascript
// Using ws package
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    console.log('Received:', message);
    ws.send(`Echo: ${message}`);
  });
  
  ws.send('Welcome!');
});

// Using socket.io
const io = require('socket.io')(server);

io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
});
```

### 35. What is Redis and how is it used with Node.js?
Redis is an in-memory data structure store used as database, cache, and message broker. Common uses with Node.js:
- Session storage
- Caching API responses
- Rate limiting
- Pub/Sub messaging

```javascript
const redis = require('redis');
const client = redis.createClient();

// Caching example
async function getCachedData(key) {
  const cached = await client.get(key);
  if (cached) {
    return JSON.parse(cached);
  }
  
  const data = await fetchFromDatabase();
  await client.setex(key, 3600, JSON.stringify(data));
  return data;
}
```

### 36. What is GraphQL and how does it differ from REST?
GraphQL is a query language for APIs that allows clients to request exactly what data they need. Key differences from REST:
- Single endpoint vs multiple endpoints
- Client specifies exact data needs
- No over-fetching or under-fetching
- Strong typing system

```javascript
// GraphQL with Apollo Server
const { ApolloServer, gql } = require('apollo-server');

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
  }
  
  type Query {
    users: [User]
    user(id: ID!): User
  }
`;

const resolvers = {
  Query: {
    users: () => getUserList(),
    user: (parent, { id }) => getUserById(id)
  }
};

const server = new ApolloServer({ typeDefs, resolvers });
```

### 37. What are worker threads in Node.js?
Worker threads allow CPU-intensive JavaScript operations to run in parallel. They're useful for:
- Heavy computations
- Image/video processing
- Cryptographic operations

```javascript
const { Worker, isMainThread, parentPort } = require('worker_threads');

if (isMainThread) {
  const worker = new Worker(__filename);
  worker.on('message', (result) => {
    console.log('Result:', result);
  });
  worker.postMessage({ cmd: 'calculate', num: 1000000 });
} else {
  parentPort.on('message', (data) => {
    if (data.cmd === 'calculate') {
      // Perform heavy computation
      const result = heavyCalculation(data.num);
      parentPort.postMessage(result);
    }
  });
}
```

### 38. How do you handle file uploads in Node.js?
File uploads can be handled using middleware like multer:

```javascript
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname)
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images allowed'));
    }
  }
});

app.post('/upload', upload.single('file'), (req, res) => {
  res.json({ filename: req.file.filename });
});
```

### 39. What is the difference between require() and import?
- **require()**: CommonJS module system, synchronous, Node.js default
- **import**: ES6 modules, can be asynchronous, static analysis possible

```javascript
// CommonJS
const express = require('express');
module.exports = myFunction;

// ES6 Modules
import express from 'express';
export default myFunction;
export { namedExport };
```

### 40. How do you debug Node.js applications?
Debugging methods include:
- **console.log()** for basic debugging
- **Node.js built-in debugger**: `node inspect app.js`
- **Chrome DevTools**: `node --inspect app.js`
- **VS Code debugger**
- **Debug module** for conditional logging

```javascript
// Using debug module
const debug = require('debug')('app:server');

debug('Server starting on port %d', port);

// Run with: DEBUG=app:* node server.js
```

## Common Interview Coding Challenges

### 41. Implement a simple rate limiter
```javascript
class RateLimiter {
  constructor(maxRequests, timeWindow) {
    this.maxRequests = maxRequests;
    this.timeWindow = timeWindow;
    this.requests = new Map();
  }
  
  isAllowed(userId) {
    const now = Date.now();
    const userRequests = this.requests.get(userId) || [];
    
    // Remove old requests outside time window
    const validRequests = userRequests.filter(
      time => now - time < this.timeWindow
    );
    
    if (validRequests.length < this.maxRequests) {
      validRequests.push(now);
      this.requests.set(userId, validRequests);
      return true;
    }
    
    return false;
  }
}
```

### 42. Create a simple LRU Cache
```javascript
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }
  
  get(key) {
    if (!this.cache.has(key)) return -1;
    
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }
  
  put(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }
}
```

### 43. Implement retry logic for failed requests
```javascript
async function retryRequest(fn, maxRetries = 3, delay = 1000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      console.log(`Attempt ${i + 1} failed. Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2; // Exponential backoff
    }
  }
}

// Usage
const result = await retryRequest(
  () => fetch('https://api.example.com/data'),
  5,
  500
);
```

## Best Practices and Tips

### 44. Node.js Best Practices Summary
1. **Always use async/await** for better error handling and readability
2. **Handle errors properly** at all levels of the application
3. **Use environment variables** for configuration
4. **Implement proper logging** with appropriate levels
5. **Keep dependencies updated** and audit regularly
6. **Use linters and formatters** (ESLint, Prettier)
7. **Write tests** for critical functionality
8. **Document your APIs** (Swagger/OpenAPI)
9. **Monitor application performance** in production
10. **Use TypeScript** for larger projects

### 45. Common Performance Tips
1. **Cache frequently accessed data**
2. **Use database indexes properly**
3. **Implement pagination for large datasets**
4. **Compress responses with gzip**
5. **Use CDN for static assets**
6. **Optimize images and assets**
7. **Implement database connection pooling**
8. **Use worker threads for CPU-intensive tasks**
9. **Profile and monitor memory usage**
10. **Implement horizontal scaling with load balancers**