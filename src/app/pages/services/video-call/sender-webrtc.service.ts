import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { WebRTCAdaptor } from "./webrtc_adaptor.js";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class AlertsService {
  webRTCAdaptor: WebRTCAdaptor;
  autoRepublishEnabled: Boolean;
  publishImmediately: Boolean;
  websocketURL: string;
  appName: string;
  rtmpForward: string | null;
  pcConfig: any;
  sdpConstraints: any;
  mediaConstraints: any;
  debug: Boolean;
  maxVideoBitrateKbps: string;
  subscriberId: string | null;
  subscriberCode: string | null;
  streamId: string;
  streamToken: string;
  streamName: string | null;
  autoRepublishIntervalJob: any;

  constructor(private http: HttpClient, private router: Router) {
    this.rtmpForward = null;
    this.appName = "nursemeetz";
    this.autoRepublishEnabled = true;
    this.publishImmediately = true;
    this.debug = true;
    this.subscriberId = null;
    this.subscriberCode = null;
    this.maxVideoBitrateKbps = "unlimited";

    const path = `webrtc.storbeey.com/${this.appName}/websocket?rtmpForward=${this.rtmpForward}`;
    this.websocketURL = "ws://" + path;
    if (location.protocol.startsWith("https")) {
      this.websocketURL = "wss://" + path;
    }
    this.pcConfig = {
      iceServers: [
        {
          urls: "stun:stun1.l.google.com:19302",
        },
      ],
    };
    this.sdpConstraints = {
      OfferToReceiveAudio: false,
      OfferToReceiveVideo: false,
    };
    this.mediaConstraints = {
      video: { facingMode: "user" },
      audio: true,
    };
  }

  toggleFacingMode = () => {
    this.mediaConstraints.video.facingMode =
      this.mediaConstraints.video.facingMode == "user" ? "environment" : "user";
    this.webRTCAdaptor.switchVideoCameraCapture(
      this.streamId,
      undefined,
      this.mediaConstraints.video.facingMode
    );
  };

  toggleVideoCam() {
    this.webRTCAdaptor.toggleVideoCam();
  }

  toggleMic() {
    const localVideo = <HTMLVideoElement>document.getElementById("senderVideo");
    localVideo.muted = !localVideo.muted;
  }

  initWebRTCAdaptor(
    videoId: string,
    streamId: string,
    streamToken: string,
    streamName: string
  ) {
    this.streamId = streamId;
    this.streamToken = streamToken;
    this.streamName = streamName;

    this.webRTCAdaptor = new WebRTCAdaptor({
      websocket_url: this.websocketURL,
      mediaConstraints: this.mediaConstraints,
      peerconnection_config: this.pcConfig,
      sdp_constraints: this.sdpConstraints,
      localVideoId: videoId,
      debug: this.debug,
      bandwidth: this.maxVideoBitrateKbps,
      dataChannelEnabled: true,
      callback: (info: string, obj: any) => {
        if (info === "initialized") {
          console.log("initialized");
          if (this.publishImmediately) {
            this.webRTCAdaptor.publish(
              this.streamId,
              this.streamToken,
              this.subscriberId,
              this.subscriberCode,
              this.streamName
            );
          }
        } else if (info == "publish_started") {
          console.log("publish started");
          // if (document.getElementById("localVideo")) {
          //   this.muteLocalVideo();
          // }
          if (
            this.autoRepublishEnabled &&
            this.autoRepublishIntervalJob == null
          ) {
            this.autoRepublishIntervalJob = setInterval(() => {
              this.checkAndRepublishIfRequired(videoId);
            }, 3000);
          }
        } else if (info == "publish_finished") {
          console.log("publish finished");
        } else if (info == "closed") {
          if (typeof obj != "undefined") {
            console.log("Connecton closed: " + JSON.stringify(obj));
          }
        } else if (info == "pong") {
        } else if (info == "refreshConnection") {
          this.checkAndRepublishIfRequired(videoId);
        } else if (info == "ice_connection_state_changed") {
          console.log("iceConnectionState Changed: ", JSON.stringify(obj));
        } else {
          console.log(info + " notification received");
        }
      },
      callbackError: function (error, message) {
        console.log("error callback: " + JSON.stringify(error));
        var errorMessage = JSON.stringify(error);
        if (typeof message != "undefined") {
          errorMessage = message;
        }
        var errorMessage = JSON.stringify(error);
        if (error.indexOf("NotFoundError") != -1) {
          errorMessage =
            "Camera or Mic are not found or not allowed in your device";
        } else if (
          error.indexOf("NotReadableError") != -1 ||
          error.indexOf("TrackStartError") != -1
        ) {
          errorMessage =
            "Camera or Mic is being used by some other process that does not let read the devices";
        } else if (
          error.indexOf("OverconstrainedError") != -1 ||
          error.indexOf("ConstraintNotSatisfiedError") != -1
        ) {
          errorMessage =
            "There is no device found that fits your video and audio constraints. You may change video and audio constraints";
        } else if (
          error.indexOf("NotAllowedError") != -1 ||
          error.indexOf("PermissionDeniedError") != -1
        ) {
          errorMessage = "You are not allowed to access camera and mic.";
        } else if (error.indexOf("TypeError") != -1) {
          errorMessage = "Video/Audio is required";
        } else if (error.indexOf("getUserMediaIsNotAllowed") != -1) {
          errorMessage =
            "You are not allowed to reach devices from an insecure origin, please enable ssl";
        } else if (error.indexOf("WebSocketNotConnected") != -1) {
          errorMessage = "WebSocket Connection is disconnected.";
        }
      },
    });
  }

  checkAndRepublishIfRequired(videoId) {
    if (!this.streamId) {
      return;
    }
    const iceState = this.webRTCAdaptor.iceConnectionState(this.streamId);
    console.log("Ice state checked = " + iceState);
    if (
      iceState == null ||
      iceState == "failed" ||
      iceState == "disconnected"
    ) {
      this.webRTCAdaptor.stop(this.streamId);
      this.webRTCAdaptor.closePeerConnection(this.streamId);
      this.webRTCAdaptor.closeWebSocket();
      this.initWebRTCAdaptor(
        videoId,
        this.streamId,
        this.streamToken,
        this.streamName
      );
    }
  }

  closeConnection() {
    this.webRTCAdaptor.stop(this.streamId);
    this.webRTCAdaptor.closeStream();
    this.webRTCAdaptor.closeWebSocket();
    this.streamId = null;
    this.streamToken = null;
    this.streamName = null;
    this.webRTCAdaptor = null;
    this.router.navigate(["/"]);
  }
}
