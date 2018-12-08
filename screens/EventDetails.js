import React from 'react';
import { Dimensions, Button, LinkingIOS, Linking, AsyncStorage, Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { HeaderBackButton } from "react-navigation";
import axios from 'axios';
import Geocoder from 'react-native-geocoding';
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
import { Icon } from 'react-native-elements';
import moment from 'moment';
moment.locale('en-ca');




Geocoder.init('undefined');
//Enter the google api key.


export default class DiscoverNow extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Event Details',
      tintColor: '#ffffff',
      headerStyle: {
        backgroundColor: '#02b3e4',
      },
      headerLeft: (<HeaderBackButton style={{ color: "#ffffff", tintColor: '#ffffff', backgroundColor: '#ffffff' }} onPress={() => { navigation.navigate('Main') }} />),
      headerTitleStyle: {
        fontWeight: 'bold',
        color: 'white',
      },
    }
  }

  constructor(props) {
    super(props);
    this.loadEvent = this.loadEvent.bind(this);
    this.checkIn = this.checkIn.bind(this);
    this.register = this.register.bind(this);

    this.state = {
      event_list: [],
      eventId: '',
      email: '',
      region: {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },


      alreadyRegistered: 0,
      alreadyCheckedIn: 0,
      isEventTime: 0,


    }

  }

  checkIn() {
    let data = {
      eventId: this.state.event_list[0].eventId,
      email: this.state.email
    }
    axios.post(`https://us-central1-testingexpress-216900.cloudfunctions.net/test/api/checkInToEvent`, { data })
      .then(res => {
        this.setState({ alreadyCheckedIn: 1 });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  register() {

    let data = {
      eventId: this.state.event_list[0].eventId,
      eventStartTime: this.state.event_list[0].eventStartTime,
      eventEndTime: this.state.event_list[0].eventEndTime,
      email: this.state.email,
      eventPicture: this.state.event_list[0].eventPicture,
      eventTitle: this.state.event_list[0].eventTitle,
      eventLocation: this.state.event_list[0].eventLocation,
      eventAddress: this.state.event_list[0].eventAddress,
    }
    axios.post(`https://us-central1-testingexpress-216900.cloudfunctions.net/test/api/registerEvent`, { data })
      .then(res => {
        this.setState({ alreadyRegistered: 1 });
      })
      .catch((error) => {
        console.log(error);
      });


  }
  _handleOpenWithLinking1 = () => {
    Linking.openURL(`https://maps.google.com/?saddr=Current+Location&daddr=${this.state.region.latitude},${this.state.region.longitude}&driving&dirflg=d`);
  }

  _handleOpenWithLinking2 = () => {
    Linking.openURL(`https://maps.google.com/?saddr=Current+Location&daddr=${this.state.region.latitude},${this.state.region.longitude}&dirflg=b`);
  }

  _handleOpenWithLinking3 = () => {
    Linking.openURL(`https://maps.google.com/?saddr=Current+Location&daddr=${this.state.region.latitude},${this.state.region.longitude}&mode=transit&dirflg=w`);
  }

  _handleOpenWithLinking4 = () => {
    Linking.openURL(`https://maps.google.com/?saddr=Current+Location&daddr=${this.state.region.latitude},${this.state.region.longitude}&mode=bicycling&dirflg=r`);
  }

  _retrieveDataEmail = async () => {
    try {
      const value = await AsyncStorage.getItem('email');
      if (value !== null) {
        // We have data!!
        console.log('VALUE OF EVENTID', value);
        this.setState({ email: value }, function () {
          console.log("DATA=" + this.state.email + "EVENTID = " + this.state.eventId);
          let data = {
            eventId: this.state.eventId,
            email: this.state.email
          }

          axios.post(`https://us-central1-testingexpress-216900.cloudfunctions.net/test/api/checkRegistration`, { data })
            .then(res => {
              if (res.data[0].count > 0) {
                this.setState({ alreadyRegistered: 1 });
              }
            })
            .catch((error) => {
              console.log(error);
            });

          axios.post(`https://us-central1-testingexpress-216900.cloudfunctions.net/test/api/checkCheckIn`, { data })
            .then(res => {
              if (res.data[0].count > 0) {
                this.setState({ alreadyCheckedIn: 1 });
              }
            })
            .catch((error) => {
              console.log(error);
            });

            let data2 = {
              eventId: this.state.eventId,
              email: this.state.email,
              date: moment().format('YYYY-MM-DD hh:mm:ss')
            }

            axios.post(`https://us-central1-testingexpress-216900.cloudfunctions.net/test/api/checkForEventTime`, { data2 })
            .then(res => {
              console.log("Is this event time?", res.data[0].count);
              if (res.data[0].count > 0) {
                this.setState({ isEventTime: 1 });
                
              }
            })
            .catch((error) => {
              console.log(error);
            });


        });
      }
    }
    catch (error) {
      console.log(error)
    }


  }


  loadEvent() {
    axios.get(`https://us-central1-testingexpress-216900.cloudfunctions.net/test/api/displayEvent/${this.state.eventId}`)
      .then(res => {
        this.setState({ event_list: res.data }, function () {

          this._retrieveDataEmail();

          //concatinating address and location to get geolocation.
          let address = this.state.event_list[0].eventAddress + " " + this.state.event_list[0].eventLocation;
          //converting location to lat and long
          Geocoder.from(address)
            .then(json => {
              var location = json.results[0].geometry.location;
              console.log(location);
              console.log(location.lat);
              console.log(location.lng);
              newRegion = {
                latitude: parseFloat(location.lat),
                longitude: parseFloat(location.lng),
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              },
                this.setState({ region: newRegion })
            })
            .catch(error => console.warn(error));

        });
        console.log(res.data);
      })
      .catch(err => console.log(err));
  }

  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('eventId');
      if (value !== null) {
        // We have data!!
        console.log('VALUE OF EVENTID', value);
        this.setState({ eventId: value }, function () {
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

    

    if (this.state.alreadyRegistered === 0 && this.state.alreadyCheckedIn === 0) {
      registerButton = <TouchableOpacity
        disabled={false}
        style={styles.button}
        onPress={this.register}
      >
        <Text style={styles.registerText}>Register</Text>
      </TouchableOpacity>
    
    }

    else if (this.state.alreadyRegistered === 1 && this.state.isEventTime === 1 && this.state.alreadyCheckedIn === 0) {
      registerButton = <TouchableOpacity
        disabled={false}
        style={styles.button}
        onPress={this.checkIn}
      >
        <Text style={styles.registerText}>Check In</Text>
      </TouchableOpacity>
    }

    else if (this.state.alreadyRegistered === 1 && this.state.isEventTime === 0) {
      registerButton = <TouchableOpacity
      disabled={true}
      style={styles.button}
    >
      <Text style={styles.registerText}>You are registered!</Text>
    </TouchableOpacity>
    }

    else if (this.state.alreadyRegistered === 1 && this.state.alreadyCheckedIn === 1) {
      registerButton = <TouchableOpacity
      disabled={true}
      style={styles.button}
    >
      <Text style={styles.registerText}>Thanks for checking in!</Text>
    </TouchableOpacity>
    }
    

    
    

    return (
      <ScrollView style={styles.container}>
        {this.state.event_list.map(event =>
          <View style={styles.viewContainer} key={event.eventId}>
            <Image
              style={{ resizeMode: 'cover', height: 200, width: imageWidth, alignSelf: 'center' }}
              source={{ uri: event.eventPicture }}
            />
            <Text style={{ alignSelf: 'center', fontWeight: 'bold', fontSize: 20,  }}>{event.eventTitle}</Text>
            <Text style={{ alignSelf: 'center', fontWeight: 'bold', fontSize: 17,  }}>Event Start Time:</Text>

            <Text style={{ alignSelf: 'center', fontSize: 15, marginLeft: 5 }}>{moment.utc(event.eventStartTime).format('MMMM DD YYYY, hh:mm a')}</Text>
            <Text style={{ alignSelf: 'center', fontWeight: 'bold', fontSize: 17,  }}>Event End Time:</Text>

            <Text style={{ alignSelf: 'center', fontSize: 15, marginLeft: 5 }}>{moment.utc(event.eventEndTime).format('MMMM DD YYYY, hh:mm a')}</Text>
            <Text style={{ alignSelf: 'center', fontWeight: 'bold', fontSize: 17,  }}>Event Location:</Text>

            <Text style={{ alignSelf: 'center', fontSize: 15, marginLeft: 5 }}>{event.eventAddress}</Text>
            <Text style={{ alignSelf: 'center', fontSize: 15, marginLeft: 5 }}>{event.eventLocation}</Text>
            {registerButton}
            <Text style={{ alignSelf: 'center', fontWeight: 'bold', fontSize: 17,  }}>Remaining Tickets:</Text>

            <Text style={{ alignSelf: 'center' }} >{event.remainingTickets}</Text>
            <Text style={{ alignSelf: 'center', fontWeight: 'bold', fontSize: 17, }}>Event Summary:</Text>

            <Text style={{ alignSelf: 'center', paddingLeft: 15, paddingRight: 15, textAlign: 'center'}}> {event.eventSummary}</Text>
            <Text style={{ alignSelf: 'center', fontWeight: 'bold', fontSize: 17,  }}>Event Description:</Text>

            <Text style={{ alignSelf: 'center', paddingLeft: 15, paddingRight: 15, textAlign: 'center' }}>{event.eventDescription}</Text>

          </View>

        )}

        <Text>{this.state.eventLocationLong}</Text>
        <Text>{this.state.eventLocationLat}</Text>


        <View
          style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
          <Icon
            raised
            name='car'
            type='font-awesome'
            color='#f50'
            onPress={this._handleOpenWithLinking1} />

          <Icon
            raised
            name='bike'
            type='material-community'
            color='#f50'
            onPress={this._handleOpenWithLinking2} />

          <Icon
            raised
            name='walk'
            type='material-community'

            color='#f50'
            onPress={this._handleOpenWithLinking3} />

          <Icon
            raised
            name='directions-bus'
            color='#f50'
            onPress={this._handleOpenWithLinking4} />
        </View>

        <View
      
      flex={1}
      paddingLeft={20}
      paddingRight= { 20}
    >
        <MapView
          style={styles.map}
          region={this.state.region}>
          <Marker
            coordinate={{
              latitude: this.state.region.latitude,
              longitude: this.state.region.longitude
            }}
            title="EVENT"
            description="Location of the event"
          />
        </MapView>
        </View>



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
  viewContainer: {
    alignSelf: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    padding: 5,
  },
  map: {
    height: 500,
    padding: 10,
  },
  button: {
    alignSelf: 'stretch',
    alignItems: 'center',
    padding: 17,
    borderRadius: 4,
    backgroundColor: '#02b3e4'
  },
  registerText : {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
  }
});
