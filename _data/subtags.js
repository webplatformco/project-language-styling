import Fetch from "@11ty/eleventy-fetch";

const REGISTRY_URL = 'https://www.iana.org/assignments/language-subtag-registry/language-subtag-registry';
const RECORD_SEPARATOR = '%%';

/** @type {import('@11ty/eleventy')} */
export default async function () {
  const result = await Fetch(REGISTRY_URL, {
    duration: "1y", // save for 1 year
    type: "text",
  })
  .then(response => {
    if (typeof response !== 'string') {
      const decoder = new TextDecoder('utf-8'); 
      return decoder.decode(response);
    } else return response;
  })
  .catch(error => {
    console.error('There has been a problem with your fetch operation:', error);
  });

  // Split by record separator
  const records = result?.split(RECORD_SEPARATOR).map(r => r.trim()).filter(r => r.length > 0);

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

	return entries ?? [];
};