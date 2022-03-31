import ChatRooms from 'assets/dummy-data/ChatRooms';
import ChatRoomList from 'components/chatRooms/ChatRoomList';
import ConversationPersonImage from 'components/ConversationPersonImage';
import React, {useLayoutEffect} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Theme from 'theme/Theme';
import {PreviewChat} from 'types/ChatTypes';
import {HomeScreenProps} from 'types/NavigationTypes';
/**
 * @param {HomeScreenProps} props
 * @returns {JSX.Element}
 */
const HomeScreen = props => {
  const {navigation} = props;

  /** @type {PreviewChat[]} */
  const data = ChatRooms;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: prop => {
        return (
          <>
            <TouchableOpacity
              style={{marginHorizontal: Theme.values.margins.marginSmall}}>
              <Icon
                name="camera-outline"
                color={Theme.colors.black}
                size={Theme.values.headerIcon.height}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{marginHorizontal: Theme.values.margins.marginSmall}}>
              <Icon
                name="pencil-outline"
                color={Theme.colors.black}
                size={Theme.values.headerIcon.height}
              />
            </TouchableOpacity>
          </>
        );
      },
      headerLeft: prop => {
        return (
          <TouchableOpacity
            style={{marginHorizontal: Theme.values.margins.marginSmall}}>
            <ConversationPersonImage
              imageStyle={styles.icon}
              imageSource={
                'https://kutyubazar.hu/media/catalog/product/cache/1/image/5f7b60b58668a14927e0229ce4c846ab/m/a/maci_borito.jpg'
              }
            />
          </TouchableOpacity>
        );
      },
    });
  }, [navigation]);

  /**
   * @param {string} chatRoomId
   */
  const onPress = chatRoomId => {
    //search for corresponding chat
    props.navigation.navigate('ChatScreen', {id: chatRoomId});
  };

  return (
    <>
      <ChatRoomList onPress={onPress} data={data} />
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  icon: {
    width: Theme.values.headerIcon.width,
    height: Theme.values.headerIcon.height,
  },
});
