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

    const dimensions = Dimensions.get('window');
    const imageWidth = 0.95 * dimensions.width;
 
   
   
  
    return (
      <ScrollView>
        {this.state.createdEvents.map(event =>
            <TouchableOpacity
            key={event.eventId}
            style={styles.button}
          >
            <Image
              style={{ resizeMode: 'cover', height: 200, width: imageWidth, alignSelf: 'center' }}
              source={{ uri: event.eventPicture }}
            />
            <View style={{flex : 1, flexDirection: "row"}}>
            <View style= {{flex: 0.75}}>
            <Text style={{ alignSelf: 'flex-start', fontWeight: 'bold', fontSize: 20, marginLeft: 5 }}>{event.eventTitle}</Text>
            <Text style={{ alignSelf: 'flex-start', fontSize: 15, marginLeft: 5 }}>{moment.utc(event.eventStartTime).format('MMMM DD YYYY, hh:mm a')}</Text>
            <Text style={{ alignSelf: 'flex-start', fontSize: 15, marginLeft: 5, marginBottom: 5 }}>{event.eventLocation}</Text>
            </View>

            <View style={{flex: 0.25, alignItems: "center", borderWidth: 1, borderColor: "#ea526f", justifyContent:'center'}}>
              <Text style={{ alignSelf: 'center', fontWeight: 'bold', fontSize: 10, marginLeft: 5 }}>Tickets Left:</Text>
              <Text style={{ alignSelf: 'center', fontWeight: 'bold', fontSize: 20, marginLeft: 5 }}>{event.remainingTickets}</Text>
            </View>
            </View>


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
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ea526f',
    width: '95%',
    
  },
  scene: {
    flex: 1,
  },
  header: {
    paddingTop: Constants.statusBarHeight,
  },
});
