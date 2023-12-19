import firebase from "firebase/app";
import "firebase/firestore";
import "./main.css";

//import firebaseConfig from "./firebase.js"

function App() {
  const firebaseConfig = {
    apiKey: "AIzaSyBa-Ia0bkYjc-IZ57b0NlaGq8n8qDThjAw",
    authDomain: "webrtc-test-68713.firebaseapp.com",
    projectId: "webrtc-test-68713",
    storageBucket: "webrtc-test-68713.appspot.com",
    messagingSenderId: "539331693032",
    appId: "1:539331693032:web:0bb9f6a8fe8e4687ac3c5d",
    measurementId: "G-7YL6HW67XR",
  };
  // Initialize Firebase

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  const firestore = firebase.firestore();
  const servers = {
    iceServers: [
      {
        urls: [
         // "stun:stun1.l.google.com:19302",
         // "stun:stun2.l.google.com:19302",
         "stun:192.168.0.30:3478"
        ],
      },
    ],
    iceCandidatePoolSize: 10,
  };
  let pc = new RTCPeerConnection(servers);

  let localStream = null;
  let remoteStream = null;

  let _createOffer = async () => {
    const callDoc = firestore.collection("calls").doc();
    const offerCandidates = callDoc.collection("offerCandidates");
    const answerCandidates = callDoc.collection("answerCandidates");

    document.getElementById("callInput").value = callDoc.id;

    // Get candidates for caller, save to db
    pc.onicecandidate = (event) => {
      event.candidate && offerCandidates.add(event.candidate.toJSON());
    };

    // Create offer
    const offerDescription = await pc.createOffer();
    await pc.setLocalDescription(offerDescription);

    const offer = {
      sdp: offerDescription.sdp,
      type: offerDescription.type,
    };

    await callDoc.set({ offer });

    // Listen for remote answer
    callDoc.onSnapshot((snapshot) => {
      const data = snapshot.data();
      if (!pc.currentRemoteDescription && data?.answer) {
        const answerDescription = new RTCSessionDescription(data.answer);
        pc.setRemoteDescription(answerDescription);
      }
    });

    // When answered, add candidate to peer connection
    answerCandidates.onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const candidate = new RTCIceCandidate(change.doc.data());
          pc.addIceCandidate(candidate);
        }
      });
    });
  };

  let startcuptrring = async () => {
    const remoteCallerCam = document.getElementById("remoteCaller");
    const sourceCallerCam = document.getElementById("sourceCaller");
    localStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true ,
    });
    remoteStream = new MediaStream();

    //Push tracks from local stream to peer connection
    localStream.getTracks().forEach((track) => {
      pc.addTrack(track, localStream);
    });

    //Pull tracks from remote stream, add to video stream
    pc.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        remoteStream.addTrack(track);
      });
    };

    sourceCallerCam.srcObject = localStream;
    sourceCallerCam.muted = true;
    remoteCallerCam.srcObject = remoteStream;
  };

  let answerButton = async () => {
    const callId = document.getElementById("callInput").value;
    const callDoc = firestore.collection("calls").doc(callId);
    const answerCandidates = callDoc.collection("answerCandidates");
    const offerCandidates = callDoc.collection("offerCandidates");

    pc.onicecandidate = (event) => {
      event.candidate && answerCandidates.add(event.candidate.toJSON());
    };

    const callData = (await callDoc.get()).data();

    const offerDescription = callData.offer;
    await pc.setRemoteDescription(new RTCSessionDescription(offerDescription));

    const answerDescription = await pc.createAnswer();
    await pc.setLocalDescription(answerDescription);

    const answer = {
      type: answerDescription.type,
      sdp: answerDescription.sdp,
    };

    await callDoc.update({ answer });

    offerCandidates.onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        console.log(change);
        if (change.type === "added") {
          let data = change.doc.data();
          pc.addIceCandidate(new RTCIceCandidate(data));
        }
      });
    });
  };

  return (
    <div className="main">
      <div style={{ display: "flex" }}>
        <div style={{ width: "500px" }}>
          <video

            autoPlay
            id="sourceCaller"
            width={400}
            height={400}
            style={{ border: "1px solid black" }}
          />
        </div>
        <div>
          <video

            autoPlay
            id="remoteCaller"
            width={400}
            height={400}
            style={{ border: "1px solid black" }}
          />
        </div>
      </div>
      <br />
      <br />
      <div style={{ display: "flex" }}>
        <div style={{ width: "400px" }}>
          <button id="callButton" onClick={startcuptrring}>
            start calling
          </button>
        </div>
        <div style={{ width: "400px" }}>
          <button onClick={_createOffer} id="createOffer">
            create offer
          </button>
        </div>
        <div style={{ width: "400px" }}>
          <button id="answerButton" onClick={answerButton}>
            answer calling
          </button>
        </div>
      </div>
      <br />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <input id="callInput" />
      </div>
    </div>
  );
}

export default App;
