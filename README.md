# Snap-ChipsAhoyStrangerThings
 
# Local Run
npm install
npm run dev
http://localhost:5173/


# Heroku Create Prod
heroku apps:create snap-castgame
heroku buildpacks:set heroku/nodejs -a snap-castgame
heroku config:set NPM_CONFIG_PRODUCTION=false YARN_PRODUCTION=false
git push heroku main
TODO https://snap-castgame-e2b6c0246458.herokuapp.com/

## Heroku Create Stage
heroku create --remote staging snap-castgame-staging
heroku buildpacks:set heroku/nodejs -a snap-castgame-staging
heroku config:set NPM_CONFIG_PRODUCTION=false YARN_PRODUCTION=false
git push staging main
https://snap-castgame-staging-59ca3a0b5639.herokuapp.com/


# Heroku Deploy Prod
git push heroku main

# Heroku Deploy Staging
git push staging main


# Push2Web
Uncomment Push2Web import in /js/main.js
Browse to http://localhost:5173/login.html
Login using standard profile.
Click Launch app with Push2Web.
Access Token is appended to URL.
Verify that LS is logged in to standard profile.
Push using Send to All Camera Kit.
Embedded CamKit will auto refresh to new version.
For production deployment, comment out Push2Web import.

