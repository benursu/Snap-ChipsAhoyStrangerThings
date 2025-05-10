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
        if (request.endpointId == 'user_login'){
                   

        } else if (request.endpointId == 'analytics'){
            //analytics
            analytics(request.parameters.event);

            return (reply) => {
                reply({
                    status: 'success',
                    metadata: {},
                    body: new TextEncoder().encode('{ "analytics": true }'),
                })
            };                


        } else if (request.endpointId == 'loadResource'){
            //loadResource to byteArray
            return async (reply) => {
                var resource = await downloadResource(request.parameters.url);

                reply({
                    status: 'success',
                    metadata: {},
                    body: new Uint8Array(resource),
                })
            };                

        } else {
            return;

        }

    },

};  

async function downloadResourceToByteArray(url, onProgress) {
    const response = await fetch(resourceURLPrefix + url);
    const reader = response.body.getReader();
    const contentLength = +response.headers.get('Content-Length');
    let receivedLength = 0;
    const chunks = [];
  
    while (true) {
      const { done, value } = await reader.read();
  
      if (done) {
        break;
      }
  
      chunks.push(value);
      receivedLength += value.length;
  
      onProgress({
        received: receivedLength,
        total: contentLength,
        percent: contentLength ? (receivedLength / contentLength) * 100 : null,
      });
    }
  
    const allChunks = new Uint8Array(receivedLength);
    let position = 0;
  
    for (const chunk of chunks) {
      allChunks.set(chunk, position);
      position += chunk.length;
    }
  
    return allChunks.buffer;

}

async function downloadResource(url) {
    try {
        var byteArrayFinal = null;

        const byteArray = await downloadResourceToByteArray(url, (progress) => {
            // if (progress.total) {
            //     console.log(`Downloaded ${progress.received} bytes of ${progress.total} bytes (${progress.percent.toFixed(2)}%)`);
            // } else {
            //     console.log(`Downloaded ${progress.received} bytes`);
            // }
        })
        .then((buffer) => {
            const byteArray = new Uint8Array(buffer);
            byteArrayFinal = byteArray;

        })
        .catch((error) => {
            console.error('Fetch error:', error);
            return false;
        });

        return byteArrayFinal;

    } catch (error) {
        console.error("Error fetching or converting the image:", error);
        return null;

    }    

}



/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
//camera kit

var cameraKit, cameraKitSession, extensions, push2Web, stream, source, lens;

const termsContainer = document.getElementById('castGame-termsContainer');
const termsAgreeButton = document.getElementById('castGame-termsAgreeButton');
const termsDismissButton = document.getElementById('castGame-termsDismissButton');
const termsExpirationDuration = 1000 * 60 * 60 * 12; // 12 hours

const mobileVideoSourceMaxWidth = 1024; //max width of render target for canvas.  optimization technique for fps.

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

if(lenses[0].camera == 'front'){
    createStreamFacingMode = 'user';
    createStreamCameraType = 'front';
    isBackFacing = false;
}

const createStreamSource = async () => {
    stream = await navigator.mediaDevices.getUserMedia({
        video:
            {
                width: { ideal: 1280 },
                height: { ideal: 720 },
                facingMode: 'environment',
            },
            audio: false,
        }
    );

    source = createMediaStreamSource(stream, {
        transform: Transform2D.MirrorX,
        cameraType: 'back',
        fpsLimit: 30,
    });
    await cameraKitSession.setSource(source);
    await cameraKitSession.setFPSLimit(30);

}

const cameraKitApply = async () => {
    await cameraKitSession.applyLens(lens);
    await cameraKitSession.play('live');
    await cameraKitSession.play('capture');

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

    //
    if(isOnPhone){
        document.addEventListener("visibilitychange", async () => {
            if(cameraKitSession != null && stream != null){
                if (document.hidden) {
                    cameraKitSession.pause('live');
                    cameraKitSession.pause('capture');
                    cameraKitSession.mute();
        
                    stream.getTracks().forEach(track => track.stop());
        
                } else {
                    cameraKitSession.play('live');
                    cameraKitSession.play('capture');
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
