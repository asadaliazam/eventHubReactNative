import React from 'react';
import { Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default class Profile extends React.Component {
  static navigationOptions = {
    title: 'Profile',
  };

  state = {
    isDateTimePickerVisible: false,
  };

  _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

  _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

  _handleDatePicked = (date) => {
    console.log('A date has been picked: ', date);
    this._hideDateTimePicker();
  };

  render() {
    return (
      <ScrollView style={styles.container}>
        <TextInput placeholder={'First Name'} style={styles.input} />
        <TextInput placeholder={'Family Name'} style={styles.input} />
        <TouchableOpacity onPress={this._showDateTimePicker}>
          <Text>Date Of Birth</Text>
        </TouchableOpacity>
        <DateTimePicker isVisible={this.state.isDateTimePickerVisible} onConfirm={this._handleDatePicked} onCancel={this._hideDateTimePicker} />
        <TextInput placeholder={'Preferred Location'} style={styles.input} />
        <TextInput placeholder={'Email Address'} style={styles.input} />
        <Button title="Change Password" />
        <TextInput placeholder={'Occuption'} style={styles.input} />
        <TextInput placeholder={'Organization'} style={styles.input} />
        <TextInput placeholder={'Bio'} style={styles.input} />
        <Button title="Personality Test" />
        <Button title="Save Profile" />
        <Button title="Cancel" />
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
  input: {
    width: 200,
    height: 44,
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
    marginBottom: 10,
  },
});
