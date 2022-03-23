import {StyleSheet} from 'react-native';

const Styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  alignedToCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  screen: {
    flex: 1,
  },
  messageMine: {
    minWidth: '5%',
    maxWidth: '75%',
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  messageOther: {
    minWidth: '5%',
    maxWidth: '75%',
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
});

export default Styles;
