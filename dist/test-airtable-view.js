"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
async function main() {
    // Airtable API details
    const AIRTABLE_API_KEY = 'pataQ6RMQ5GnQgRNC.06d2999a87413b677e522b561e65868828d29769ba530c7221e47622b96fe93c';
    const BASE_ID = 'appvseKRqCWattMr5';
    const TABLE_ID = 'tblZFRuM1H6JC2Noy';
    const VIEW = 'Ready For Generation';
    const url = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}?maxRecords=2&view=${encodeURIComponent(VIEW)}`;
    try {
        const res = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
                'Content-Type': 'application/json',
            },
        });
        if (!res.ok)
            throw new Error(`Airtable API error: ${res.status} ${res.statusText}`);
        const data = await res.json();
        console.log('First two records from Airtable (Ready For Generation view):');
        console.dir(data.records, { depth: null });
    }
    catch (err) {
        console.error('Failed to fetch Airtable records:', err);
    }
}
main().catch(err => {
    console.error(err);
    process.exit(1);
});
