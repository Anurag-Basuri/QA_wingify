// Simple logger utility for test automation
// Adds timestamps, levels, and context to all log messages for clarity

class Logger {
  // Store the context name for this logger instance
  constructor(context) {
    this.context = context;
  }

  // Format a log message with timestamp, level, and context info
  _format(level, message) {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level}] [${this.context}] ${message}`;
  }

  // Log an informational message
  info(message) {
    console.log(this._format('INFO', message));
  }

  // Log a warning message
  warn(message) {
    console.warn(this._format('WARN', message));
  }

  // Log an error message
  error(message) {
    console.error(this._format('ERROR', message));
  }

  // Log a debug message
  debug(message) {
    console.log(this._format('DEBUG', message));
  }

  // Log a test step with a nice visual marker
  step(stepDescription) {
    console.log(this._format('STEP', `▶ ${stepDescription}`));
  }
}

module.exports = Logger;
