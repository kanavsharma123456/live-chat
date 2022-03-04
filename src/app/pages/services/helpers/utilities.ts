import { Capacitor } from "@capacitor/core";

export function isWeb() {
  return Capacitor.getPlatform() === "web";
}

export function dataURItoBlob(dataURI) {
  let byteString;
  if (dataURI.split(",")[0].indexOf("base64") >= 0)
    byteString = atob(dataURI.split(",")[1]);
  else byteString = unescape(dataURI.split(",")[1]);

  const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
  const ia = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ia], { type: mimeString });
}
export function checkFileType(name) {
  if (name.includes("image")) {
    return "img";
  } else if (name.includes("video")) {
    return "video";
  } else if (name.includes("audio")) {
    return "audio";
  } else {
    return "doc";
  }
}
