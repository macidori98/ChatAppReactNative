import {changeChatRoomName, getRoomUsers, leaveChatRoom} from 'api/Requests';
import {DataStore} from 'aws-amplify';
import LoadingIndicator from 'components/common/LoadingIndicator';
import UsersListItem from 'components/users/UsersListItem';
import {getDeleteAlert, getLeaveAlert} from 'helpers/AlertHelper';
import {ToastHelper} from 'helpers/ToastHelper';
import {ChatRoomUser, User} from 'models';
import React, {useCallback, useEffect, useLayoutEffect, useState} from 'react';
import {
  Alert,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useSelector} from 'react-redux';
import Theme from 'theme/Theme';
import {Translations} from 'translations/Translations';
import {UseState} from 'types/CommonTypes';
import {DetailsScreenProps} from 'types/NavigationTypes';
import {AuthenticateState} from 'types/StoreTypes';

/**
 * @param {DetailsScreenProps} props
 * @returns {JSX.Element}
 */
const DetailsScreen = props => {
  const {data} = props.route.params;
  /** @type {UseState<User[]>} */
  const [users, setUsers] = useState([]);
  /** @type {UseState<boolean>} */
  const [isLoading, setIsLoading] = useState(true);
  /** @type {UseState<boolean>} */
  const [isGroup, setIsGroup] = useState(false);

  const authedUserState = useSelector(
    /** @param {{auth: AuthenticateState}} state */ state => {
      return state.auth;
    },
  );

  const leaveRoom = useCallback(async () => {
    setIsLoading(true);
    const response = await leaveChatRoom(
      data.id,
      authedUserState.authedUser.id,
    );

    if (response.success) {
      ToastHelper.showSuccess('Successfully left the room');
      props.navigation.reset({routes: [{name: 'Home'}]});
    } else {
      ToastHelper.showError(response.error);
    }
  }, [authedUserState.authedUser.id, data.id, props.navigation]);

  const setHeader = useCallback(
    () => (
      <>
        <TouchableOpacity
          onPress={getLeaveAlert.bind(
            this,
            'Are you sure about leaving the room?',
            leaveRoom,
          )}
          style={{marginHorizontal: Theme.values.margins.marginSmall}}>
          <Icon
            name="log-out-outline"
            color={Theme.colors.error}
            size={Theme.values.headerIcon.height}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            Alert.prompt(
              Translations.strings.changeName(),
              Translations.strings.enterName(),
              [
                {
                  text: Translations.strings.cancel(),
                  style: 'cancel',
                },
                {
                  text: 'OK',
                  onPress: async name => {
                    setIsLoading(true);
                    const response = await changeChatRoomName(data, name);
                    console.log(response);
                    props.navigation.reset({
                      routes: [
                        {name: 'Home'},
                        {name: 'ChatScreen', params: {id: response.id}},
                      ],
                    });
                  },
                },
              ],
              'plain-text',
            );
          }}
          style={{marginHorizontal: Theme.values.margins.marginSmall}}>
          <Icon
            name="create-outline"
            color={Theme.colors.error}
            size={Theme.values.headerIcon.height}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={{marginHorizontal: Theme.values.margins.marginSmall}}>
          <Icon
            name="image-outline"
            color={Theme.colors.error}
            size={Theme.values.headerIcon.height}
          />
        </TouchableOpacity>
      </>
    ),
    [data, leaveRoom, props.navigation],
  );

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerRight: setHeader,
    });
  }, [props.navigation, setHeader]);

  useEffect(() => {
    const fetchData = async () => {
      const roomUsers = await getRoomUsers(data.id);

      setUsers(roomUsers);
      setIsGroup(data.groupName ? true : false);
      setIsLoading(false);
    };

    fetchData();
  }, [data]);

  const getGroupSections = () => {
    const members = users.filter(u => u.id !== data.Admin.id);

    return [
      {
        title: 'Admin',
        data: [data.Admin],
      },
      {
        title: 'Conversation members',
        data: members,
      },
    ];
  };

  const getSections = () => {
    return [
      {
        title: 'Conversation members',
        data: users,
      },
    ];
  };

  /**
   * @param {User} user
   */
  const confirmDelete = user => {
    if (isGroup && user !== data.Admin) {
      getDeleteAlert(
        `Are you sure you want to delete ${user.userName} from the group?`,
        () => removeUserFromRoom(user),
      );
    }
  };

  /**
   * @param {User} user
   */
  const removeUserFromRoom = async user => {
    const chatroomuser = (await DataStore.query(ChatRoomUser)).filter(
      u => u.user.id === user.id && u.chatRoom.id === data.id,
    );
    await DataStore.delete(ChatRoomUser, u => u.id('eq', chatroomuser[0].id));
    setUsers(prev => {
      const index = prev.indexOf(user);
      prev.splice(index, 1);
      return [...prev];
    });
  };

  return (
    <View style={isLoading ? {flex: 1} : undefined}>
      {!isLoading && (
        <SectionList
          sections={isGroup ? getGroupSections() : getSections()}
          renderItem={({item}) => (
            <UsersListItem onPress={confirmDelete} user={item} />
          )}
          renderSectionFooter={() => <View style={styles.footer} />}
          renderSectionHeader={({section: {title}}) => (
            <View style={styles.header}>
              <Text style={styles.title}>{title}</Text>
            </View>
          )}
        />
      )}
      {isLoading && <LoadingIndicator />}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 30,
    backgroundColor: Theme.colors.lightGrey,
    justifyContent: 'center',
    paddingHorizontal: Theme.values.paddings.paddingLarge,
  },
  title: {
    fontWeight: 'bold',
  },
  footer: {
    height: 15,
  },
});

export default DetailsScreen;
