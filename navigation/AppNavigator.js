import { createSwitchNavigator } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import { createStackNavigator } from 'react-navigation';
import CreateEvent from '../screens/CreateEvent';
import EventDetails from '../screens/EventDetails';
import VisitedEvents from '../screens/VisitedEvents';
import CreatedEvents from '../screens/CreatedEvents';
import RegisteredEvents from '../screens/RegisteredEvents';
import UserAccount from '../screens/UserAccount';



const AppStack = createStackNavigator({ CreateEvent: CreateEvent}, {Main:MainTabNavigator});
const AppStack2 = createStackNavigator({ EventDetails: EventDetails}, {Main:MainTabNavigator});
const AppStack3 = createStackNavigator({ EventDetails: EventDetails}, {Main:UserAccount});



// export default createSwitchNavigator({
//   Main: MainTabNavigator,
//   AppStack: AppStack
// });

export default createSwitchNavigator(
  {
    Main: MainTabNavigator,
    App: AppStack,
    App2: AppStack2,
    App3: AppStack3,
   
  },
  // {
  //   initialRouteName: 'Main',
  // }
);