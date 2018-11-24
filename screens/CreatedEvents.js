import React from 'react';
import { TouchableOpacity, Image, View, Text, AsyncStorage, Platform, ScrollView, StyleSheet, Button, Dimensions  } from 'react-native';
import moment from 'moment';
import axios from 'axios';
import { Constants } from 'expo';





export default class CreatedEvents extends React.Component {

  

  constructor(props) {
    super(props);
    this.loadEvent = this.loadEvent.bind(this);

    this.state = {
      email: '',
      createdEvents: [],
  };
}

  


  loadEvent() {

    let data3 = {      
        email : this.state.email,
      }
    axios.post(`https://us-central1-testingexpress-216900.cloudfunctions.net/test/api/getCreatedEvents`, { data3 })
        .then(res => {
          console.log(res.data);
          this.setState({createdEvents:res.data});
        })
      .catch((error) => {
        console.log(error);
      });
  }

  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('email');
      if (value !== null) {
        // We have data!!
        console.log('VALUE OF EVENTID', value);
        this.setState({email: value}, function() {
            this.loadEvent();
        });
      }
     } catch (error) {
       console.log(error)
     }
  }

  componentDidMount() {
    this._retrieveData();
  }

  

  render() {
 
   
   
  
    return (
      <ScrollView>
        {this.state.createdEvents.map(event =>
             <TouchableOpacity
            key={event.eventId}
            style={styles.button}
          > 
             <Image
           style={{width: 200, height: 200, alignSelf:'center'}}
           source={{uri: event.eventPicture}}
         />
               <Text style={{alignSelf: 'center'}}>{event.eventTitle}</Text>  
        </TouchableOpacity>
        )}

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
  buttonContainer: {
    marginTop: 40,
    marginLeft: 30,
    marginRight: 30,
  },
  button: {
    alignSelf: 'center',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10
  },
  scene: {
    flex: 1,
  },
  header: {
    paddingTop: Constants.statusBarHeight,
  },
});
