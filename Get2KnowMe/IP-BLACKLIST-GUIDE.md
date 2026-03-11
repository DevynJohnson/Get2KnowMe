# IP Blacklist Implementation Guide

## Traffic Analysis Results

Based on the analysis of your traffic logs from March 11, 2026, **two IPs should be blacklisted immediately**:

### High Threat IPs

1. **158.158.32.105**
   - **224 requests in 43 seconds** (~5.2 req/sec)
   - Max burst: 12 requests in 1 second
   - No user agent (automated bot)
   - Data transferred: 245.50 KB
   - **Recommendation**: BLACKLIST IMMEDIATELY

2. **208.84.101.154**
   - **20 requests in 1 second** (20 req/sec)
   - Outdated Chrome 78 browser (from 2019) - common bot signature
   - Data transferred: 40.49 KB
   - **Recommendation**: BLACKLIST IMMEDIATELY

### Normal Traffic IPs (No Action Needed)

- 104.28.163.16 - 2 requests (legitimate)
- 82.154.181.145 - 1 request (legitimate)
- 104.210.140.135 - 1 request (OpenAI SearchBot - legitimate crawler)
- 43.156.109.53 - 1 request (legitimate)
- 204.76.203.25 - 1 request (legitimate)

---

## Implementation Options

You have **two options** for implementing IP blacklisting:

### Option 1: Environment Variable (Current Method)

Your server already has IP blacklist middleware at line 50 in `app.js`. To use it:

1. Add these two IPs to your `.env` file:
```env
WAF_BLACKLIST=158.158.32.105,208.84.101.154
```

2. Restart your server

**Pros:**
- Already implemented
- Simple and lightweight
- No code changes needed

**Cons:**
- Requires server restart to update
- Less flexible for managing many IPs

---

### Option 2: JSON-Based Blacklist (Recommended)

I've created a more flexible solution using `ip-blacklist.json`:

#### 1. Add the middleware to app.js

Find this line in `server/app.js` (around line 83):

```javascript
}
```

Right after the existing WAF blacklist block (after line 83), add:

```javascript
// Enhanced JSON-based IP blacklist
import ipBlacklistMiddleware from './ip-blacklist-middleware.js';
app.use(ipBlacklistMiddleware(logger));
```

#### 2. The blacklist file

The IPs are already configured in `server/ip-blacklist.json`:

```json
{
  "blacklist": [
    {
      "ip": "158.158.32.105",
      "reason": "Automated bot attack - 224 requests in 43 seconds with no user agent",
      "dateAdded": "2026-03-11",
      "severity": "high"
    },
    {
      "ip": "208.84.101.154",
      "reason": "Burst attack - 20 requests in 1 second using outdated Chrome 78 browser",
      "dateAdded": "2026-03-11",
      "severity": "high"
    }
  ]
}
```

#### 3. Restart your server

**Pros:**
- Better documentation of why IPs are blocked
- Hot-reload (updates automatically without restart)
- Can add severity levels and dates
- Programmatically manageable
- Better for auditing and compliance

**Cons:**
- Requires adding 2 lines of code

---

## Additional Security Recommendations

### 1. Implement Rate Limiting (Already Partially Done)

Your server already uses `express-rate-limit`. Consider these enhancements:

```javascript
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // limit each IP to 60 requests per minute
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);
```

### 2. User Agent Validation

Add middleware to block requests with no user agent:

```javascript
app.use((req, res, next) => {
  const userAgent = req.get('User-Agent');
  if (!userAgent || userAgent.trim() === '') {
    logger.warn('Blocked request with no user agent', {
      ip: req.ip,
      path: req.path,
    });
    return res.status(403).json({ error: 'Invalid request' });
  }
  next();
});
```

### 3. Monitoring & Alerts

Set up alerts for:
- IPs making more than 100 requests per minute
- Burst patterns (>10 requests in 1 second)
- Empty user agents
- Outdated browsers (Chrome < 90, Firefox < 90)

### 4. Regular Log Analysis

Run the traffic analyzer regularly:

```bash
node server/analyze-traffic.js path/to/your/logs.txt
```

Set up a cron job or scheduled task to analyze logs daily and email you the results.

---

## Quick Start (Recommended Path)

**Choose the fastest option** based on your needs:

### Fast & Simple (5 seconds):
```bash
# Add to .env
echo "WAF_BLACKLIST=158.158.32.105,208.84.101.154" >> .env
# Restart server
```

### Better Long-term (2 minutes):
1. Add these 2 lines to `app.js` after line 83:
   ```javascript
   import ipBlacklistMiddleware from './ip-blacklist-middleware.js';
   app.use(ipBlacklistMiddleware(logger));
   ```
2. Restart server
3. Done! The JSON file is already configured with the malicious IPs.

---

## Testing

To verify the blacklist is working:

```bash
# Test from another machine or using curl
curl -H "X-Forwarded-For: 158.158.32.105" http://your-domain.com/api/users

# Should return:
# Status: 403
# {"error":"Access denied","message":"Your IP address has been blocked due to suspicious activity."}
```

---

## Maintenance

### Add IP to blacklist manually:

Edit `server/ip-blacklist.json` and add:

```json
{
  "ip": "1.2.3.4",
  "reason": "Description of suspicious activity",
  "dateAdded": "2026-03-11",
  "severity": "high"
}
```

The middleware will automatically reload it on the next request (no server restart needed).

### Remove IP from blacklist:

Simply delete the entry from `server/ip-blacklist.json`.

---

## Questions?

The traffic analysis tool is available at `server/analyze-traffic.js`. Run it anytime with:

```bash
node server/analyze-traffic.js path/to/logs.txt
```

It will analyze patterns and tell you which IPs to blacklist.
