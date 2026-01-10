import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';

// Extend dayjs with plugins
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
dayjs.locale('vi');

// Vietnam timezone constant
export const VIETNAM_TIMEZONE = 'Asia/Ho_Chi_Minh';

/**
 * Convert GMT date to Vietnam timezone (GMT+7)
 * Ensures the input is treated as UTC before conversion
 */
export const toVietnamTime = (date: Date | string): dayjs.Dayjs => {
  // Parse as UTC first, then convert to Vietnam timezone
  return dayjs.utc(date).tz(VIETNAM_TIMEZONE);
};

/**
 * Format a date to a readable string in Vietnam timezone
 */
export const formatDate = (date: Date | string): string => {
  return toVietnamTime(date).format('DD MMMM YYYY');
};

/**
 * Format a date to a short string in Vietnam timezone
 */
export const formatDateShort = (date: Date | string): string => {
  return toVietnamTime(date).format('DD/MM/YYYY');
};

/**
 * Format a date with time in Vietnam timezone
 */
export const formatDateTime = (date: Date | string): string => {
  return toVietnamTime(date).format('DD/MM/YYYY HH:mm');
};

/**
 * Format a date with full time in Vietnam timezone
 */
export const formatDateTimeFull = (date: Date | string): string => {
  return toVietnamTime(date).format('DD/MM/YYYY HH:mm:ss');
};

/**
 * Format time ago (relative time) in Vietnam timezone
 * e.g., "2 hours ago", "3 days ago"
 */
export const formatTimeAgo = (dateString: string): string => {
  const vietnamDate = toVietnamTime(dateString);
  const now = dayjs().tz(VIETNAM_TIMEZONE);

  const diffInMinutes = now.diff(vietnamDate, 'minute');

  if (diffInMinutes < 1) return 'Vừa xong';
  if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} giờ trước`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays} ngày trước`;

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) return `${diffInWeeks} tuần trước`;

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `${diffInMonths} tháng trước`;

  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} năm trước`;
};

/**
 * Format time ago in short format (e.g., "2h", "3d")
 */
export const formatTimeAgoShort = (dateString: string): string => {
  const vietnamDate = toVietnamTime(dateString);
  const now = dayjs().tz(VIETNAM_TIMEZONE);

  const diffInMinutes = now.diff(vietnamDate, 'minute');

  if (diffInMinutes < 1) return 'Vừa xong';
  if (diffInMinutes < 60) return `${diffInMinutes}p`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d`;

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) return `${diffInWeeks}w`;

  return formatDateShort(dateString);
};
