import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * IP Blacklist Middleware
 * Blocks requests from IPs listed in server/ip-blacklist.json
 */

let blacklistCache = null;
let lastModified = null;

function loadBlacklist() {
  try {
    const blacklistPath = path.join(__dirname, 'ip-blacklist.json');
    const stats = fs.statSync(blacklistPath);
    
    // Only reload if file has been modified
    if (!lastModified || stats.mtime > lastModified) {
      const data = fs.readFileSync(blacklistPath, 'utf8');
      blacklistCache = JSON.parse(data);
      lastModified = stats.mtime;
      console.log(`[IP Blacklist] Loaded ${blacklistCache.blacklist.length} blacklisted IPs`);
    }
    
    return blacklistCache;
  } catch (error) {
    console.error('[IP Blacklist] Error loading blacklist:', error.message);
    return { blacklist: [] };
  }
}

/**
 * Middleware function to block blacklisted IPs
 */
export function ipBlacklistMiddleware(logger = console) {
  return (req, res, next) => {
    const blacklistConfig = loadBlacklist();
    const clientIP = req.ip || req.connection?.remoteAddress || req.socket?.remoteAddress || 'unknown';
    
    // Normalize IPv6 localhost and IPv4-mapped IPv6 addresses
    const normalizedIP = clientIP.replace(/^::ffff:/, '');
    
    // Check if IP is blacklisted
    const blockedEntry = blacklistConfig.blacklist.find(
      entry => entry.ip === clientIP || entry.ip === normalizedIP
    );
    
    if (blockedEntry) {
      logger.warn && logger.warn('Blocked request from blacklisted IP', {
        ip: clientIP,
        reason: blockedEntry.reason,
        severity: blockedEntry.severity,
        path: req.path,
        method: req.method,
        userAgent: req.get('User-Agent'),
        timestamp: new Date().toISOString(),
      });
      
      return res.status(403).json({ 
        error: 'Access denied',
        message: 'Your IP address has been blocked due to suspicious activity.'
      });
    }
    
    next();
  };
}

/**
 * Get current blacklist
 */
export function getBlacklist() {
  return loadBlacklist();
}

/**
 * Add IP to blacklist
 */
export function addToBlacklist(ip, reason, severity = 'medium') {
  const blacklistPath = path.join(__dirname, 'ip-blacklist.json');
  const config = loadBlacklist();
  
  // Check if IP already exists
  if (config.blacklist.find(entry => entry.ip === ip)) {
    return { success: false, message: 'IP already blacklisted' };
  }
  
  config.blacklist.push({
    ip,
    reason,
    severity,
    dateAdded: new Date().toISOString().split('T')[0]
  });
  
  fs.writeFileSync(blacklistPath, JSON.stringify(config, null, 2));
  blacklistCache = config;
  lastModified = new Date();
  
  return { success: true, message: 'IP added to blacklist' };
}

/**
 * Remove IP from blacklist
 */
export function removeFromBlacklist(ip) {
  const blacklistPath = path.join(__dirname, 'ip-blacklist.json');
  const config = loadBlacklist();
  
  const initialLength = config.blacklist.length;
  config.blacklist = config.blacklist.filter(entry => entry.ip !== ip);
  
  if (config.blacklist.length === initialLength) {
    return { success: false, message: 'IP not found in blacklist' };
  }
  
  fs.writeFileSync(blacklistPath, JSON.stringify(config, null, 2));
  blacklistCache = config;
  lastModified = new Date();
  
  return { success: true, message: 'IP removed from blacklist' };
}

export default ipBlacklistMiddleware;
