# Alexa Skill Kit - Salesforce Integration

An Amazon Alexa skill that integrates with Salesforce to retrieve and manage planned interactions and account information using OAuth 2.0 authentication.

## Overview

This project consists of two main components:

1. **Alexa Lambda Function** - Node.js AWS Lambda function that handles Alexa skill requests
2. **Salesforce REST Controller** - Apex REST API for creating Suggestion records from CSV data

## Features

### Alexa Skill
- OAuth 2.0 authentication with Salesforce
- Retrieve planned interactions/calls from Salesforce
- Query account information
- Voice-based interaction with Salesforce data
- AWS Lambda deployment ready

### Salesforce API
- RESTful API endpoint for bulk Suggestion record creation
- CSV file parsing and data validation
- Dynamic field mapping with type conversion
- Comprehensive error handling and logging
- Batch insert operations

## Repository Structure

```
.
├── Veeva alexa Skill - OUATH2 enabled/
│   ├── index.js                 # Main Lambda function handler
│   └── node_modules/            # NPM dependencies
├── registrationController       # Salesforce Apex REST controller
└── README.md
```

## Prerequisites

### For Alexa Skill
- AWS Account with Lambda access
- Amazon Developer Account
- Salesforce Developer/Sandbox account
- Node.js and npm

### For Salesforce API
- Salesforce Developer or Sandbox environment
- API access enabled
- Appropriate object permissions (Suggestion_vod__c)

## Setup Instructions

### 1. Salesforce Configuration

#### Deploy Apex Controller
1. Copy the contents of `registrationController`
2. Deploy to your Salesforce org via:
   - Developer Console
   - VS Code with Salesforce Extensions
   - Salesforce CLI: `sfdx force:source:deploy`

#### Configure Connected App
1. In Salesforce Setup, navigate to **App Manager**
2. Create a new Connected App with:
   - Enable OAuth Settings
   - Callback URL: `https://pitangui.amazon.com/spa/skill/account-linking-status.html`
   - Selected OAuth Scopes: `Full access (full)`, `Perform requests on your behalf (api)`
3. Note the **Consumer Key** and **Consumer Secret**

### 2. Alexa Skill Setup

#### Install Dependencies
```bash
cd "Veeva alexa Skill - OUATH2 enabled"
npm install
```

Key dependencies:
- `alexa-sdk` (v1.0.25)
- `request` - HTTP client
- `aws-sdk` - AWS services integration

#### Configure the Lambda Function

Update the following in [index.js](Veeva alexa Skill - OUATH2 enabled/index.js):

```javascript
// Line 11: Your Alexa Skill App ID
const APP_ID = 'amzn1.ask.skill.YOUR-SKILL-ID';

// Line 64: Your Salesforce OAuth endpoint
url: 'https://YOUR-INSTANCE.salesforce.com/services/oauth2/token?grant_type=password&client_id=YOUR_CLIENT_ID&client_secret=YOUR_CLIENT_SECRET&username=YOUR_USERNAME&password=YOUR_PASSWORD'
```

**Security Note:** For production, use environment variables or AWS Secrets Manager instead of hardcoding credentials.

#### Deploy to AWS Lambda

1. **Create Lambda Function:**
   - Runtime: Node.js (compatible version)
   - Handler: `index.handler`
   - Memory: 256 MB minimum
   - Timeout: 30 seconds

2. **Package and Upload:**
   ```bash
   zip -r function.zip index.js node_modules/
   ```
   Upload via AWS Console or CLI

3. **Add Alexa Skills Kit Trigger:**
   - Add trigger from Alexa Skills Kit
   - Configure skill ID for validation

#### Configure Alexa Skill

1. Create a new skill in [Alexa Developer Console](https://developer.amazon.com/alexa/console/ask)
2. Configure the interaction model with intents:
   - `GetNewFactIntent` - Retrieves planned interactions
   - `PlannedInteractions` - (Optional) Additional interaction queries
3. Set the Lambda function ARN as the endpoint
4. Enable Account Linking:
   - Authorization URI: `https://YOUR-INSTANCE.salesforce.com/services/oauth2/authorize`
   - Access Token URI: `https://YOUR-INSTANCE.salesforce.com/services/oauth2/token`
   - Client ID and Secret from Connected App
   - Scopes: `api full`

## Usage

### Alexa Skill

**Launch Skill:**
```
User: "Alexa, open [Your Skill Name]"
Alexa: "You have only one planned call on [time] with [Account Name]"
```

**Available Intents:**
- Launch - Automatically retrieves planned interactions
- Help - Provides usage information
- Stop/Cancel - Exits the skill

### Salesforce API

**Endpoint:** `/services/apexrest/via_RegsitrationAPIController/`

**Method:** POST

**Content-Type:** `multipart/form-data`

**Request Body:** CSV file with Suggestion fields

**Example CSV Format:**
```csv
OwnerId,Account_vod__c,Status_vod__c,Suggestion_Date_vod__c
005XXXXXXXXXXXXXXX,001XXXXXXXXXXXXXXX,Pending_vod,2025-01-15
```

**Response:**
```json
{
  "statusCode": 200,
  "recordCount": 15,
  "errorMessage": null,
  "debugLogs": [...]
}
```

**Status Codes:**
- `200` - All records inserted successfully
- `207` - Partial success (some records failed)
- `400` - Bad request (invalid CSV or no valid headers)

## API Reference

### Salesforce Apex REST Controller

#### Class: `via_RegsitrationAPIController`

**Key Methods:**

- `createSuggestionsFromCSV()` - Main HTTP POST handler
- `parseCSVAndInsert(String csvString)` - Parses CSV and performs bulk insert
- `fastParseCSVLine(String line)` - CSV line parser with quote handling
- `setFieldValue()` - Dynamic field type conversion

**Supported Field Types:**
- STRING, TEXTAREA
- BOOLEAN
- INTEGER, DOUBLE
- DATE (format: YYYY-MM-DD)
- DATETIME (format: YYYY-MM-DD HH:mm:ss)
- REFERENCE (Salesforce IDs)
- PICKLIST

**Ignored Fields:**
- Owner.Name
- Account_vod__r.Name
- Account_vod__r.PersonEmail
- RecordType.Name

### Lambda Function

**Main Handler:** `exports.handler`

**Intent Handlers:**
- `LaunchRequest` - Entry point
- `GetNewFactIntent` - Main interaction retrieval
- `AMAZON.HelpIntent` - Help messages
- `AMAZON.CancelIntent` / `AMAZON.StopIntent` - Exit handlers
- `Unhandled` - Fallback for unknown requests

**Helper Functions:**
- `format_time(dateTimeString)` - Formats Salesforce datetime to 12-hour format

## Architecture

```
┌─────────────┐      ┌──────────────┐      ┌─────────────────┐
│   Alexa     │─────▶│  AWS Lambda  │─────▶│   Salesforce    │
│   Device    │      │  (Node.js)   │      │   REST API      │
└─────────────┘      └──────────────┘      └─────────────────┘
                            │
                            ▼
                     OAuth 2.0 Flow
                     (Access Token)
```

## Security Considerations

⚠️ **Important Security Notes:**

1. **Credentials in Code:** The current implementation contains hardcoded credentials. For production:
   - Use AWS Secrets Manager or Parameter Store
   - Implement environment variables
   - Use Salesforce JWT Bearer Flow for server-to-server auth

2. **OAuth Token Management:**
   - Implement token refresh logic
   - Store tokens securely
   - Handle token expiration gracefully

3. **API Security:**
   - Implement request authentication
   - Add rate limiting
   - Validate CSV input thoroughly to prevent injection attacks

## Development

### Local Testing

**Test Lambda Function Locally:**
```bash
# Create test event JSON
node -e "console.log(require('./index.js').handler(eventData, context, callback))"
```

**Salesforce Testing:**
- Use Postman or similar tools to test the REST endpoint
- Create test CSV files with sample data
- Monitor debug logs in Salesforce Developer Console

## Troubleshooting

### Common Issues

**1. OAuth Authentication Fails**
- Verify Client ID and Client Secret
- Check username/password in OAuth URL
- Ensure security token is appended to password if required
- Verify IP restrictions in Salesforce

**2. Lambda Timeout**
- Increase Lambda timeout (default: 30s recommended)
- Check Salesforce API response times
- Review network connectivity

**3. CSV Upload Fails**
- Verify CSV format matches expected headers
- Check field API names in Salesforce
- Ensure required fields (Account_vod__c) are populated
- Review debug logs in API response

**4. Alexa Skill Not Responding**
- Check CloudWatch logs for Lambda errors
- Verify skill endpoint configuration
- Test with Alexa Simulator in Developer Console

## Contributing

Developer: Mayank Anand

## License

Not specified - Please add appropriate license information

## Changelog

### Current Version
- OAuth 2.0 authentication with Salesforce
- Planned interaction retrieval
- CSV-based bulk Suggestion creation
- Dynamic field mapping and type conversion

## Future Enhancements

- [ ] Implement token refresh mechanism
- [ ] Add more Alexa intents (create interactions, update records)
- [ ] Enhance error messages for better user experience
- [ ] Add unit tests for Lambda function
- [ ] Implement proper credential management
- [ ] Add support for multiple Salesforce objects
- [ ] Create interaction model JSON for easy skill setup
- [ ] Add logging and monitoring

## Support

For issues and questions:
- Check CloudWatch Logs for Lambda execution details
- Review Salesforce debug logs for API errors
- Test using Alexa Developer Console simulator

---

**Note:** This is a development/demo implementation. Additional security hardening and error handling should be implemented before production use.
