import React from 'react';
import { Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default class ContactUs extends React.Component {
  static navigationOptions = {
    title: 'Contact Us',
  };

  render() {
    return (
      <ScrollView style={styles.container}>
        <Text>This is contact us page.</Text>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});
