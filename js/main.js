import '../scss/style.scss'
import { bootstrapCameraKit, createMediaStreamSource, createImageSource, Transform2D, remoteApiServicesFactory, Injectable, estimateLensPerformance } from '@snap/camera-kit';
// import { Push2Web } from '@snap/push2web';



/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
//config

//TODO: set configs

const serverVersion = 0.3;

const camKitConfiguration = {
    apiToken: 'eyJhbGciOiJIUzI1NiIsImtpZCI6IkNhbnZhc1MyU0hNQUNQcm9kIiwidHlwIjoiSldUIn0.eyJhdWQiOiJjYW52YXMtY2FudmFzYXBpIiwiaXNzIjoiY2FudmFzLXMyc3Rva2VuIiwibmJmIjoxNzQ0NDkyMDE3LCJzdWIiOiI4MzdmOTA0Yy1jYTU4LTQ2OWEtOWExNi1hN2ZkNTc0MjM4ZmV-UFJPRFVDVElPTn5lOWVjYmM2Yi0xMzI4LTRiNjItYTEwZi04ODg4OWFkOTU5ZDQifQ.VDe2UgAedQ1Ywl5_3ErC0vZMpstU54CfWQ0YV-8uZaU', //apiToken to final CamKit token
    logger: 'console',
}

const camKitApiSpecId = '4bcc807f-59c5-4596-9535-f4489b829fff'; //api spec id for Snap Remote API

// const lensId = 'cba3e43c-a01b-43cf-b203-91c5931d2cbd'; //dev
const lensId = '728a5dca-413a-4450-8603-84be19068f3d'; //staging
// const lensId = '8f65b735-e3cd-4fef-a584-ee93fc03da23'; //alpha
// const lensId = 'a7a08df7-cc8a-4e58-b0e2-2a2fffb7ddea'; //prod

const groupId = 'a32e98c9-24b1-4039-b57a-2785f5abed01'; //dev,staging,alpha,prod



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

var viz = (function(){
    var stateKey, 
        eventKey, 
        keys = {
                hidden: "visibilitychange",
                webkitHidden: "webkitvisibilitychange",
                mozHidden: "mozvisibilitychange",
                msHidden: "msvisibilitychange"
    };
    for (stateKey in keys) {
        if (stateKey in document) {
            eventKey = keys[stateKey];
            break;
        }
    }
    return function(c) {
        if (c) document.addEventListener(eventKey, c);
        return !document[stateKey];
    }
})();

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}



/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
//init

const audioCtx = new ( window.AudioContext || window.webkitAudioContext )();
const launchButton = document.querySelector('.castGame-launch-btn');
const canvas = document.querySelector('.castGame-cameraKit');
const content = document.querySelector('.castGame-content');
const loaderContainer = document.querySelector('.castGame-loaderContainer');
const errorContainer = document.querySelector('.castGame-errorContainer');
const errorMessage = document.querySelector('.castGame-errorMessage');
const errorMessageButton = document.querySelector('.castGame-error-container-btn');

const init = async () => {
    loaderContainer.style.display = 'block';

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

        canvas.width = width;
        canvas.height = height;

        resizeCanvas();

        await registerPymReceiver();

        //
        await cameraKitInit();

        content.style.display = 'block';
        loaderContainer.style.display = 'none';

        //
        console.log('Pym Child: Analytics Event: Page Embedded');
        pymChildSendMessage('analytics', { event: 'Page Embedded' });

    } catch (error) {
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

var awardStatusState = {
    'awardedTier1': false,
    'awardedTier2': false,
    'awardedTier3': false,
    'awardedInstantWin': false,
};

const castGameService = {
    apiSpecId: camKitApiSpecId,

    getRequestHandler(request) {
        // console.log(request);

        //endpoints
        if (request.endpointId == 'processRequest'){
            var payload = JSON.parse(request.parameters.payload);
            var response = { 'success': false };

            //
            if(payload.function != null){

                switch (payload.function) {
                    case 'analytics':
                        //{ 'function': 'analytics', 'event': 'foo' }

                        //send analtyics event
                        if(payload.event != null){
                            console.log('Pym Child: Analytics Event: ' + payload.event);
                            pymChildSendMessage('analytics', { event: payload.event });
                            response = { 'success': true };
                        }                     

                        return getRequestHandlerReply(response);

                        break;

                    case 'log':
                        //{ 'function': 'log', 'log': 'foo' }

                        //used for console.log test
                        if(payload.log != null){
                            console.log('Pym Child: Log: ' + payload.log);
                            response = { 'success': true };
                        }

                        return getRequestHandlerReply(response);

                        break;

                    case 'error':
                        //{ 'function': 'error', 'error': 'foo' }

                        //used for future logger feature
                        if(payload.error != null){
                            console.log('Pym Child: Error: ' + payload.error);
                            response = { 'success': true };
                        }               
                        
                        return getRequestHandlerReply(response);

                        break;

                    case 'resize':
                        //{ 'function': 'resize' }

                        //force resize
                        resizeCanvas();
                        response = { 'success': true };
                        
                        return getRequestHandlerReply(response);

                        break;                        

                    case 'config':
                        //{ 'function': 'config' }

                        //used to get server config vars
                        response = { 'serverVersion': serverVersion, 'serverResourceURLFull': window.location.href.split('?')[0], 'serverResourceURLPrefix': serverResourceURLPrefix, 'isPhone': isPhone, 'isIOS': isIOS(), 'success': true };
                        
                        return getRequestHandlerReply(response);

                        break;

                    case 'award':
                        //{ 'function': 'award', 'tier': 1 }
                        //{ 'function': 'award', 'tier': 2 }
                        //{ 'function': 'award', 'tier': 3 }

                        //send award tier
                        if(payload.tier != null){
                            console.log('Pym Child: Award: Submit ' + payload.tier);
                            pymChildSendMessage('award', { tier: payload.tier });
                            response = { 'success': true };
                        }                        

                        return getRequestHandlerReply(response);
                        
                        break;

                    case 'awardStatus':
                        //{ 'function': 'awardStatus' }

                        //recieve awarded status
                        console.log('Pym Child: Award: Get Status');

                        pymChildSendMessage('awardStatus', {});

                        response = { 'success': true };

                        return getRequestHandlerReply(response);

                        break;

                    case 'awardStatusState':
                        //{ 'function': 'awardStatusState' }

                        //provide awardStatusState
                        response = { 'awardedTier1': awardStatusState.awardedTier1, 'awardedTier2': awardStatusState.awardedTier2, 'awardedTier3': awardStatusState.awardedTier3,'awardedInstantWin': awardStatusState.awardedInstantWin, 'success': true };

                        return getRequestHandlerReply(response);

                        break;                        

                    case 'gameStatus':
                        //{ 'function': 'gameStatus', 'cookies': 0, 'demogorgons': 0 }

                        //send game progress
                        if(payload.cookies != null && payload.demogorgons != null){
                            console.log('Pym Child: Game: Submit Status, cookies: ' + payload.cookies + ', demogorgons: ' + payload.demogorgons);

                            pymChildSendMessage('gameStatus', { cookies: payload.cookies, demogorgons: payload.demogorgons });

                            response = { 'success': true };
                        }

                        return getRequestHandlerReply(response);
                        
                        break;

                    case 'gameMode':
                        //{ 'function': 'gameMode', 'mode': 'loading' }
                        //{ 'function': 'gameMode', 'mode': 'gameplay' }
                        //{ 'function': 'gameMode', 'mode': 'game' }
                        //{ 'function': 'gameMode', 'mode': 'entry' }
                        //{ 'function': 'gameMode', 'mode': 'gameover' }

                        //send game mode
                        if(payload.mode != null){
                            console.log('Pym Child: Game: Mode, mode: ' + payload.mode);

                            pymChildSendMessage('gameMode', { mode: payload.mode });

                            response = { 'success': true };
                        }

                        return getRequestHandlerReply(response);
                        
                        break;                        

                    case 'gameOver':
                        //{ 'function': 'gameOver' }

                        //send game  over
                        console.log('Pym Child: Game: Over');
                        pymChildSendMessage('gameOver', {});

                        break;

                    case 'reload':
                        //{ 'function': 'reload' }

                        //used to force page reload
                        location.reload();

                        break;

                    case 'visibilitychangeStatus':
                        //{ 'function': 'visibilitychangeStatus' }

                        //used for visibilitychange tracking
                        response = { 'success': true, 'visibilitychangeStatus': visibilitychangeStatus };

                        if(visibilitychangeStatus == 'init'){
                            visibilitychangeStatus = 'ready';
                        }

                        return getRequestHandlerReply(response);

                        break;

                    default:
                        
                }

            }

        } else {
            return;

        }

    },

};

function getRequestHandlerReply(response){
    return (reply) => {
        reply({
            status: 'success',
            metadata: {},
            body: new TextEncoder().encode(JSON.stringify(response)),
        })
        
    };
}

const eventRegistry = {
  awardStatus: awardStatusEvent,
}

async function awardStatusEvent(data) {
    console.log('Pym Child: Award: Received Status Event', data);

    awardStatusState = {
        'awardedTier1': data.awardedTier1,
        'awardedTier2': data.awardedTier2,
        'awardedTier3': data.awardedTier3,
        'awardedInstantWin': data.awardedInstantWin,
    };

}

// to pym parent
function pymChildSendMessage(event, data) {
  if (window.pymChild) {
    window.pymChild.sendMessage(
      'doEvent',
      JSON.stringify({ event: event, data: data })
    )
  }
}

// from pym parent - called when the parent sends a message to this pym frame. Is bound as callback in init()
function pymChildOnMessage(data) {
  const dataParsed = JSON.parse(data)
  dispatchEvent(dataParsed?.event, dataParsed?.data) // using the same syntax / setup as ARGame.vue for ease
}

function registerPymReceiver() {
  console.log('Registering Pym Receiver');
  return new Promise((resolve, reject) => {
    const checkPymChild = () => {
      if (window.pymChild) {
        console.log('Registered Pym Receiver Successfully');
        window.pymChild.onMessage('toChild', pymChildOnMessage);
        resolve()
      } else {
        console.log('Pym Not Found Rechecking');
        setTimeout(checkPymChild, 100);
      }
    }
    checkPymChild();
  })
}

const dispatchEvent = (type, response) => {
  switch (type) {
    case 'awardStatus':
      eventRegistry[type](response)
      break
    default:
      console.log(
        `Pym Child: Unknown dispatch: ${JSON.stringify({ type, response })}`
      )
  }
}

//reload button
errorMessageButton.addEventListener('click', (e) => {
    e.preventDefault();
    location.reload();

});



/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
//camera kit

var cameraKit, cameraKitSession, extensions, push2Web, stream, source, sourceImage, sourceCamera, lens;

var visibilitychangeStatus = 'init';

//location of assets for CamKit canvas game
var serverResourceURLPrefix = window.location.pathname.replace('index.html', '');
if(serverResourceURLPrefix.charAt(serverResourceURLPrefix.length - 1) == '/'){
    serverResourceURLPrefix = serverResourceURLPrefix.slice(0, -1);
}

//canvas image, force static black background, no camera.
const blackPixel = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';
const createImageSourceElement = new Image(); 
createImageSourceElement.src = blackPixel;
createImageSourceElement.width = 1024;
createImageSourceElement.height = 1024;

const cameraKitInit = async () => {
    //extensions
    // try {
    //     push2Web = new Push2Web();

    //     extensions = (container) => container.provides(push2Web.extension).provides(
    //         Injectable(
    //             remoteApiServicesFactory.token,
    //             [remoteApiServicesFactory.token],
    //             (existing) => [...existing, castGameService]
    //         )
    //     );

    // }catch(e) {
        extensions = (container) => container.provides(
            Injectable(
                remoteApiServicesFactory.token,
                [remoteApiServicesFactory.token],
                (existing) => [...existing, castGameService]
            )
        );

    // }

    //
    cameraKit = await bootstrapCameraKit(camKitConfiguration, extensions);

    cameraKitSession = await cameraKit.createSession({ liveRenderTarget: canvas });
    cameraKitSession.events.addEventListener('error', (event) => {
        console.log('cameraKitSession Error:' + event);
        if (event.detail.error.name === 'LensExecutionError') {
            console.log(
            'The current Lens encountered an error and was removed.',
            event.detail.error
            );
        }
        // location.reload();
    });

    await createStreamSource();

    lens = await cameraKit.lensRepository.loadLens(
        lensId,
        groupId
    );

    await cameraKitApply();

}

const createStreamSource = async () => {
    //
    sourceImage = createImageSource(createImageSourceElement, {
        // transform: Transform2D.MirrorX, //only for selfie
        cameraType: 'back',
        fpsLimit: 24,
    });
    
    source = sourceImage;

    //
    await cameraKitSession.setSource(source);
    await cameraKitSession.setFPSLimit(24);

}

const cameraKitApply = async () => {

    await cameraKitSession.applyLens(lens);
    await cameraKitSession.play('live');
    await cameraKitSession.play('capture');

    // if(push2Web != null){
    //     var push2WebAccessToken = '';
    //     const urlParams = new URLSearchParams(window.location.search);
    //     if(urlParams.get('access_token')){
    //         push2WebAccessToken = urlParams.get('access_token');
    //     }

    //     push2Web.subscribe(
    //         push2WebAccessToken,
    //         cameraKitSession,
    //         cameraKit.lensRepository
    //     );

    // }

    /////////////////////////////////////////////////////////////////////////////////////
    //resize

    // debounce function to limit the number of resize calls
    const debouncedResizeCanvas = debounce(resizeCanvas, 600);
    window.addEventListener('resize', debouncedResizeCanvas);
    window.addEventListener('orientationchange', debouncedResizeCanvas);

    const debouncedVisualViewportResize = debounce(handleVisualViewportResize, 300);
    if(window.visualViewport) {
      window.visualViewport.addEventListener('resize', debouncedVisualViewportResize);
    }

    // initial canvas resize
    resizeCanvas();
    debouncedResizeCanvas();

    //
    if(isPhone){
        viz(function(){
            //
            if(viz()){
                // cameraKitSession.play('live');
                // cameraKitSession.play('capture');
                cameraKitSession.unmute();

                if(audioCtx != null){
                    if(audioCtx.state == "interrupted" || audioCtx.state == 'suspended' || audioCtx.state == 'closed') {
                        audioCtx.resume().then(() => play());
                    }
                }                

                resizeCanvas();
                                
            } else {
                // cameraKitSession.pause('live');
                // cameraKitSession.pause('capture');
                cameraKitSession.mute();

                if(visibilitychangeStatus == 'ready'){
                    visibilitychangeStatus = 'triggered';
                }
                
            }

        });   

    }

}

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
        //callback to window.innerWidth and documentElement.clientHeight for desktop
        width = window.innerWidth;
        height = document.documentElement.clientHeight;

    }

    return { width, height };

};

const getRenderSizeForced = () => {
    let { width, height } = getRenderSize();

    var newWidth = width;
    var newHeight = height;

    if(isPhone){
        //phone 
        if (typeof screen.orientation !== 'undefined') {
          
            if(screen.orientation.type == 'landscape-primary' || screen.orientation.type == 'landscape-secondary'){
                //landscape
                var newWidthForced = newHeight * 0.5625;
                if(newWidthForced < newWidth){
                    newWidth = newWidthForced;
                }

            }else{
                //portrait, correct orientation
            }

        }

    }else{
        //desktop
        newWidth = newHeight * 0.5625;
        newHeight = newHeight;

    }

    return { width: newWidth, height: newHeight };

};

const handleVisualViewportResize = () => {
    resizeCanvas();
};  

const resizeCanvas = () => {
    const { width, height } = getRenderSizeForced();

    content.style.width = width + 'px';
    content.style.height = height + 'px';            

    createImageSourceElement.width = width;
    createImageSourceElement.height = height;
    
    if (source) {
        var mobileVideoSourceResolution = 1.25;
        var renderSizeMinumumWidth = 400;
        var renderSizeMinumumUpResRatio = 1;

        //up res if width is small
        var renderSizeFinalWidth = width * mobileVideoSourceResolution;
        if(renderSizeFinalWidth < renderSizeMinumumWidth){
            renderSizeMinumumUpResRatio = renderSizeMinumumWidth / renderSizeFinalWidth;
        }
        renderSizeFinalWidth = renderSizeFinalWidth * renderSizeMinumumUpResRatio;

        //
        var renderSizeFinalHeight = height * mobileVideoSourceResolution * renderSizeMinumumUpResRatio;

        source.setRenderSize(renderSizeFinalWidth, renderSizeFinalHeight);
        //considered a window.devicePixelRatio, however there is a trade off between gpu resources fps vs quality.  Leaning towards fps with maxiumum of 1.25.
        // source.setRenderSize(width * window.devicePixelRatio, height * window.devicePixelRatio);
    }        

    //
    // console.log('Pym Child: Resize');
    // pymChildSendMessage('resize', { width: width, height: height });

};



/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
//init

init();
