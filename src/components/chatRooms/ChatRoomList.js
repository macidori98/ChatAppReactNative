import {useHeaderHeight} from '@react-navigation/elements';
import ChatRoomListItem from 'components/chatRooms/ChatRoomListItem';
import React, {useState} from 'react';
import {Dimensions, FlatList, Text, View} from 'react-native';
import Theme from 'theme/Theme';
import {Translations} from 'translations/Translations';
import {UseState} from 'types/CommonTypes';
import {ChatRoomListProps} from 'types/ComponentPropsTypes';

/**
 * @param {ChatRoomListProps} props
 * @returns {JSX.Element}
 */
const ChatRoomList = props => {
  /** @type {UseState<boolean>} */
  const [isRefreshing, setIsRefreshing] = useState(false);

  const screenHeaderHeight = useHeaderHeight();
  const screenDimensions = Dimensions.get('screen');

  const style = {
    height: screenDimensions.height - screenHeaderHeight,
    width: screenDimensions.width,
    ...Theme.styles.center,
  };

  return (
    <View style={Theme.styles.screen}>
      <FlatList
        style={Theme.styles.screen}
        refreshing={isRefreshing}
        onRefresh={() => {
          setIsRefreshing(true);
          props.onRefresh();
        }}
        data={props.data}
        renderItem={({item}) => (
          <ChatRoomListItem onPress={props.onPress} data={item} />
        )}
        showsVerticalScrollIndicator={false}
        onEndReached={info => {
          //console.log(info);
        }}
        ListEmptyComponent={() => {
          return (
            <View style={style}>
              <Text>{Translations.strings.emptyList()}</Text>
            </View>
          );
        }}
      />
    </View>
  );
};

export default ChatRoomList;
