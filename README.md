# Snap-ChipsAhoyStrangerThings
 
# Local Run
npm install
##
npm run dev
##
https://localhost:5174/

# QA
Run both this and the Snap-ChipsAhoyStrangerThigs-App.
##
Browse on https://localhost:5173/ for testing, which is the parent iframe.

# Push2Web
Uncomment Push2Web import in /js/main.js
##
Browse to https://localhost:5174/login.html
##
Login using standard profile.
##
Click Launch app with Push2Web.
##
Access Token is appended to URL.
##
Verify that LS is logged in to standard profile.
##
Push using Send to All Camera Kit.
##
Embedded CamKit will auto refresh to new version.
##
For production deployment, comment out Push2Web import.

# Deployment
There are a few Cloudfront/S3 setup.##
##
Dev App
##
https://d35pw8pv3cjm4w.cloudfront.net
##
aws s3 sync . s3://snap-castgame-dev-app --delete
##
Dev
##
https://d9lrq2zcrni65.cloudfront.net
##
aws s3 sync . s3://snap-castgame-dev --delete
##
Staging App
##
https://d3uxwr4aqlghjh.cloudfront.net
##
aws s3 sync . s3://snap-castgame-staging-app --delete
##
Staging
##
https://d27tnv7pk7wn11.cloudfront.net
##
aws s3 sync . s3://snap-castgame-staging --delete