
# Bancwise Backend API

## Features
- User authentication and authorization (signup/login)
- Role-based access (`user` and `admin`)
- Portfolio management with scheme assignments
- Fund NAV history tracking
- MongoDB aggregation pipelines for reports
- Validation using Joi
- Postman collection for all APIs

## Tech Stack
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Validation:** Joi
- **Authentication:** JWT
- **Testing:** Postman
- **Deployment:** render

## Setup Instructions
1. **Clone the repository**
2. **install dependencies 'npm install'**
3.  run the server- npm run start
4.  local url- localhost:8000
5.  deployed url- https://assessment-lbao.onrender.com



Database Schema

Collection: Fund

| Field Name          | Type   | Required | Unique | Default    | Description                         |
| ------------------- | ------ | -------- | ------ | ---------- | ----------------------------------- |
| schemeCode          | Number | Yes      | Yes    | N/A        | Unique code for the fund            |
| schemeName          | String | No       | No     | N/A        | Name of the scheme                  |
| isinGrowth          | String | No       | No     | N/A        | ISIN code for growth option         |
| isinDivReinvestment | String | No       | No     | N/A        | ISIN code for dividend reinvestment |
| fundHouse           | String | No       | No     | N/A        | Fund house name                     |
| schemeType          | String | No       | No     | N/A        | Type of the scheme (equity/debt)    |
| schemeCategory      | String | No       | No     | N/A        | Category of the scheme              |
| updatedAt           | Date   | No       | No     | `Date.now` | Last update timestamp               |


Collection: FundLatestNav

| Field Name | Type   | Required | Unique | Default    | Description                  |
| ---------- | ------ | -------- | ------ | ---------- | ---------------------------- |
| schemeCode | Number | Yes      | Yes    | N/A        | Code of the fund             |
| nav        | Number | Yes      | No     | N/A        | Latest Net Asset Value       |
| date       | String | Yes      | No     | N/A        | NAV date (YYYY-MM-DD format) |
| updatedAt  | Date   | No       | No     | `Date.now` | Last update timestamp        |

Collection: FundNavHistory
| Field Name | Type   | Required | Unique | Default    | Description                  |
| ---------- | ------ | -------- | ------ | ---------- | ---------------------------- |
| schemeCode | Number | Yes      | No     | N/A        | Code of the fund             |
| nav        | Number | Yes      | No     | N/A        | NAV value                    |
| date       | String | Yes      | No     | N/A        | NAV date (YYYY-MM-DD format) |
| createdAt  | Date   | No       | No     | `Date.now` | Record creation timestamp    |
Indexes:
{ schemeCode: 1, date: -1 } – For sorting NAV history by latest date.

Collection: Portfolio
| Field Name   | Type   | Required | Unique | Default    | Description                 |
| ------------ | ------ | -------- | ------ | ---------- | --------------------------- |
| userId       | String | Yes      | No     | N/A        | Reference to User `_id`     |
| schemeCode   | Number | Yes      | No     | N/A        | Fund code                   |
| schemeName   | String | No       | No     | N/A        | Fund name                   |
| units        | Number | Yes      | No     | N/A        | Number of units purchased   |
| purchaseNav  | Number | Yes      | No     | N/A        | NAV at the time of purchase |
| purchaseDate | Date   | No       | No     | `Date.now` | Date of purchase            |
| createdAt    | Date   | No       | No     | `Date.now` | Record creation timestamp   |

Collection: User
| Field Name | Type   | Required | Unique | Default  | Description            |
| ---------- | ------ | -------- | ------ | -------- | ---------------------- |
| _id       | String | Yes      | Yes    | `uuidv4` | Unique user ID         |
| name       | String | Yes      | No     | N/A      | Full name of the user  |
| email      | String | Yes      | Yes    | N/A      | Email address          |
| password   | String | Yes      | No     | N/A      | Hashed password        |
| role       | String | No       | No     | "user"   | User role (user/admin) |

Deployment Guide:

Created an account in render and connected github repository with it. On each push into github the changes will be automatically deployed.
