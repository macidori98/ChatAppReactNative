import {ChatRoom, User} from 'models';

/**
 * @template T
 * @typedef {import('@react-navigation/native').TypedNavigator<T,
 * import('@react-navigation/native').StackNavigationState<
 * import('@react-navigation/native').ParamListBase>,
 * import('@react-navigation/native-stack').NativeStackNavigationOptions,
 * import("@react-navigation/native-stack").NativeStackNavigationEventMap,
 * ({ initialRouteName, children, screenListeners, screenOptions, ...rest}:
 * import('@react-navigation/core').DefaultNavigatorOptions<
 * import('@react-navigation/routers').ParamListBase,
 * import('@react-navigation/routers').StackNavigationState<
 * import('@react-navigation/routers').ParamListBase>,
 * import('@react-navigation/native-stack').NativeStackNavigationOptions,
 * import('@react-navigation/native-stack').NativeStackNavigationEventMap>
 * & import('@react-navigation/routers').StackRouterOptions &
 * import('@react-navigation/native-stack/lib/typescript/src/types').NativeStackNavigationConfig)
 * => JSX.Element>} CreateNativeStackNavigatorType
 */

/**
 * @typedef {{SplashScreen: undefined, Home: {title: string},
 * ChatScreen: {id: string},
 * Auth: import('@react-navigation/native').NavigatorScreenParams<AuthenticationNavigationParamList>,
 * UsersScreen: {}, CreateGroupScreen: {data: User[]},
 * Profile: undefined, FullScreen: {imageId: string}, Languages: {},
 * DetailsScreen: {data: ChatRoom}}} MainNavigationParamList
 */

/**
 * @typedef {import("@react-navigation/native-stack").NativeStackScreenProps<MainNavigationParamList, 'SplashScreen'>} SplashScreenProps
 */

/**
 * @typedef {import("@react-navigation/native-stack").NativeStackScreenProps<MainNavigationParamList, 'Languages'>} LanguagesScreenProps
 */

/**
 * @typedef {import("@react-navigation/native-stack").NativeStackScreenProps<MainNavigationParamList, 'DetailsScreen'>} DetailsScreenProps
 */

/**
 * @typedef {import("@react-navigation/native-stack").NativeStackScreenProps<MainNavigationParamList, 'CreateGroupScreen'>} CreateGroupScreenProps
 */

/**
 * @typedef {import("@react-navigation/native-stack").NativeStackScreenProps<MainNavigationParamList, 'FullScreen'>} FullScreenProps
 */

/**
 * @typedef {import("@react-navigation/native-stack").NativeStackScreenProps<MainNavigationParamList, 'Profile'>} ProfileScreenProps
 */

/**
 * @typedef {import("@react-navigation/native-stack").NativeStackScreenProps<MainNavigationParamList, 'Home'>} HomeScreenProps
 */

/**
 * @typedef {import("@react-navigation/native-stack").NativeStackScreenProps<MainNavigationParamList, 'ChatScreen'>} ChatScreenProps
 */

/**
 * @typedef {import("@react-navigation/native-stack").NativeStackScreenProps<MainNavigationParamList, 'UsersScreen'>} UsersScreenProps
 */

/**
 * @typedef {{Login: undefined, SignUp: undefined, ForgotPassword: undefined}} AuthenticationNavigationParamList
 */

/**
 * @typedef {import('@react-navigation/core').CompositeScreenProps<
 *            import('@react-navigation/native-stack').NativeStackScreenProps<import('types/NavigationTypes').AuthenticationNavigationParamList, 'Login'>,
 *            import('@react-navigation/native-stack').NativeStackScreenProps<import('types/NavigationTypes').MainNavigationParamList>>} LoginScreenProps
 */

/**
 * @typedef {import("@react-navigation/native-stack").NativeStackScreenProps<AuthenticationNavigationParamList, 'SignUp'>} SignUpScreenProps
 */

/**
 * @typedef {import("@react-navigation/native-stack").NativeStackScreenProps<AuthenticationNavigationParamList, 'ForgotPassword'>} ForgotPasswordScreenProps
 */

export {};

// /**
//  * @typedef {{Study: undefined, Game: undefined}} BottomTabBarParamList
//  */

// /**
//  * @template T
//  * @typedef {import("@react-navigation/native").TypedNavigator<T, import("@react-navigation/native").TabNavigationState<import("@react-navigation/native").ParamListBase>, import('@react-navigation/bottom-tabs').BottomTabNavigationOptions, import('@react-navigation/bottom-tabs/lib/typescript/src/types').BottomTabNavigationEventMap, ({ initialRouteName, backBehavior, children, screenListeners, screenOptions, sceneContainerStyle, lazy, tabBarOptions, ...rest }: import('@react-navigation/core').DefaultNavigatorOptions<import('@react-navigation/routers').ParamListBase, import('@react-navigation/routers').TabNavigationState<import('@react-navigation/routers').ParamListBase>, import('@react-navigation/bottom-tabs').BottomTabNavigationOptions, import('@react-navigation/bottom-tabs/lib/typescript/src/types').BottomTabNavigationEventMap> & import('@react-navigation/routers').TabRouterOptions & import('@react-navigation/bottom-tabs/lib/typescript/src/types').BottomTabNavigationConfig)=> JSX.Element>} CreateBottomTabNavigatorType
//  */

// /**
//  * @typedef {{onStartGame: (data: GameData) => void}} GameConfig
//  */

// /**
//  * @typedef {{Statistics: undefined, Gaming: {data: GameData}, StatDetails: {data: StatisticsDataWithQuestions}}} GameNavigationParamList
//  */

// /**
//  * @typedef {import("@react-navigation/stack").StackScreenProps<GameNavigationParamList, 'Statistics'>} StatisticsScreenProps
//  */

// /**
//  * @typedef {import("@react-navigation/stack").StackScreenProps<GameNavigationParamList, 'StatDetails'>} StatisticDetailsScreenProps
//  */

// /**
//  * @typedef {import("@react-navigation/stack").StackScreenProps<GameNavigationParamList, 'Gaming'>} GameScreenProps
//  */

// /**
//  * @typedef {import("@react-navigation/stack").StackScreenProps<StudyNavigationParamList, 'Details'>} DetailsScreenProps
//  */

// /**
//  * @typedef {import("@react-navigation/stack").StackScreenProps<StudyNavigationParamList, 'CountryList'>} CountryListScreenProps
//  */

// /**
//  * @typedef {import("@react-navigation/stack").StackScreenProps<StudyNavigationParamList, 'RegionList'>} RegionListScreenProps
//  */

// /**
//  * @typedef {import("@react-navigation/stack").StackScreenProps<ModalScreensParamList, 'EndGameModal'>} StatisticDetailsModalProps
//  */

// /**
//  * @typedef {import("@react-navigation/stack").StackScreenProps<ModalScreensParamList, 'GameConfigModal'>} GameConfigModalProps
//  */

// /**
//  * @typedef {{MainScreens: undefined, ModalScreens: import("@react-navigation/core").NavigatorScreenParams<ModalScreensParamList>}} MainNavigationParamList
//  */

// /**
//  * @typedef {{GameConfigModal: GameConfig, EndGameModal: {data: StatisticsDataWithQuestions, onBack: () => void}}} ModalScreensParamList
//  */
