/*!
 * DataSync Content Store Filesystem - Messages
 * Copyright (c) Contentstack LLC
 * MIT Licensed
 */

/**
 * Centralized message store for all log messages, error messages, and user-facing strings.
 * This provides a single source of truth for all messages in the application,
 * making it easier to maintain consistency and support future localization.
 */

export const LOG_MESSAGES = {
  PUBLISHING_ENTRY: (input: any) => `Publishing entry: ${JSON.stringify(input)}`,
} as const;

export const ERROR_MESSAGES = {
  // Add error messages here as needed
} as const;

export const INFO_MESSAGES = {
  // Add info messages here as needed
} as const;

