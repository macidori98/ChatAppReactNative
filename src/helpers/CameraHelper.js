import {Platform} from 'react-native';
import {Asset} from 'react-native-image-picker';
import {
  checkMultiple,
  PERMISSIONS,
  requestMultiple,
  RESULTS,
} from 'react-native-permissions';

const IOSCameraPermissions = [
  PERMISSIONS.IOS.CAMERA,
  PERMISSIONS.IOS.MICROPHONE,
  PERMISSIONS.IOS.PHOTO_LIBRARY,
];

const androidCameraPermissions = [
  PERMISSIONS.ANDROID.CAMERA,
  PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
  PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
];

/**
 * @param {(onDataRecievedAction?: (data: Asset[]) => void) => void} cameraAction
 * @param {(data: Asset[]) => void} [onDataRecievedAction]
 */
export const getPermissions = async (cameraAction, onDataRecievedAction) => {
  const permissionsArray =
    Platform.OS === 'android' ? androidCameraPermissions : IOSCameraPermissions;

  const result = await checkMultiple(permissionsArray);
  let areAllPermissionsGranted = true;
  for (const key in result) {
    const element = result[key];
    if (element === RESULTS.DENIED) {
      areAllPermissionsGranted = false;
    }
  }

  if (!areAllPermissionsGranted) {
    const resultRequest = await requestMultiple(permissionsArray);

    areAllPermissionsGranted = true;
    for (const key in resultRequest) {
      const element = resultRequest[key];
      if (element === RESULTS.DENIED) {
        areAllPermissionsGranted = false;
      }
    }
  }

  if (areAllPermissionsGranted) {
    cameraAction(onDataRecievedAction);
  }
};
