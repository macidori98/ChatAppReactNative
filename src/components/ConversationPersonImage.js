import Images from 'common/Images';
import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import Theme from 'theme/Theme';
import {ConversationPersonImageProps} from 'types/ComponentPropsTypes';

/**
 * @param {ConversationPersonImageProps} props
 * @returns {JSX.Element}
 */
const ConversationPersonImage = props => {
  const styles = StyleSheet.create({
    image: {
      width: props.imageStyle?.width ?? Theme.values.defaultRoundImage.width,
      height: props.imageStyle?.height ?? Theme.values.defaultRoundImage.height,
      borderRadius:
        props.imageStyle?.width && props.imageStyle?.height
          ? typeof props.imageStyle?.width === 'number' &&
            typeof props.imageStyle?.height === 'number'
            ? (props.imageStyle?.width + props.imageStyle?.height) / 2
            : 0
          : (Theme.values.defaultRoundImage.height +
              Theme.values.defaultRoundImage.width) /
            2,
      overflow: 'hidden',
      borderWidth: Theme.values.borderWidth.small,
      borderColor: Theme.colors.lightGrey,
    },
  });
  return (
    <View style={Theme.styles.center}>
      <Image
        source={props.imageSource ? {uri: props.imageSource} : Images.testImage}
        style={{...styles.image, ...props.imageStyle}}
      />
    </View>
  );
};

export default ConversationPersonImage;
