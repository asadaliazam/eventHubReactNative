import React from 'react';
import { Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default class AboutUs extends React.Component {
  static navigationOptions = {
    title: 'About Us',
  };

  render() {
    return (
      <ScrollView style={styles.container}>
        <Text>This is about us page.</Text>
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
