import React from 'react';
import { AsyncStorage, Button, Image, Picker, ScrollView, StyleSheet, Text, TouchableOpacity, TextInput } from 'react-native';
import { HeaderBackButton } from "react-navigation";
import DatePicker from 'react-native-datepicker'
import { ImagePicker } from 'expo';
import { RNS3 } from 'react-native-aws3';
import moment from 'moment';
import axios from 'axios';





  const options = {
  
    bucket: "event-hub-pictures",
    region: "us-west-2",
    accessKey: "undefined",
    secretKey: "undefined",
    successActionStatus: 201
  }

  

export default class CreateEvent extends React.Component {

    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Create Event',
            headerLeft: (<HeaderBackButton onPress={() => { navigation.navigate('Main') }} />)
        }
    }

    
    _pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
        });
    
        console.log(result);
    
        if (!result.cancelled) {
          this.setState({ image: result.uri }, function() {
            let a = result.uri.split("/");
            var last_element = a[a.length - 1];
            const file = {
                uri: result.uri,
                name: last_element,
                type: "image/jpeg"
              } 

              console.log(file);
            RNS3.put(file, options).then(response => {
                if (response.status !== 201)
                  throw new Error("Failed to upload image to S3");
                console.log(response.body.postResponse.location);
                this.setState({eventPicture:response.body.postResponse.location})
              });

          });

        }
      };

    constructor(props) {
        super(props);
        this.createEvent = this.createEvent.bind(this);
        this.state = {
            date: new Date(),
            eventTitle: '',
            eventAddress: '',
            eventLocation: 'Surrey, BC, Canada',
            eventSummary: '',
            eventStartTime: new Date(),
            eventEndTime: new Date(),
            numberOfTickets: 0,
            eventDescription: '',
            image: null,
            eventPicture: '',
            email: '',
            eventType: 'Training or Workshop',
            eventTopic: 'Science or Technology'

        };
    }

    _retrieveData = async () => {
        try {
          const value = await AsyncStorage.getItem('email');
          if (value !== null) {
            // We have data!!
            console.log('VALUE OF EVENTID', value);
            this.setState({email: value}, function() {
                console.log(this.state);
          let dateStringStart = moment(this.state.eventStartTime).format("YYYY-MM-DD hh:mm:ss");
          let dateStringEnd = moment(this.state.eventEndTime).format("YYYY-MM-DD hh:mm:ss");
          let tags = [ 'HTML', 'CSS', 'JavaScript', 'React', 'Vue.js', 'React Native', 'Climate', 'Weather', 'Environment', 'Development', 'Design', 'Graphics', 'Medical', 'Drugs', 'Brain', 'Heart', 'Doctor', 'Nurse', 'Scientist', 'Dentist', 'Physics', 'Quantum', 'Computing', 'Microsoft', 'Amazon', 'Google', 'Surgery', 'Medicine', 'Awareness', 'Veterinarian', 'Space', 'Pregnancy', 'Data', 'Health', 'Diet', 'Finance', 'Accountant', 'Accounting', 'Economist', 'Supply Chain', 'Cryptocurrency', 'Auditor', 'GAAP', 'IAS', 'Business Plan', 'Tax', 'Entrepreneur', 'Investor', 'Budget', 'Shareholder', 'Risk Management', 'Analysis', 'Banking', 'Human Resources', 'Lawyer', 'Amendments', 'PWC', 'BDO', 'Credit', 'Loan', 'CIBC', 'BMO', 'International', 'Local', 'Debts', 'Wall Street', 'Markets', 'Shares', 'Film Making', 'Choreography', 'Music', 'Acting', 'Actor', 'Lyrists', 'Poetry', 'Cinema', 'Movies', 'Classics', 'Disaster', 'Action', 'Comedy', 'Thriller', 'Horror', 'Sports', 'Soccer', 'Football', 'Hockey', 'Baseball', 'Basketball', 'Drama', 'Hollywood', 'Bollywood', 'Hip-Hop', 'Rap', 'RnB', 'Soul', 'Rock', 'Indie', 'Singers', 'Band', 'Athletics', 'News', 'Politics', 'Facebook', 'Twitter', 'Instagram', 'YouTube', 'Romance', 'Myths', 'Concert', 'Stunts' ]
    
          let eventTags = [];
          this.state.eventDescription.split(" ").forEach(function (item) {
            for (let i = 0; i < tags.length; i++) {
              if (item.match(new RegExp(tags[i], "ig"))) {
                eventTags.push(item);
              }
            }        
        });
    
    
    
        console.log(eventTags);
    
          let data = {
            eventTitle : this.state.eventTitle,
            eventAddress : this.state.eventAddress,
            eventStartTime: dateStringStart,
            eventEndTime: dateStringEnd,
            eventLocation: this.state.eventLocation,
            eventSummary: this.state.eventSummary,
            eventDescription: this.state.eventDescription,
            numberOfTickets: this.state.numberOfTickets,
            eventType: this.state.eventType,
            eventTopic: this.state.eventTopic,
            eventPicture: this.state.eventPicture,
            eventCreatedBy: this.state.email,
            eventTags: eventTags
          }
          
            console.log(data);
           
          axios.post(`https://us-central1-testingexpress-216900.cloudfunctions.net/test/api/createEvent`, { data })
                .then(res => {
                    console.log(res.data[0].eventId);
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

    createEvent() {
        this._retrieveData();
        
    
    }



    render() {
        let { image } = this.state;
        return (
            <ScrollView style={styles.container}>
                <TextInput
                    placeholder={'  Event Title'}
                    style={{ margin: 10, height: 40, borderColor: 'gray', borderWidth: 1 }}
                    onChangeText={(eventTitle) => this.setState({ eventTitle })}
                    value={this.state.eventTitle}
                />
                <Text>Event Location:</Text>
                <Picker
                    selectedValue={this.state.eventLocation}
                    style={{ margin: 10, height: 50 }}
                    onValueChange={(itemValue, itemIndex) => this.setState({ eventLocation: itemValue })}>
                    <Picker.Item label="Surrey, BC, Canada" value="Surrey, BC, Canada" />
                    <Picker.Item label="Vancouver, BC, Canada" value="Vancouver, BC, Canada" />
                    <Picker.Item label="Richmond, BC, Canada" value="Richmond, BC, Canada" />
                </Picker>

                <TextInput
                    placeholder={'  Event Address'}
                    style={{ margin: 10, height: 40, borderColor: 'gray', borderWidth: 1 }}
                    onChangeText={(eventAddress) => this.setState({ eventAddress })}
                    value={this.state.eventAddress}
                />
                <Text> Event Start Time:</Text>
                <DatePicker
                    style={{ width: 200, margin: 10, marginTop: 20 }}
                    date={this.state.eventStartTime}
                    mode="datetime"
                    placeholder="select date"
                    format="YYYY-MM-DD hh:mm:ss"
                    minDate={new Date()}
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
                            marginLeft: 36
                        }
                    }}
                    onDateChange={(date) => {
                        this.setState({ eventStartTime: date }, function () {
                        })
                    }}
                />

                <Text> Event End Time:</Text>
                <DatePicker
                    style={{ width: 200, margin: 10, marginTop: 20 }}
                    date={this.state.eventEndTime}
                    mode="datetime"
                    placeholder="select date"
                    format="YYYY-MM-DD hh:mm:ss"
                    minDate={new Date()}
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
                            marginLeft: 36
                        }
                    }}
                    onDateChange={(date) => {
                        this.setState({ eventEndTime: date }, function () {
                        })
                    }}
                />




                <TextInput
                    placeholder={'  Event Summary'}
                    style={{ margin: 10, height: 40, borderColor: 'gray', borderWidth: 1 }}
                    onChangeText={(eventSummary) => this.setState({ eventSummary })}
                    value={this.state.eventSummary}
                />

                <TextInput
                    placeholder={'  Event Description'}
                    multiline = {true}
                    numberOfLines = {6}
                    style={{ margin: 10, height: 40, borderColor: 'gray', borderWidth: 1 }}
                    onChangeText={(eventDescription) => this.setState({ eventDescription })}
                    value={this.state.eventDescription}
                />

                <TextInput
                    placeholder={'  Number of Tickets'}
                    keyboardType = 'numeric'
                    style={{ margin: 10, height: 40, borderColor: 'gray', borderWidth: 1 }}
                    onChangeText={(numberOfTickets) => this.setState({ numberOfTickets })}
                    value={this.state.numberOfTickets}
                />

                <Button
          title="Pick an image from camera roll"
          onPress={this._pickImage}
        />
        {image &&
          <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}


                <Picker
                    selectedValue={this.state.eventType}
                    style={{ margin: 10, height: 50 }}
                    onValueChange={(itemValue, itemIndex) => this.setState({ eventType: itemValue })}>
                    <Picker.Item label="Training or Workshop" value="Training or Workshop, Canada" />
                    <Picker.Item label="Networking Event" value="Networking Event" />
                    <Picker.Item label="Social Gathering" value="Social Gathering" />
                </Picker>

                <Picker
                    selectedValue={this.state.eventTopic}
                    style={{ margin: 10, height: 50 }}
                    onValueChange={(itemValue, itemIndex) => this.setState({ eventTopic: itemValue })}>
                    <Picker.Item label="Science or Technology" value="Science or Technology" />
                    <Picker.Item label="Business or Professional" value="Business or Professional" />
                    <Picker.Item label="Film, Media or Entertainment" value="Film, Media or Entertainment" />
                </Picker>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => { this.createEvent() }}
                >
                    <Text style={{ alignSelf: 'center' }}>Launch Event</Text>
                </TouchableOpacity>


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
    input: {
        width: 200,
        height: 44,
        padding: 10,
        borderWidth: 1,
        borderColor: 'black',
        marginBottom: 10,
    },
    button: {
        margin: 5,
        alignItems: 'center',
        backgroundColor: '#DDDDDD',
        padding: 10,
        marginBottom: 20,
    }
});
