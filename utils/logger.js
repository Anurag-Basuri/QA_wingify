/**
 * Simple logger utility for test automation.
 * Provides timestamped, leveled logging for clear test output.
 */
class Logger {
  /**
   * @param {string} context - The context/module name for log messages
   */
  constructor(context) {
    this.context = context;
  }

  /**
   * Format a log message with timestamp, level, and context.
   * @param {string} level - Log level (INFO, WARN, ERROR, DEBUG)
   * @param {string} message - The log message
   * @returns {string} Formatted log string
   */
  _format(level, message) {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level}] [${this.context}] ${message}`;
  }

  /**
   * Log an informational message.
   * @param {string} message
   */
  info(message) {
    console.log(this._format('INFO', message));
  }

  /**
   * Log a warning message.
   * @param {string} message
   */
  warn(message) {
    console.warn(this._format('WARN', message));
  }

  /**
   * Log an error message.
   * @param {string} message
   */
  error(message) {
    console.error(this._format('ERROR', message));
  }

  /**
   * Log a debug message.
   * @param {string} message
   */
  debug(message) {
    console.log(this._format('DEBUG', message));
  }

  /**
   * Log a test step with clear visual separation.
   * @param {string} stepDescription
   */
  step(stepDescription) {
    console.log(this._format('STEP', `▶ ${stepDescription}`));
  }
}

module.exports = Logger;
