import {
  changeUserName,
  changeUserProfilePicture,
  logOut,
  updateCurrentUserPublicKey,
  uploadImage,
} from 'api/Requests';
import Separator from 'components/common/Separator';
import UserProfile from 'components/users/UserProfile';
import {getPromptDialog} from 'helpers/AlertHelper';
import {saveItemToAsyncStorage} from 'helpers/AsyncStorageHelper';
import {SECRET_KEY} from 'helpers/Constants';
import {pickImageFromGallery} from 'helpers/GalleryHelper';
import {ToastHelper} from 'helpers/ToastHelper';
import React, {useCallback, useRef, useState} from 'react';
import {Button, View} from 'react-native';
import {Asset} from 'react-native-image-picker';
import {useDispatch, useSelector} from 'react-redux';
import {updateUserData} from 'store/actions/auth';
import {Translations} from 'translations/Translations';
import {UseState} from 'types/CommonTypes';
import {ProfileScreenProps} from 'types/NavigationTypes';
import {AuthenticateState} from 'types/StoreTypes';
import {generateKeyPair} from 'utils/crypto';

/**
 * @param {ProfileScreenProps} props
 * @returns {JSX.Element}
 */
const ProfileScreen = props => {
  /** @type {UseState<boolean>} */
  const [isNameChange, setIsNameChange] = useState(false);

  /** @type {React.MutableRefObject<string>} */
  const nameRef = useRef();

  const authedUserState = useSelector(
    /** @param {{auth: AuthenticateState}} state */ state => {
      return state.auth;
    },
  );

  const dispatch = useDispatch();

  const handleLogOut = async () => {
    await logOut();
  };

  const handleKeyPairUpdate = async () => {
    const {publicKey, secretKey} = generateKeyPair();
    await saveItemToAsyncStorage(SECRET_KEY, secretKey.toString());
    const response = await updateCurrentUserPublicKey(
      authedUserState.authedUser,
      publicKey.toString(),
    );

    dispatch(updateUserData(response));

    ToastHelper.showSuccess(Translations.strings.updateKeypairSuccess());
  };

  const onImageRecieved = useCallback(
    /**
     * @param {Asset[]} dataa
     */
    async dataa => {
      const imageLink = await uploadImage(dataa);
      const response = await changeUserProfilePicture(imageLink);
      dispatch(updateUserData(response));
    },
    [dispatch],
  );

  const changeProfilePicture = async () => {
    await pickImageFromGallery(onImageRecieved);
  };

  /**
   * @param {string} name
   */
  const changeName = async name => {
    const response = await changeUserName(name);

    dispatch(updateUserData(response));
    ToastHelper.showSuccess(Translations.strings.requestSuccessfullySent());
  };

  const handleChangeName = async () => {
    setIsNameChange(true);
  };

  const changeLanguage = () => {
    props.navigation.navigate('Languages');
  };

  const onNameConfirmed = () => {
    changeName(nameRef.current);
    nameRef.current = undefined;
    setIsNameChange(false);
  };

  const onNameChangeCancel = () => {
    setIsNameChange(false);
    nameRef.current = undefined;
  };

  /**
   * @param {string} text
   */
  const onNameChangeText = text => {
    nameRef.current = text;
  };

  return (
    <View>
      {getPromptDialog(
        isNameChange,
        Translations.strings.changeName(),
        Translations.strings.enterName(),
        onNameChangeText,
        onNameConfirmed,
        onNameChangeCancel,
      )}

      <UserProfile user={authedUserState.authedUser} />

      <Separator />

      <Button
        title={Translations.strings.changeLanguage()}
        onPress={changeLanguage}
      />
      <Button
        title={Translations.strings.changeProfilePicture()}
        onPress={changeProfilePicture}
      />
      <Button
        title={Translations.strings.changeName()}
        onPress={handleChangeName}
      />
      <Button
        title={Translations.strings.updateKeypair()}
        onPress={handleKeyPairUpdate}
      />
      <Button title={Translations.strings.logout()} onPress={handleLogOut} />
    </View>
  );
};

export default ProfileScreen;
