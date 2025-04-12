# Snap-ChipsAhoyStrangerThings
 
# Local Run
npm install
npm run dev
http://localhost:5173/


# Heroku Create
heroku apps:create snap-chipsahoystrangerthings
https://snap-chipsahoystrangerthings-e2b6c0246458.herokuapp.com/ 

## Heroku Create Prod
heroku buildpacks:set heroku/nodejs -a snap-chipsahoystrangerthings
heroku config:set NPM_CONFIG_PRODUCTION=false YARN_PRODUCTION=false
git push heroku main
https://snap-chipsahoystrangerthings-e2b6c0246458.herokuapp.com/ 

## Heroku Create Stage
heroku buildpacks:set heroku/nodejs -a snap-chipsahoystrangerthings-staging
heroku create --remote staging snap-chipsahoystrangerthings-staging
git push staging main
https://snap-chipsahoystrangerthings-staging-830396e11f4a.herokuapp.com/ 


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

