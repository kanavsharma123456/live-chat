import { Injectable } from "@angular/core";
import { WebRTCAdaptor } from "./webrtc_adaptor.js";
import { Router } from "@angular/router";
@Injectable({
  providedIn: "root",
})
export class RecieverAlertsService {
  constructor(private router: Router) {}
  initWebRTCAdaptor(videoId, id, noStreamCallback?) {
    var pcConfig = {
      iceServers: [
        {
          urls: "stun:stun1.l.google.com:19302",
        },
      ],
    };

    var sdpConstraints = {
      OfferToReceiveAudio: true,
      OfferToReceiveVideo: true,
    };
    var mediaConstraints = {
      video: false,
      audio: false,
    };

    var appName = "nursemeetz";
    var rtmpForward = null;
    const path = `webrtc.storbeey.com/${appName}/websocket?rtmpForward=${rtmpForward}`;
    var websocketURL = "ws://" + path;

    if (location.protocol.startsWith("https")) {
      websocketURL = "wss://" + path;
    }

    var iceConnected = false;

    var webRTCAdaptor = new WebRTCAdaptor({
      websocket_url: websocketURL,
      mediaConstraints: mediaConstraints,
      peerconnection_config: pcConfig,
      sdp_constraints: sdpConstraints,
      remoteVideoId: videoId,
      isPlayMode: true,
      debug: true,
      callback: function (info, description) {
        const that = this;
        if (info == "initialized") {
          console.log("initialized");
          iceConnected = false;
          webRTCAdaptor.getStreamInfo(id);
        } else if (info == "streamInformation") {
          console.log("stream information");
          webRTCAdaptor.play(id);
        } else if (info == "play_started") {
          console.log("play started");
        } else if (info == "play_finished") {
          console.log("play finished");
          if (iceConnected) {
            const that = this;
            setTimeout(function () {
              webRTCAdaptor.getStreamInfo(id);
            }, 3000);
          } else {
            if (typeof noStreamCallback != "undefined") {
              noStreamCallback();
            }
          }
        } else if (info == "closed") {
          if (typeof description != "undefined") {
            console.log("Connecton closed: " + JSON.stringify(description));
          }
        } else if (info == "bitrateMeasurement") {
          console.debug(description);
          if (
            description.audioBitrate + description.videoBitrate >
            description.targetBitrate
          ) {
            document.getElementById("networkWarning").style.display = "block";
            setTimeout(function () {
              document.getElementById("networkWarning").style.display = "none";
            }, 3000);
          }
        } else if (info == "ice_connection_state_changed") {
          console.debug("ice connection state changed to " + description.state);
          if (
            description.state == "connected" ||
            description.state == "completed"
          ) {
            iceConnected = true;
          }
        }
      },
      callbackError: (error) => {
        console.log("error callback: " + JSON.stringify(error));
        if (error == "no_stream_exist") {
          console.log("ca");
        }
      },
    });
  }
}
