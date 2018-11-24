import React  from 'react';
import { createStackNavigator } from 'react-navigation';//install package
import HomeScreen from "./screens/HomeScreen";
import CreateEvent from './screens/CreateEvent';



const RootStack = createStackNavigator(
    {
      Home: HomeScreen,
      CreateEvent: CreateEvent,
    },
  );

export default class App extends React.Component {
    render() {
      return <RootStack />;
    }
  }