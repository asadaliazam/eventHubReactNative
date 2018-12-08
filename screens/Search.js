import React from 'react';
import { Dimensions, PickerIOS, AsyncStorage, Picker, TextInput, Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SearchBar } from 'react-native-elements';
import axios from 'axios';
import ModalSelector from 'react-native-modal-selector';
import moment from 'moment';



let locationIndex = 0;
const locationData = [
  { key: locationIndex++, section: true, label: 'Locations' },
  { key: locationIndex++, label: 'Vancouver, BC, Canada' },
  { key: locationIndex++, label: 'Surrey, BC, Canada' },
  { key: locationIndex++, label: 'Richmond, BC, Canada' },
  { key: locationIndex++, label: 'Any Place' },
];
let timeIndex = 0;
const timeData = [
  { key: timeIndex++, section: true, label: 'Time' },
  { key: timeIndex++, label: 'Today' },
  { key: timeIndex++, label: 'Tomorrow' },
  { key: timeIndex++, label: 'This Week' },
  { key: timeIndex++, label: 'Next Week' },
  { key: timeIndex++, label: 'Any Time' },


];

export default class Search extends React.Component {
  static navigationOptions = {
    title: 'Search',
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
    this.viewDetails = this.viewDetails.bind(this);

    this.state = {
      eventText : '',
      location : 'Any Place',
      eventTime : 'Any Time',
      event_list : [],

    };
  }

  viewDetails(eventId) {
    console.log(eventId);
    this._storeData(eventId);
    this.props.navigation.navigate('App2', {
      eventId: eventId,
    });
  }

  _storeData = async (eventId) => {
    console.log(typeof(eventId));
    try {
      await AsyncStorage.setItem('eventId', (eventId.toString()));
    } catch (error) {
      console.log(error);
    }
  }

  searchEvents() {
    let date = new Date();
        let month = '' + (date.getMonth() + 1);
        let day = '' + date.getDate();
        let year = date.getFullYear();
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
        let formattedDate = ([year, month, day].join('-'));

        var nextWeek = new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000);
        let month2 = '' + (nextWeek.getMonth() + 1);
        let day2 = '' + nextWeek.getDate();
        let year2 = nextWeek.getFullYear();
        if (month2.length < 2) month2 = '0' + month2;
        if (day2.length < 2) day2 = '0' + day2;
        let formattedDateForNextWeek = ([year2, month2, day2].join('-'));

        let searchObject = { dateForNextWeek: formattedDateForNextWeek, date: formattedDate, text: this.state.eventText, location: this.state.location, time: this.state.eventTime };

        axios.post(`https://us-central1-testingexpress-216900.cloudfunctions.net/test/api/searchEvents`, { searchObject })
            .then(res => {
                this.setState({ events: res.data }, function () {
                    console.log(res.data);
                    this.setState({event_list:res.data});
                });
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
      <View style={styles.searchBar}>
      <SearchBar
      lightTheme
        clearIcon={{ color: 'red' }}
  searchIcon={{ size: 24 }}
  onChangeText={(eventText) => this.setState({eventText})}
  value= {this.state.eventText}
  onClear={() => this.setState({eventText: ''})}

  placeholder='Search for' />
      </View>
      <View>

<ModalSelector
                    data={locationData}
                    initValue={this.state.location}
                    onChange={(option)=>{ this.setState({location:option.label})}}
                    style = {{marginLeft: 10, marginRight: 10, }}>
                    </ModalSelector>


<ModalSelector
                    data={timeData}
                    initValue={this.state.eventTime}
                    onChange={(option)=>{ this.setState({eventTime:option.label})}}
                    style = {{marginLeft: 10, marginRight: 10, }}>
                    
                    </ModalSelector>
      </View>
      <TouchableOpacity
         style={styles.button}
         onPress={this.searchEvents.bind(this)}
       >
         <Text style={{color: 'white'}}> Search </Text>
       </TouchableOpacity>
       {this.state.event_list.map(event =>
           <TouchableOpacity
           key={event.eventId}
           style={styles.buttonOpaque}
           onPress={() => { this.viewDetails(event.eventId) }}
         >
           <Image
             style={{ resizeMode: 'cover', height: 200, width: imageWidth, alignSelf: 'center' }}
             source={{ uri: event.eventPicture }}
           />
           <View style={{flex : 1, flexDirection: "row"}}>
           <View style= {{flex: 0.75}}>
           <Text style={{ alignSelf: 'flex-start', fontWeight: 'bold', fontSize: 20, marginLeft: 5 }}>{event.eventTitle}</Text>
           <Text style={{ alignSelf: 'flex-start', fontSize: 15, marginLeft: 5 }}>{moment(event.eventStartTime).format('MMMM DD YYYY, hh:mm a')}</Text>
           <Text style={{ alignSelf: 'flex-start', fontSize: 15, marginLeft: 5, marginBottom: 5 }}>{event.eventLocation}</Text>
           </View>

          <View style={{flex: 0.25, alignItems: "center", borderWidth: 1, borderColor: "#ea526f", justifyContent:'center', margin: 5, padding: 5, borderRadius: 4}}>
               <Text style={{ alignSelf: 'center', fontWeight: 'bold', fontSize: 10, marginLeft: 5 }}>Tickets Left:</Text>
             <Text style={{ alignSelf: 'center', fontWeight: 'bold', fontSize: 20, marginLeft: 5, color: '#ea526f' }}>{event.remainingTickets}</Text>
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
    paddingTop: 1,
    backgroundColor: '#fff',
  },
  searchBar: {
    flex: 1,
    marginLeft: 0,
    marginRight: 0,
    padding: 0
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#02b3e4',
    padding: 10,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    borderRadius: 4,
  },
  buttonOpaque: {
    alignSelf: 'center',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ea526f',
    width: '95%',
    
  },
  searchResults: {
    alignSelf: 'center',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10
  },
});
