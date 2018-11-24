import React from 'react';
import { AsyncStorage, Picker, TextInput, Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SearchBar } from 'react-native-elements';
import axios from 'axios';

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
      location : 'Vancouver, BC, Canada',
      eventTime : 'Today',
      event_list : []

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
      <Picker
  selectedValue={this.state.location}
  style={{ height: 50, width: '100%' }}
  onValueChange={(itemValue, itemIndex) => this.setState({location: itemValue})}>
  <Picker.Item label="Vancouver, BC, Canada" value="Vancouver, BC, Canada" />
  <Picker.Item label="Surrey, BC, Canada" value="Surrey, BC, Canada" />
</Picker>
<Picker
  selectedValue={this.state.eventTime}
  style={{ height: 50, width: '100%' }}
  onValueChange={(itemValue, itemIndex) => this.setState({eventTime: itemValue})}>
  <Picker.Item label="Today" value="Today" />
  <Picker.Item label="Tomorrow" value="Tomorrow" />
  <Picker.Item label="This Week" value="This Week" />
  <Picker.Item label="Next Week" value="Next Week" />
  <Picker.Item label="Any Time" value="Any Time" />

</Picker>
      </View>
      <TouchableOpacity
         style={styles.button}
         onPress={this.searchEvents.bind(this)}
       >
         <Text> Search </Text>
       </TouchableOpacity>
       {this.state.event_list.map(event =>
           <TouchableOpacity
           key={event.eventId}
           style={styles.searchResults}
           onPress={() => { this.viewDetails(event.eventId) }}
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
  searchBar: {
    flex: 1,
    margin: 0,
    padding: 0
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  searchResults: {
    alignSelf: 'center',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10
  },
});
