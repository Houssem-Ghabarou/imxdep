import { CameraView, Camera } from "expo-camera";
import { useState, useRef, useEffect } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  Image,
  Modal,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import { useIsFocused } from "@react-navigation/native";
export default function CameraFunction({
  openCamera,
  setOpenCamera,
  setImagesSelected,
}: {
  openCamera: boolean;
  setOpenCamera: React.Dispatch<React.SetStateAction<boolean>>;
  setImagesSelected: React.Dispatch<React.SetStateAction<any[]>>;
}) {
  const isFocused = useIsFocused();
  const [cameraPermission, setCameraPermission] = useState<boolean | undefined>(
    undefined
  );
  const [mediaLibraryPermission, setMediaLibraryPermission] = useState<
    boolean | undefined
  >(undefined);
  const [micPermission, setMicPermission] = useState<boolean | undefined>(
    undefined
  );
  const [cameraMode, setCameraMode] = useState("picture");
  const [facing, setFacing] = useState("back");
  const [photo, setPhoto] = useState<
    | {
        uri: string;
        base64?: string | undefined;
        width?: number | undefined;
        height?: number | undefined;
      }
    | undefined
  >();
  const [video, setVideo] = useState<{ uri: string } | undefined>();

  const [flashMode, setFlashMode] = useState("off");
  const [recording, setRecording] = useState(false);
  const [zoom, setZoom] = useState(0);
  let cameraRef = useRef();
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      if (!isFocused) {
        return;
      }
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      const mediaLibraryPermission =
        await MediaLibrary.requestPermissionsAsync();
      const microphonePermission =
        await Camera.requestMicrophonePermissionsAsync();
      setCameraPermission(cameraPermission.status === "granted");
      setMediaLibraryPermission(mediaLibraryPermission.status === "granted");
      setMicPermission(microphonePermission.status === "granted");
    })();
  }, [isFocused]);

  if (
    cameraPermission === undefined ||
    mediaLibraryPermission === undefined ||
    micPermission === undefined
  ) {
    return;
  } else if (!cameraPermission) {
    return (
      <Text>
        Permission for camera not granted. Please change this in settings
      </Text>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  function toggleFlash() {
    setFlashMode((current) => (current === "on" ? "off" : "on"));
  }

  const takePic = async () => {
    let options = {
      quality: 1, //Specifies the quality of the captured image. A value of 1 indicates maximum quality, whereas lower values reduce quality (and file size).
      // base64: true, //Includes the image's Base64 representation in the returned object. This is useful for embedding the image directly in data URIs or for immediate upload to servers.
      // exif: false, //Disables the inclusion of EXIF metadata in the image (e.g., location, device info). Setting this to true would include such metadata.
      skipProcessing: true,
    };

    try {
      //@ts-ignore
      const photo = await cameraRef.current.takePictureAsync(options);
      const fileInfo = await FileSystem.getInfoAsync(photo.uri);

      if (fileInfo.exists) {
        // wait 45
        setVideo(undefined);
        setPhoto(photo); //
      } else {
      }
    } catch (error) {}
  };

  //Video Recorder
  async function recordVideo() {
    setRecording(true);
    //@ts-ignore
    cameraRef.current
      .recordAsync({
        maxDuration: 30,
      })
      //@ts-ignore
      .then((newVideo) => {
        setPhoto(undefined);
        setVideo(newVideo);
        setRecording(false);
      });
  }

  function stopRecording() {
    setRecording(false);
    //@ts-ignore
    cameraRef.current.stopRecording();
  }
  function retake() {
    setPhoto(undefined);
    setVideo(undefined);
  }

  return (
    <View style={styles.container}>
      <Modal
        visible={openCamera}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setOpenCamera(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: "100%",
              height: "100%",
            }}
          >
            {photo?.uri || video?.uri ? (
              // Show image preview
              <View style={styles.previewContainer}>
                <Image
                  source={{ uri: photo?.uri || video?.uri }}
                  style={styles.imagePreview}
                />

                <View style={styles.previewButtons}>
                  <TouchableOpacity onPress={retake}>
                    <Ionicons name="refresh-outline" size={32} color="white" />
                    <Text style={styles.previewButtonText}>Retake</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      if (video?.uri) {
                        setImagesSelected((prev) => {
                          if (prev) {
                            return [
                              ...prev,
                              {
                                uri: video.uri,
                                type: "video",
                                name: video.uri.split("/").pop(),
                              },
                            ];
                          } else {
                            return [
                              {
                                uri: video.uri,
                                type: "video",
                                name: video.uri.split("/").pop(),
                              },
                            ];
                          }
                        });
                      } else if (photo?.uri) {
                        setImagesSelected((prev) => {
                          if (prev) {
                            return [
                              ...prev,
                              {
                                uri: photo.uri,
                                type: "image",
                                name: photo.uri.split("/").pop(),
                              },
                            ];
                          } else {
                            return [
                              {
                                uri: photo.uri,
                                type: "image",
                                name: photo.uri.split("/").pop(),
                              },
                            ];
                          }
                        });
                      }

                      setOpenCamera(false);

                      // maybe pass photo to parent or navigate
                    }}
                  >
                    <Ionicons
                      name="checkmark-circle-outline"
                      size={32}
                      color="white"
                    />
                    <Text style={styles.previewButtonText}>Use Photo</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              //@ts-ignore
              <CameraView
                style={styles.camera}
                facing={facing}
                ref={cameraRef}
                flash={flashMode}
                mode={cameraMode}
                zoom={zoom}
              >
                <View style={styles.buttonContainer}>
                  {!recording && (
                    <TouchableOpacity
                      style={styles.button}
                      onPress={toggleCameraFacing}
                    >
                      <Ionicons
                        name="camera-reverse-outline"
                        size={20}
                        color="white"
                      />
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => setCameraMode("picture")}
                  >
                    <Ionicons name="camera-outline" size={20} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => setCameraMode("video")}
                  >
                    <Ionicons name="videocam-outline" size={20} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.button} onPress={toggleFlash}>
                    <Text>
                      {flashMode === "on" ? (
                        <Ionicons
                          name="flash-outline"
                          size={20}
                          color="white"
                        />
                      ) : (
                        <Ionicons
                          name="flash-off-outline"
                          size={20}
                          color="white"
                        />
                      )}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.shutterContainer}>
                  {cameraMode === "picture" ? (
                    <TouchableOpacity style={styles.button} onPress={takePic}>
                      <Ionicons
                        name="aperture-outline"
                        size={40}
                        color="white"
                      />
                    </TouchableOpacity>
                  ) : recording ? (
                    <TouchableOpacity
                      style={styles.button}
                      onPress={stopRecording}
                    >
                      <Ionicons
                        name="stop-circle-outline"
                        size={40}
                        color="red"
                      />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={styles.button}
                      onPress={recordVideo}
                    >
                      <Ionicons
                        name="play-circle-outline"
                        size={40}
                        color="white"
                      />
                    </TouchableOpacity>
                  )}
                </View>
              </CameraView>
            )}

            <TouchableOpacity
              onPress={() => setOpenCamera(false)}
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                padding: 10,
                borderRadius: 5,
              }}
            >
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  previewContainer: {
    flex: 1,
  },

  imagePreview: {
    width: "100%",
    height: "100%",
  },

  previewButtons: {
    flexDirection: "row",
    position: "absolute",
    bottom: 0,
    justifyContent: "space-around",
    width: "100%",
    padding: 20,
  },

  previewButtonText: {
    color: "white",
    textAlign: "center",
    marginTop: 5,
  },
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 20,
  },
  shutterContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    margin: 20,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  btnContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    backgroundColor: "white",
  },
  btn: {
    justifyContent: "center",
    margin: 10,
    elevation: 5,
  },
  imageContainer: {
    height: "95%",
    width: "100%",
  },
  preview: {
    alignSelf: "stretch",
    flex: 1,
    width: "auto",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
