import * as posedetection from '@tensorflow-models/pose-detection';

import { JumpingJacks } from './jumpingJacks';

import { HighKnees } from './highKnees';

import { Squats } from './squats'

import data from '../Assets/Json/Text'

import { Dimensions } from 'react-native'

const { width, height } = Dimensions.get('screen')

import {
    model,
    videoConfig,
    body,
    scoreThreshold,
    exercises
} from '../constants/model';

import HKEnd from '../Assets/Sound/high_knees/HIGH KNEES_end.mp3'

export class PoseCamera {
    constructor(canvas) {
        // this.video = camera1
        this.canvas = canvas
        this.ctx = canvas.getContext('2d');
        // this.width = this.video.offsetWidth
        // this.height = this.video.offsetHeight
        this.exercise_count = 0
        this.high_knee = new HighKnees()
        this.jumping_jack = new JumpingJacks()
        this.squat = new Squats()
        this.start_played = false
        this.countdown_end = false
    }

    static setupCamera(
        canvas,
        setRep = 0,
        setSpeed = 0,
        setPlaying = 0,
        playing = 0,
        setCompleted = 0,
        setAnimation = 0
    ) {
        // let l = document.querySelector('.left').offsetWidth
        // let r = document.querySelector('.right').offsetWidth
        // let w = window.innerWidth
        // if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        //     throw new Error(
        //         'Browser API navigator.mediaDevices.getUserMedia not available');
        // }

        // let stream = null
        // try {
        // stream = await navigator.mediaDevices.getUserMedia(videoConfig);

        const camera = new PoseCamera(canvas);
        camera.setRep = setRep
        camera.setSpeed = setSpeed
        camera.setPlaying = setPlaying
        camera.playing = playing
        camera.setCompleted = setCompleted
        camera.setAnimation = setAnimation
        // camera.video.srcObject = stream;

        // await new Promise((resolve) => {
        //     camera.video.onloadedmetadata = (video) => {
        //         resolve(video);
        //     };
        // });

        // camera.video.play();

        // const videoWidth = camera.video.videoWidth;
        // const videoHeight = camera.video.videoHeight;
        // Must set below two lines, otherwise video element doesn't show.
        // camera.video.width = videoWidth;
        // camera.video.height = videoHeight;

        //setting size of full body validator
        // document.querySelector('#green').style.width = (w - l - r - 2.5) + 'px'

        // camera.canvas.width = videoWidth;
        // camera.canvas.height = videoHeight;
        // const canvasContainer = document.querySelector('.canvas-wrapper');
        // canvasContainer.style = `width: ${videoWidth}px; height: ${videoHeight}px`;

        // Because the image from camera is mirrored, need to flip horizontally.
        // camera.ctx.translate(camera.video.videoWidth, 0);
        // camera.ctx.scale(-1, 1);

        return camera;
        // } catch (error) {
        //     throw 'Permission Error'
        // }
    }

    drawCtx(cam) {
        this.ctx.drawImage(
            cam, 0, 0, width, height);
    }

    clearCtx() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
    * Draw the keypoints && skeleton on the video.
    * @param poses A list of poses to render.
    */
    drawResults(poses) {
        this.pose = poses[0]
        for (const pose of poses) {
            this.drawResult(pose);
        }
    }

    /**
    * Draw the keypoints && skeleton on the video.
    * @param pose A pose with keypoints to render.
    */
    drawResult(pose) {
        if (pose.keypoints != null) {
            this.drawKeypoints(pose.keypoints);
            this.drawSkeleton(pose.keypoints);
        }
    }

    /**
    * Draw the keypoints on the video.
    * @param keypoints A list of keypoints.
    */
    drawKeypoints(keypoints) {
        const keypointInd =
            posedetection.util.getKeypointIndexBySide(model);
        this.ctx.fillStyle = 'Red';
        this.ctx.strokeStyle = 'White';
        this.ctx.lineWidth = 2;

        for (const i of keypointInd.middle) {
            this.drawKeypoint(keypoints[i]);
        }

        this.ctx.fillStyle = 'Green';
        for (const i of keypointInd.left) {
            this.drawKeypoint(keypoints[i]);
        }

        this.ctx.fillStyle = 'Orange';
        for (const i of keypointInd.right) {
            this.drawKeypoint(keypoints[i]);
        }
    }

    drawKeypoint(keypoint) {
        // console.log(keypoint)
        // If score is null, just show the keypoint.
        const score = keypoint.score != null ? keypoint.score : 1;

        if (score >= scoreThreshold) {
            // const circle = new Path2D();
            this.ctx.beginPath()
            this.ctx.arc(keypoint.x, keypoint.y, 4, 0, 2 * Math.PI);
            // this.ctx.fill(circle);
            this.ctx.stroke();
        }
    }

    /**
    * Draw the skeleton of a body on the video.
    * @param keypoints A list of keypoints.
    */
    drawSkeleton(keypoints) {
        // Each poseId is mapped to a color in the color palette.
        const color = 'White';
        this.ctx.fillStyle = color;
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 2;

        posedetection.util.getAdjacentPairs(model).forEach(([
            i, j
        ]) => {
            const kp1 = keypoints[i];
            const kp2 = keypoints[j];

            // If score is null, just show the keypoint.
            const score1 = kp1.score != null ? kp1.score : 1;
            const score2 = kp2.score != null ? kp2.score : 1;

            if (score1 >= scoreThreshold && score2 >= scoreThreshold) {
                this.ctx.beginPath();
                this.ctx.moveTo(kp1.x, kp1.y);
                this.ctx.lineTo(kp2.x, kp2.y);
                this.ctx.stroke();
            }
        });
    }
    // draw text of values provided
    drawText(a, b = 0, c = 0, d = 0) {
        this.ctx.font = "30px Arial";
        this.ctx.fillText(a, 100, 30);
        this.ctx.fillText(b, 100, 60);
        this.ctx.fillText(c, 100, 100);
        this.ctx.fillText(d, 100, 150);
    }
    // find angle bw 3 keypoints
    getAngle(a, b, c) {
        let ang = (180 / Math.PI) * (Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x))
        if (ang < 0) {
            return ang + 360
        }
        return ang
    }
    // find distance bw 2 keypoints
    distance(a, b) {
        return Math.sqrt(((a.x - b.x) ** 2) + ((a.y - b.y) ** 2))
    }
    // validate if head to toe is in frame
    heels_valid(validator, ex) {
        try {
            let coordinates = this.pose.keypoints
            let right_ankle = coordinates[body.right_ankle]
            let left_ankle = coordinates[body.left_ankle]
            let nose = coordinates[body.nose]

            if ((right_ankle.score > scoreThreshold || left_ankle.score > scoreThreshold) && nose.score > scoreThreshold) {
                document.getElementById('green').style.border = "5px solid green"
                if (!this.start_played) {
                    this.countdownAudio(ex)
                }
                if (this.countdown_end) {
                    let count = validator()
                    if (count !== this.exercise_count) {
                        this.update_values(count, ex)
                    }
                }
                return true

            }
            document.getElementById('green').style.border = "none"
            return false
        } catch (error) {
            console.log(error)
        }
    }
    // initial audio + countdwon animation
    countdownAudio = (ex) => {
        let audio = data[ex].aud2
        if (this.playing) {
            this.playing.pause()
            this.playing.currentTime = 0
        }
        audio.play()
        this.setPlaying(audio)
        this.start_played = true
        const nums = document.querySelectorAll('.nums span');
        const counter = document.querySelector('.counter');
        const finalMessage = document.querySelector('.final');

        var cc = document.getElementById('countdown')
        function resetDOM() {
            counter.classList.remove('hide');
            finalMessage.classList.remove('show');

            nums.forEach(num => {
                num.classList.value = '';
            });

            nums[0].classList.add('in');
        }
        const runAnimation = () => {
            nums.forEach((num, idx) => {
                const penultimate = nums.length - 1;
                num.addEventListener('animationend', (e) => {
                    if (e.animationName === 'goIn' && idx !== penultimate) {
                        num.classList.remove('in');
                        num.classList.add('out');
                    } else if (e.animationName === 'goOut' && num.nextElementSibling) {
                        num.nextElementSibling.classList.add('in');
                    } else {
                        counter.classList.add('hide');
                        finalMessage.classList.add('show');
                        setTimeout(() => {
                            cc.style.display = 'none'
                            resetDOM()
                            this.countdown_end = true
                            this.start_time = new Date().getTime()
                        }, 500)
                    }
                });
            });
        }
        let an = setTimeout(() => {
            cc.style.display = 'inline-block'
            runAnimation()
        }, data[ex].aud2len)
        this.setAnimation(an)
    }
    //updates rep count and speed in ui
    update_values = (count, ex) => {
        this.exercise_count = count
        let time_taken = new Date().getTime() - this.start_time
        this.setRep(this.exercise_count)
        if (time_taken) {
            // console.log(time_taken, count)
            this.setSpeed(((1000 * count) / time_taken).toFixed(2))
        }
        if (count === data[ex].reps) {
            this.setCompleted(true)
            // new Audio(HKEnd).play()
        }
    }
    // switch bw exercises
    do_exercise(exercise) {
        switch (exercise) {
            case exercises.High_Knees:
                this.heels_valid(this.validateHighKnees, 0)
                break;

            case exercises.Jumping_Jacks:
                this.heels_valid(this.validateJumpingJacks, 1)
                break;

            case exercises.Squats:
                this.heels_valid(this.validateSquats, 2)
                break;
            default:
                break;
        }
    }
    // high knees validation
    validateHighKnees = () => {
        let coordinates = this.pose.keypoints
        let right_ankle = coordinates[body.right_ankle]
        let left_ankle = coordinates[body.left_ankle]

        let right_knee = coordinates[body.right_knee]
        let left_knee = coordinates[body.left_knee]
        let right_hip = coordinates[body.right_hip]
        let left_hip = coordinates[body.left_hip]

        let RLD = Math.abs(right_ankle.y - left_ankle.y)
        let count = this.high_knee.isValid(RLD, right_knee.y, left_knee.y, right_hip.y, left_hip.y, right_ankle.y, left_ankle.y)

        return count
    }
    // jumping jacks validation
    validateJumpingJacks = () => {
        let coordinates = this.pose.keypoints
        let right_shoulder = coordinates[body.right_shoulder]
        let left_shoulder = coordinates[body.left_shoulder]
        let right_ankle = coordinates[body.right_ankle]
        let left_ankle = coordinates[body.left_ankle]
        let right_elbow = coordinates[body.right_elbow]
        let left_elbow = coordinates[body.left_elbow]

        let ankle_mid_point = (left_shoulder.x + right_shoulder.x) / 2

        let shoulder_distance = this.distance(left_shoulder, right_shoulder)
        let ankle_distance = this.distance(left_ankle, right_ankle)
        let ld = left_ankle.x - ankle_mid_point
        let rd = ankle_mid_point - right_ankle.x
        let diff = Math.abs(ld - rd)

        let count = this.jumping_jack.isValid(diff, left_elbow.y, right_elbow.y, left_shoulder.y, right_shoulder.y, shoulder_distance, ankle_distance)

        return count
    }
    //squats validation
    validateSquats = () => {
        let coordinates = this.pose.keypoints
        let correction = 25

        let nose = coordinates[body.nose]
        let right_ankle = coordinates[body.right_ankle]
        let left_ankle = coordinates[body.left_ankle]
        let left_hip = coordinates[body.left_hip]
        let right_hip = coordinates[body.right_hip]
        let left_knee = coordinates[body.left_knee]
        let right_knee = coordinates[body.right_knee]
        let left_wrist = coordinates[body.left_wrist]
        let right_wrist = coordinates[body.right_wrist]
        let left_shoulder = coordinates[body.left_shoulder]
        let right_shoulder = coordinates[body.right_shoulder]

        let profile = left_wrist.x > left_shoulder.x ? 'right' : 'left'
        let left_wrist_shoulder_ankle_angle = this.getAngle(left_wrist, left_shoulder, left_ankle)
        let right_wrist_shoulder_ankle_angle = this.getAngle(right_wrist, right_shoulder, right_ankle)

        // let left_wrist_shoulder_knee_angle = this.getAngle(left_wrist, left_shoulder, left_knee)
        // let right_wrist_shoulder_knee_angle = this.getAngle(right_wrist, right_shoulder, right_knee)
        // let left_wrist_shoulder_knee_angle = Math.abs(this.getAngle(left_wrist, left_shoulder, left_knee) - 360)
        // console.log(right_wrist_shoulder_knee_angle, left_wrist_shoulder_knee_angle)
        // let straight_left_hand_condn = Math.abs(left_shoulder.y - left_wrist.y) <= correction
        // let straight_right_hand_condn = Math.abs(right_shoulder.y - right_wrist.y) <= correction
        // let straight_hands_condn = (left_wrist_shoulder_knee_angle >= 45 && left_wrist_shoulder_knee_angle <= 65) || (right_wrist_shoulder_knee_angle >= 45 && right_wrist_shoulder_knee_angle <= 65)

        let straight_hands_condn = profile === 'left' ?
            ((left_wrist_shoulder_ankle_angle >= 260 && left_wrist_shoulder_ankle_angle <= 280) ||
                (right_wrist_shoulder_ankle_angle >= 260 && right_wrist_shoulder_ankle_angle <= 280)) :
            ((left_wrist_shoulder_ankle_angle >= 80 && left_wrist_shoulder_ankle_angle <= 100) ||
                (right_wrist_shoulder_ankle_angle >= 80 && right_wrist_shoulder_ankle_angle <= 100))



        let squat_low_condn = (left_hip.y + correction >= left_knee.y) || (right_hip.y + correction >= right_knee.y)

        let head_condn = nose.y <= left_shoulder.y || nose.y <= right_shoulder.y

        let left_shoulder_hip_knee_angle = this.getAngle(left_shoulder, left_hip, left_knee)
        let right_shoulder_hip_knee_angle = this.getAngle(right_shoulder, right_hip, right_knee)
        let hips_condn = (left_shoulder_hip_knee_angle >= 20 && left_shoulder_hip_knee_angle <= 35) || (right_shoulder_hip_knee_angle >= 11 && right_shoulder_hip_knee_angle <= 42)

        // this.drawText([squat_low_condn, nose.y], [straight_hands_condn, head_condn], hips_condn)

        return this.squat.isValid(squat_low_condn, nose.y, straight_hands_condn, head_condn, hips_condn)
    }
}
