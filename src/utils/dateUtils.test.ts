/**
 * Test utilities for timezone conversion
 * Run this in browser console to verify timezone is working correctly
 */

import dayjs from 'dayjs';
import {
  toVietnamTime,
  formatTimeAgo,
  formatTimeAgoShort,
  formatDateTime,
  formatDateShort,
  VIETNAM_TIMEZONE
} from './dateUtils';

/**
 * Test timezone conversion
 */
export const testTimezoneConversion = () => {
  console.group('🧪 Timezone Conversion Tests');

  // Test 1: Basic GMT to GMT+7 conversion
  const gmtTime = '2024-01-10T10:00:00Z'; // 10:00 GMT
  const vnTime = toVietnamTime(gmtTime);
  console.log('Test 1: GMT → GMT+7 Conversion');
  console.log(`  Input (GMT):  ${gmtTime}`);
  console.log(`  Output (VN):  ${vnTime.format('YYYY-MM-DD HH:mm:ss')}`);
  console.log(`  Expected:     2024-01-10 17:00:00`);
  console.log(`  ✅ Pass:      ${vnTime.hour() === 17}`);

  // Test 2: Current time in Vietnam
  const nowUTC = dayjs.utc();
  const nowVN = dayjs().tz(VIETNAM_TIMEZONE);
  console.log('\nTest 2: Current Time');
  console.log(`  UTC Now:      ${nowUTC.format('HH:mm:ss')}`);
  console.log(`  Vietnam Now:  ${nowVN.format('HH:mm:ss')}`);
  console.log(`  Diff (hours): ${nowVN.diff(nowUTC, 'hour')}`);
  console.log(`  ✅ Pass:      ${Math.abs(nowVN.diff(nowUTC, 'hour')) === 7}`);

  // Test 3: Time ago calculation
  const oneHourAgo = dayjs.utc().subtract(1, 'hour').toISOString();
  const timeAgoText = formatTimeAgo(oneHourAgo);
  console.log('\nTest 3: Time Ago (1 hour ago)');
  console.log(`  Input:        ${oneHourAgo}`);
  console.log(`  Output:       ${timeAgoText}`);
  console.log(`  Expected:     "1 giờ trước"`);
  console.log(`  ✅ Pass:      ${timeAgoText === '1 giờ trước'}`);

  // Test 4: Format DateTime
  const testDate = '2024-01-10T10:30:00Z';
  const formatted = formatDateTime(testDate);
  console.log('\nTest 4: Format DateTime');
  console.log(`  Input (GMT):  ${testDate}`);
  console.log(`  Output:       ${formatted}`);
  console.log(`  Expected:     10/01/2024 17:30`);
  console.log(`  ✅ Pass:      ${formatted === '10/01/2024 17:30'}`);

  // Test 5: Server timestamp simulation (7 hours ago in GMT should show as "now" or recent in VN context)
  // If server time is 10:00 GMT and creates a post,
  // and current time is 17:00 GMT (same as 10:00 GMT = 17:00 VN, then 17:00 GMT = 00:00 next day VN)
  // Let's test a realistic scenario
  const twoHoursAgoGMT = dayjs.utc().subtract(2, 'hour').toISOString();
  const twoHoursText = formatTimeAgo(twoHoursAgoGMT);
  console.log('\nTest 5: Time Ago (2 hours ago)');
  console.log(`  Input:        ${twoHoursAgoGMT}`);
  console.log(`  Output:       ${twoHoursText}`);
  console.log(`  Expected:     "2 giờ trước"`);
  console.log(`  ✅ Pass:      ${twoHoursText === '2 giờ trước'}`);

  console.groupEnd();
};

/**
 * Test with server response simulation
 */
export const testServerResponse = () => {
  console.group('🌐 Server Response Simulation');

  // Simulate: Server sent a timestamp 30 minutes ago (in GMT)
  const serverTimestamp = dayjs.utc().subtract(30, 'minute').toISOString();

  console.log('Scenario: User liked a post 30 minutes ago');
  console.log(`  Server sent (GMT):     ${serverTimestamp}`);
  console.log(`  Browser timezone:      ${Intl.DateTimeFormat().resolvedOptions().timeZone}`);
  console.log(`  Vietnam time:          ${toVietnamTime(serverTimestamp).format('HH:mm:ss')}`);
  console.log(`  Display (timeAgo):     ${formatTimeAgo(serverTimestamp)}`);
  console.log(`  Display (short):       ${formatTimeAgoShort(serverTimestamp)}`);
  console.log(`  Display (dateTime):    ${formatDateTime(serverTimestamp)}`);
  console.log(`  ✅ Should show:        "30 phút trước" or "30p"`);

  console.groupEnd();
};

/**
 * Debug current notification timestamps
 */
export const debugNotification = (createdAt: string) => {
  console.group('🔍 Debug Notification Timestamp');

  const serverTime = dayjs.utc(createdAt);
  const vnTime = toVietnamTime(createdAt);
  const nowUTC = dayjs.utc();
  const nowVN = dayjs().tz(VIETNAM_TIMEZONE);

  console.log('Server Time Info:');
  console.log(`  Raw string:           ${createdAt}`);
  console.log(`  Parsed as UTC:        ${serverTime.format('YYYY-MM-DD HH:mm:ss')} UTC`);
  console.log(`  Converted to VN:      ${vnTime.format('YYYY-MM-DD HH:mm:ss')} GMT+7`);

  console.log('\nCurrent Time:');
  console.log(`  UTC Now:              ${nowUTC.format('YYYY-MM-DD HH:mm:ss')} UTC`);
  console.log(`  Vietnam Now:          ${nowVN.format('YYYY-MM-DD HH:mm:ss')} GMT+7`);

  console.log('\nDifference Calculation:');
  console.log(`  Diff (minutes):       ${nowVN.diff(vnTime, 'minute')} minutes`);
  console.log(`  Diff (hours):         ${nowVN.diff(vnTime, 'hour')} hours`);
  console.log(`  Diff (days):          ${nowVN.diff(vnTime, 'day')} days`);

  console.log('\nFormatted Output:');
  console.log(`  formatTimeAgo:        ${formatTimeAgo(createdAt)}`);
  console.log(`  formatTimeAgoShort:   ${formatTimeAgoShort(createdAt)}`);
  console.log(`  formatDateTime:       ${formatDateTime(createdAt)}`);
  console.log(`  formatDateShort:      ${formatDateShort(createdAt)}`);

  console.groupEnd();
};

/**
 * Run all tests
 */
export const runAllTimezoneTests = () => {
  console.clear();
  console.log('🚀 Running Timezone Tests...\n');
  testTimezoneConversion();
  console.log('\n');
  testServerResponse();
  console.log('\n✅ All tests completed! Check results above.');
};

// Auto-export for console usage
if (typeof window !== 'undefined') {
  (window as any).timezoneTests = {
    testTimezoneConversion,
    testServerResponse,
    debugNotification,
    runAllTimezoneTests
  };
  console.log('💡 Timezone test utilities loaded!');
  console.log('Usage:');
  console.log('  window.timezoneTests.runAllTimezoneTests()');
  console.log('  window.timezoneTests.debugNotification("2024-01-10T10:00:00Z")');
}

