import React from 'react';
import {SafeAreaView, Text} from 'react-native';
// @ts-ignore
import {PROBA} from 'react-native-dotenv';

const App = () => {
  return (
    <SafeAreaView>
      <Text>111 {PROBA}</Text>
    </SafeAreaView>
  );
};

export default App;
