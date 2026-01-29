# Project Guidelines

## Tech Stack

- **Node.js**: v24+ (use `nvm use` to switch to the correct version)
- **Package manager**: Yarn
- **Static site generator**: Eleventy (11ty) 3.x

## Development

```bash
# Install dependencies
yarn install

# Start dev server with hot reload
yarn start

# Build for production
yarn build

# Clean build output
yarn clean
```

## Project Structure

- `_data/` — Each file in this folder fetches or assigns data to the global scope based on the file name
- `src/` — Pages to be rendered on the site (.njk)
- `_includes/layouts/` — Base layout templates
- `_site/` — Build output (gitignored)

