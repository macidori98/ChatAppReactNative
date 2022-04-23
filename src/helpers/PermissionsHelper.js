import {DocumentPickerResponse} from 'react-native-document-picker';
import {Asset} from 'react-native-image-picker';
import {
  checkMultiple,
  Permission,
  PERMISSIONS,
  requestMultiple,
  RESULTS,
} from 'react-native-permissions';

export const IOSCameraPermissions = [
  PERMISSIONS.IOS.CAMERA,
  PERMISSIONS.IOS.MICROPHONE,
  PERMISSIONS.IOS.PHOTO_LIBRARY,
];

export const androidCameraPermissions = [
  PERMISSIONS.ANDROID.CAMERA,
  PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
  PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
];

export const IOSStoragePermissions = [PERMISSIONS.IOS.PHOTO_LIBRARY];

export const androidStoragePermissions = [
  PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
  PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
];

export const androidMicPermission = [
  PERMISSIONS.ANDROID.RECORD_AUDIO,
  PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
  PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
];

export const iosMicPermission = [PERMISSIONS.IOS.MICROPHONE];

/**
 * @param {(onDataRecievedAction?: (data: Asset[]) => void) => void} action
 * @param {Permission[]} permissions
 * @param {(data: Asset[]|DocumentPickerResponse[]) => void} [onDataRecievedAction]
 */
export const getPermissions = async (
  action,
  permissions,
  onDataRecievedAction,
) => {
  const result = await checkMultiple(permissions);
  let areAllPermissionsGranted = true;
  for (const key in result) {
    const element = result[key];
    if (element === RESULTS.DENIED) {
      areAllPermissionsGranted = false;
    }
  }

  if (!areAllPermissionsGranted) {
    const resultRequest = await requestMultiple(permissions);

    areAllPermissionsGranted = true;
    for (const key in resultRequest) {
      const element = resultRequest[key];
      if (element === RESULTS.DENIED) {
        areAllPermissionsGranted = false;
      }
    }
  }

  if (areAllPermissionsGranted) {
    action(onDataRecievedAction);
  }
};
