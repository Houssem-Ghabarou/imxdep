import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Image,
} from "react-native";
import React, { useRef, useState } from "react";
// @ts-ignore
import Video from "@/assets/images/video.svg";
// @ts-ignore
import Attachment from "@/assets/images/attachment.svg";
// @ts-ignore
import Gallery from "@/assets/images/gallery.svg";

import Camera from "./camera/Camera";
import { requestGallery } from "./requestGallery";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
//@ts-ignore
import VideoPlayer, { type VideoPlayerRef } from "react-native-video-player";

const Media = ({
  iamgesSelected,
  setImagesSelected,
}: {
  iamgesSelected: any;
  setImagesSelected: React.Dispatch<React.SetStateAction<any>>;
}) => {
  const playerRef = useRef<VideoPlayerRef>(null);

  const placeholders = Array(5).fill(null);
  const [openCamera, setOpenCamera] = useState(false);

  const pickImage = async () => {
    const permission = await requestGallery();

    if (!permission) {
      alert("Permission to access camera roll is required!");
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      allowsMultipleSelection: true,
      // aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImagesSelected((prev: any[] | null) => {
        const assets = result.assets.map((asset) => ({
          uri: asset.uri,
          name: asset.fileName || "Unnamed",
          type: asset.type || "unknown",
        }));
        if (prev) {
          return [...prev, ...assets];
        } else {
          return assets;
        }
      });
    }
  };
  const pickDocuments = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        multiple: true, // Allows the user to select any file
      });

      if (!result.canceled) {
        const successResult =
          result as DocumentPicker.DocumentPickerSuccessResult;

        setImagesSelected((prevSelectedDocuments: any) => {
          const newDocuments = successResult.assets.map((asset) => ({
            ...asset,
            type: "document",
          }));
          return prevSelectedDocuments
            ? [...prevSelectedDocuments, ...newDocuments]
            : newDocuments;
        });
      } else {
      }
    } catch (error) {}
  };
  // Remove a document from the array
  const removeDocument = (index: number) => {
    setImagesSelected((prevSelectedDocuments: any) =>
      //@ts-ignore
      prevSelectedDocuments.filter((_, i) => i !== index)
    );
  };
  // Additional code snippet to get the document type
  const getFileType = (fileName: string): string => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "pdf":
        return "PDF";
      case "doc":
      case "docx":
        return "Word";
      case "xls":
      case "xlsx":
        return "Excel";
      case "jpg":
        return "Image";
      case "jpeg":
        return "Image";
      case "png":
        return "Image";
      // You can add more cases to fit your criteria
      default:
        return "Unknown";
    }
  };
  return (
    <View style={{ gap: 20 }}>
      {openCamera && (
        <Camera
          openCamera={openCamera}
          setOpenCamera={setOpenCamera}
          setImagesSelected={setImagesSelected}
        />
      )}

      <View
        style={{
          backgroundColor: "#F0F0F0",
          padding: 12,
          borderRadius: 10,
          width: "73%",
        }}
      >
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => pickImage()}
          >
            <Gallery width={40} height={40} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => setOpenCamera(true)}
          >
            <Video width={40} height={40} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={pickDocuments}
          >
            <Attachment width={40} height={40} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Parent view for FlatList */}
      <View style={styles.flatListContainer}>
        <FlatList
          data={iamgesSelected ? iamgesSelected : placeholders}
          horizontal
          keyExtractor={(_, index) => index.toString()}
          renderItem={(item) => {
            if (item?.item?.type === "video") {
              return (
                <View style={styles.placeholderCard}>
                  <VideoPlayer
                    ref={playerRef}
                    endWithThumbnail
                    thumbnail={{
                      uri: item.item.uri,
                    }}
                    source={{
                      uri: item.item.uri,
                    }}
                    style={{
                      width: "100%",
                      height: "100%",
                      // borderRadius: 10,
                    }}
                    showDuration={true}
                  />
                </View>
              );
            }
            if (item?.item?.type === "image") {
              return (
                <View style={styles.placeholderCard}>
                  <Image
                    source={{ uri: item.item.uri }}
                    style={{
                      width: 250,
                      height: 180,
                      borderRadius: 10,
                    }}
                  />
                </View>
              );
            } else if (item?.item?.type === "document") {
              const fileType = getFileType(item.item.name);

              if (fileType === "Image") {
                return (
                  <View style={styles.placeholderCard}>
                    <Image
                      source={{ uri: item.item.uri }}
                      style={{
                        width: 250,
                        height: 180,
                        borderRadius: 10,
                      }}
                    />
                  </View>
                );
              }
              if (
                fileType === "Unknown" ||
                fileType === "PDF" ||
                fileType === "Word" ||
                fileType === "Excel"
              ) {
                return (
                  <View
                    style={[
                      styles.placeholderCard,
                      { justifyContent: "center", alignItems: "center" },
                    ]}
                  >
                    <Text style={{ textAlign: "center" }}>
                      {item.item.name}
                    </Text>
                  </View>
                );
              }
            } else if (item?.item?.type === "placeholder" || !iamgesSelected) {
              return <View style={styles.placeholderCard} />;
            }
            return null; // Explicitly return null if no condition matches
          }}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  container: {
    flexDirection: "row",
    gap: 18,
    marginBottom: 10,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "black",
  },
  flatListContainer: {
    marginTop: 10,
  },
  placeholderCard: {
    width: 250,
    height: 180,
    backgroundColor: "#F0F0F0",
    borderRadius: 10,
    marginRight: 10,
  },
});

export default Media;
