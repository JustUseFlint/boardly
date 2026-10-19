#!/bin/sh
# npm run build && sh deploy.sh
cd dist && touch .nojekyll && rm -rf .git && git init -q -b gh-pages && git add -A && git -c user.name=JustUseFlint -c user.email=JustUseFlint@users.noreply.github.com commit -qm deploy && git -c credential.helper= -c "credential.helper=!$(which gh) auth git-credential" push -fq https://github.com/JustUseFlint/boardly.git gh-pages
