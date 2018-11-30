import React from 'react';
import { Dimensions, AsyncStorage, Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import axios from 'axios';
import moment from 'moment'

export default class DiscoverNow extends React.Component {
  static navigationOptions = {
    title: 'Discover Now',
    headerStyle: {
      backgroundColor: '#02b3e4',
    },
    headerTitleStyle: {
      fontWeight: 'bold',
      color: 'white',
    },
  };

  constructor(props) {
    super(props);
    this.state = {
      event_list: []
    }
    this.loadEvents = this.loadEvents.bind(this);
    this.viewDetails = this.viewDetails.bind(this);
  }

  componentDidMount() {
    this.loadEvents();
  }

  _storeData = async (eventId) => {
    console.log(typeof(eventId));
    try {
      await AsyncStorage.setItem('eventId', (eventId.toString()));
    } catch (error) {
      console.log(error);
    }
  }

  viewDetails(eventId) {
    console.log(eventId);
    this._storeData(eventId);
    this.props.navigation.navigate('App2', {
      eventId: eventId,
    });
  }

  loadEvents() {
    let data = {
      date: new Date()
    }
    axios.post(`https://us-central1-testingexpress-216900.cloudfunctions.net/test/api/getDiscoverNow/`, { data })
      .then(res => {
        this.setState({event_list : res.data});
        console.log(res.data);
      })
    .catch((error) => {
      console.log(error);
    });
  }

  render() {
    const dimensions = Dimensions.get('window');
    const imageWidth = 0.95 * dimensions.width;
    return (
      <ScrollView style={styles.container}>
      {this.state.event_list.map(event =>
            <TouchableOpacity
            key={event.eventId}
            style={styles.button}
            onPress={() => { this.viewDetails(event.eventId) }}
          >
            <Image
              style={{ resizeMode: 'cover', height: 200, width: imageWidth, alignSelf: 'center' }}
              source={{ uri: event.eventPicture }}
            />
            <View style={{flex : 1, flexDirection: "row"}}>
            <View style= {{flex: 0.75}}>
            <Text style={{ alignSelf: 'flex-start', fontWeight: 'bold', fontSize: 20, marginLeft: 5 }}>{event.eventTitle}</Text>
            <Text style={{ alignSelf: 'flex-start', fontSize: 15, marginLeft: 5 }}>{moment.utc(event.eventStartTime).format('MMMM DD, hh:mm a')}</Text>
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
    backgroundColor: '#fff',
  },
  '*' : {
    fontFamily: 'open-sans-bold'
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
});
