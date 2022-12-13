import { useState } from "react";
import {
  Button,
  CameraRoll,
  PermissionsAndroid,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { mediaDevices, RTCView } from "react-native-webrtc";

function App() {
  const [stream, setStream] = useState(null);

  const start = async () => {
    try {

      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "Camera Permissions",
          Message: "requsting permission to use your Camera"
        }
      )
      if(granted === PermissionsAndroid.RESULTS.GRANTED){
        console.log("you can use the camera")
      }else{
        console.log("camera Permissions denied")
      }
    }catch(err){
      console.warn
    }

    let cameraCount = 0;
    try {
      const devices = await mediaDevices.enumerateDevices();
  
      devices.map( device => {
        if ( device.kind != 'videoinput' ) { return; };
  
        cameraCount = cameraCount + 1;
      } );
      console.log(cameraCount)
      console.log(devices)
    } catch( err ) {
      // Handle Error
    };

    if (!stream) {
      console.log("start");
      let s;
      try {
        s = await mediaDevices.getUserMedia({ video: true });
        setStream(s);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const stop = () => {
    console.log("stop");
    if (stream) {
      stream.release();
      setStream(null);
    }
  };

  

  

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <View style={{ flex: 1 }}>
        {stream && <RTCView streamURL={stream.toURL()} style={{ flex: 1 }} />}
      </View>
      <View>
      <Text>Try {}</Text>
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
        <Button title="Start" onPress={start} />
        <Button title="Stop" onPress={stop} />
      </View>
    </SafeAreaView>
  );
}

export default App;


// import React from 'react';
// import {View, SafeAreaView, Button, StyleSheet} from 'react-native';

// import {RTCPeerConnection, RTCView, mediaDevices} from 'react-native-webrtc';

// export default function App() {
//   const [localStream, setLocalStream] = React.useState();
//   const [remoteStream, setRemoteStream] = React.useState();
//   const [cachedLocalPC, setCachedLocalPC] = React.useState();
//   const [cachedRemotePC, setCachedRemotePC] = React.useState();

//   const startLocalStream = async () => {
//     const isFront = true;
//     const devices = await mediaDevices.enumerateDevices();

//     const facing = isFront ? 'front' : 'back';
//     const videoSourceId = devices.find(device => device.kind === 'videoinput' && device.facing === facing);
//     const facingMode = isFront ? 'user' : 'environment';
//     const constraints = {
//       audio: true,
//       video: {
//         mandatory: {
//           minWidth: 500, // Provide your own width, height and frame rate here
//           minHeight: 300,
//           minFrameRate: 30,
//         },
//         facingMode,
//         optional: videoSourceId ? [{sourceId: videoSourceId}] : [],
//       },
//     };
//     const newStream = await mediaDevices.getUserMedia(constraints);
//     setLocalStream(newStream);

//   };

//   const startCall = async () => {
//     const configuration = {iceServers: [{url: 'stun:stun.l.google.com:19302'}]};
//     const localPC = new RTCPeerConnection(configuration);
//     const remotePC = new RTCPeerConnection(configuration);

//     // could also use "addEventListener" for these callbacks, but you'd need to handle removing them as well
//     localPC.onicecandidate = e => {
//       try {
//         console.log('localPC icecandidate:', e.candidate);
//         if (e.candidate) {
//           remotePC.addIceCandidate(e.candidate);
//         }
//       } catch (err) {
//         console.error(`Error adding remotePC iceCandidate: ${err}`);
//       }
//     };
//     remotePC.onicecandidate = e => {
//       try {
//         console.log('remotePC icecandidate:', e.candidate);
//         if (e.candidate) {
//           localPC.addIceCandidate(e.candidate);
//         }
//       } catch (err) {
//         console.error(`Error adding localPC iceCandidate: ${err}`);
//       }
//     };
//     remotePC.onaddstream = e => {
//       console.log('remotePC tracking with ', e);
//       if (e.stream && remoteStream !== e.stream) {
//         console.log('RemotePC received the stream', e.stream);
//         setRemoteStream(e.stream);
//       }
//     };

//     // AddTrack not supported yet, so have to use old school addStream instead
//     // newStream.getTracks().forEach(track => localPC.addTrack(track, newStream));
//     localPC.addStream(localStream);
//     try {
//       const offer = await localPC.createOffer();
//       console.log('Offer from localPC, setLocalDescription');
//       await localPC.setLocalDescription(offer);
//       console.log('remotePC, setRemoteDescription');
//       await remotePC.setRemoteDescription(localPC.localDescription);
//       console.log('RemotePC, createAnswer');
//       const answer = await remotePC.createAnswer();
//       console.log(`Answer from remotePC: ${answer.sdp}`);
//       console.log('remotePC, setLocalDescription');
//       await remotePC.setLocalDescription(answer);
//       console.log('localPC, setRemoteDescription');
//       await localPC.setRemoteDescription(remotePC.localDescription);
//     } catch (err) {
//       console.error(err);
//     }
//     setCachedLocalPC(localPC);
//     setCachedRemotePC(remotePC);
//   };

//   const closeStreams = () => {
//     if (cachedLocalPC) {
//       cachedLocalPC.removeStream(localStream);
//       cachedLocalPC.close();
//     }
//     if (cachedRemotePC) {
//       cachedRemotePC.removeStream(remoteStream);
//       cachedRemotePC.close();
//     }
//     setLocalStream();
//     setRemoteStream();
//     setCachedRemotePC();
//     setCachedLocalPC();
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       {localStream && <Button title="Click to start call" onPress={startCall} disabled={!!remoteStream} />}
//       {!localStream && <Button title="Click to start stream" onPress={startLocalStream} />}

//       <View style={styles.rtcview}>
//         {localStream && <RTCView style={styles.rtc} streamURL={localStream.toURL()} />}
//       </View>
//       <View style={styles.rtcview}>
//         {remoteStream && <RTCView style={styles.rtc} streamURL={remoteStream.toURL()} />}
//       </View>
//       <Button title="Click to stop call" onPress={closeStreams} disabled={!remoteStream} />
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: '#313131',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     height: '100%',
//   },
//   text: {
//     fontSize: 30,
//   },
//   rtcview: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     height: '40%',
//     width: '80%',
//     backgroundColor: 'black',
//   },
//   rtc: {
//     width: '80%',
//     height: '100%',
//   },