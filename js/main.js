import '../scss/style.scss'
import { bootstrapCameraKit, createMediaStreamSource, createImageSource, Transform2D, remoteApiServicesFactory, Injectable, estimateLensPerformance } from '@snap/camera-kit';

//TODO: comment as needed, only for debug, remove from prod
import { Push2Web } from '@snap/push2web';



/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
//config

//TODO: set configs

const serverVersion = 0.1;

const camKitConfiguration = {
    apiToken: 'eyJhbGciOiJIUzI1NiIsImtpZCI6IkNhbnZhc1MyU0hNQUNQcm9kIiwidHlwIjoiSldUIn0.eyJhdWQiOiJjYW52YXMtY2FudmFzYXBpIiwiaXNzIjoiY2FudmFzLXMyc3Rva2VuIiwibmJmIjoxNzQ0NDkyMDE3LCJzdWIiOiI4MzdmOTA0Yy1jYTU4LTQ2OWEtOWExNi1hN2ZkNTc0MjM4ZmV-U1RBR0lOR340YzI0MGU2NC0zOTQ4LTQxOGYtOGM2OS0wZTU1MDA3MTQ3NTUifQ.Y7QGwmP1OHx_BXD3TIAqv9sMaxlOogcQE0q5g08SHJw', //apiToken to final CamKit token
    logger: 'console',
}

const camKitApiSpecId = '4bcc807f-59c5-4596-9535-f4489b829fff'; //api spec id for Snap Remote API

// const lensId = 'cba3e43c-a01b-43cf-b203-91c5931d2cbd'; //dev
// const lensId = '728a5dca-413a-4450-8603-84be19068f3d'; //staging
const lensId = '8f65b735-e3cd-4fef-a584-ee93fc03da23'; //alpha

const groupId = 'a32e98c9-24b1-4039-b57a-2785f5abed01'; //dev,staging,alpha

//full HTTPS location of assets for CamKit canvas game
// const serverResourceURLPrefix = 'https://snap-castgame-staging-59ca3a0b5639.herokuapp.com';
const serverResourceURLPrefix = 'https://snap-castgame-dev-31ea29a7d9cf.herokuapp.com';



/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
//util

//phone check
const phoneCheck = () => {
    const userAgentCheck = /Android|iPhone|iPod|Opera Mini|IEMobile|BlackBerry|webOS/i.test(navigator.userAgent);
    const touchCheck = ('ontouchstart' in window || navigator.maxTouchPoints > 0);
    return userAgentCheck && touchCheck;
}
const isPhone = phoneCheck();

const isIOS = () => {
    return /iPhone|iPad|iPod/.test(navigator.userAgent);
}



/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
//init

const canvas = document.getElementById('castGame-cameraKit');
const content = document.querySelector('.castGame-content');
const loaderContainer = document.querySelector('.castGame-loaderContainer');
const errorContainer = document.getElementById('castGame-errorContainer');
const errorMessage = document.getElementById('castGame-errorMessage');

const init = async () => {
  try {
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

    console.log('1')
    canvas.width = width;
    canvas.height = height;

    console.log('2')
    await cameraKitInit();
    console.log('3')

    content.style.display = 'block';
    loaderContainer.style.display = 'none';  

  } catch (error) {
    console.log('4')
    //error
    console.error('Error during cameraKitInit:', error);
    errorMessage.innerHTML = 'There was an error loading the site.';

    //displays an error message if cameraKit initialization fails
    loaderContainer.style.display = 'none';
    errorContainer.style.display = 'flex';

  }

};



/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
//remote api

const castGameService = {
    apiSpecId: camKitApiSpecId,

    getRequestHandler(request) {
        console.log(request);

        //endpoints
        if (request.endpointId == 'processRequest'){
            var payload = JSON.parse(request.parameters.payload);
            var response = { 'success': false };

            //
            if(payload.function != null){

                //analytics
                if(payload.function == 'analytics'){
                    //TODO: setup analtyic call
                    if(payload.event != null){
                        console.log('Analytics Event: ' + payload.event);
                        response = { 'success': true };
                    }

                //log
                }else if(payload.function == 'log'){
                    if(payload.log != null){
                        console.log('Log: ' + payload.log);
                        response = { 'success': true };
                    }

                //error
                }else if(payload.function == 'error'){
                    //TODO: hookup an error logger
                    if(payload.error != null){
                        console.log('Error: ' + payload.error);
                        response = { 'success': true };
                    }

                //config
                }else if(payload.function == 'config'){
                    //TODO: setup config for resources
                    response = { 'serverVersion': serverVersion, 'serverResourceURLPrefix': serverResourceURLPrefix, 'success': true };

                //prize
                }else if(payload.function == 'prize'){
                    //TODO: always respond with 200 and success true
                    if(payload.tier != null){
                        console.log('Prize: Submit ' + payload.tier);
                        response = { 'success': true };
                    }

                //prizeStatus
                }else if(payload.function == 'prizeStatus'){
                    //TODO: hook into prize status
                    console.log('Prize: Get Status');
                    response = {
                        'success': true,
                        'prizeEntry1': true,
                        'prizeEntry2': false,
                        'prizeEntry3': false,
                    };

                //gameStatus
                }else if(payload.function == 'gameStatus'){
                    //TODO: store game status in localstorage for general site usage
                    if(payload.cookies != null && payload.demogorgons != null){
                        console.log('Game: Submit Status, cookies: ' + payload.cookies + ', demogorgons: ' + payload.demogorgons);
                        localStorage.setItem('cookies', payload.cookies);
                        localStorage.setItem('demogorgons', payload.demogorgons);
                        response = { 'success': true };
                    }

                //gameExit
                }else if(payload.function == 'gameExit'){
                    //TODO: hookup redirect logic
                    console.log('Game: Exit');
                    response = { 'success': true };

                    location.reload();

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

var cameraKit, cameraKitSession, extensions, push2Web, stream, source, sourceImage, sourceCamera, lens;

const mobileVideoSourceMaxWidth = 1024; //max width of render target for canvas.  optimization technique for fps.

const createImageSourceElement = new Image(); //force static black background, no camera.
createImageSourceElement.src = '/assets/ui/black.png';
createImageSourceElement.width = 1024;
createImageSourceElement.height = 1024;

const cameraKitInit = async () => {
    console.log('5')
    //extensions
    try {
        console.log('6')
        push2Web = new Push2Web();

        extensions = (container) => container.provides(push2Web.extension).provides(
            Injectable(
                remoteApiServicesFactory.token,
                [remoteApiServicesFactory.token],
                (existing) => [...existing, castGameService]
            )
        );

    }catch(e) {
        console.log('7')
        extensions = (container) => container.provides(
            Injectable(
                remoteApiServicesFactory.token,
                [remoteApiServicesFactory.token],
                (existing) => [...existing, castGameService]
            )
        );

    }

    console.log('8')
    //
    cameraKit = await bootstrapCameraKit(camKitConfiguration, extensions);

    console.log('9')

    cameraKitSession = await cameraKit.createSession({ liveRenderTarget: canvas });

    console.log('10')

    cameraKitSession.events.addEventListener('error', (event) => {
    if (event.detail.error.name === 'LensExecutionError') {
        console.log(
        'The current Lens encountered an error and was removed.',
        event.detail.error
        );
    }
    });


    console.log('11')

    await createStreamSource();

    console.log('12')

    lens = await cameraKit.lensRepository.loadLens(
        lensId,
        groupId
    );

    await cameraKitApply();

    console.log('13')

}

const createStreamSource = async () => {
    console.log('14')

    sourceImage = createImageSource(createImageSourceElement, {
        // transform: Transform2D.MirrorX, //only for selfie
        cameraType: 'back',
        fpsLimit: 24,
    });
    
        stream = await navigator.mediaDevices.getUserMedia({
            video:
                {
                    width: { ideal: 1024 },
                    height: { ideal: 540 },
                    facingMode: 'environment',
                },
                audio: false,
            }
        );

        sourceCamera = createMediaStreamSource(stream, {
            // transform: Transform2D.MirrorX, //only for selfie
            cameraType: 'back',
            fpsLimit: 24,
        });

        source = sourceCamera;    

    // source = sourceImage;

    console.log('15')
    //
    await cameraKitSession.setSource(source);
    await cameraKitSession.setFPSLimit(24);

    console.log('16')
}

const cameraKitApply = async () => {
console.log('17')
    await cameraKitSession.applyLens(lens);
    await cameraKitSession.play('live');
    // await cameraKitSession.play('capture');
console.log('18')
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

            if(isPhone && newWidth > mobileVideoSourceMaxWidth){
                newWidth = mobileVideoSourceMaxWidth;

                var ratio = mobileVideoSourceMaxWidth / width;
                newHeight = newHeight * ratio;
            }

            createImageSourceElement.width = newWidth;
            createImageSourceElement.height = newHeight;
            
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
    if(isPhone){
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

    console.log('19')

    await sleep(250);

}



/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
//unmute for iOS

const audioCtx = new ( window.AudioContext || window.webkitAudioContext )();
const unmuteBtn = document.querySelector('.castGame-unmute-btn');

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
//init

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

init();