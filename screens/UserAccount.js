import React from 'react';
import { TouchableOpacity, Image, View, Text, AsyncStorage, Platform, ScrollView, StyleSheet, Button, Dimensions } from 'react-native';
import { ButtonGroup } from 'react-native-elements';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import { Constants } from 'expo';
import VisitedEvents from './VisitedEvents';
import CreatedEvents from './CreatedEvents';
import RegisteredEvents from './RegisteredEvents';




FirstRoute = () => (
  <View style={[styles.scene, { backgroundColor: '#ff4081' }]} />
);
SecondRoute = () => (
  <View style={[styles.scene, { backgroundColor: '#673ab7' }]} />
);

ThirdRoute = () => (
  <View style={[styles.scene, { backgroundColor: '#dddddd' }]}>

    <Text>{this.state.email}</Text>

  </View>


);

export default class UserAccount extends React.Component {
  static navigationOptions = {
    title: 'User Account',
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
    this.updateIndex = this.updateIndex.bind(this)

    this.state = {
      email: '',
      createdEvents: [],
      registeredEvents: [],
      visitedEvents: [],
      selectedIndex: 1,
      index: 0,
      routes: [
        { key: 'first', title: 'Visited' },
        { key: 'second', title: 'Registered' },
        { key: 'third', title: 'Created' }
      ],
    }
  }

  updateIndex(selectedIndex) {
    this.setState({ selectedIndex })
  }

  _handleIndexChange = index => this.setState({ index });
  _renderTabBar = props => <TabBar {...props}        indicatorStyle={styles.indicator}
  style={styles.tabbar}
  labelStyle={styles.label}
/>;
  _renderScene = ({ route }) => {
    switch (route.key) {
      case 'first':
        return <VisitedEvents />;
      case 'second':
        return <RegisteredEvents />
      case 'third':
        return <CreatedEvents />

      default:
        return null;
    }
  };

  componentDidMount() {
  }


  render() {
    const { selectedIndex } = this.state
    return (

      <TabView
        navigationState={this.state}
        renderScene={this._renderScene}
        renderTabBar={this._renderTabBar}
        onIndexChange={this._handleIndexChange}
        initialLayout={{
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height,

        }}
        
      />




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
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10
  },
  scene: {
    flex: 1,
  },
  header: {
    paddingTop: Constants.statusBarHeight,
  },
  tabbar: {
    backgroundColor: '#222',
  },
  indicator: {
    backgroundColor: '#ffeb3b',
  },
  label: {
    color: '#fff',
    fontWeight: '400',
    fontSize: 10,
  },
});
