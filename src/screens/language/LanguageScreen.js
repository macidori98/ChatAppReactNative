import React from 'react';
import {Button, View} from 'react-native';
import {Translations} from 'translations/Translations';
import {LanguagesScreenProps} from 'types/NavigationTypes';

/**
 * @param {LanguagesScreenProps} props
 * @returns {JSX.Element}
 */
const LanguageScreen = props => {
  const languages = Translations.languages();

  /**
   * @param {string} item
   */
  const handleLanguageChange = async item => {
    await Translations.initializeTranslations(item);
    props.navigation.reset({routes: [{name: 'Home'}]});
  };

  /**
   * @returns {JSX.Element[]}
   */
  const getContent = () => {
    const elements = languages.map(item => {
      return (
        <Button
          key={item}
          title={item}
          onPress={handleLanguageChange.bind(this, item)}
        />
      );
    });

    return elements;
  };

  return <View>{getContent()}</View>;
};

export default LanguageScreen;
