import React from 'react';
import { Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default class MyEvent extends React.Component {
  static navigationOptions = {
    title: 'My Event',
  };

  render() {
    return (
      <ScrollView style={styles.container}>
        <Text>This is MY event page.</Text>
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
