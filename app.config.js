import withPermissionsSetup from "./plugins/with-permissions-setup";

export default {
  expo: {
    name: "IMXDEP",
    slug: "IMXDEP",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      googleServicesFile: "./GoogleService-Info.plist",
      bundleIdentifier: "com.imaxeam.imxdep",
      infoPlist: {
        NSCameraUsageDescription:
          "The app requires access to your camera to capture photos and videos.",
        NSMicrophoneUsageDescription:
          "The app requires access to your microphone to record audio for videos or voice features.",
        NSPhotoLibraryUsageDescription:
          "The app requires access to your photo library to upload and share photos.",
        NSPhotoLibraryAddUsageDescription:
          "The app accesses your photos to let you share them with your friends.",
      },
    },
    android: {
      permissions: [
        "CAMERA",
        "RECORD_AUDIO",
        "READ_MEDIA_IMAGES",
        "READ_MEDIA_VIDEO",
        "READ_MEDIA_AUDIO",
        "WRITE_EXTERNAL_STORAGE", // Optional for writing before API 29
        "READ_EXTERNAL_STORAGE", // Legacy support (before API 33)
      ],
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      googleServicesFile: "./google-services.json",
      package: "com.imaxeam.imxdep",
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      [
        "expo-video",
        {
          supportsBackgroundPlayback: true,
          supportsPictureInPicture: true,
        },
      ],
      withPermissionsSetup,

      [
        "react-native-permissions",
        {
          iosPermissions: ["Camera", "Microphone"],
        },
      ],
      [
        "expo-image-picker",
        {
          photosPermission:
            "The app accesses your photos to let you share them with your friends.",
        },
      ],
      [
        "expo-camera",
        {
          cameraPermission: "Allow $(PRODUCT_NAME) to access your camera",
          microphonePermission:
            "Allow $(PRODUCT_NAME) to access your microphone",
          recordAudioAndroid: true,
        },
      ],
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
        },
      ],
      "@react-native-firebase/app",
      "@react-native-firebase/auth",
      "@react-native-firebase/crashlytics",
      [
        "expo-build-properties",
        {
          ios: {
            useFrameworks: "static",
          },
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
  },
};
