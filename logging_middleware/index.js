const axios = require('axios');

/**
 * Reusable Log Function for Backend
 * @param {string} level - 'debug' | 'info' | 'warn' | 'error' | 'fatal'
 * @param {string} packageField - 'cache' | 'controller' | 'cron_job' | 'db' | 'domain' | 'handler' | 'repository' | 'route' | 'service' | 'middleware' | 'utils'
 * @param {string} message - The actual message to log
 */
async function logToTestServer(level, packageField, message) {
    const LOG_API_URL = "http://20.207.122.201/evaluation-service/logs";
    
    // Validating constraints as per setup rules
    const validLevels = ["debug", "info", "warn", "error", "fatal"];
    const validPackages = ["cache", "controller", "cron_job", "db", "domain", "handler", "repository", "route", "service", "middleware", "utils"];

    const validatedLevel = validLevels.includes(level.toLowerCase()) ? level.toLowerCase() : "info";
    const validatedPackage = validPackages.includes(packageField.toLowerCase()) ? packageField.toLowerCase() : "utils";

    const payload = {
        stack: "backend",
        level: validatedLevel,
        package: validatedPackage,
        message: message
    };

    try {
        // Send logs to the test server API endpoint
        const response = await axios.post(LOG_API_URL, payload, { timeout: 2000 });
        console.log(`[Server Logger Success]: (LogID: ${response.data.logID})`);
    } catch (error) {
        // Safe console output in case of token/server errors
        console.log(`[Local Log Fallback - ${validatedLevel.toUpperCase()}][${validatedPackage}]: ${message}`);
    }
}

module.exports = { logToTestServer };