# 💳 Transaction Microservice (`transaction-microservice`)

This microservice is built using **NestJS** and **Prisma ORM** to manage and process financial transaction records. It demonstrates a **hybrid communication** architecture, handling both synchronous API requests and asynchronous event processing using Kafka.

## ✨ Key Features

  * **RESTful CRUD:** Manages core transaction records (Create, Read, Fraud Flagging).
  * **Asynchronous Processing:** Acts as a **Kafka Producer** for fraud events and status changes.
  * **Synchronous Communication:** Uses **Axios** to communicate synchronously with the Account Microservice to validate user status before creating a transaction.
  * **Database:** Utilizes **PostgreSQL** for persistence via **Prisma ORM**.
  * **Technology Stack:** Built on **NestJS** and **TypeScript** for modularity and type safety.
  * **API Documentation:** Integrated with **Swagger UI** for easy endpoint testing and documentation.

-----

## 🛠️ System Requirements

To run this project, you need the following installed:

1.  **Node.js** (v18 or higher)
2.  **npm** (Node Package Manager)
3.  **Docker & Docker Compose** (to run PostgreSQL, Kafka, and Kafka UI)
4.  **Postman** (for testing API endpoints)

-----

## ⚙️ Configuration and Local Execution

### Step 1: Clone the Repository & Install Dependencies

```bash
# Clone the repository
git clone [Your Repository URL] transaction-microservice
cd transaction-microservice

# Install Node.js packages
npm install
```

### Step 2: Configure Environment Variables

Create a file named **`.env`** in the project root with the following variables. These are used by both Node.js (`@nestjs/config`) and Docker Compose.

```env
# SERVER CONFIGURATION
PORT=3000

# POSTGRESQL (Used by Prisma and Docker)
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=tservice_db
POSTGRES_PORT=5438

# KAFKA CONFIGURATION
KAFKA_CLIENT_ID=transaction-service
KAFKA_BROKERS=localhost:29092
KAFKA_TOPIC=transaction-service-topic
```

### Step 3: Start the Infrastructure (Database & Kafka)

Use Docker Compose to launch PostgreSQL, Kafka, and the Kafka UI interface.

```bash
docker compose up -d
```

*(Verify services are running: `docker ps`)*

### Step 4: Run Prisma Migrations

Apply the database schema (models) to PostgreSQL and generate the Prisma Client.

```bash
# Apply schema and generate client
npx prisma migrate dev --name init
```

### Step 5: Start the Microservice

```bash
# Start the NestJS server with hot reload
npm run start:dev
```

The service will start on port `3000`.

-----

## 🌐 API Endpoints

Access the interactive API documentation at: **`http://localhost:3000/api`**

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **POST** | `/transaction` | Creates a new transaction. Calls Account Service for status validation. Produces Kafka event if validated. |
| **GET** | `/transaction` | Retrieves all transactions. |
| **GET** | `/transaction/:id` | Retrieves a transaction by its unique ID. |
| **POST** | `/transaction/:id/fraud` | Flags a transaction as `FRAUD` and publishes a message to Kafka for the Account Service to consume (e.g., to block the user). |

### Sample Payload (POST /transaction)

```json
{
  "accountId": "662c081370bd2ba6b5f04e94",
  "description": "Purchase of goods online"
}
```

-----

## 🔄 Inter-Service Communication

This microservice interacts with external services in the following ways:

| Service | Protocol | Role | Usage |
| :--- | :--- | :--- | :--- |
| **Account Service** | **HTTP (Synchronous)** | Client | Called before transaction creation to validate if the `accountId` exists and is in a valid status (`new` or `active`). |
| **Kafka Broker** | **Asynchronous** | Producer | Publishes messages to the `transaction-service-topic` when a transaction status is updated (e.g., set to `FRAUD`). |

-----

## 💻 Project Structure

```
.
├── prisma/               # Prisma schema and migrations
├── src/
│   ├── common/           # Shared utilities (e.g., DTOs)
│   ├── config/           # Environment loading and validation
│   ├── prisma/           # Prisma service and module wrapper
│   ├── transaction/      # Core logic (Controller, Service, Module, DTOs)
│   ├── main.ts           # Application entry point & Swagger setup
│   └── app.module.ts     # Main NestJS module
├── .env                  # Environment variables
├── docker-compose.yml    # Infrastructure services (PostgreSQL, Kafka, UI)
└── package.json
```

-----

## 🧑‍💻 Contributions

Feel free to open issues or submit pull requests for bug fixes, new features, or improvements\!