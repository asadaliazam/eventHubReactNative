import React from 'react';
import { Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import MultipleTags from 'react-native-multiple-tags';

const objectTags = [
    { id: 'Quantum', text: 'Quantum' },
    { id: 'HTML', text: 'HTML' },
    { id: 'CSS', text: 'CSS' },
    { id: 'JavaScript', text: 'JavaScript' },
    { id: 'React', text: 'React' },
    { id: 'Vue.js', text: 'Vue.js' },
    { id: 'React-Native', text: 'React-Native' },
    { id: 'Climate', text: 'Climate' },
    { id: 'Weather', text: 'Weather' },
    { id: 'Environment', text: 'Environment' },
    { id: 'Development', text: 'Development' },
    { id: 'Design', text: 'Design' },
    { id: 'Graphics', text: 'Graphics' },
    { id: 'Medical', text: 'Medical' },
    { id: 'Drugs', text: 'Drugs' },
    { id: 'Brain', text: 'Brain' },
    { id: 'Heart', text: 'Heart' },
    { id: 'Doctor', text: 'Doctor' },
    { id: 'Nurse', text: 'Nurse' },
    { id: 'Scientist', text: 'Scientist' },
    { id: 'Dentist', text: 'Dentist' },
    { id: 'Physics', text: 'Physics' },
    { id: 'Computing', text: 'Computing' },
    { id: 'Microsoft', text: 'Microsoft' },
    { id: 'Amazon', text: 'Amazon' },
    { id: 'Google', text: 'Google' },
    { id: 'Surgery', text: 'Surgery' },
    { id: 'Medicine', text: 'Medicine' },
    { id: 'Awareness', text: 'Awareness' },
    { id: 'Veterinarian', text: 'Veterinarian' },
    { id: 'Space', text: 'Space' },
    { id: 'Pregnancy', text: 'Pregnancy' },
    { id: 'Data', text: 'Data' },
    { id: 'Health', text: 'Health' },
    { id: 'Diet', text: 'Diet' },
    { id: 'Finance', text: 'Finance' },
    { id: 'Accountant', text: 'Accountant' },
    { id: 'Accounting', text: 'Accounting' },
    { id: 'Economist', text: 'Economist' },
    { id: 'Supply Chain', text: 'Supply Chain' },
    { id: 'Cryptocurrency', text: 'Cryptocurrency' },
    { id: 'Auditor', text: 'Auditor' },
    { id: 'GAAP', text: 'GAAP' },
    { id: 'IAS', text: 'IAS' },
    { id: 'Business Plan', text: 'Business Plan' },
    { id: 'Tax', text: 'Tax' },
    { id: 'Entrepreneur', text: 'Entrepreneur' },
    { id: 'Investor', text: 'Investor' },
    { id: 'Budget', text: 'Budget' },
    { id: 'Shareholder', text: 'Shareholder' },
    { id: 'Risk Management', text: 'Risk Management' },
    { id: 'Analysis', text: 'Analysis' },
    { id: 'Banking', text: 'Banking' },
    { id: 'Human Resources', text: 'Human Resources' },
    { id: 'Lawyer', text: 'Lawyer' },
    { id: 'Amendments', text: 'Amendments' },
    { id: 'PWC', text: 'PWC' },
    { id: 'BDO', text: 'BDO' },
    { id: 'Credit', text: 'Credit' },
    { id: 'Loan', text: 'Loan' },
    { id: 'CIBC', text: 'CIBC' },
    { id: 'BMO', text: 'BMO' },
    { id: 'International', text: 'International' },
    { id: 'Local', text: 'Local' },
    { id: 'Debts', text: 'Debts' },
    { id: 'Wall Street', text: 'Wall Street' },
    { id: 'Markets', text: 'Markets' },
    { id: 'Shares', text: 'Shares' },
    { id: 'Film Making', text: 'Film Making' },
    { id: 'Choreography', text: 'Choreography' },
    { id: 'Music', text: 'Music' },
    { id: 'Acting', text: 'Acting' },
    { id: 'Actor', text: 'Actor' },
    { id: 'Lyrists', text: 'Lyrists' },
    { id: 'Poetry', text: 'Poetry' },
    { id: 'Cinema', text: 'Cinema' },
    { id: 'Movies', text: 'Movies' },
    { id: 'Classics', text: 'Classics' },
    { id: 'Disaster', text: 'Disaster' },
    { id: 'Action', text: 'Action' },
    { id: 'Comedy', text: 'Comedy' },
    { id: 'Thriller', text: 'Thriller' },
    { id: 'Horror', text: 'Horror' },
    { id: 'Sports', text: 'Sports' },
    { id: 'Soccer', text: 'Soccer' },
    { id: 'Football', text: 'Football' },
    { id: 'Hockey', text: 'Hockey' },
    { id: 'Baseball', text: 'Baseball' },
    { id: 'Basketball', text: 'Basketball' },
    { id: 'Hollywood', text: 'Hollywood' },
    { id: 'Bollywood', text: 'Bollywood' },
    { id: 'Hip-Hop', text: 'Hip-Hop' },
    { id: 'Rap', text: 'Rap' },
    { id: 'RnB', text: 'RnB' },
    { id: 'Soul', text: 'Soul' },
    { id: 'Rock', text: 'Rock' },
    { id: 'Indie', text: 'Indie' },
    { id: 'Singers', text: 'Singers' },
    { id: 'Band', text: 'Band' },
    { id: 'Athletics', text: 'Athletics' },
    { id: 'News', text: 'News' },
    { id: 'Politics', text: 'Politics' },
    { id: 'Facebook', text: 'Facebook' },
    { id: 'Twitter', text: 'Twitter' },
    { id: 'Instagram', text: 'Instagram' },
    { id: 'YouTube', text: 'YouTube' },
    { id: 'Romance', text: 'Romance' },
    { id: 'Myths', text: 'Myths' },
    { id: 'Concert', text: 'Concert' },
    { id: 'Stunts', text: 'Stunts' },
]

export default class PersonalityTest extends React.Component {
  static navigationOptions = {
    title: 'Personality Test',
  };

  constructor(props) {
        super(props);

        this.inputRefs = {};

        this.state = {
            typeOption: undefined,
            items: [
                {
                    label: 'Training or Workshop',
                    value: 'training or workshop',
                },
                {
                    label: 'Networking Event',
                    value: 'networking event',
                },
                {
                    label: 'Social Gathering',
                    value: 'social gathering',
                },
            ],
            topicOption: undefined,
            items2: [
                {
                    label: 'Science or Technology',
                    value: 'science or technology',
                },
                {
                    label: 'Business or Professional',
                    value: 'business or professional',
                },
                {
                    label: 'Film, Media or Entertainment',
                    value: 'film, media or entertainment',
                },
            ],
            content: [],
            contentx: [],
        };
    }

  render() {
    return (
      <ScrollView style={styles.container}>
        <RNPickerSelect
            placeholder={{
                label: 'Select a type...',
                value: null,
            }}
            items={this.state.items}
            onValueChange={(value) => {
                this.setState({
                    typeOption: value,
                });
            }}
            onUpArrow={() => {
                this.inputRefs.name.focus();
            }}
            onDownArrow={() => {
                this.inputRefs.picker2.togglePicker();
            }}
            style={{ ...pickerSelectStyles }}
            value={this.state.typeOption}
            ref={(el) => {
                this.inputRefs.picker = el;
            }}
        />
        <RNPickerSelect
            placeholder={{
                label: 'Select a topic...',
                value: null,
            }}
            items={this.state.items2}
            onValueChange={(value) => {
                this.setState({
                    topicOption: value,
                });
            }}
            onUpArrow={() => {
                this.inputRefs.picker.togglePicker();
            }}
            onDownArrow={() => {
                this.inputRefs.company.focus();
            }}
            style={{ ...pickerSelectStyles }}
            value={this.state.topicOption}
            ref={(el) => {
                this.inputRefs.picker2 = el;
            }}
        />
        <MultipleTags tags={objectTags} search onChangeItem={(content) => { this.setState({ content }); }}
          title="Interests"/>
          {(() => this.state.content.map(item => <Text key={item.id}> {item.id}: {item.text} </Text>))()}
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
});
