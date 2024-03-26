declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      PORT?: number | null;
      RATE_LIMIT_TIME?: number | null;
      RATE_LIMIT_LIMIT_REQUESTS?: number | null;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
