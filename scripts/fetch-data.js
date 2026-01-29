const fs = require('fs');
const path = require('path');

const REGISTRY_URL = 'https://www.iana.org/assignments/language-subtag-registry/language-subtag-registry';

async function fetchAndParseRegistry() {
  console.log('Fetching IANA Language Subtag Registry...');

  const response = await fetch(REGISTRY_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch registry: ${response.status} ${response.statusText}`);
  }

  const text = await response.text();
  console.log(`Fetched ${text.length} bytes`);

  // Split by record separator
  const records = text.split('%%').map(r => r.trim()).filter(r => r.length > 0);
  console.log(`Found ${records.length} records`);

  const entries = [];

  for (const record of records) {
    const lines = record.split('\n');
    const entry = {};
    let currentField = null;

    for (const line of lines) {
      // Check if this is a continuation line (starts with whitespace)
      if (line.match(/^\s+/) && currentField) {
        // Continuation of previous field
        entry[currentField] += ' ' + line.trim();
      } else if (line.includes(':')) {
        const colonIndex = line.indexOf(':');
        const field = line.substring(0, colonIndex).trim();
        const value = line.substring(colonIndex + 1).trim();
        currentField = field;

        // Handle multiple Description fields
        if (field === 'Description') {
          if (entry.Description) {
            entry.Description += '; ' + value;
          } else {
            entry.Description = value;
          }
        } else {
          entry[field] = value;
        }
      }
    }

    // Only include entries that have Type and (Subtag or Tag)
    if (entry.Type && (entry.Subtag || entry.Tag)) {
      entries.push({
        subtag: entry.Subtag || entry.Tag,
        description: entry.Description || '',
        type: entry.Type
      });
    }
  }

  console.log(`Parsed ${entries.length} valid entries`);

  // Write to data file
  const outputPath = path.join(__dirname, '..', 'src', '_data', 'subtags.json');
  fs.writeFileSync(outputPath, JSON.stringify(entries, null, 2));
  console.log(`Written to ${outputPath}`);
}

fetchAndParseRegistry().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
