import {
  changeChatRoomImage,
  changeChatRoomName,
  getRoomUsers,
  leaveChatRoom,
  uploadImage,
} from 'api/Requests';
import {DataStore} from 'aws-amplify';
import LoadingIndicator from 'components/common/LoadingIndicator';
import UsersListItem from 'components/users/UsersListItem';
import {
  getInteractiveDialog,
  getPromptDialog,
  getSimpleDialog,
} from 'helpers/AlertHelper';
import {pickImageFromGallery} from 'helpers/GalleryHelper';
import {ToastHelper} from 'helpers/ToastHelper';
import {ChatRoomUser, User} from 'models';
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Asset} from 'react-native-image-picker';
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
  /** @type {UseState<boolean>} */
  const [isDialogShown, setIsDialogShown] = useState();
  /** @type {UseState<boolean>} */
  const [isLeaveDialogShown, setIsLeaveDialogShown] = useState();
  /** @type {UseState<boolean>} */
  const [isChangeGroupNameDialogShown, setIsChangeGroupNameDialogShown] =
    useState();
  /** @type {UseState<boolean>} */
  const [isDeleteDialogShown, setIsDeleteDialogShown] = useState();
  /** @type {React.MutableRefObject<User>} */
  const userRef = useRef();
  /** @type {React.MutableRefObject<string>} */
  const groupNameRef = useRef();

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
      ToastHelper.showSuccess(Translations.strings.successLeaveGroup());
      props.navigation.reset({routes: [{name: 'Home'}]});
    } else {
      ToastHelper.showError(response.error);
    }
  }, [authedUserState.authedUser.id, data.id, props.navigation]);

  const onChangeGroupName = useCallback(
    /**
     * @param {string} name
     */
    async name => {
      if (name.length > 8) {
        setIsLoading(true);
        const response = await changeChatRoomName(data, name);
        props.navigation.reset({
          routes: [
            {name: 'Home'},
            {name: 'ChatScreen', params: {id: response.id}},
          ],
        });
      } else {
        setIsDialogShown(true);
      }
    },
    [data, props.navigation],
  );

  const onImageRecieved = useCallback(
    /**
     * @param {Asset[]} dataa
     */
    async dataa => {
      setIsLoading(true);
      const imageLink = await uploadImage(dataa);
      const response = await changeChatRoomImage(data, imageLink);
      props.navigation.reset({
        routes: [
          {name: 'Home'},
          {name: 'ChatScreen', params: {id: response.id}},
        ],
      });
    },
    [data, props.navigation],
  );

  const setHeader = useCallback(
    () => (
      <>
        {getInteractiveDialog(
          isLeaveDialogShown,
          Translations.strings.leave(),
          Translations.strings.leavingConfirmation(),
          leaveRoom,
          () => {
            setIsLeaveDialogShown(false);
          },
        )}
        <TouchableOpacity
          onPress={() => {
            setIsLeaveDialogShown(true);
          }}
          style={{marginHorizontal: Theme.values.margins.marginSmall}}>
          <Icon
            name="log-out-outline"
            color={Theme.colors.error}
            size={Theme.values.headerIcon.height}
          />
        </TouchableOpacity>
        {data.groupName && (
          <>
            {getPromptDialog(
              isChangeGroupNameDialogShown,
              Translations.strings.changeName(),
              Translations.strings.enterName(),
              text => {
                groupNameRef.current = text;
              },
              () => {
                if (groupNameRef.current.length >= 8) {
                  onChangeGroupName(groupNameRef.current);
                } else {
                  ToastHelper.showError(
                    Translations.strings.lessCharacterError(),
                  );
                }

                groupNameRef.current = undefined;
                setIsChangeGroupNameDialogShown(false);
              },
              () => {
                groupNameRef.current = undefined;
                setIsChangeGroupNameDialogShown(false);
              },
            )}
            <TouchableOpacity
              onPress={() => {
                setIsChangeGroupNameDialogShown(true);
              }}
              style={{marginHorizontal: Theme.values.margins.marginSmall}}>
              <Icon
                name="create-outline"
                color={Theme.colors.error}
                size={Theme.values.headerIcon.height}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={async () => {
                await pickImageFromGallery(onImageRecieved);
              }}
              style={{marginHorizontal: Theme.values.margins.marginSmall}}>
              <Icon
                name="image-outline"
                color={Theme.colors.error}
                size={Theme.values.headerIcon.height}
              />
            </TouchableOpacity>
          </>
        )}
      </>
    ),
    [
      data.groupName,
      isChangeGroupNameDialogShown,
      isLeaveDialogShown,
      leaveRoom,
      onChangeGroupName,
      onImageRecieved,
    ],
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
        title: Translations.strings.admin(),
        data: [data.Admin],
      },
      {
        title: Translations.strings.conversationMembers(),
        data: members,
      },
    ];
  };

  const getSections = () => {
    return [
      {
        title: Translations.strings.conversationMembers(),
        data: users,
      },
    ];
  };

  /**
   * @param {User} user
   */
  const confirmDelete = user => {
    if (isGroup && user !== data.Admin) {
      userRef.current = user;
      setIsDeleteDialogShown(true);
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
    <View style={Theme.styles.screen}>
      {getSimpleDialog(
        isDialogShown,
        Translations.strings.warning(),
        Translations.strings.lessCharacterError(),
        () => {
          setIsDialogShown(false);
        },
      )}
      {isDeleteDialogShown &&
        getInteractiveDialog(
          isDeleteDialogShown,
          Translations.strings.delete(),
          Translations.strings.deletePersonFromGroup(userRef.current.userName),
          () => {
            removeUserFromRoom(userRef.current);
            userRef.current = undefined;
            setIsDeleteDialogShown(false);
          },
          () => {
            userRef.current = undefined;
            setIsDeleteDialogShown(false);
          },
          Translations.strings.delete(),
        )}
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
