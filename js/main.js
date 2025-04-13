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
    // logger: 'console',
}

//TODO: set api IDs to final CamKit values
var lensId = 'f85f5280-9afc-4ed5-ae53-c8b60a2e2941'; //staging
var groupId = 'f4bb30fc-3974-4765-b570-3e25b69a102d';
var apiSpecId = '4bcc807f-59c5-4596-9535-f4489b829fff'; //api spec id for Snap Remote API, currently hosted on House of V account  //TODO: switch out



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

//keys for flavor profile
const cokecastGameServiceKeys = [
    { id: 'mode' },
    { id: 'flavor0' },
    { id: 'flavor1' },
    { id: 'flavor2' },
    { id: 'flavor0_percentage' },
    { id: 'flavor1_percentage' },
    { id: 'flavor2_percentage' },
    { id: 'product' },
    { id: 'food' },
];

const cokecastGameService = {
    apiSpecId: apiSpecId,

    getRequestHandler(request) {
        console.log("--------------------------------------");
        console.log(request);
        console.log("--------------------------------------");

        //endpoints
        if (request.endpointId == 'user_login'){
            //open user login
            userLogin();

            return (reply) => {
                reply({
                    status: 'success',
                    metadata: {},
                    body: new TextEncoder().encode('{ "user_login": true }'),
                })
            };

        } else if (request.endpointId == 'user_authenticated'){
            //check for userAuthenticatedSuccess, checked on an interval
            return (reply) => {
                reply({
                    status: 'success',
                    metadata: {},
                    body: new TextEncoder().encode('{ "user_authenticated": ' +  userAuthenticatedSuccess + ' }'),
                })
            };          

        } else if (request.endpointId == 'capture_photo'){
            //capture photo
            capturePhoto();

            return (reply) => {
                reply({
                    status: 'success',
                    metadata: {},
                    body: new TextEncoder().encode('{ "capture_photo": true }'),
                })
            };     

        } else if (request.endpointId == 'profile_set'){
            //profile set
            //localStorage
            cokecastGameServiceKeys.forEach((key, i) => {
                if(request.parameters[key.id] != null){
                    localStorage.setItem(key.id, request.parameters[key.id]);
                }
            });

            return (reply) => {
                reply({
                    status: 'success',
                    metadata: {},
                    body: new TextEncoder().encode('{ "profile_set": true }'),
                })
            };                

        } else if (request.endpointId == 'profile_get'){
            //profile get
            const results = {};
            
            cokecastGameServiceKeys.forEach(key => {
                const value = localStorage.getItem(key.id);
                if (value !== null && value.trim() !== '') {
                    results[key.id] = isNaN(value) ? value : Number(value);
                }
            });

            const profile = results ? JSON.stringify(results, null, 2) : '{}';

            return (reply) => {
                reply({
                    status: 'success',
                    metadata: {},
                    body: new TextEncoder().encode(profile),
                })
            };                

        } else if (request.endpointId == 'profile_clear'){
            //profile clear
            cokecastGameServiceKeys.forEach(key => {
                localStorage.removeItem(key.id);
            });

            return (reply) => {
                reply({
                    status: 'success',
                    metadata: {},
                    body: new TextEncoder().encode('{ "profile_clear": true }'),
                })
            };                

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


        } else if (request.endpointId == 'get_image'){
            print('get_image')

            return (reply) => {
                reply({
                    status: 'success',
                    metadata: {},
                    body: new TextEncoder().encode('{ "get_image": true }'),
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
                (existing) => [...existing, cokecastGameService]
            )
        );

    }catch(e) {
        extensions = (container) => container.provides(
            Injectable(
                remoteApiServicesFactory.token,
                [remoteApiServicesFactory.token],
                (existing) => [...existing, cokecastGameService]
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

    var termsValid = false;
    const termsAcceptDate = localStorage.getItem('termsAcceptDate');
    const currentTime = new Date().getTime();
    if(termsAcceptDate == null) {
        //not valid
    }else{
        //check if valid
        if(currentTime - termsAcceptDate > termsExpirationDuration){
            //expired terms
        }else{
            //valid terms
            termsValid = true;
        }
    }

    if(termsValid){
        await cameraKitApply();
    }else{
        termsContainer.style.display = 'flex';
    }

}

const createStreamSource = async () => {
    stream = await navigator.mediaDevices.getUserMedia({
        video:
            {
                width: { ideal: 1280 },
                height: { ideal: 720 }
            },
            audio: false
        }
    );

    source = createMediaStreamSource(stream, {
        transform: Transform2D.MirrorX,
        cameraType: 'front',
        fpsLimit: 30,
        cameraType: 'user'
    });
    await cameraKitSession.setSource(source);

}

termsAgreeButton.addEventListener('click', async(e) => {    
    e.preventDefault();

    const currentTime = new Date().getTime();
    localStorage.setItem('termsAcceptDate', currentTime);

    termsContainer.style.display = 'none';
    await cameraKitApply();

    analytics('Terms Agree');

}); 

termsDismissButton.addEventListener('click', async(e) => {    
    e.preventDefault();

    termsContainer.style.display = 'none';

    errorMessage.innerHTML = 'The site could not be loaded.';
    errorContainer.style.display = 'flex';

});

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
//user

const authArea = document.getElementById('castGame-tempAuthContainer');
const authCloseButton = document.getElementById('castGame-closeAuthButton');

//
const userLogin = async () => {
    if(!userAuthenticatedSuccess){
        window.userAuthenticationShow();
    }

}

//
authCloseButton.addEventListener('click', (e) => {
    e.preventDefault();

    window.userAuthenticationHide();
    window.userAuthenticationSuccess();

}); 

window.userAuthenticationShow = async () => {
    //TODO: show user auth form
    authArea.style.display = 'flex';
}

window.userAuthenticationHide = async () => {
    //TODO: hide user auth form
    authArea.style.display = 'none';
}

window.userAuthenticationSuccess = async () => {
    //TODO: replace this with actual user login permission results.  if login is successful set "userAuthenticatedSuccess = true". userAuthenticatedSuccess is checked on an inteveral during authentication mode in the lens.
    console.log('User has succesfully authenticated');
    userAuthenticatedSuccess = true;

}



/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
//capture photo

const imageContainer = document.getElementById('castGame-imageContainer');
const closeImageBtn = document.querySelector('.castGame-closeImageBtn');

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

//
const capturePhoto = async () => {
    const dataUrl = cameraKitSession.output.capture.toDataURL('image/png');

    //create the image
    const imageElement = document.createElement('img');
    imageElement.src = dataUrl;
    imageElement.alt = 'Chips Ahoy! Stranger Things';
    imageContainer.appendChild(imageElement); 
    imageContainer.style.display = 'flex';

    //setup download button on desktop
    //on mobile, this doesn't need to happen. A Touch and hold will be used instead
    const tapBtn = document.querySelector('.castGame-tap');

    if (!isOnPhone) {
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'Chips Ahoy! Stranger Things.png';
              
        tapBtn.style.pointerEvents = 'auto';
        //change button text for click instead of hold
        tapBtn.querySelector('.castGame-tap p strong').textContent = 'Click Here';
        tapBtn.querySelector('.castGame-tap p').childNodes[1].textContent = 'To Save Your Photo';
        //event listener to start download on desktop
        tapBtn.addEventListener('click', () => {
            //trigger the download by simulating a click on the anchor
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            tapBtn.querySelector('.castGame-tap p strong').textContent = "Your Photo";
            tapBtn.querySelector('.castGame-tap p').childNodes[1].textContent = "Has Been Downloaded";

            analytics('Capture Download Desktop');

        });

    }else{
        tapBtn.addEventListener('click', () => {
            analytics('Capture Download Mobile');

        });

    }

}

//
closeImageBtn.addEventListener('click', (e) => {
    e.preventDefault();

    imageContainer.style.display = 'none';
    //remove the last image from the DOM
    imageContainer.querySelector('img').remove();

    analytics('Capture Complete');

});



/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
//unmute for iOS

const audioCtx = new ( window.AudioContext || window.webkitAudioContext )();
const unmuteBtn = document.querySelector('.castGame-unmuteButton');

unmuteBtn.addEventListener('click', (e) => {
    e.preventDefault();
    // unmuteBtn.style.display = 'none';

    // if(audioCtx != null){
    //     if(audioCtx.state == "interrupted" || audioCtx.state == 'suspended' || audioCtx.state == 'closed') {
    //         audioCtx.resume().then(() => play());
    //     }
    // }

    changeLens();

});

unmuteBtn.style.display = 'block';

var counter = 0;

const changeLens = async () => {

    if(counter == 0){
        lensId = '43276930875';
        groupId = 'b3bcab54-2bfe-4b99-93bd-31b106ee6c56';
    
    }else if(counter == 1){
        lensId = '43288930875';
        groupId = 'b3bcab54-2bfe-4b99-93bd-31b106ee6c56';
    
    }
    counter++;

    lens = await cameraKit.lensRepository.loadLens(
        lensId,
        groupId
    );

    await cameraKitApply();

}

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
