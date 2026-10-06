# FedEx Face Match — GitHub Pages build

This build is intended to run from GitHub Pages over HTTPS.

## Publish
1. Create a new GitHub repository.
2. Upload ALL files from this folder to the repository root:
   - index.html
   - style.css
   - players.js
   - app.js
   - .nojekyll
3. Open repository Settings → Pages.
4. Under Build and deployment choose **Deploy from a branch**.
5. Choose `main` and `/(root)`, then Save.
6. Wait for GitHub to show the published URL.

The resulting URL will normally look like:
`https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/`

## Important
This version is designed for the published HTTPS GitHub Pages URL. Do not use local `file://` behavior as the acceptance test for the image-loading path.

The game itself is static. Player headshots are displayed from PGA TOUR's standardized headshot service.
