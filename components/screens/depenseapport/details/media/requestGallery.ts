import * as MediaLibrary from "expo-media-library";
import {
  PERMISSIONS,
  RESULTS,
  requestMultiple,
  checkMultiple,
} from "react-native-permissions";
import { Platform } from "react-native";
export const requestGallery = async () => {
  if (Platform.OS === "android") {
    const androidVersion = Platform.Version;

    let permissions = [];

    if (androidVersion >= 34) {
      permissions = [
        PERMISSIONS.ANDROID.READ_MEDIA_VISUAL_USER_SELECTED,
        PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
        PERMISSIONS.ANDROID.READ_MEDIA_VIDEO,
      ];
    } else if (androidVersion === 33) {
      permissions = [
        PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
        PERMISSIONS.ANDROID.READ_MEDIA_VIDEO,
      ];
    } else {
      const permission = await MediaLibrary.requestPermissionsAsync();
      return permission.status === "granted";
    }

    const statuses = await checkMultiple(permissions);

    if (
      statuses[PERMISSIONS.ANDROID.READ_MEDIA_VISUAL_USER_SELECTED] ===
      RESULTS.GRANTED
    ) {
      return true;
    }

    const hasMediaAccess = [
      PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
      PERMISSIONS.ANDROID.READ_MEDIA_VIDEO,
    ].every((permission) => statuses[permission] === RESULTS.GRANTED);

    if (hasMediaAccess) {
      return true;
    }

    const newStatuses = await requestMultiple(permissions);

    if (
      newStatuses[PERMISSIONS.ANDROID.READ_MEDIA_VISUAL_USER_SELECTED] ===
      RESULTS.GRANTED
    ) {
      return true;
    }

    const hasNewMediaAccess = [
      PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
      PERMISSIONS.ANDROID.READ_MEDIA_VIDEO,
    ].every((permission) => newStatuses[permission] === RESULTS.GRANTED);

    if (hasNewMediaAccess) {
      return true;
    }

    return false;
  } else {
    // **iOS Permission Handling**
    const permission = await MediaLibrary.requestPermissionsAsync();
    return permission.status === "granted";
  }
};
