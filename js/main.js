import '../scss/style.scss'
import { bootstrapCameraKit, createMediaStreamSource, Transform2D, remoteApiServicesFactory, Injectable, estimateLensPerformance } from '@snap/camera-kit';

//TODO: comment as needed, only for debug, remove from prod
import { Push2Web } from '@snap/push2web';



/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
//vars

//camkit config
//TODO: set apiToken to final CamKit token
const configuration = {
    apiToken: 'eyJhbGciOiJIUzI1NiIsImtpZCI6IkNhbnZhc1MyU0hNQUNQcm9kIiwidHlwIjoiSldUIn0.eyJhdWQiOiJjYW52YXMtY2FudmFzYXBpIiwiaXNzIjoiY2FudmFzLXMyc3Rva2VuIiwibmJmIjoxNzQ0NDkyMDE3LCJzdWIiOiI4MzdmOTA0Yy1jYTU4LTQ2OWEtOWExNi1hN2ZkNTc0MjM4ZmV-U1RBR0lOR340YzI0MGU2NC0zOTQ4LTQxOGYtOGM2OS0wZTU1MDA3MTQ3NTUifQ.Y7QGwmP1OHx_BXD3TIAqv9sMaxlOogcQE0q5g08SHJw',
    logger: 'console',
}

//TODO: set api IDs to final CamKit values
var apiSpecId = '4bcc807f-59c5-4596-9535-f4489b829fff'; //api spec id for Snap Remote API, currently hosted on House of V account  //TODO: switch out

var lensCurrent = 0;
var lenses = [
    { lensId: 'cba3e43c-a01b-43cf-b203-91c5931d2cbd', groupId: 'a32e98c9-24b1-4039-b57a-2785f5abed01', camera: 'back'}, //dev    
    // { lensId: '728a5dca-413a-4450-8603-84be19068f3d', groupId: 'a32e98c9-24b1-4039-b57a-2785f5abed01', camera: 'back'}, //staging
];
var lensId = lenses[0].lensId;
var groupId = lenses[0].groupId;

//TODO: set resource URL Prefix
// const resourceURLPrefix = 'https://snap-castgame-staging-59ca3a0b5639.herokuapp.com';
// const resourceURLPrefix = 'https://snap-castgame-dev-31ea29a7d9cf.herokuapp.com';
const resourceURLPrefix = '';


/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
//util

//phone check
function phoneCheck(){
    const userAgentCheck = /Android|iPhone|iPod|Opera Mini|IEMobile|BlackBerry|webOS/i.test(navigator.userAgent);
    const touchCheck = ('ontouchstart' in window || navigator.maxTouchPoints > 0);
    return userAgentCheck && touchCheck;
}
const isOnPhone = phoneCheck();

const isIOS = () => {
    return /iPhone|iPad|iPod/.test(navigator.userAgent);
}



/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
//init

var userAuthenticatedSuccess = false; //user authentication boolean is initially set to false

const canvas = document.getElementById('castGame-cameraKit');
const content = document.querySelector('.castGame-content');
const loaderContainer = document.querySelector('.castGame-loaderContainer');
const errorContainer = document.getElementById('castGame-errorContainer');
const errorMessage = document.getElementById('castGame-errorMessage');
const errorMessageButton = document.getElementById('castGame-errorContainerButton');

const init = async () => {
  try {
    //initialize canvas size
    let width, height;
    if (window.visualViewport) {
        //for devices that support visualViewport, such as iOS Safari
        width = window.visualViewport.width;
        height = window.visualViewport.height;
    } else {
        //fallback to window.innerWidth and documentElement.clientHeight for desktop
        width = window.innerWidth;
        height = document.documentElement.clientHeight;
    }

    canvas.width = width;
    canvas.height = height;

    //try initializing cameraKit
    await cameraKitInit();

    content.style.display = 'block';
    loaderContainer.style.display = 'none';  

  } catch (error) {
    //error
    console.error('Error during cameraKitInit:', error);
    errorMessage.innerHTML = 'There was an error loading the site.';

    //displays an error message if cameraKit initialization fails
    loaderContainer.style.display = 'none';
    errorContainer.style.display = 'flex';

  }

};

//reload button
errorMessageButton.addEventListener('click', (e) => {
    e.preventDefault();
    location.reload();

});



/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
//remote api

const castGameService = {
    apiSpecId: apiSpecId,

    getRequestHandler(request) {
        console.log(request);

        //endpoints
        if (request.endpointId == 'processRequest'){
            var payload = JSON.parse(request.parameters.payload);
            var response = { 'success': false };

            //
            if(payload.function != null){

                if(payload.function == 'analytics'){
                    if(payload.event != null){
                        analytics(payload.event);
                        response = { 'success': true };
                    }

                }else if(payload.function == 'log'){
                    if(payload.log != null){
                        console.log(payload.log);
                        response = { 'success': true };
                    }

                }else if(payload.function == 'prize'){
                    if(payload.prize != null){
                        //TODO: get prize
                        response = { 'success': true };
                    }

                }

            }
            //
            return (reply) => {
                reply({
                    status: 'success',
                    metadata: {},
                    body: new TextEncoder().encode(JSON.stringify(response)),
                })
            };             

        } else {
            return;

        }

    },

};  



/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
//camera kit

var cameraKit, cameraKitSession, extensions, push2Web, stream, source, lens;

const mobileVideoSourceMaxWidth = 512; //max width of render target for canvas.  optimization technique for fps.


const cameraKitInit = async () => {

    //extensions
    try {
        push2Web = new Push2Web();

        extensions = (container) => container.provides(push2Web.extension).provides(
            Injectable(
                remoteApiServicesFactory.token,
                [remoteApiServicesFactory.token],
                (existing) => [...existing, castGameService]
            )
        );

    }catch(e) {
        extensions = (container) => container.provides(
            Injectable(
                remoteApiServicesFactory.token,
                [remoteApiServicesFactory.token],
                (existing) => [...existing, castGameService]
            )
        );

    }

    //
    cameraKit = await bootstrapCameraKit(configuration, extensions);

    cameraKitSession = await cameraKit.createSession({ liveRenderTarget: canvas });
    cameraKitSession.events.addEventListener('error', (event) => {
    if (event.detail.error.name === 'LensExecutionError') {
        console.log(
        'The current Lens encountered an error and was removed.',
        event.detail.error
        );
    }
    });

    await createStreamSource();

    lens = await cameraKit.lensRepository.loadLens(
        lensId,
        groupId
    );

    await cameraKitApply();

}

var createStreamFacingMode = 'environment';
var createStreamCameraType = 'back';
let isBackFacing = true;

const createStreamSource = async () => {
    stream = await navigator.mediaDevices.getUserMedia({
        video:
            {
                width: { ideal: 512 },
                height: { ideal: 270 },
                facingMode: 'environment',
            },
            audio: false,
        }
    );

    source = createMediaStreamSource(stream, {
        // transform: Transform2D.MirrorX, //only for sellfie
        cameraType: 'back',
        fpsLimit: 24,
    });
    await cameraKitSession.setSource(source);
    await cameraKitSession.setFPSLimit(24);

}

const cameraKitApply = async () => {
    await cameraKitSession.applyLens(lens);
    await cameraKitSession.play('live');
    // await cameraKitSession.play('capture');

    if(push2Web != null){
        var push2WebAccessToken = '';
        const urlParams = new URLSearchParams(window.location.search);
        if(urlParams.get('access_token')){
            push2WebAccessToken = urlParams.get('access_token');
        }
    
        push2Web.subscribe(
            push2WebAccessToken,
            cameraKitSession,
            cameraKit.lensRepository
        );

    }

    /////////////////////////////////////////////////////////////////////////////////////
    //resize

    //debounce function
    const debounce = (func, delay) => {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => func(...args), delay);
        };
    };

    //function to get the appropriate width and height
    //need this to deal with iOS's janky viewport
    const getRenderSize = () => {
        let width, height;

        if (window.visualViewport) {
            //for devices that support visualViewport, such as iOS Safari
            width = window.visualViewport.width;
            height = window.visualViewport.height;

        } else {
            //allback to window.innerWidth and documentElement.clientHeight for desktop
            width = window.innerWidth;
            height = document.documentElement.clientHeight;

        }

        return { width, height };

    };

    //optimized canvas resizing
    const resizeCanvas = () => {
        if (source) {
            const { width, height } = getRenderSize();

            var newWidth = width;
            var newHeight = height;

            if(isOnPhone && newWidth > mobileVideoSourceMaxWidth){
                newWidth = mobileVideoSourceMaxWidth;

                var ratio = mobileVideoSourceMaxWidth / width;
                newHeight = newHeight * ratio;
            }
            
            source.setRenderSize(newWidth, newHeight);
            //considered a window.devicePixelRatio, however there is a trade off between ML resources fps vs quality.  Going with fps for this one.
            // source.setRenderSize(newWidth * window.devicePixelRatio, newHeight * window.devicePixelRatio);

        }

    };

    // debounce function to limit the number of resize calls
    const debouncedResizeCanvas = debounce(resizeCanvas, 500);
    window.addEventListener('resize', debouncedResizeCanvas);
    window.addEventListener('orientationchange', debouncedResizeCanvas);

    // initial canvas resize
    resizeCanvas();
    debouncedResizeCanvas();

    //
    if(isOnPhone){
        document.addEventListener("visibilitychange", async () => {
            if(cameraKitSession != null && stream != null){
                if (document.hidden) {
                    cameraKitSession.pause('live');
                    // cameraKitSession.pause('capture');
                    cameraKitSession.mute();
        
                    stream.getTracks().forEach(track => track.stop());
        
                } else {
                    cameraKitSession.play('live');
                    // cameraKitSession.play('capture');
                    cameraKitSession.unmute();
        
                    await createStreamSource();
        
                    resizeCanvas();

                    if(isIOS() && audioCtx != null){             
                        if(audioCtx.state == "interrupted" || audioCtx.state == 'suspended' || audioCtx.state == 'closed') {
                            unmuteBtn.style.display = 'block';
                        }else{
                            unmuteBtn.style.display = 'none';
                        }
                        
                    }
        
                }

            }

        });    

    }

    await sleep(250);

}



/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
//unmute for iOS

const audioCtx = new ( window.AudioContext || window.webkitAudioContext )();
const unmuteBtn = document.querySelector('.castGame-unmuteButton');

unmuteBtn.addEventListener('click', (e) => {
    e.preventDefault();
    unmuteBtn.style.display = 'none';

    if(audioCtx != null){
        if(audioCtx.state == "interrupted" || audioCtx.state == 'suspended' || audioCtx.state == 'closed') {
            audioCtx.resume().then(() => play());
        }
    }

});



/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
//analytics

//events:
// Lens Start

function analytics(event){
    //TODO: add chips ahoy anayltics logic
    console.log('Analytic Event: ' + event);
}



/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
//init

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

init();





/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
//init

// // device maps
// const iosDeviceMapping = new Map([
//   ["320x480", "IPhone 4S, 4, 3GS, 3G, 1st gen"],
//   ["320x568", "IPhone 5, SE 1st Gen,5C, 5S"],
//   ["375x667", "IPhone SE 2nd Gen, 6, 6S, 7, 8"],
//   ["375x812", "IPhone X, XS, 11 Pro, 12 Mini, 13 Mini"],
//   ["390x844", "IPhone 13, 13 Pro, 12, 12 Pro"],
//   ["414x736", "IPhone 8+"],
//   ["414x896", "IPhone 11, XR, XS Max, 11 Pro Max"],
//   ["428x926", "IPhone 13 Pro Max, 12 Pro Max"],
//   ["476x847", "IPhone 7+, 6+, 6S+"],
//   ["744x1133", "IPad Mini 6th Gen"],
//   [
//     "768x1024",
//     "IPad Mini (5th Gen), IPad (1-6th Gen), iPad Pro (1st Gen 9.7), Ipad Mini (1-4), IPad Air(1-2)  ",
//   ],
//   ["810x1080", "IPad 7-9th Gen"],
//   ["820x1180", "iPad Air (4th gen)"],
//   ["834x1194", "iPad Pro (3-5th Gen 11)"],
//   ["834x1112", "iPad Air (3rd gen), iPad Pro (2nd gen 10.5)"],
//   ["1024x1366", "iPad Pro (1-5th Gen 12.9)"],
// ]);

// const desktopDeviceMapping = new Map([
//   ["Win32", "Windows"],
//   ["Linux", "Linux"],
//   ["MacIntel", "Mac OS"],
// ]);


// // get device name for android
// const getAndroidDeviceName = () => {
//   const androidUserAgentString = window.navigator.userAgent.slice(window.navigator.userAgent.indexOf("Android"));
//   const androidDeviceName = androidUserAgentString.slice(androidUserAgentString.indexOf("; ") + 1, androidUserAgentString.indexOf(")"));
//   if (androidDeviceName) {
//     return androidDeviceName.trim().split(" ")[0];
//   }

//   return "Android";
// };

// // get device name for ios
// const getIosDeviceName = () => {
//   const screenResolution = window.screen.width + 'x' + window.screen.height;
//   const device = iosDeviceMapping.get(screenResolution);
//   if (device) {
//     return device;
//   }
//   return "Iphone";
// };

// // get device name for desktop
// const getDesktopDeviceName = () => {
//   const platform = navigator.userAgentData.platform || navigator.platform || "unknown";
//   const device = desktopDeviceMapping.get(platform) || "Unknown";
//   return device;
// };

// // get device name utility
// export default function getDeviceName() {
//   let device = "";
  
//   // check if mobile device
//   const isMobileDevice = window.navigator.userAgent
//     .toLowerCase()
//     .includes("mobi");

//   if (isMobileDevice) {
//     if (window.navigator.userAgent.includes("Android")) {
//       device = getAndroidDeviceName();
//     } else {
//       device = getIosDeviceName();
//     }
//   } else {
//     const device = getDesktopDeviceName();
//   }
  
//   return device;
// }

// console.log(getDeviceName())