# API Integration Testing Guide

## What's Been Fixed

### 1. Route Mismatch ✓
- **Problem**: Frontend was calling `/api/generate-session`, but backend had `/api/generate`
- **Solution**: Updated backend route to match frontend expectations (server/routes.ts:7)

### 2. Comprehensive Logging ✓
- **Added**: Detailed console logging for all API requests
- **Includes**:
  - Request timestamp
  - Prompt length and token limits
  - API key validation status
  - Response time tracking
  - Token usage statistics
  - Success/failure indicators

### 3. User-Friendly Error Messages ✓
- **Backend**: Returns structured error responses with `userMessage` field
- **Frontend**: Displays user-friendly messages instead of technical errors
- **Coverage**:
  - Missing API key
  - Invalid API key (401)
  - Rate limiting (429)
  - Service unavailable (500/502/503)
  - Generic errors

### 4. Test Script ✓
- **Location**: `test-api.js`
- **Coverage**: 4 comprehensive tests
  1. Server health check
  2. Input validation (missing prompt)
  3. Simple session generation
  4. Full session generation with real-world data

## How to Run Tests

### Quick Test
```bash
node test-api.js
```

This will run all 4 tests and display:
- Color-coded results (green = pass, red = fail)
- Response times
- Token usage
- Sample generated content

### What You'll See

#### Server Logs (Terminal Running `npm start`)
```
=== API Request Started ===
Timestamp: 2025-11-29T09:11:17.240Z
Prompt length: 133 characters
Max tokens: 500
✓ API key found in environment
→ Sending request to Anthropic API...
✓ Success! Response received in 9850ms
Response tokens: 285
=== API Request Complete ===
```

#### Test Output
```
✓ Server is running on http://localhost:5000
✓ Server correctly rejects requests without prompt
✓ Session generated successfully!
  Response time: 9885ms
  Response length: 1121 characters
  Tokens used: 285
✓ Full session generated successfully!
  Response time: 19.55s
  Response length: 2556 characters
  Tokens used: 739

🎉 All tests passed! Your API integration is working correctly.
```

## Testing in the Browser

1. **Start the server**: `npm start`
2. **Open**: http://localhost:5000
3. **Enter a coaching challenge** and generate a session
4. **Check server logs** to see detailed request/response info

## Debugging Tips

### Check API Key Configuration
```bash
# Make sure ANTHROPIC_API_KEY is set in .env
cat .env | grep ANTHROPIC_API_KEY
```

### Monitor Server Logs
Watch the terminal running `npm start` for:
- Request details (timestamp, prompt length)
- API key validation
- Response times
- Error messages with ❌ prefix
- Success messages with ✓ prefix

### Common Issues

#### Error: "API key not configured"
- **Solution**: Add `ANTHROPIC_API_KEY` to your `.env` file

#### Error: "Rate limit exceeded"
- **Solution**: Wait a moment and try again
- **Note**: This happens when you make too many requests too quickly

#### Error: "Invalid API key"
- **Solution**: Check your API key at https://console.anthropic.com
- **Note**: Make sure the key is correctly copied to `.env`

#### Slow Responses
- **Normal**: 10-30 seconds for full session generation
- **Simple prompts**: 5-15 seconds
- **Token usage**: More tokens = longer response time

## Test Results Summary

All 4 tests passed:
1. ✓ Server Health Check
2. ✓ Missing Prompt Validation
3. ✓ Simple Session Generation (9.9s, 285 tokens)
4. ✓ Full Session Generation (19.6s, 739 tokens)

## Next Steps

The API integration is working correctly! You can now:
1. Test session generation in the browser at http://localhost:5000
2. Customize the test script for different scenarios
3. Monitor server logs for debugging
4. Deploy to production when ready

## Improvements Made

### Code Quality
- ✓ Fixed route mismatch
- ✓ Added comprehensive error handling
- ✓ Implemented request/response logging
- ✓ User-friendly error messages
- ✓ Input validation

### Testing
- ✓ Created automated test script
- ✓ Tests cover happy path and error cases
- ✓ Response time tracking
- ✓ Content validation

### Developer Experience
- ✓ Clear console output with colors
- ✓ Detailed logging for debugging
- ✓ Easy-to-run test script
- ✓ Helpful error messages
