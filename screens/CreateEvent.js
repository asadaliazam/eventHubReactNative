import React from 'react';
import { AsyncStorage, Button, Image, Picker, ScrollView, StyleSheet, Text, TouchableOpacity, TextInput, View, KeyboardAvoidingView } from 'react-native';
import { Modal, TouchableHighlight, Alert } from 'react-native';

import { HeaderBackButton } from "react-navigation";
import DatePicker from 'react-native-datepicker'
import { ImagePicker } from 'expo';
import { RNS3 } from 'react-native-aws3';
import moment from 'moment';
import axios from 'axios';
import ModalSelector from 'react-native-modal-selector'






const options = {

    bucket: "event-hub-pictures",
    region: "us-west-2",
    accessKey: "undefined",
    secretKey: "undefined",
    successActionStatus: 201
}

let locationIndex = 0;
const locationData = [
    { key: locationIndex++, section: true, label: 'Locations' },
    { key: locationIndex++, label: 'Vancouver, BC, Canada' },
    { key: locationIndex++, label: 'Surrey, BC, Canada' },
    { key: locationIndex++, label: 'Richmond, BC, Canada' },
];

let eventTypeIndex = 0;
const eventTypeData = [
    { key: eventTypeIndex++, section: true, label: 'Event Type' },
    { key: eventTypeIndex++, label: 'Training or Workshop' },
    { key: eventTypeIndex++, label: 'Networking Event' },
    { key: eventTypeIndex++, label: 'Social Gathering' },
];

let eventTopicIndex = 0;
const eventTopicData = [
    { key: eventTopicIndex++, section: true, label: 'Event Topic' },
    { key: eventTopicIndex++, label: 'Science or Technology' },
    { key: eventTopicIndex++, label: 'Business or Professional' },
    { key: eventTopicIndex++, label: 'Film, Media or Entertainment' },
];



export default class CreateEvent extends React.Component {

    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Create Event',
            headerStyle: {
                backgroundColor: '#02b3e4',
            },
            headerLeft: (<HeaderBackButton onPress={() => { navigation.navigate('Main') }} />),
            headerTitleStyle: {
                fontWeight: 'bold',
                color: 'white',
            },
        }
    }


    _pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
        });

        console.log(result);

        if (!result.cancelled) {
            this.setState({ image: result.uri }, function () {
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
                    this.setState({ eventPicture: response.body.postResponse.location })
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
            eventTopic: 'Science or Technology',
            modalVisible: false,

        };
    }

    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }

    _retrieveData = async () => {
        try {
            const value = await AsyncStorage.getItem('email');
            if (value !== null) {
                // We have data!!
                console.log('VALUE OF EVENTID', value);
                this.setState({ email: value }, function () {
                    console.log(this.state);
                    let dateStringStart = moment(this.state.eventStartTime).format("YYYY-MM-DD hh:mm:ss");
                    let dateStringEnd = moment(this.state.eventEndTime).format("YYYY-MM-DD hh:mm:ss");
                    let tags = ['HTML', 'CSS', 'JavaScript', 'React', 'Vue.js', 'React Native', 'Climate', 'Weather', 'Environment', 'Development', 'Design', 'Graphics', 'Medical', 'Drugs', 'Brain', 'Heart', 'Doctor', 'Nurse', 'Scientist', 'Dentist', 'Physics', 'Quantum', 'Computing', 'Microsoft', 'Amazon', 'Google', 'Surgery', 'Medicine', 'Awareness', 'Veterinarian', 'Space', 'Pregnancy', 'Data', 'Health', 'Diet', 'Finance', 'Accountant', 'Accounting', 'Economist', 'Supply Chain', 'Cryptocurrency', 'Auditor', 'GAAP', 'IAS', 'Business Plan', 'Tax', 'Entrepreneur', 'Investor', 'Budget', 'Shareholder', 'Risk Management', 'Analysis', 'Banking', 'Human Resources', 'Lawyer', 'Amendments', 'PWC', 'BDO', 'Credit', 'Loan', 'CIBC', 'BMO', 'International', 'Local', 'Debts', 'Wall Street', 'Markets', 'Shares', 'Film Making', 'Choreography', 'Music', 'Acting', 'Actor', 'Lyrists', 'Poetry', 'Cinema', 'Movies', 'Classics', 'Disaster', 'Action', 'Comedy', 'Thriller', 'Horror', 'Sports', 'Soccer', 'Football', 'Hockey', 'Baseball', 'Basketball', 'Drama', 'Hollywood', 'Bollywood', 'Hip-Hop', 'Rap', 'RnB', 'Soul', 'Rock', 'Indie', 'Singers', 'Band', 'Athletics', 'News', 'Politics', 'Facebook', 'Twitter', 'Instagram', 'YouTube', 'Romance', 'Myths', 'Concert', 'Stunts']

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
                        eventTitle: this.state.eventTitle,
                        eventAddress: this.state.eventAddress,
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
                            this.setState({ modalVisible: true })
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
            <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" enabled>

                <ScrollView style={{ flex: 1 }}>
                    <View style={styles.innerContainer}>

                        <Modal
                            animationType="slide"
                            transparent={false}
                            visible={this.state.modalVisible}
                            onRequestClose={() => {
                                Alert.alert('Modal has been closed.');
                            }}>
                            <View style={{ marginTop: 22, flex: 1, justifyContent: "center", alignItems: 'center' }}>
                                <View>
                                    <Text>Your Event has been created!</Text>

                                    <TouchableHighlight
                                        onPress={() => {
                                            this.setModalVisible(!this.state.modalVisible);
                                        }}>
                                        <Text>Back</Text>
                                    </TouchableHighlight>
                                </View>
                            </View>
                        </Modal>
                        <TextInput
                            placeholder={'Event Title'}
                            style={styles.input}
                            onChangeText={(eventTitle) => this.setState({ eventTitle })}
                            value={this.state.eventTitle}
                        />
                        <Text style={{ alignSelf: 'center', fontWeight: 'bold', fontSize: 12 }}>Event Location:</Text>

                        <ModalSelector
                            data={locationData}
                            initValue={this.state.eventLocation}
                            onChange={(option) => { this.setState({ eventLocation: option.label }) }}
                            style={{ marginLeft: 10, marginRight: 10 }}>
                        </ModalSelector>

                        <TextInput
                            placeholder={'Event Address'}
                            style={styles.input}
                            onChangeText={(eventAddress) => this.setState({ eventAddress })}
                            value={this.state.eventAddress}
                        />
                        <Text style={{ alignSelf: 'center', marginTop: 8 }}> Event Start Time:</Text>
                        <DatePicker
                            style={{ width: 200, alignSelf: 'center', marginTop: 10, }}
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
                                    marginLeft: 36,
                                    borderRadius: 7,
                                    borderColor: '#02b3e4'

                                }
                            }}
                            onDateChange={(date) => {
                                this.setState({ eventStartTime: date }, function () {
                                })
                            }}
                        />

                        <Text style={{ alignSelf: 'center', marginTop: 8 }}> Event End Time:</Text>
                        <DatePicker
                            style={{ width: 200, alignSelf: 'center', marginTop: 10, }}
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
                                    marginLeft: 36,
                                    borderRadius: 7,
                                    borderColor: '#02b3e4'

                                }
                            }}
                            onDateChange={(date) => {
                                this.setState({ eventEndTime: date }, function () {
                                })
                            }}
                        />




                        <TextInput
                            placeholder={'Event Summary'}
                            style={styles.input}
                            onChangeText={(eventSummary) => this.setState({ eventSummary })}
                            value={this.state.eventSummary}
                        />

                        <TextInput
                            placeholder={'Event Description'}
                            multiline={true}
                            numberOfLines={6}
                            style={styles.input}
                            onChangeText={(eventDescription) => this.setState({ eventDescription })}
                            value={this.state.eventDescription}
                        />

                        <TextInput
                            placeholder={'Number of Tickets'}
                            keyboardType='numeric'
                            style={styles.input}
                            onChangeText={(numberOfTickets) => this.setState({ numberOfTickets })}
                            value={(this.state.numberOfTickets.toString())}
                        />


                        <TouchableOpacity
                            style={styles.buttonForImage}
                            onPress={() => { this._pickImage() }}
                        >
                            <Text style={{ alignSelf: 'center' }}>Choose Event Picture</Text>
                        </TouchableOpacity>

                        {image &&
                            <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}


                        <Text style={{ alignSelf: 'center', fontWeight: 'bold', fontSize: 12 }}>Event Type:</Text>

                        <ModalSelector
                            data={eventTypeData}
                            initValue={this.state.eventType}
                            onChange={(option) => { this.setState({ eventType: option.label }) }}
                            style={{ marginLeft: 10, marginRight: 10 }}>

                        </ModalSelector>

                        <Text style={{ alignSelf: 'center', fontWeight: 'bold', fontSize: 12 }}>Event Topic:</Text>

                        <ModalSelector
                            data={eventTopicData}
                            initValue={this.state.eventTopic}
                            onChange={(option) => { this.setState({ eventTopic: option.label }) }}
                            style={{ marginLeft: 10, marginRight: 10 }}>

                        </ModalSelector>

                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => { this.createEvent() }}
                        >
                            <Text style={{ alignSelf: 'center' }}>Launch Event</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
        backgroundColor: '#dddddd',
    },
    input: {
        height: 50,
        borderBottomWidth: 1,
        borderBottomColor: '#02b3e4',
        margin: 10,


    },
    button: {
        alignItems: 'center',
        backgroundColor: '#02b3e4',
        padding: 10,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10,
        borderRadius: 4,
        marginBottom: 20,
    },
    buttonForImage: {
        alignItems: 'center',
        backgroundColor: '#02b3e4',
        padding: 10,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10,
        borderRadius: 4,
        marginBottom: 20,
    },
    innerContainer: {
        backgroundColor: '#fff',
        flex: 1,
        borderRadius: 5,
    }
});
