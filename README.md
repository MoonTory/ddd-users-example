# DDD NodeJs API

This project is a backend service built with Node.js, Express, and TypeScript. It follows a modular architecture to ensure ease of testing and maintainability.

### How to Run the Application

To run this application, you'll need to have both Yarn and Docker installed on your machine. Follow the steps below to set up and run the application in different environments:

1. **Install Yarn**  
   If you don't have Yarn installed, you can install it by following the instructions on the [Yarn website](https://yarnpkg.com/getting-started/install).

2. **Install Dependencies**  
   After cloning the repository, navigate to the root directory of the project and run the following command to install all the necessary dependencies:
   ```bash
   yarn install
   ```
3. **Run the Application in Development Mode**  
   To start the application in development mode, use Docker Compose to spin up the necessary services by running `docker-compose up`. This command will start all the required services defined in the `docker-compose.yml` file.

   Then run the app:

   ```bash
   yarn start:dev
   ```

4. **Run Tests**  
   For running tests, use the `docker-compose.test.yml` file to set up the test environment by running `docker-compose -f docker-compose.test.yml up`. Then run `yarn run test`.

### Swagger Documentation

The Swagger documentation for this API is available at the following endpoint:

```
http://localhost:4323/swagger/
```

## Folder Structure

```plaintext
.
├── .gitignore
├── LICENSE
├── package.json
├── packages/
│   └── users/
│       ├── .prettierignore
│       ├── .prettierrc
│       ├── docker-compose.test.yml
│       ├── docker-compose.yml
│       ├── jest.config.js
│       ├── package.json
│       ├── src/
│       │   ├── tests/
│       │   │   ├── app/
│       │   │   ├── domain/
│       │   │   ├── server/
│       │   ├── app/
│       │   │   ├── app.ts
│       │   │   ├── container.ts
│       │   │   ├── data-source.ts
│       │   │   ├── index.ts
│       │   │   ├── symbols.ts
│       │   ├── bin/
│       │   │   └── index.ts
│       │   ├── domain/
│       │   │   ├── index.ts
│       │   │   ├── users/
│       │   ├── migration/
│       │   ├── server/
│       │   │   ├── controller/
│       │   │   │   └── user.controller.ts
│       │   │   ├── server.ts
│       │   ├── swagger.ts
│       │   ├── test-helpers/
│       │   ├── types/
│       ├── tsconfig.json
│       ├── tsoa.json
│       ├── webpack.config.ts
│       ├── yarn-error.log
└── README.md
```

### Folder Descriptions

- **bin/**: The entry point of the application. It contains the startup script.
- **app/**: Contains application-specific configurations and the dependency injection (DI) setup.
  - **app.ts**: Defines the main application class.
  - **container.ts**: Sets up the DI container.
  - **data-source.ts**: Configures the data source.
  - **symbols.ts**: Contains symbols for DI.
- **domain/**: Contains domain-specific implementations such as models, repositories, and business logic.
  - **users/**: Contains user-related domain logic.
- **server/**: Contains server-related code such as controllers.
  - **controller/**: Contains the user controller.
  - **server.ts**: Sets up the Express server.
- **tests/**: Contains test cases for the application.
- **swagger.ts**: Configures Swagger for API documentation.
- **test-helpers/**: Contains helper functions for testing.
- **types/**: Contains TypeScript type definitions.

### Implementation Approach

The project is structured to facilitate isolated testing and maintainability. The key components are:

- **Dependency Injection**: The DI container is set up in `app/container.ts`, allowing for easy injection of dependencies. This makes it easier to test individual components in isolation.
- **Modular Architecture**: The code is organized into distinct modules (`app`, `domain`, `server`) to separate concerns and improve readability.
- **Simplified Controller**: In this example, the controller directly calls the repository. In a larger application, the controller would call a business logic or service class, which would then interact with the repository. This approach keeps the controller thin and focused on handling HTTP requests.
