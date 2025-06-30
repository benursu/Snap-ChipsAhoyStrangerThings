# Snap-ChipsAhoyStrangerThings
 
# Local Run
npm install<br/>
npm run dev<br/>
https://localhost:5174/<br/>

# QA
Run both this and the Snap-ChipsAhoyStrangerThigs-App.<br/>
Browse on https://localhost:5173/ for testing, which is the parent iframe.<br/>

# Push2Web
Uncomment Push2Web import in /js/main.js<br/>
Browse to https://localhost:5174/login.html<br/>
Login using standard profile.<br/>
Click Launch app with Push2Web.<br/>
Access Token is appended to URL.<br/>
Verify that LS is logged in to standard profile.<br/>
Push using Send to All Camera Kit.<br/>
Embedded CamKit will auto refresh to new version.<br/>
For production deployment, comment out Push2Web import.<br/>

# Deployment
There are a few Cloudfront/S3 setup.<br/>
<br/>
Dev App<br/>
https://d35pw8pv3cjm4w.cloudfront.net<br/>
aws s3 sync . s3://snap-castgame-dev-app --delete<br/>
<br/>
Dev<br/>
https://d9lrq2zcrni65.cloudfront.net<br/>
aws s3 sync . s3://snap-castgame-dev --delete<br/>
<br/>
Staging App<br/>
https://d3uxwr4aqlghjh.cloudfront.net<br/>
aws s3 sync . s3://snap-castgame-staging-app --delete<br/>
<br/>
Staging<br/>
https://d27tnv7pk7wn11.cloudfront.net<br/>
aws s3 sync . s3://snap-castgame-staging --delete<br/>