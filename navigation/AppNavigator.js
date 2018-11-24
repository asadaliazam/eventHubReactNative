import { createSwitchNavigator } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import { createStackNavigator } from 'react-navigation';
import CreateEvent from '../screens/CreateEvent';
import EventDetails from '../screens/EventDetails';
import VisitedEvents from '../screens/VisitedEvents';
import CreatedEvents from '../screens/CreatedEvents';
import RegisteredEvents from '../screens/RegisteredEvents';




const AppStack = createStackNavigator({ CreateEvent: CreateEvent}, {Main:MainTabNavigator});
const AppStack2 = createStackNavigator({ EventDetails: EventDetails}, {Main:MainTabNavigator});



// export default createSwitchNavigator({
//   Main: MainTabNavigator,
//   AppStack: AppStack
// });

export default createSwitchNavigator(
  {
    Main: MainTabNavigator,
    App: AppStack,
    App2: AppStack2,
   
  },
  // {
  //   initialRouteName: 'Main',
  // }
);