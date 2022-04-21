import React, { useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Platform,
  Modal
} from 'react-native';

const { width, height } = Dimensions.get('screen')

import { PoseCamera } from './utils/camera';
import { Camera } from 'expo-camera';
import { useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';
import * as mpPose from '@mediapipe/pose';
import * as posedetection from '@tensorflow-models/pose-detection';
import { cameraWithTensors } from '@tensorflow/tfjs-react-native';
import Canvas from 'react-native-canvas';
import { model, detectorConfig } from './constants/model';
import {useStateIfMounted} from 'use-state-if-mounted'
const Tensorcamera = cameraWithTensors(Camera)
const tensorDims = { height: height, width: width, depth: 3 };

const App = () => {
  const plot = () => {
    canvas.current.width = width
    canvas.current.height = height
    // const ctx = canvas.current.getContext('2d');
    // ctx.fillStyle = 'purple';
    // ctx.fillRect(300, 100, 100, 100);
  }
  const canvas = useRef(null)
  const detector = useRef(null)
  const raf = useRef(null)
  const [hasPermission, setHasPermission] = useState(null);
  const [frameWorkReady, setFrameWorkReady] = useStateIfMounted(false)
  const textureDimsState = Platform.OS === 'ios' ? { height: 1920, width: 1080 } : { height: 1200, width: 1600 }
  const camera1 = useRef(null)
  const [tfReady, setTFReady] = useStateIfMounted(false);
  const createDetector = async () => {
    return posedetection.createDetector(model, detectorConfig);
  };
  const onReady = (images) => {
    if (!images) {
      console.log("Image not found!");
    }
    // console.log(nextImageTensor)
    let camera = PoseCamera.setupCamera(
      canvas.current,
    );
    const loop = async () => {
      // console.log('loop1')
      try {
        const nextImageTensor = images.next().value;
        camera.clearCtx()
        let poses = null
        if (detector.current != null) {
          try {
            poses = await detector.current.estimatePoses(
              nextImageTensor,
              { maxPoses: 1, flipHorizontal: false });
            if (poses && poses.length > 0) {
              let nose = poses[0].keypoints[0]
              camera.drawText(nose.x, nose.y)
              // console.log(poses[0].keypoints[0])
              // camera.drawResults(poses)
              // camera.do_exercise(exercise)
            }
            else {
              console.log('no pose')
            }
            // console.log(poses[0])
          } catch (error) {
            detector.current.dispose();
            detector.current = null;
            alert(error);
            console.log(error)
          }
        }
        raf.current = requestAnimationFrame(loop);
      } catch (error) {
        console.log(error)
      }

    };
    loop();
  }
  useEffect(() => {
    plot()
    if (!frameWorkReady) {
      (async () => {
        const { status } = await Camera.requestCameraPermissionsAsync().catch(e =>
          console.log(e)
        );
        setHasPermission(status === "granted");
        await tf.ready().catch(e => console.log(e));
        setTFReady(true);
        detector.current = await createDetector()
        setFrameWorkReady(true);
      })();
    }
  }, [])
  useEffect(() => {
    return () => {
      cancelAnimationFrame(raf.current);
    };
  }, [raf.current]);
  return (
    <View style={styles.container}>
      <Modal
        transparent={true}
        visible={true}
      >
        <Canvas ref={canvas} />
      </Modal>
      {hasPermission ?
        <Tensorcamera
          ref={camera1}
          type={Camera.Constants.Type.front}
          onReady={onReady}
          autorender={true}
          style={styles.stream}
          cameraTextureHeight={height}
          cameraTextureWidth={width}
          resizeHeight={height - height % 4}
          resizeWidth={width - width % 4}
          resizeDepth={3}
        /> : <Text>camera not available
        </Text>}
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  stream: {
    width: width,
    height: height,
  },

});
export default App;
