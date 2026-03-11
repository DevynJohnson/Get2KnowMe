import fs from 'fs';

// Sample log data (you would load this from your actual log file)
const logData = `
2026-03-11T21:00:23Z clientIP="158.158.32.105" requestID="" responseTimeMS=0 responseBytes=180 userAgent=""
2026-03-11T21:00:23Z clientIP="158.158.32.105" requestID="" responseTimeMS=0 responseBytes=184 userAgent=""
2026-03-11T21:00:24Z clientIP="158.158.32.105" requestID="7727c363-0876-4c30" responseTimeMS=5 responseBytes=2073 userAgent=""
2026-03-11T21:00:24Z clientIP="158.158.32.105" requestID="" responseTimeMS=0 responseBytes=204 userAgent=""
2026-03-11T21:00:24Z clientIP="158.158.32.105" requestID="eae056f6-f151-4ecb" responseTimeMS=5 responseBytes=2073 userAgent=""
`.trim();

// Parse log entries
function parseLogLine(line) {
  const timestampMatch = line.match(/^(\S+)/);
  const ipMatch = line.match(/clientIP="([^"]+)"/);
  const userAgentMatch = line.match(/userAgent="([^"]*)"/);
  const responseBytesMatch = line.match(/responseBytes=(\d+)/);
  const responseTimeMatch = line.match(/responseTimeMS=(\d+)/);

  if (!timestampMatch || !ipMatch) return null;

  return {
    timestamp: new Date(timestampMatch[1]),
    ip: ipMatch[1],
    userAgent: userAgentMatch ? userAgentMatch[1] : '',
    responseBytes: responseBytesMatch ? parseInt(responseBytesMatch[1]) : 0,
    responseTime: responseTimeMatch ? parseInt(responseTimeMatch[1]) : 0
  };
}

// Analyze traffic patterns
function analyzeTraffic(logInput) {
  const lines = logInput.trim().split('\n').filter(l => l.trim());
  const entries = lines.map(parseLogLine).filter(e => e !== null);

  if (entries.length === 0) {
    console.log('No valid log entries found');
    return;
  }

  // Group by IP
  const ipStats = {};
  
  entries.forEach(entry => {
    if (!ipStats[entry.ip]) {
      ipStats[entry.ip] = {
        requests: [],
        userAgents: new Set(),
        totalBytes: 0
      };
    }
    
    ipStats[entry.ip].requests.push(entry.timestamp);
    if (entry.userAgent) {
      ipStats[entry.ip].userAgents.add(entry.userAgent);
    }
    ipStats[entry.ip].totalBytes += entry.responseBytes;
  });

  // Analyze each IP
  const analysis = [];
  
  for (const [ip, stats] of Object.entries(ipStats)) {
    const requestCount = stats.requests.length;
    const sortedTimes = stats.requests.sort((a, b) => a - b);
    const firstRequest = sortedTimes[0];
    const lastRequest = sortedTimes[sortedTimes.length - 1];
    const timeSpan = (lastRequest - firstRequest) / 1000; // seconds
    const requestsPerSecond = timeSpan > 0 ? (requestCount / timeSpan).toFixed(2) : requestCount;
    
    // Calculate burst patterns (requests within 1-second windows)
    let maxBurst = 0;
    for (let i = 0; i < sortedTimes.length; i++) {
      let burstCount = 1;
      const windowStart = sortedTimes[i];
      for (let j = i + 1; j < sortedTimes.length; j++) {
        if ((sortedTimes[j] - windowStart) / 1000 <= 1) {
          burstCount++;
        } else {
          break;
        }
      }
      maxBurst = Math.max(maxBurst, burstCount);
    }

    // Determine threat level
    let threatLevel = 'NORMAL';
    let reasons = [];
    
    if (requestsPerSecond > 5) {
      threatLevel = 'HIGH';
      reasons.push(`High rate: ${requestsPerSecond} req/sec`);
    } else if (requestsPerSecond > 2) {
      threatLevel = 'MEDIUM';
      reasons.push(`Elevated rate: ${requestsPerSecond} req/sec`);
    }
    
    if (maxBurst > 10) {
      threatLevel = 'HIGH';
      reasons.push(`Burst traffic: ${maxBurst} requests in 1 sec`);
    } else if (maxBurst > 5) {
      if (threatLevel === 'NORMAL') threatLevel = 'MEDIUM';
      reasons.push(`Moderate burst: ${maxBurst} requests in 1 sec`);
    }
    
    if (stats.userAgents.size === 0 || (stats.userAgents.size === 1 && [...stats.userAgents][0] === '')) {
      if (requestCount > 10) {
        threatLevel = threatLevel === 'NORMAL' ? 'MEDIUM' : 'HIGH';
        reasons.push('No user agent (likely bot)');
      }
    }

    // Check for outdated browsers (possible bot signatures)
    const userAgentList = Array.from(stats.userAgents);
    if (userAgentList.some(ua => ua.includes('Chrome/78.'))) {
      reasons.push('Outdated browser (Chrome 78 from 2019)');
      if (threatLevel === 'NORMAL') threatLevel = 'MEDIUM';
    }

    analysis.push({
      ip,
      requestCount,
      requestsPerSecond: parseFloat(requestsPerSecond),
      timeSpan: timeSpan.toFixed(1),
      maxBurst,
      userAgents: userAgentList,
      totalBytes: stats.totalBytes,
      threatLevel,
      reasons,
      firstRequest,
      lastRequest
    });
  }

  // Sort by threat level and request count
  const threatOrder = { 'HIGH': 0, 'MEDIUM': 1, 'NORMAL': 2 };
  analysis.sort((a, b) => {
    if (a.threatLevel !== b.threatLevel) {
      return threatOrder[a.threatLevel] - threatOrder[b.threatLevel];
    }
    return b.requestCount - a.requestCount;
  });

  return analysis;
}

// Display results
function displayAnalysis(analysis) {
  console.log('\n╔═══════════════════════════════════════════════════════════════════════════╗');
  console.log('║                      TRAFFIC ANALYSIS REPORT                              ║');
  console.log('╚═══════════════════════════════════════════════════════════════════════════╝\n');

  const highThreat = analysis.filter(a => a.threatLevel === 'HIGH');
  const mediumThreat = analysis.filter(a => a.threatLevel === 'MEDIUM');
  const normal = analysis.filter(a => a.threatLevel === 'NORMAL');

  if (highThreat.length > 0) {
    console.log('🚨 HIGH THREAT IPs (RECOMMEND IMMEDIATE BLACKLIST):');
    console.log('═'.repeat(75));
    highThreat.forEach(ip => printIPDetails(ip));
  }

  if (mediumThreat.length > 0) {
    console.log('\n⚠️  MEDIUM THREAT IPs (MONITOR/RATE LIMIT):');
    console.log('═'.repeat(75));
    mediumThreat.forEach(ip => printIPDetails(ip));
  }

  if (normal.length > 0) {
    console.log('\n✓ NORMAL TRAFFIC IPs:');
    console.log('═'.repeat(75));
    normal.forEach(ip => printIPDetails(ip, true));
  }

  // Summary and recommendations
  console.log('\n╔═══════════════════════════════════════════════════════════════════════════╗');
  console.log('║                         RECOMMENDATIONS                                   ║');
  console.log('╚═══════════════════════════════════════════════════════════════════════════╝\n');
  
  if (highThreat.length > 0) {
    console.log('📋 IPs to blacklist immediately:');
    highThreat.forEach(ip => {
      console.log(`   • ${ip.ip}`);
    });
  }

  if (mediumThreat.length > 0) {
    console.log('\n📋 IPs to monitor or rate-limit:');
    mediumThreat.forEach(ip => {
      console.log(`   • ${ip.ip}`);
    });
  }

  console.log('\n💡 Suggested protective measures:');
  console.log('   • Implement rate limiting (e.g., 60 requests per minute per IP)');
  console.log('   • Require valid user agents');
  console.log('   • Consider CAPTCHA for suspicious patterns');
  console.log('   • Monitor for similar burst patterns');
  console.log('   • Add logging for blocked requests\n');
}

function printIPDetails(ipData, compact = false) {
  console.log(`\nIP: ${ipData.ip}`);
  console.log(`   Requests: ${ipData.requestCount} over ${ipData.timeSpan}s (${ipData.requestsPerSecond} req/sec)`);
  console.log(`   Max burst: ${ipData.maxBurst} requests in 1 second`);
  console.log(`   Data transferred: ${(ipData.totalBytes / 1024).toFixed(2)} KB`);
  
  if (!compact) {
    console.log(`   Time range: ${ipData.firstRequest.toISOString()} to ${ipData.lastRequest.toISOString()}`);
  }
  
  if (ipData.userAgents.length > 0 && ipData.userAgents[0] !== '') {
    console.log(`   User agents: ${ipData.userAgents.length}`);
    ipData.userAgents.slice(0, 2).forEach(ua => {
      console.log(`      - ${ua.substring(0, 70)}${ua.length > 70 ? '...' : ''}`);
    });
  } else {
    console.log(`   User agents: NONE (likely automated bot)`);
  }
  
  if (ipData.reasons.length > 0) {
    console.log(`   🔍 Flags:`);
    ipData.reasons.forEach(reason => {
      console.log(`      • ${reason}`);
    });
  }
}

// Run analysis
// Read from stdin or use sample data
const input = process.argv[2] ? fs.readFileSync(process.argv[2], 'utf8') : logData;

const analysis = analyzeTraffic(input);
displayAnalysis(analysis);

export { analyzeTraffic, parseLogLine };
