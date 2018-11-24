import React from 'react';
import { Button, LinkingIOS, Linking, AsyncStorage, Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { HeaderBackButton } from "react-navigation";
import axios from 'axios';
import Geocoder from 'react-native-geocoding';
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
import { Icon } from 'react-native-elements'




Geocoder.init('undefined');
//Enter the google api key.


export default class DiscoverNow extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Event Details',
      headerLeft: (<HeaderBackButton onPress={() => { navigation.navigate('Main') }} />)
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
     

      alreadyRegistered : 0,
      alreadyCheckedIn: 0,


    }

  }

  checkIn() {
    let data = {
      eventId : this.state.event_list[0].eventId,
      email : this.state.email
    }
axios.post(`https://us-central1-testingexpress-216900.cloudfunctions.net/test/api/checkInToEvent`, { data })
      .then(res => {
        this.setState({alreadyCheckedIn: 1});
      })
    .catch((error) => {
      console.log(error);
    });
  }

  register() {

    let data = {
      eventId : this.state.event_list[0].eventId,
      eventStartTime: this.state.event_list[0].eventStartTime,
      eventEndTime: this.state.event_list[0].eventEndTime,
      email : this.state.email,
      eventPicture: this.state.event_list[0].eventPicture,
      eventTitle: this.state.event_list[0].eventTitle,
    }
axios.post(`https://us-central1-testingexpress-216900.cloudfunctions.net/test/api/registerEvent`, { data })
      .then(res => {
        this.setState({alreadyRegistered: 1});
      })
    .catch((error) => {
      console.log(error);
    });
  

  }
  _handleOpenWithLinking1 = () => {
    Linking.openURL(`https://maps.google.com/?saddr=Current+Location&daddr=${this.state.region.latitude},${this.state.region.longitude}&driving`);
  }

  _handleOpenWithLinking2 = () => {
    Linking.openURL(`https://maps.google.com/?saddr=Current+Location&daddr=${this.state.region.latitude},${this.state.region.longitude}`);
  }

  _handleOpenWithLinking3 = () => {
    Linking.openURL(`https://maps.google.com/?saddr=Current+Location&daddr=${this.state.region.latitude},${this.state.region.longitude}&mode=transit`);
  }

  _handleOpenWithLinking4 = () => {
    Linking.openURL(`https://maps.google.com/?saddr=Current+Location&daddr=${this.state.region.latitude},${this.state.region.longitude}&mode=bicycling`);
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
            eventId : this.state.eventId,
            email : this.state.email
          }

          axios.post(`https://us-central1-testingexpress-216900.cloudfunctions.net/test/api/checkRegistration`, { data })
            .then(res => {
                if (res.data[0].count > 0) {
                    this.setState({alreadyRegistered: 1});
                }
            })
          .catch((error) => {
            console.log(error);
          });

          axios.post(`https://us-central1-testingexpress-216900.cloudfunctions.net/test/api/checkCheckIn`, { data })
            .then(res => {
                if (res.data[0].count > 0) {
                    this.setState({alreadyCheckedIn: 1});
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

    if (this.state.alreadyRegistered === 0) {
      registerButton = <TouchableOpacity
              disabled={false}
              style={styles.button}
              onPress={this.register}
            >
              <Icon
                name='check'
                type='simple-line-icon'
                color='green' />
              <Text>Register</Text>
      </TouchableOpacity>
    }
    else {
      registerButton = <TouchableOpacity
              disabled={true}
              style={styles.button}
            >
              <Icon
                name='check'
                type='simple-line-icon'
                color="red" />
              <Text>Already Registered</Text>
      </TouchableOpacity>
    }

    if (this.state.alreadyCheckedIn === 0) {
      checkInButton = 
      <TouchableOpacity
        disabled={false}
        style={styles.button}
        onPress={this.checkIn}
      >
        <Icon
          name='check'
          type='simple-line-icon'
          color="green" />
        <Text>Check-in</Text>
      </TouchableOpacity>
    }
    else {
      checkInButton = 
      <TouchableOpacity
        disabled={true}
        style={styles.button}
      >
        <Icon
          name='check'
          type='simple-line-icon'
          color="red" />
        <Text>Already Checked-in</Text>
      </TouchableOpacity>
    }

    return (
      <ScrollView style={styles.container}>
        {this.state.event_list.map(event =>
          <View style={styles.viewContainer} key={event.eventId}>
            <Image
              style={{ width: 200, height: 200, alignSelf: 'center' }}
              source={{ uri: event.eventPicture }}
            />
            <Text style={{ alignSelf: 'center' }} >{event.eventTitle}</Text>

            {registerButton}
            <Text style={{ alignSelf: 'center' }}> Are you at this event? </Text>
            {checkInButton}

            

            <Text style={{ alignSelf: 'center' }} >Tickets Left: {event.remainingTickets}</Text>
            <Text style={{ alignSelf: 'center' }} >{event.eventStartTime}</Text>
            <Text style={{ alignSelf: 'center' }}>{event.eventEndTime}</Text>
            <Text style={{ alignSelf: 'center' }}>{event.eventDescription}</Text>
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
  },
  map: {
    flex: 1,
    height: 500
  },
  button: {
    alignSelf: 'center',
    alignItems: 'center',
    paddingRight: 20,
    paddingLeft: 20,
    backgroundColor: '#ddd'
  },
});
