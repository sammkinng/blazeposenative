import * as mpPose from '@mediapipe/pose';
import * as posedetection from '@tensorflow-models/pose-detection';

console.log(mpPose)

const body = {
    'nose': 0,
    'left_eye_inner': 1,
    'left_eye': 2,
    'left_eye_outer': 3,
    'right_eye_inner': 4,
    'right_eye': 5,
    'right_eye_outer': 6,
    'left_ear': 7,
    'right_ear': 8,
    'mouth_left': 9,
    'mouth_right': 10,
    'left_shoulder': 11,
    'right_shoulder': 12,
    'left_elbow': 13,
    'right_elbow': 14,
    'left_wrist': 15,
    'right_wrist': 16,
    'left_pinky': 17,
    'right_pinky': 18,
    'left_index': 19,
    'right_index': 20,
    'left_thumb': 21,
    'right_thumb': 22,
    'left_hip': 23,
    'right_hip': 24,
    'left_knee': 25,
    'right_knee': 26,
    'left_ankle': 27,
    'right_ankle': 28,
    'left_heel': 29,
    'right_heel': 30,
    'left_foot_index': 31,
    'right_foot_index': 32
}

const detectorConfig = {
    runtime: 'mediapipe',
    modelType: 'full',
    solutionPath: `https://cdn.jsdelivr.net/npm/@mediapipe/pose@${mpPose.VERSION}`

};

// const detectorConfig = {
//     runtime: 'tfjs',
//     modelType: 'full'
// };

const videoConfig = {
    'audio': false,
    'video': {
        facingMode: 'user',
        width: 1280,
        height: 720,
        frameRate: {
            ideal: 60,
        }
    }
};

const scoreThreshold = 0.65

const model = posedetection.SupportedModels.BlazePose


const exercises = {
    'High_Knees': 0,
    'Jumping_Jacks': 1,
    'Squats': 2
}

export { model, body, detectorConfig, videoConfig, scoreThreshold, exercises }

