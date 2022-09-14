// Copyright 2020 The MediaPipe Authors.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

const mpHands = window;
const drawingUtils = window;
const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');

function insertGlobalScript(url) {
    var element = document.createElement('script');
    element.setAttribute('src', url);
    element.setAttribute('crossorigin', 'anonymous');
    document.head.appendChild(element);

    return new Promise((resolve) => {
        element.onload = () => {
            resolve();
        };
    });
}

let detectHandsExports;
export async function onInit(component) {

    const { getAssemblyExports } = await globalThis.getDotnetRuntime(0);
    detectHandsExports = await getAssemblyExports("DetectHandsJsComponent.dll");

    await insertGlobalScript('https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils@0.3/camera_utils.js')
    await insertGlobalScript('https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils@0.3/drawing_utils.js')
    await insertGlobalScript('https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4/hands.js')
    const hands = new mpHands.Hands({
        locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/hands@${mpHands.VERSION}/${file}`;
        }
    });
    hands.setOptions({
        selfieMode: true,
        maxNumHands: 2,
        modelComplexity: 0,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
    });
    hands.onResults(results => onResults(component, results));
    const camera = new Camera(videoElement, {
        onFrame: async () => {
            await hands.send({ image: videoElement });
        },
        width: 1280,
        height: 720
    });
    camera.start();
    console.log("camera.started");
}

const spinner = document.querySelector('.loading');
spinner.ontransitionend = () => {
    spinner.style.display = 'none';
};

function onResults(component, results) {
    document.body.classList.add('loaded');
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);
    if (results.multiHandLandmarks && results.multiHandedness) {
        for (let index = 0; index < results.multiHandLandmarks.length; index++) {
            const classification = results.multiHandedness[index];
            const isRightHand = classification.label === 'Right';
            const landmarks = results.multiHandLandmarks[index];
            drawingUtils.drawConnectors(canvasCtx, landmarks, mpHands.HAND_CONNECTIONS, { color: isRightHand ? '#00FF00' : '#FF0000' });
            drawingUtils.drawLandmarks(canvasCtx, landmarks, {
                color: isRightHand ? '#00FF00' : '#FF0000',
                fillColor: isRightHand ? '#FF0000' : '#00FF00',
                radius: (data) => {
                    return drawingUtils.lerp(data.from.z, -0.15, .1, 10, 1);
                }
            });
        }
    }
    canvasCtx.restore();
    if (results.multiHandedness && results.multiHandLandmarks ) {
        const hands = [];
        for (let index = 0; index < results.multiHandLandmarks.length; index++) {
            const classification = results.multiHandedness[index];
            const landmarks = results.multiHandLandmarks[index];
            hands.push({
                ...classification,
                landmarks
            })
        }

        const json = JSON.stringify({hands});
        detectHandsExports.DetectHandsJsComponent.DetectHands.Interop.OnResults(component, json);
    }
}