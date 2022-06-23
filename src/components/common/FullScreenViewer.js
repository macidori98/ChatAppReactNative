// import {S3Image} from 'aws-amplify-react-native/dist/Storage';
import {Storage} from 'aws-amplify';
import Images from 'common/Images';
import LoadingIndicator from 'components/common/LoadingIndicator';
import React, {useCallback, useEffect, useState} from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Theme from 'theme/Theme';
import {Translations} from 'translations/Translations';
import {UseState} from 'types/CommonTypes';
import {FullScreenProps} from 'types/NavigationTypes';
import {onShare} from 'utils/Utils';

/**
 * @param {FullScreenProps} props
 * @returns {JSX.Element}
 */
const FullScreenViewer = props => {
  /** @type {UseState<string>} */
  const [imageUri, setImageUri] = useState(undefined);

  const loadImage = useCallback(async () => {
    const uri = await Storage.get(props.route.params.imageId);
    setImageUri(uri);
  }, [props.route.params.imageId]);

  useEffect(() => {
    loadImage();
  }, [loadImage]);

  return (
    <SafeAreaView>
      {!imageUri && (
        <View
          style={{
            ...Theme.styles.center,
            ...Theme.styles.screen,
          }}>
          <LoadingIndicator />
        </View>
      )}
      {imageUri && (
        <TouchableOpacity
          style={styles.imageContainer}
          onPress={() =>
            onShare(props.route.params.imageId, props.route.params.message)
          }>
          <Image
            style={styles.image}
            source={{uri: imageUri}}
            defaultSource={Images.loadImage}
          />
        </TouchableOpacity>
      )}
      <View style={styles.backButtonContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={props.navigation.goBack}>
          <Text style={{color: Theme.colors.white}}>
            {Translations.strings.back()}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default FullScreenViewer;

const styles = StyleSheet.create({
  imageContainer: {
    height: '100%',
    width: '100%',
  },
  image: {
    resizeMode: 'contain',
    height: '100%',
    width: '100%',
    borderRadius: Theme.values.radius.large,
  },
  backButtonContainer: {
    position: 'absolute',
    width: '100%',
    height: 100,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  backButton: {
    position: 'absolute',
    bottom: Theme.values.margins.marginMedium,
    left: Theme.values.margins.marginMedium,
  },
});
