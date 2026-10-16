/**
 * CoastalGuard AI — Standalone In-Memory Backend API
 *
 * REST API providing live marine telemetry, vessel location updates, safety announcements,
 * and user directories without requiring external database dependencies or migrations.
 */

const http = require('http');
const url = require('url');

const PORT = process.env.PORT || 5000;

// In-Memory Data Store (Strictly isolated - No external DB connections)
let vessels = [
  {
    id: 'vessel-01',
    boatName: 'Kadalarasan (கடலரசன்)',
    registrationNumber: 'IND-TN-10-MM-4021',
    ownerName: 'M. Selvam',
    homePort: 'Rameswaram Fishing Harbour',
    reportedLocation: "09°18'N, 79°22'E (Sector 4)",
    coordinates: [9.30, 79.36],
    lastReportedTime: '12 mins ago',
    lastUpdateMinutes: 12,
    status: 'sample',
    signalStrength: 'Strong',
    speedKnots: 8.5,
    headingDegrees: 142,
    isLiveGps: false,
    isDemo: true,
  },
  {
    id: 'vessel-02',
    boatName: 'Meenatchi Ambal',
    registrationNumber: 'IND-TN-02-MM-1892',
    ownerName: 'K. Arumugam',
    homePort: 'Kasimedu (Chennai)',
    reportedLocation: "13°08'N, 80°20'E (Sector 1)",
    coordinates: [13.14, 80.32],
    lastReportedTime: '4 mins ago',
    lastUpdateMinutes: 4,
    status: 'sample',
    signalStrength: 'Strong',
    speedKnots: 11.2,
    headingDegrees: 38,
    isLiveGps: false,
    isDemo: true,
  },
  {
    id: 'vessel-03',
    boatName: 'Alai Osai II',
    registrationNumber: 'IND-TN-16-MM-9931',
    ownerName: 'S. Anthony Raj',
    homePort: 'Tuticorin Port',
    reportedLocation: "08°42'N, 78°14'E (Sector 4)",
    coordinates: [8.70, 78.23],
    lastReportedTime: '2 hours ago',
    lastUpdateMinutes: 120,
    status: 'stale',
    signalStrength: 'Degraded',
    speedKnots: null,
    headingDegrees: null,
    isLiveGps: false,
    isDemo: true,
  },
  {
    id: 'vessel-04',
    boatName: 'Sea Queen Voyager',
    registrationNumber: 'IND-TN-14-MM-3108',
    ownerName: 'R. Velan',
    homePort: 'Chinnamuttam Harbour',
    reportedLocation: "08°01'N, 77°32'E (Sector 5)",
    coordinates: [8.02, 77.52],
    lastReportedTime: '5 hours ago',
    lastUpdateMinutes: 300,
    status: 'unknown',
    signalStrength: 'Offline',
    speedKnots: null,
    headingDegrees: null,
    isLiveGps: false,
    isDemo: true,
  },
  {
    id: 'vessel-05',
    boatName: 'Thirumalai Star',
    registrationNumber: 'IND-TN-10-MM-6721',
    ownerName: 'P. Murugesan',
    homePort: 'Rameswaram Fishing Harbour',
    reportedLocation: "09°14'N, 79°19'E (Sector 4)",
    coordinates: [9.23, 79.32],
    lastReportedTime: '8 mins ago',
    lastUpdateMinutes: 8,
    status: 'sample',
    signalStrength: 'Strong',
    speedKnots: 6.8,
    headingDegrees: 210,
    isLiveGps: false,
    isDemo: true,
  },
  {
    id: 'vessel-06',
    boatName: 'Cauvery Matha',
    registrationNumber: 'IND-TN-12-MM-8419',
    ownerName: 'C. Dharmalingam',
    homePort: 'Nagapattinam Harbour',
    reportedLocation: "10°44'N, 79°52'E (Sector 2)",
    coordinates: [10.74, 79.87],
    lastReportedTime: '30 mins ago',
    lastUpdateMinutes: 30,
    status: 'sample',
    signalStrength: 'Strong',
    speedKnots: 9.1,
    headingDegrees: 95,
    isLiveGps: false,
    isDemo: true,
  },
];

let marineConditions = {
  'gulf-of-mannar': {
    regionId: 'gulf-of-mannar',
    regionName: 'Gulf of Mannar',
    coastalZone: 'South-East Zone (Sector 4)',
    windSpeedKnots: 28,
    windDirection: 'SSW (South-South-West)',
    waveHeightMeters: 3.2,
    swellPeriodSeconds: 11,
    rainfallMm: 18.5,
    visibilityKm: 4.8,
    barometricPressureHpa: 1004,
    seaSurfaceTempC: 28.5,
    forecastSummary: 'Squally weather with rough to very rough seas. Wind gusts up to 35 knots expected.',
    riskLevel: 'high',
    lastUpdated: '10 mins ago (Backend API sync)',
  },
  'palk-strait': {
    regionId: 'palk-strait',
    regionName: 'Palk Strait / Rameswaram',
    coastalZone: 'Mid-East Zone (Sector 3)',
    windSpeedKnots: 16,
    windDirection: 'ENE (East-North-East)',
    waveHeightMeters: 1.8,
    swellPeriodSeconds: 8,
    rainfallMm: 4.2,
    visibilityKm: 8.5,
    barometricPressureHpa: 1011,
    seaSurfaceTempC: 29.1,
    forecastSummary: 'Moderate chop. Safe for mechanized trawlers; traditional small catamarans exercise caution.',
    riskLevel: 'moderate',
    lastUpdated: '25 mins ago (Backend API sync)',
  },
  'chennai-coromandel': {
    regionId: 'chennai-coromandel',
    regionName: 'Chennai & Coromandel Coast',
    coastalZone: 'North-East Zone (Sector 1)',
    windSpeedKnots: 12,
    windDirection: 'NE (North-East)',
    waveHeightMeters: 1.1,
    swellPeriodSeconds: 6,
    rainfallMm: 0.0,
    visibilityKm: 12.0,
    barometricPressureHpa: 1014,
    seaSurfaceTempC: 29.8,
    forecastSummary: 'Calm seas with light sea breeze. Standard maritime safety conditions prevail.',
    riskLevel: 'low',
    lastUpdated: '5 mins ago (Backend API sync)',
  },
  'kanyakumari-cape': {
    regionId: 'kanyakumari-cape',
    regionName: 'Kanyakumari & Cape Sea',
    coastalZone: 'Southern Confluence (Sector 5)',
    windSpeedKnots: 38,
    windDirection: 'WNW (West-North-West)',
    waveHeightMeters: 4.5,
    swellPeriodSeconds: 14,
    rainfallMm: 45.0,
    visibilityKm: 2.2,
    barometricPressureHpa: 998,
    seaSurfaceTempC: 27.2,
    forecastSummary: 'Severe cyclonic swell warning. Absolute ban on fishing craft venturing into deep waters.',
    riskLevel: 'extreme',
    lastUpdated: 'Just now (Backend API sync)',
  },
  'nagapattinam-delta': {
    regionId: 'nagapattinam-delta',
    regionName: 'Nagapattinam & Cauvery Delta',
    coastalZone: 'Mid-East Zone (Sector 2)',
    windSpeedKnots: 20,
    windDirection: 'SE (South-East)',
    waveHeightMeters: 2.4,
    swellPeriodSeconds: 9,
    rainfallMm: 12.0,
    visibilityKm: 6.0,
    barometricPressureHpa: 1008,
    seaSurfaceTempC: 28.9,
    forecastSummary: 'Choppy seas with localized thunderstorms. Return to shelter before dusk recommended.',
    riskLevel: 'moderate',
    lastUpdated: '15 mins ago (Backend API sync)',
  },
};

let alerts = [
  {
    id: 'alert-01',
    title: 'Severe High Swell & Gale Advisory (Gulf of Mannar)',
    titleTamil: 'மன்னார் வளைகுடா: அதிவேக காற்று மற்றும் கடல் கொந்தளிப்பு எச்சரிக்கை',
    message: 'South-westerly winds gusting to 35-40 knots with wave heights exceeding 3.5 meters expected. Small craft operations advised to cease immediately.',
    messageTamil: 'தென்மேற்கு திசையிலிருந்து மணிக்கு 35 முதல் 40 கி.மீ வேகத்தில் காற்று வீசக்கூடும். அலைகளின் உயரம் 3.5 மீட்டருக்கு மேல் எழும் என்பதால் நாட்டுப்படகுகள் கடலுக்குச் செல்ல வேண்டாம்.',
    coastalRegion: 'Gulf of Mannar',
    severity: 'high',
    issuedAt: 'Today, 06:00 AM IST',
    validUntil: 'Tomorrow, 18:00 PM IST',
    bulletinId: 'CG-IN-2026-089A',
    isActive: true,
    recommendedAction: 'Anchor vessels in sheltered creeks or inner harbour berths immediately.',
    recommendedActionTamil: 'படகுளை உடனடியாக பாதுகாப்பான துறைமுக அணைகளில் நங்கூரமிட்டு நிறுத்தவும்.',
  },
  {
    id: 'alert-02',
    title: 'Extreme Cyclonic Surge Red Alert (Kanyakumari Coast)',
    titleTamil: 'கன்னியாகுமரி கடலோரப் பகுதி: தீவிர புயல் மற்றும் பேரலை சிவப்பு எச்சரிக்கை',
    message: 'Deep depression intensifying into severe storm. Wave heights predicted up to 4.8 meters with squally winds up to 45 knots.',
    messageTamil: 'ஆழ்ந்த காற்றழுத்த தாழ்வு மண்டலம் தீவிரமடைகிறது. கடல் அலைகள் 4.8 மீட்டர் வரை எழக்கூடும். அனைத்து மீனவர்களும் உடனடியாக கரை திரும்ப வேண்டும்.',
    coastalRegion: 'Kanyakumari & Cape Sea',
    severity: 'extreme',
    issuedAt: 'Today, 04:30 AM IST',
    validUntil: 'Next 48 Hours',
    bulletinId: 'CG-IN-2026-090E',
    isActive: true,
    recommendedAction: 'Total ban on sea ventures. All active boats instructed to make nearest harbour call.',
    recommendedActionTamil: 'கடலுக்குள் செல்ல முழுத் தடை. கடலில் உள்ள அனைத்து படகுகளும் உடனடியாக அருகிலுள்ள துறைமுகம் செல்லவும்.',
  },
  {
    id: 'alert-03',
    title: 'Moderate Thunderstorm & Churning Alert (Cauvery Delta)',
    titleTamil: 'காவிரி டெல்டா: மிதமான இடிமின்னல் மற்றும் கடல் சீற்ற எச்சரிக்கை',
    message: 'Localized convective cloud bands approaching Nagapattinam and Karaikal with moderate lightning and gusty winds.',
    messageTamil: 'நாகப்பட்டினம் மற்றும் காரைக்கால் கடல் பகுதியில் இடி மின்னலுடன் கூடிய திடீர் பலத்த காற்று வீசக்கூடும்.',
    coastalRegion: 'Nagapattinam & Cauvery Delta',
    severity: 'moderate',
    issuedAt: 'Today, 08:15 AM IST',
    validUntil: 'Tonight, 22:00 PM IST',
    bulletinId: 'CG-IN-2026-088M',
    isActive: true,
    recommendedAction: 'Keep VHF transceivers on Channel 16. Avoid night operations in open waters.',
    recommendedActionTamil: 'VHF அலைவரிசை 16-ல் விழிப்புடன் இருக்கவும். இரவு நேர ஆழ்கடல் மீன்பிடிப்பைத் தவிர்க்கவும்.',
  },
  {
    id: 'alert-04',
    title: 'Routine Maritime Safety Advisory (Coromandel Coast)',
    titleTamil: 'கோரமண்டல் கடற்கரை: வழக்கமான கடல் வழிகாட்டுதல் தகவல்',
    message: 'Normal sea state with swells below 1.2m. Fair weather across Chennai and Ennore ports.',
    messageTamil: 'கடல் அமைதியாக உள்ளது. வழக்கமான மீன்பிடி பணிகளை பாதுகாப்பு வழிகாட்டுதல்களுடன் மேற்கொள்ளலாம்.',
    coastalRegion: 'Chennai & Coromandel Coast',
    severity: 'low',
    issuedAt: 'Yesterday, 18:00 PM IST',
    validUntil: 'Tomorrow, 06:00 AM IST',
    bulletinId: 'CG-IN-2026-087L',
    isActive: false,
    recommendedAction: 'Standard safety jackets and GPS beacon inspection before voyage.',
    recommendedActionTamil: 'லைஃப் ஜாக்கெட் மற்றும் ஜிபிஎஸ் கருவிகளை சரிபார்த்து கடலுக்குச் செல்லவும்.',
  },
];

let users = [
  {
    id: 'usr-101',
    name: 'M. Selvam',
    contact: '+91 98401 23456',
    homeHarbour: 'Rameswaram Fishing Harbour',
    vesselName: 'Kadalarasan',
    registrationNo: 'IND-TN-10-MM-4021',
    accountStatus: 'active',
    preferredLanguage: 'ta',
    joinedDate: 'Jan 14, 2024',
  },
  {
    id: 'usr-102',
    name: 'K. Arumugam',
    contact: '+91 97890 87654',
    homeHarbour: 'Kasimedu (Chennai)',
    vesselName: 'Meenatchi Ambal',
    registrationNo: 'IND-TN-02-MM-1892',
    accountStatus: 'active',
    preferredLanguage: 'ta',
    joinedDate: 'Mar 22, 2024',
  },
  {
    id: 'usr-103',
    name: 'S. Anthony Raj',
    contact: '+91 94432 11223',
    homeHarbour: 'Tuticorin Port',
    vesselName: 'Alai Osai II',
    registrationNo: 'IND-TN-16-MM-9931',
    accountStatus: 'active',
    preferredLanguage: 'en',
    joinedDate: 'Nov 05, 2023',
  },
  {
    id: 'usr-104',
    name: 'R. Velan',
    contact: '+91 98940 55443',
    homeHarbour: 'Chinnamuttam Harbour',
    vesselName: 'Sea Queen Voyager',
    registrationNo: 'IND-TN-14-MM-3108',
    accountStatus: 'inactive',
    preferredLanguage: 'ta',
    joinedDate: 'Feb 18, 2025',
  },
  {
    id: 'usr-105',
    name: 'P. Murugesan',
    contact: '+91 97500 66778',
    homeHarbour: 'Rameswaram Fishing Harbour',
    vesselName: 'Thirumalai Star',
    registrationNo: 'IND-TN-10-MM-6721',
    accountStatus: 'active',
    preferredLanguage: 'ta',
    joinedDate: 'Aug 10, 2024',
  },
  {
    id: 'usr-106',
    name: 'C. Dharmalingam',
    contact: '+91 99420 33221',
    homeHarbour: 'Nagapattinam Harbour',
    vesselName: 'Cauvery Matha',
    registrationNo: 'IND-TN-12-MM-8419',
    accountStatus: 'suspended',
    preferredLanguage: 'ta',
    joinedDate: 'Dec 02, 2023',
  },
];

// Helper for JSON responses
function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  });
  res.end(JSON.stringify(data));
}

// Helper to parse JSON body
function getRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const parsed = body ? JSON.parse(body) : {};
        resolve(parsed);
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', err => reject(err));
  });
}

// HTTP Server
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    });
    res.end();
    return;
  }

  try {
    // 1. Health check
    if (pathname === '/api/health' && method === 'GET') {
      return sendJson(res, 200, {
        status: 'ok',
        service: 'CoastalGuard AI Backend API',
        timestamp: new Date().toISOString(),
        realTimeSupported: false,
        note: 'In-memory backend simulation without direct database persistence.',
      });
    }

    // 2. Vessels list
    if (pathname === '/api/vessels' && method === 'GET') {
      return sendJson(res, 200, {
        vessels,
        total: vessels.length,
        timestamp: new Date().toISOString(),
        isSimulated: true,
      });
    }

    // 3. Single vessel detail
    if (pathname.startsWith('/api/vessels/') && method === 'GET') {
      const vesselId = pathname.replace('/api/vessels/', '');
      const vessel = vessels.find(v => v.id === vesselId);
      if (!vessel) {
        return sendJson(res, 404, { error: 'Vessel not found', vesselId });
      }
      return sendJson(res, 200, { vessel, timestamp: new Date().toISOString() });
    }

    // 4. Marine conditions list
    if (pathname === '/api/marine-conditions' && method === 'GET') {
      return sendJson(res, 200, {
        conditions: marineConditions,
        timestamp: new Date().toISOString(),
      });
    }

    // 5. Single marine condition
    if (pathname.startsWith('/api/marine-conditions/') && method === 'GET') {
      const regionId = pathname.replace('/api/marine-conditions/', '');
      const condition = marineConditions[regionId];
      if (!condition) {
        return sendJson(res, 404, { error: 'Region not found', regionId });
      }
      return sendJson(res, 200, { condition, timestamp: new Date().toISOString() });
    }

    // 6. Safety alerts list
    if (pathname === '/api/alerts' && method === 'GET') {
      return sendJson(res, 200, {
        alerts,
        total: alerts.length,
        timestamp: new Date().toISOString(),
      });
    }

    // 7. Create safety alert
    if (pathname === '/api/alerts' && method === 'POST') {
      const body = await getRequestBody(req);
      if (!body.title || !body.message) {
        return sendJson(res, 400, { error: 'Title and message are required' });
      }

      const newAlert = {
        id: `alert-api-${Date.now()}`,
        title: body.title,
        titleTamil: body.titleTamil || body.title,
        message: body.message,
        messageTamil: body.messageTamil || body.message,
        coastalRegion: body.coastalRegion || 'Gulf of Mannar',
        severity: body.severity || 'high',
        issuedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST',
        validUntil: body.validUntil || 'Next 24 Hours',
        bulletinId: `CG-IN-2026-${Math.floor(100 + Math.random() * 900)}`,
        isActive: true,
        recommendedAction: body.recommendedAction || 'Return to nearest designated harbour immediately.',
        recommendedActionTamil: body.recommendedActionTamil || 'அருகிலுள்ள துறைமுகத்திற்கு உடனடியாக திரும்பவும்.',
      };

      alerts.unshift(newAlert);
      return sendJson(res, 201, { alert: newAlert, message: 'Announcement created successfully in in-memory store.' });
    }

    // 8. Users directory
    if (pathname === '/api/users' && method === 'GET') {
      return sendJson(res, 200, {
        users,
        total: users.length,
        timestamp: new Date().toISOString(),
      });
    }

    // 9. Update user status
    if (pathname.match(/^\/api\/users\/[^/]+\/status$/) && method === 'PATCH') {
      const parts = pathname.split('/');
      const userId = parts[3];
      const body = await getRequestBody(req);

      const userIndex = users.findIndex(u => u.id === userId);
      if (userIndex === -1) {
        return sendJson(res, 404, { error: 'User not found', userId });
      }

      if (body.accountStatus) {
        users[userIndex].accountStatus = body.accountStatus;
      } else {
        // Toggle if not provided
        users[userIndex].accountStatus = users[userIndex].accountStatus === 'active' ? 'inactive' : 'active';
      }

      return sendJson(res, 200, { user: users[userIndex], message: 'Status updated successfully in in-memory store.' });
    }

    // Not found
    return sendJson(res, 404, { error: 'API route not found', pathname });
  } catch (err) {
    console.error('Server error:', err);
    return sendJson(res, 500, { error: 'Internal server error', details: err.message });
  }
});

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`CoastalGuard Backend API listening on port ${PORT}`);
    console.log(`Endpoints available:`);
    console.log(`  GET   http://localhost:${PORT}/api/health`);
    console.log(`  GET   http://localhost:${PORT}/api/vessels`);
    console.log(`  GET   http://localhost:${PORT}/api/marine-conditions`);
    console.log(`  GET   http://localhost:${PORT}/api/alerts`);
    console.log(`  POST  http://localhost:${PORT}/api/alerts`);
    console.log(`  GET   http://localhost:${PORT}/api/users`);
    console.log(`  PATCH http://localhost:${PORT}/api/users/:id/status`);
  });
}

module.exports = { server, vessels, marineConditions, alerts, users };
