import {
    bootstrapCameraKit,
    CameraKitSession,
    createMediaStreamSource,
    Transform2D,
    Lens,
  } from '@snap/camera-kit';
  
  let mediaStream: MediaStream;
  
  async function init() {
    const liveRenderTarget = document.getElementById(
      'canvas'
    ) as HTMLCanvasElement;
    const cameraKit = await bootstrapCameraKit({ apiToken: 'eyJhbGciOiJIUzI1NiIsImtpZCI6IkNhbnZhc1MyU0hNQUNQcm9kIiwidHlwIjoiSldUIn0.eyJhdWQiOiJjYW52YXMtY2FudmFzYXBpIiwiaXNzIjoiY2FudmFzLXMyc3Rva2VuIiwibmJmIjoxNzQ0NDkyMDE3LCJzdWIiOiI4MzdmOTA0Yy1jYTU4LTQ2OWEtOWExNi1hN2ZkNTc0MjM4ZmV-U1RBR0lOR340YzI0MGU2NC0zOTQ4LTQxOGYtOGM2OS0wZTU1MDA3MTQ3NTUifQ.Y7QGwmP1OHx_BXD3TIAqv9sMaxlOogcQE0q5g08SHJw' });
    const session = await cameraKit.createSession({ liveRenderTarget });
    const { lenses } = await cameraKit.lensRepository.loadLensGroups([
      'b3bcab54-2bfe-4b99-93bd-31b106ee6c56',
    ]);
  
    session.applyLens(lenses[0]);
  
    await setCameraKitSource(session);
  
    attachCamerasToSelect(session);
    attachLensesToSelect(lenses, session);
  }
  
  async function setCameraKitSource(
    session: CameraKitSession,
    deviceId?: string
  ) {
    if (mediaStream) {
      session.pause();
      mediaStream.getVideoTracks()[0].stop();
    }
  
    mediaStream = await navigator.mediaDevices.getUserMedia({
      video: { deviceId },
    });
  
    const source = createMediaStreamSource(mediaStream);
  
    await session.setSource(source);
  
    source.setTransform(Transform2D.MirrorX);
  
    session.play();
  }
  
  async function attachCamerasToSelect(session: CameraKitSession) {
    const cameraSelect = document.getElementById('cameras') as HTMLSelectElement;
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices.filter(({ kind }) => kind === 'videoinput');
  
    cameras.forEach((camera) => {
      const option = document.createElement('option');
  
      option.value = camera.deviceId;
      option.text = camera.label;
  
      cameraSelect.appendChild(option);
    });
  
    cameraSelect.addEventListener('change', (event) => {
      const deviceId = (event.target as HTMLSelectElement).selectedOptions[0]
        .value;
  
      setCameraKitSource(session, deviceId);
    });
  }
  
  async function attachLensesToSelect(lenses: Lens[], session: CameraKitSession) {
    const lensSelect = document.getElementById('lenses') as HTMLSelectElement;
  
    lenses.forEach((lens) => {
      const option = document.createElement('option');
  
      option.value = lens.id;
      option.text = lens.name;
  
      lensSelect.appendChild(option);
    });
  
    lensSelect.addEventListener('change', (event) => {
      const lensId = (event.target as HTMLSelectElement).selectedOptions[0].value;
      const lens = lenses.find((lens) => lens.id === lensId);
  
      if (lens) session.applyLens(lens);
    });
  }
  
  init();