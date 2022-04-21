//Creataed for testing purposes


// import React, {useState} from 'react';
// import {
//   Button,
//   SafeAreaView,
//   StyleSheet,
//   ScrollView,
//   View,
//   Text,
//   StatusBar,
//   Dimensions,
// } from 'react-native';
// import {Colors} from 'react-native/Libraries/NewAppScreen';
// import {mediaDevices, RTCView} from 'react-native-webrtc';
// import Canvas from 'react-native-canvas';
// import {useRef, useEffect} from 'react';

// const {width, height} = Dimensions.get('screen');

// function App7() {
//   const canvas = useRef(null);
//   let stream = null
//   const start = async () => {
//     console.log('start');
//       let s;
//       try {
//         s = await mediaDevices.getUserMedia({
//           video: {width: width, height: height, frameRate: 30},
//         });
//         stream = s;
//         console.log(s);
//       } catch (e) {
//         console.error(e);
//     }
//   };
//   useEffect(() => {
//     start;
//     const ctx = canvas.current.getContext('2d');
//     ctx.fillRect(0, 0, width, 500);
//     ctx.fillStyle = 'purple';
//     // ctx.fillRect(0, 0, 100, 100);
//   }, []);
//   return (
//     <View style={styles.body}>
//       <Canvas ref={canvas} style={styles.can} />
//       {stream && <RTCView streamURL={stream.toURL()} style={styles.stream} />}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//     body: {
//     //   position: 'absolute',
//     //   top: 0,
//     //   left: 0,
//     //   width: '100%',
//     //   height: '100%',
//     },
//     stream: {
//       flex: 2,
//       zIndex: 1,
//     },
    // can: {
    //   width: width,
    // //   height:300,
    // //   zIndex: 2,
    // },
//   });
// export default App7;
