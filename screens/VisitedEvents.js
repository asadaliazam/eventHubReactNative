import React from 'react';
import { TouchableOpacity, Image, View, Text, AsyncStorage, Platform, ScrollView, StyleSheet, Button, Dimensions } from 'react-native';
import moment from 'moment';
import axios from 'axios';
import { Constants } from 'expo';





export default class VisitedEvents extends React.Component {



  constructor(props) {
    super(props);
    this.loadEvent = this.loadEvent.bind(this);
    this.viewDetails = this.viewDetails.bind(this);


    this.state = {
      email: '',
      visitedEvents: [],
    };
  }




  loadEvent() {

    let data2 = {
      email: this.state.email,
      date: moment(new Date()).format("YYYY-MM-DD hh:mm:ss")
    }
    axios.post(`https://us-central1-testingexpress-216900.cloudfunctions.net/test/api/getVisitedEvents`, { data2 })
      .then(res => {
        console.log(res.data);
        this.setState({ visitedEvents: res.data });
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
        this.setState({ email: value }, function () {
          this.loadEvent();
        });
      }
    } catch (error) {
      console.log(error)
    }
  }

  _storeData = async (eventId) => {
    console.log(typeof (eventId));
    try {
      await AsyncStorage.setItem('eventId', (eventId.toString()));
    } catch (error) {
      console.log(error);
    }
  }


  viewDetails(eventId) {
    console.log("THIS IS NAVIGATION", this.props.navigation);

    console.log(eventId);
    this._storeData(eventId);
    this.props.navigation.navigate('App3', {
      eventId: eventId,
    });
  }

  componentDidMount() {
    this._retrieveData();
  }




  render() {
    const dimensions = Dimensions.get('window');
    const imageWidth = 0.95 * dimensions.width;





    return (
      <ScrollView>
        {this.state.visitedEvents.map(event =>
          <TouchableOpacity
            key={event.eventId}
            style={styles.button}
          >
            <Image
              style={{ resizeMode: 'cover', height: 200, width: imageWidth, alignSelf: 'center' }}
              source={{ uri: event.eventPicture }}
            />
            <View style={{ flex: 1, flexDirection: "column" }}>
              <Text style={{ alignSelf: 'flex-start', fontWeight: 'bold', fontSize: 20, marginLeft: 5 }}>{event.eventTitle}</Text>
              <Text style={{ alignSelf: 'flex-start', fontSize: 15, marginLeft: 5 }}>{moment.utc(event.eventStartTime).format('MMMM DD YYYY, hh:mm a')}</Text>
              <Text style={{ alignSelf: 'flex-start', fontSize: 15, marginLeft: 5, marginBottom: 5 }}>{event.eventLocation}</Text>
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
