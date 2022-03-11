export interface StreamPublishToken {
  tokenId: string;
  streamId: string;
  expireDate: number;
  type: string;
  roomId?: any;
}

export interface VideoCall {
  id: number;
  patient_stream_id: string;
  nurse_stream_id: string;
  recording_link?: any;
  total_time_in_secs: number;
  patient_request_id: number;
  created_at: Date;
  updated_at: Date;
}

export interface streamData {
  stream_publish_token: StreamPublishToken;
  video_call: VideoCall;
}

export interface getDetailsResponse {
  data: streamData;
}

export interface VideoData {
  video_call: VideoCall;
}

export interface ringResponse {
  message: string;
  data: VideoData;
}
