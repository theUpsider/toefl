# @package

## Overview

This is a monorepo

## Getting Started

### Prerequisites

- Node.js
- Yarn (Version 4.0.2 or later)

### Installation

1. Clone the repository:

   ```bash
   git clone <yourproject>
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```
3. Create a `.env` file in the `packages/server` directory and add the following content:
   ```bash
   DATABASE_URL="postgresql://USERNAME:PASSWORD@localhost:5432/DATABASENAME?schema=public"
   ```
   Replace the connection string with your own database connection string.
4. Run prisma migrations:
   ```bash
   cd packages/server
   yarn setup
   ```

### Running the Project

To run the project in a development environment, use the following command in the root directory:

```bash
yarn dev
```

This will launch both the server and the frontend PWA in development mode.

## Structure

The project is structured into multiple workspaces located under `packages/*`, enabling seamless integration and development of the individual components.

### Server

The server component, implemented in TypeScript, provides the backend functionality for the application. It stores data using [Prisma](https://www.prisma.io/), a database toolkit and Object Relational Mapper (ORM). The server also provides an API for the frontend PWA to interact with using websockets.

### Frontend PWA

Developed in React, the frontend PWA offers a responsive and interactive user experience. 

### Library Package



## Example Usage

TODO

## Docker

TODO

## Scripts

- **Development**: `yarn dev` - Runs both the server and frontend in development mode.
- **Lint**: `yarn lint` - Lints the codebase for both the server and frontend.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### Credits
