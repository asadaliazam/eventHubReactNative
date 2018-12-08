import React from 'react';
import { AsyncStorage, AppRegistry ,Image, TouchableOpacity, TextInput, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo';
import { KeyboardAvoidingView } from 'react-native';



import { Auth } from 'aws-amplify'

export default class App extends React.Component {
  state = {
    username: '',
    password: '',
    user: {}
  }
  onChangeText(key, value) {
    this.setState({
      [key]: value
    })
  }

  _storeData = async (username) => {
    try {
      await AsyncStorage.setItem('email', (username.toString()));
    } catch (error) {
      console.log(error);
    }
  }

  signIn() {
    const { username, password } = this.state
    Auth.signIn(username, password)
    .then(user => {
      this.setState({ user })
      console.log('successful sign in!')
    this._storeData(this.state.username);
      this.props.screenProps.authenticate(true)
    })
    .catch(err => console.log('error signing in!: ', err))
  }
  
    
     
   
  
  render() {
    return (
      
      <View style={styles.container}>
            <LinearGradient

          colors={['#ffffff', '#02b3e4']}
          start={[0, 0]}
          end={[1, 1]}
          location={[0.25, 1]}

          style={{ padding: 15,  flex:1 }}>
      <Image
          style={styles.picture}
          source={require('./logo1.png')}
        />

        <TextInput
          onChangeText={value => this.onChangeText('username', value)}
          style={styles.input}
          placeholder='Email'
        />
        <TextInput
          onChangeText={value => this.onChangeText('password', value)}
          style={styles.input}
          secureTextEntry={true}
          placeholder='Password'
        />
        {/* <Button  title="Sign In" onPress={this.signIn.bind(this)} /> */}

        <TouchableOpacity
         style={styles.button}
         onPress={this.signIn.bind(this)}
       >
         <Text> Login </Text>
       </TouchableOpacity>
       </LinearGradient>

      </View>

    );
  }
}
AppRegistry.registerComponent('App', () => App);

const styles = StyleSheet.create({
  input: {
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#2196F3',
    margin: 15
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  button: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 15,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 20,
    borderRadius:5,
    borderWidth: 1,
    borderColor: '#fff'
  },
  picture: {
    resizeMode: 'contain',
    width: '90%',
    alignSelf: 'center',
    
  }
});

