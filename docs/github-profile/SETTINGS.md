GitHub profile settings for half-stache
Set by hand at https://github.com/settings/profile unless noted.

PROFILE FIELDS

Display name:
Sam Hutcherson

Bio (one sentence, under the 160-character limit):
I'm a mechanical engineer by degree and a software developer by trade; I build iOS apps, small-business websites, and a Little Red River hydrology model.

Company:
Hutchware LLC

Location:
your call

Website:
https://half-stache.github.io

Social accounts (two entries):
https://open.spotify.com/artist/2EEOIWtPu49X7MN430bNVI
https://www.youtube.com/@sam-hutch

Public email (optional):
halfstache@hotmail.com
GitHub only lists a verified address here. Add it under Settings > Emails, verify it, then pick it under "Public email". If you skip this, the README still carries the address.

Avatar:
Recommended: your photo.
Reason: the README already leads with the mark, so a photo beside it shows the real mustache the mark comes from, and a face is what people expect next to commits, reviews, and comments.
Alternative: https://half-stache.github.io/brand/avatar-1024.png. GitHub takes an uploaded file, not a URL, so use the PNG from the brand folder in the site repository until the site is live.

CREATE THE PROFILE REPOSITORY

1. Signed in as half-stache, open https://github.com/new
2. Owner: half-stache. Repository name: half-stache (it must match the username exactly; GitHub shows a "You found a secret!" banner to confirm it is the profile repository).
3. Description: leave empty.
4. Visibility: Public. A private profile repository is not shown on the profile page.
5. Check "Add a README file". Leave .gitignore at None and License at None, so README.md is the only file.
6. Click "Create repository".
7. In the new repository open README.md, click the pencil icon to edit, select all, paste the full contents of the README.md written here, and click "Commit changes". Message: Add profile README. Commit directly to main.
8. Open https://github.com/half-stache and confirm the README appears above the pinned repositories. Check it under both themes (Settings > Appearance). The mark image resolves only after half-stache.github.io is live; until then its space is empty, which is expected.
9. Optional, under the repository's Settings > General: uncheck Issues, Projects, Wiki, and Discussions so the repository stays a single file.

Command-line alternative to steps 1 to 7, from a folder containing only README.md:
  git init -b main
  git add README.md
  git commit -m "Add profile README"
  gh repo create half-stache/half-stache --public --source=. --push

PINS

1. On https://github.com/half-stache click "Customize your pins".
2. Check half-stache/half-stache.github.io and save. It goes first: it is the site, and the only public code at the moment.
3. Do not pin half-stache/half-stache; its README is already the top of the page.
4. Only public repositories can be pinned, so the other projects are not pinnable while they stay private.

NOTES

GitHub serves README images through its image proxy and caches them. If a mark file changes later, append a query string to its URL in the README (for example ?v=2) to force a refresh.
