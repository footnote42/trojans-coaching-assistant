#!/usr/bin/env node

/**
 * Test script for Trojans Coaching Assistant API Integration
 *
 * This script tests the /api/generate-session endpoint to ensure:
 * - Backend proxy is working correctly
 * - API key is configured properly
 * - Requests are formatted correctly
 * - Responses are parsed correctly
 * - Error handling works as expected
 *
 * Usage: node test-api.js
 */

const SERVER_URL = 'http://localhost:5000';
const API_ENDPOINT = '/api/generate-session';

// ANSI color codes for better output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  console.log('\n' + '='.repeat(60));
  log(title, 'bright');
  console.log('='.repeat(60));
}

async function testServerHealth() {
  logSection('TEST 1: Server Health Check');

  try {
    const response = await fetch(SERVER_URL);

    if (response.ok || response.status === 404) {
      log('✓ Server is running on ' + SERVER_URL, 'green');
      return true;
    } else {
      log('✗ Server returned unexpected status: ' + response.status, 'red');
      return false;
    }
  } catch (error) {
    log('✗ Server is not responding', 'red');
    log(`  Error: ${error.message}`, 'red');
    log('\n  Make sure the server is running with: npm start', 'yellow');
    return false;
  }
}

async function testMissingPrompt() {
  logSection('TEST 2: Missing Prompt Validation');

  try {
    const response = await fetch(`${SERVER_URL}${API_ENDPOINT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        maxTokens: 100,
      }),
    });

    const data = await response.json();

    if (response.status === 400) {
      log('✓ Server correctly rejects requests without prompt', 'green');
      log(`  Error message: "${data.userMessage}"`, 'cyan');
      return true;
    } else {
      log('✗ Server should return 400 for missing prompt', 'red');
      log(`  Got status: ${response.status}`, 'red');
      return false;
    }
  } catch (error) {
    log('✗ Test failed with error', 'red');
    log(`  ${error.message}`, 'red');
    return false;
  }
}

async function testSimpleSessionGeneration() {
  logSection('TEST 3: Simple Session Generation');

  const simplePrompt = `Create a brief 5-minute warm-up activity for U10 rugby players focusing on passing skills. Keep the response short (under 200 words).`;

  log('Sending request to generate session...', 'yellow');
  log(`Prompt: "${simplePrompt}"`, 'cyan');

  const startTime = Date.now();

  try {
    const response = await fetch(`${SERVER_URL}${API_ENDPOINT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: simplePrompt,
        maxTokens: 500,
      }),
    });

    const responseTime = Date.now() - startTime;

    if (!response.ok) {
      const errorData = await response.json();
      log('✗ API request failed', 'red');
      log(`  Status: ${response.status}`, 'red');
      log(`  Error: ${errorData.error}`, 'red');
      if (errorData.userMessage) {
        log(`  User message: ${errorData.userMessage}`, 'yellow');
      }
      if (errorData.details) {
        log(`  Details: ${errorData.details}`, 'red');
      }
      return false;
    }

    const data = await response.json();

    if (!data.content || !data.content[0] || !data.content[0].text) {
      log('✗ Response missing expected structure', 'red');
      log(`  Response: ${JSON.stringify(data, null, 2)}`, 'red');
      return false;
    }

    const generatedText = data.content[0].text;

    log('✓ Session generated successfully!', 'green');
    log(`  Response time: ${responseTime}ms`, 'cyan');
    log(`  Response length: ${generatedText.length} characters`, 'cyan');
    log(`  Tokens used: ${data.usage?.output_tokens || 'unknown'}`, 'cyan');

    log('\n--- Generated Content (first 300 chars) ---', 'blue');
    console.log(generatedText.substring(0, 300) + '...\n');

    return true;
  } catch (error) {
    log('✗ Test failed with error', 'red');
    log(`  ${error.message}`, 'red');
    return false;
  }
}

async function testFullSessionGeneration() {
  logSection('TEST 4: Full Session Generation (Real-world Test)');

  const fullPrompt = `You are an expert rugby coach creating a detailed training session plan following RFU Regulation 15 (2025-26 season).

**COACHING CHALLENGE:**
I need to develop my players' Catch and Pass skills in order to help their ability to exploit space on the pitch.

**AGE GROUP:** U10
**SESSION FOCUS:** Skills
**COACHING METHOD:** Use Game Zone (decision-making games) and Skill Zone (isolated skill practice) approach. Start with an unopposed game, then move to skill practice, then return to an opposed game.
**SESSION DURATION:** 60 minutes
**NUMBER OF PLAYERS:** 12
**NUMBER OF COACHES:** 2

**RFU REGULATION 15 RULES FOR U10:**
- Format: Contact Rugby
- Team Size: 8v8
- Contact Level: Full tackle (not hold), ruck (1 support player), maul (1 support player)
- Scrums: 3-player uncontested scrums

Create a 60-minute session with:
1. Arrival Activity (5-10 mins)
2. Warm-up (10 mins)
3. Main Activities (40 mins)
4. Cool-down (5-10 mins)

Keep it concise but practical.`;

  log('Sending full session generation request...', 'yellow');
  log('This may take 10-30 seconds...', 'yellow');

  const startTime = Date.now();

  try {
    const response = await fetch(`${SERVER_URL}${API_ENDPOINT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: fullPrompt,
        maxTokens: 4096,
      }),
    });

    const responseTime = Date.now() - startTime;

    if (!response.ok) {
      const errorData = await response.json();
      log('✗ API request failed', 'red');
      log(`  Status: ${response.status}`, 'red');
      log(`  Error: ${errorData.error}`, 'red');
      if (errorData.userMessage) {
        log(`  User message: ${errorData.userMessage}`, 'yellow');
      }
      return false;
    }

    const data = await response.json();
    const generatedText = data.content[0].text;

    log('✓ Full session generated successfully!', 'green');
    log(`  Response time: ${(responseTime / 1000).toFixed(2)}s`, 'cyan');
    log(`  Response length: ${generatedText.length} characters`, 'cyan');
    log(`  Tokens used: ${data.usage?.output_tokens || 'unknown'}`, 'cyan');
    log(`  Model: ${data.model || 'unknown'}`, 'cyan');

    // Check for key components
    const hasArrivalActivity = generatedText.toLowerCase().includes('arrival');
    const hasWarmup = generatedText.toLowerCase().includes('warm');
    const hasCooldown = generatedText.toLowerCase().includes('cool');

    log('\n--- Content Analysis ---', 'blue');
    log(`  ${hasArrivalActivity ? '✓' : '✗'} Contains arrival activity`, hasArrivalActivity ? 'green' : 'yellow');
    log(`  ${hasWarmup ? '✓' : '✗'} Contains warm-up`, hasWarmup ? 'green' : 'yellow');
    log(`  ${hasCooldown ? '✓' : '✗'} Contains cool-down`, hasCooldown ? 'green' : 'yellow');

    log('\n--- Generated Content (first 500 chars) ---', 'blue');
    console.log(generatedText.substring(0, 500) + '...\n');

    return true;
  } catch (error) {
    log('✗ Test failed with error', 'red');
    log(`  ${error.message}`, 'red');
    return false;
  }
}

async function runAllTests() {
  console.log('\n');
  log('╔═══════════════════════════════════════════════════════════╗', 'bright');
  log('║   TROJANS COACHING ASSISTANT - API INTEGRATION TEST       ║', 'bright');
  log('╚═══════════════════════════════════════════════════════════╝', 'bright');

  const results = {
    total: 0,
    passed: 0,
    failed: 0,
  };

  // Run tests sequentially
  const tests = [
    testServerHealth,
    testMissingPrompt,
    testSimpleSessionGeneration,
    testFullSessionGeneration,
  ];

  for (const test of tests) {
    results.total++;
    const passed = await test();
    if (passed) {
      results.passed++;
    } else {
      results.failed++;
    }
  }

  // Summary
  logSection('TEST SUMMARY');
  log(`Total Tests: ${results.total}`, 'cyan');
  log(`Passed: ${results.passed}`, 'green');
  log(`Failed: ${results.failed}`, results.failed > 0 ? 'red' : 'green');

  if (results.failed === 0) {
    log('\n🎉 All tests passed! Your API integration is working correctly.', 'green');
  } else {
    log('\n⚠️  Some tests failed. Check the logs above for details.', 'yellow');
  }

  console.log('\n');

  process.exit(results.failed > 0 ? 1 : 0);
}

// Run tests
runAllTests().catch(error => {
  console.error('Unexpected error running tests:', error);
  process.exit(1);
});
