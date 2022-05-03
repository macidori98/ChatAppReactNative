import {DataStore} from 'aws-amplify';
import LoadingIndicator from 'components/common/LoadingIndicator';
import UsersListItem from 'components/users/UsersListItem';
import {ChatRoomUser, User} from 'models';
import React, {useEffect, useState} from 'react';
import {Alert, SectionList, Text, View} from 'react-native';
import Theme from 'theme/Theme';
import {UseState} from 'types/CommonTypes';

/**
 * @param {import('types/NavigationTypes').DetailsScreenProps} props
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

  useEffect(() => {
    const fetchData = async () => {
      const usersResponse = (await DataStore.query(ChatRoomUser))
        .filter(u => u.chatRoom.id === data.id)
        .map(u => u.user);

      setUsers(usersResponse);
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
      Alert.alert(
        'Confirm delete',
        `Are you sure you want to delete ${user.name} from the group?`,
        [
          {
            text: 'Delete',
            onPress: () => removeUserFromRoom(user),
            style: 'destructive',
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ],
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
    <View>
      {!isLoading && (
        <SectionList
          sections={isGroup ? getGroupSections() : getSections()}
          renderItem={({item}) => (
            <UsersListItem onPress={confirmDelete} user={item} />
          )}
          renderSectionFooter={() => <View style={{height: 15}} />}
          renderSectionHeader={({section: {title}}) => (
            <View
              style={{
                height: 30,
                backgroundColor: Theme.colors.lightGrey,
                justifyContent: 'center',
                paddingHorizontal: Theme.values.paddings.paddingLarge,
              }}>
              <Text style={{fontWeight: 'bold'}}>{title}</Text>
            </View>
          )}
        />
      )}
      {isLoading && <LoadingIndicator />}
    </View>
  );
};

export default DetailsScreen;
