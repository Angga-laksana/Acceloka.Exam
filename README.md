# Acceloka - Online Ticket Booking API

This is a project for the **Acceloka** ticket booking system as part of Accelist's full-stack developer intern competency examination

## Features:
* - Implements the **MARVEL Pattern** using **MediatR** for Vertical Slice Architecture.
* - Robust input validation using **FluentValidation**.
* - Uses **PostgreSQL** with Entity Framework Core.
* - Daily rolling file logging implemented with **Serilog**.
* - Global Exception Handling conforming to **RFC 7807**.
* - Supports pagination for ticket searching.

## Tech Stack
* **Framework:** .NET 10 (ASP.NET Core Web API) [cite: 30]
* **Language:** C#
* **Database:** PostgreSQL
* **Libraries:**
    * MediatR (CQRS Pattern)
    * FluentValidation (Validation Rules)
    * Serilog (File Logging)
    * Npgsql (PostgreSQL Driver)
    * Scalar (API Documentation UI)

 ## Prerequisites
* .NET SDK (Version 8.0 or higher)
* PostgreSQL Database
* DBeaver (Optional, for database viewing)

## Getting Started

### 1. Clone the Repository
```bash
git clone [https://github.com/your-username/Acceloka.Exam.git](https://github.com/your-username/Acceloka.Exam.git)
cd Acceloka.Exam
```
### 2. Configure Database
- Ensure PostgreSQL is running locally.
- Open appsettings.json and update the connection string if necessary
### 3. Apply Migrations
```bash
cd Acceloka.Api
dotnet ef database update
```
### 4. Run the Application
```bash
dotnet run
```
### 5. API Documentation
Visit the interactive Scalar UI to test endpoints:
"http://localhost:5xxx/scalar/v1"

## API Endpoints
| Method	| Endpoint	                              | Description                                               |
-----------------------------------------------------------------------------------------------------------------
| GET	    | /api/v1/get-available-ticket	          | Search and filter available tickets (Supports Pagination).|
| POST	  | /api/v1/book-ticket	                    | Book tickets (Validates quota and dates).                 |
| GET	    | /api/v1/get-booked-ticket/{id}          | View details of a specific booking.                       |
| PUT	    | /api/v1/edit-booked-ticket/{id}         | Edit ticket quantity for an existing booking.             |
| DELETE	| /api/v1/revoke-ticket/{id}/{code}/{qty}	| Revoke (cancel) a specific quantity of booked tickets.    |
