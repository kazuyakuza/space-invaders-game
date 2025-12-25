# Update Vite Configuration Plan

## Goal
Configure Vite to correctly serve and build the Space Invaders project, respecting the current source structure (`src/` directory).

## Analysis
- **Current Structure**: Source files are in `src/`, including `index.html`.
- **Issue**: Running `npm run dev` (vite) looks for `index.html` in the root directory by default.
- **Solution**: Configure Vite to use `src` as the root directory.
- **Entry Point**: `src/index.html` incorrectly references `ts/main.js`. It must reference the TypeScript file `ts/main.ts` with `type="module"`.

## Detailed Implementation Steps

### Step 1: Create `vite.config.ts`
Create a new file named `vite.config.ts` in the project root directory.

**Content:**
```typescript
import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
});
```

### Step 2: Update `src/index.html`
Modify `src/index.html` to correctly import the TypeScript entry point.

**Change:**
- **From**: `<script src="ts/main.js"></script>`
- **To**: `<script type="module" src="./ts/main.ts"></script>`

### Step 3: Verify Build (Coder Mode Action)
After applying changes, run the build command to ensure the configuration works as expected.
- Command: `npm run build`
- Expected Outcome: A `dist` folder should be created in the project root containing the built assets.

## Verification Checklist
- [ ] `vite.config.ts` exists in root.
- [ ] `src/index.html` uses `<script type="module" src="./ts/main.ts">`.
- [ ] `npm run build` executes without errors.
