# ABOUT GATEWAY
This is a custom designed backend API gateway that was created using express.js, a backend technology built with node.js
This gateway is completely adaptable, making it simple to interface with any backend service regardless of the programming language or architecture. The gateway has the capacity to load balance client requests. 
Additionally, the gateway can run on several instances, enabling you to allocate or dedicate a specific instance to any client of your choice, including desktop, mobile, and third-party clients.
Note: this is a Backend API Gateway application rather than a backend service; it serves as a top-level entry point to any desired backend services.

# FEATURES
1.	API routing
2.	IP blocking
3.	Request throttling
4.	Load balancing
5.	Session management
6.	API top-level security

# TECHNOLOGY
1.	MYSQL
2.	Redis
3.	Express.js 
4.	node.js
5.	Typescript

# ARCHITECTURE
1.	nano-service
2.	monolithic

# REPOSITORY LINK
1.	github.com https://github.com/nuelnike/custom-API-gateway

# HOW TO DEPLOY
1.	Set up server environment by installing nginx, node, NPM, MYSQL & Redis cache
2.	Clone project from github.com
3.	Run “npm install” to install all packages and dependencies.
4.	Run “npm run dev” to start application.

# HOW TO ADD NEW ROUTE
1.	Locate “src/routes”
2.	Make a duplicate of the file "sample_service" and rename it to the service route you choose.
3.	Update and save "src/routes/index.ts" with the name of the new service “require('./sample_service.ts')(router);”
