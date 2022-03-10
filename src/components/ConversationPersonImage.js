import Images from 'common/Images';
import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import Theme from 'theme/Theme';

/**
 * @param {{imageSource: string, imageStyle?: object}} props
 * @returns {JSX.Element}
 */
const ConversationPersonImage = props => {
  const styles = StyleSheet.create({
    image: {
      width: props.imageStyle?.width ?? 55,
      height: props.imageStyle?.height ?? 55,
      borderRadius:
        props.imageStyle?.width && props.imageStyle?.height
          ? (props.imageStyle?.width + props.imageStyle?.height) / 2
          : 55 / 2,
      overflow: 'hidden',
      borderWidth: 1,
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
