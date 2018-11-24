import React from 'react';
import { AsyncStorage, Image, ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { FloatingAction } from 'react-native-floating-action';
import axios from 'axios';
import DatePicker from 'react-native-datepicker';
import moment from 'moment';


const actions = [{
  text: 'Create Event',
  name: 'Create Event',
  position: 1,
  color: '#02b3e4'
},
];




class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Suggested Events',
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
      date: new Date(),
      event_list: [],
      email: ''
    }

    this.loadEvents = this.loadEvents.bind(this);
    this.viewDetails = this.viewDetails.bind(this);

  }

  loadEvents() {
    let data = {
      date: this.state.date,
      email : this.state.email,
    }

    axios.post(`https://us-central1-testingexpress-216900.cloudfunctions.net/test/api/displayEvents`, { data })
      .then(res => {
        console.log(res.data);
        this.setState({event_list: res.data});
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
          let month = '' + (this.state.date.getMonth() + 1);
    let day = '' + this.state.date.getDate();
    let year = this.state.date.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    let formattedDate = ([year, month, day].join('-'));

    console.log(this.state.date);
    console.log(formattedDate);
    let data = {
      date: formattedDate,
      email : this.state.email,
    }

    axios.post(`https://us-central1-testingexpress-216900.cloudfunctions.net/test/api/displayEvents`, { data })
      .then(res => {
        console.log(res.data);
        this.setState({event_list: res.data});
      })
    .catch((error) => {
      console.log(error);
    });
        });
      }
     } catch (error) {
       console.log(error)
     }
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
  
  componentDidMount() {
    this._retrieveData();
    
  }
  render() {
    console.log(this.state.event_list);
    return (
      <View style={styles.container}>
          
        <ScrollView>
        <DatePicker
        style={{width: 200 ,alignSelf:'center', marginTop: 20,}}
        date={this.state.date}
        mode="date"
        placeholder="select date"
        format="YYYY-MM-DD"
        minDate= {new Date()}
        maxDate="2018-12-31"
        confirmBtnText="Confirm"
        cancelBtnText="Cancel"
        customStyles={{
          dateIcon: {
            position: 'absolute',
            left: 0,
            top: 4,
            marginLeft: 0
          },
          dateInput: {
            marginLeft: 36,
            borderRadius: 7,
            borderColor: '#ea526f'

          }
          // ... You can check the source to find the other keys.
        }}
        onDateChange={(date) => {this.setState({date: date}, function() {
          this.loadEvents();
        })}}
      />
          {this.state.event_list.map(event =>
            <TouchableOpacity
              key={event.eventId}
              style={styles.button}
              onPress={() => { this.viewDetails(event.eventId) }}
            >
              <Image
                style={{ resizeMode: 'cover', height: 200, width: 340, alignSelf: 'center' }}
                source={{ uri: event.eventPicture }}
              />
              <Text style={{ alignSelf: 'flex-start', fontWeight: 'bold', fontSize: 20, marginLeft: 5 }}>{event.eventTitle}</Text>
              <Text style={{ alignSelf: 'flex-start', fontSize: 15, marginLeft: 5 }}>{moment(event.eventStartTime).format('MMMM DD YYYY, hh:mm a')}</Text>
              <Text style={{ alignSelf: 'flex-start', fontSize: 15, marginLeft: 5, marginBottom: 5 }}>{event.eventLocation}</Text>


            </TouchableOpacity>
          )}
          
        </ScrollView>
        <FloatingAction
        color = '#ea526f'
        onPressMain	={() => this.props.navigation.navigate('App')}
      />
      </View>
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


export default HomeScreen;