import {
  androidCameraPermissions,
  getPermissions,
  IOSCameraPermissions,
} from 'helpers/PermissionsHelper';
import {Platform} from 'react-native';
import {Asset, launchImageLibrary} from 'react-native-image-picker';

/**
 * @param {(data: Asset[])=>void} [onResultRecieved]
 */
const openGallery = async onResultRecieved => {
  const result = await launchImageLibrary({
    mediaType: 'photo',
    includeBase64: true,
    includeExtra: true,
  });
  if (!result.didCancel) {
    onResultRecieved?.(result.assets);
  }
};

/**
 * @param {(data: Asset[])=>void} [onResultRecieved]
 */
export const pickImageFromGallery = async onResultRecieved => {
  await getPermissions(
    openGallery,
    Platform.OS === 'android' ? androidCameraPermissions : IOSCameraPermissions,
    onResultRecieved,
  );
};

/**
 * @param {string} uri
 * @returns {Promise<Blob>}
 */
export const getFileBlob = async uri => {
  if (!uri) {
    return null;
  }

  const response = await fetch(uri);
  const blob = await response.blob();
  return blob;
};
