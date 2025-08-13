/**
 * Simple logger with prefixes for telemetry
 * Logger simples com prefixos para telemetria
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export interface LogEntry {
  timestamp: string
  level: LogLevel
  prefix: string
  message: string
  data?: any
}

class Logger {
  private logs: LogEntry[] = []
  private maxLogs = 1000 // Keep last 1000 logs in memory

  private log(level: LogLevel, prefix: string, message: string, data?: any) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      prefix,
      message,
      data
    }

    // Add to memory store
    this.logs.push(entry)
    
    // Keep only last maxLogs entries
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs)
    }

    // Console output with colors
    const colors = {
      debug: '\x1b[36m', // Cyan
      info: '\x1b[32m',  // Green
      warn: '\x1b[33m',  // Yellow
      error: '\x1b[31m'  // Red
    }
    
    const reset = '\x1b[0m'
    const color = colors[level]
    
    const formattedMessage = `${color}[${level.toUpperCase()}]${reset} ${prefix}: ${message}`
    
    if (data) {
      console.log(formattedMessage, data)
    } else {
      console.log(formattedMessage)
    }
  }

  debug(prefix: string, message: string, data?: any) {
    this.log('debug', prefix, message, data)
  }

  info(prefix: string, message: string, data?: any) {
    this.log('info', prefix, message, data)
  }

  warn(prefix: string, message: string, data?: any) {
    this.log('warn', prefix, message, data)
  }

  error(prefix: string, message: string, data?: any) {
    this.log('error', prefix, message, data)
  }

  // Get logs for debugging
  getLogs(level?: LogLevel): LogEntry[] {
    if (level) {
      return this.logs.filter(log => log.level === level)
    }
    return [...this.logs]
  }

  // Clear logs
  clearLogs() {
    this.logs = []
  }

  // Export logs as JSON
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2)
  }
}

// Singleton instance
export const logger = new Logger()

// Simple log function as requested
export const log = (scope: string, ...args: any[]) => {
  console.log(`[${scope}]`, ...args)
}

// Convenience functions with common prefixes
export const appLogger = {
  recipe: {
    viewed: (recipeId: string) => logger.info('RECIPE', `Recipe viewed: ${recipeId}`),
    cooked: (recipeId: string) => logger.info('RECIPE', `Recipe cooked: ${recipeId}`),
    addedToList: (recipeId: string) => logger.info('RECIPE', `Recipe added to shopping list: ${recipeId}`)
  },
  
  shopping: {
    itemAdded: (itemName: string) => logger.info('SHOPPING', `Item added to list: ${itemName}`),
    itemPurchased: (itemName: string) => logger.info('SHOPPING', `Item marked as purchased: ${itemName}`),
    listConsolidated: (itemCount: number) => logger.info('SHOPPING', `Shopping list consolidated: ${itemCount} items`),
    listCompleted: (recipeCount: number) => logger.info('SHOPPING', `Shopping list completed for ${recipeCount} recipes`)
  },
  
  expense: {
    added: (amount: number, category: string) => logger.info('EXPENSE', `Expense added: R$ ${amount} (${category})`),
    removed: (expenseId: string) => logger.info('EXPENSE', `Expense removed: ${expenseId}`)
  },
  
  stock: {
    updated: (itemCount: number) => logger.info('STOCK', `Stock updated with ${itemCount} items`),
    decremented: (recipeId: string) => logger.info('STOCK', `Stock decremented for recipe: ${recipeId}`)
  },
  
  promotion: {
    viewed: (promotionId: string) => logger.info('PROMOTION', `Promotion viewed: ${promotionId}`),
    clicked: (promotionId: string) => logger.info('PROMOTION', `Promotion clicked: ${promotionId}`),
    created: (promotionId: string) => logger.info('PROMOTION', `Promotion created: ${promotionId}`)
  },
  
  theme: {
    loaded: (themeName: string) => logger.info('THEME', `Food theme loaded: ${themeName}`),
    changed: (from: string, to: string) => logger.info('THEME', `Theme changed from ${from} to ${to}`)
  },
  
  error: {
    api: (endpoint: string, error: any) => logger.error('API', `Error in ${endpoint}`, error),
    component: (component: string, error: any) => logger.error('COMPONENT', `Error in ${component}`, error),
    validation: (field: string, error: string) => logger.warn('VALIDATION', `${field}: ${error}`)
  }
}

// Performance tracking
export const perfLogger = {
  start: (operation: string): string => {
    const id = `${operation}-${Date.now()}`
    logger.debug('PERF', `Started: ${operation}`, { id })
    return id
  },
  
  end: (id: string, operation: string) => {
    const duration = Date.now() - parseInt(id.split('-').pop() || '0')
    logger.debug('PERF', `Completed: ${operation} in ${duration}ms`, { id, duration })
  }
}

// Usage examples:
// appLogger.recipe.viewed('pizza-margherita')
// appLogger.shopping.itemAdded('Tomate')
// appLogger.error.api('/api/promotions', new Error('Network error'))
// const perfId = perfLogger.start('fetch-recipes')
// perfLogger.end(perfId, 'fetch-recipes')