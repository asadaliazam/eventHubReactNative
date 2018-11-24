import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import DiscoverNow from '../screens/DiscoverNow';
import Search from '../screens/Search';
import UserAccount from '../screens/UserAccount';
import CreateEvent from '../screens/CreateEvent';
import { Icon } from 'react-native-elements'


const HomeStack = createStackNavigator({
  Home: HomeScreen,
});

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  headerStyle: {
    backgroundColor: '#02b3e4',
  },
  tabBarIcon: ({ focused }) => (
    <Icon
  
  name='home'
  type='font-awesome'
  color='#fff'
  />
  ),
};

const DiscoverNowStack = createStackNavigator({
  Discover: DiscoverNow,
});

DiscoverNowStack.navigationOptions = {
  tabBarLabel: 'Discover Now',
  tabBarIcon: ({ focused }) => (
    <Icon
  
  name='wpexplorer'
  type='font-awesome'
  color='#fff'
  />
  ),
};

const SearchStack = createStackNavigator({
  Search: Search,
});

SearchStack.navigationOptions = {
  tabBarLabel: 'Search',
  tabBarIcon: ({ focused }) => (
    <Icon
  
  name='search'
  type='font-awesome'
  color='#fff'
  />
  ),
};



const UserAccountStack = createStackNavigator({
  Account: UserAccount,
});

UserAccountStack.navigationOptions = {
  tabBarLabel: 'User Account',
  tabBarIcon: ({ focused }) => (
    <Icon
  
  name='user'
  type='font-awesome'
  color='#fff'
  />
  ),
};




export default createBottomTabNavigator({
  HomeStack,
  DiscoverNowStack,
  SearchStack,
  UserAccountStack,
},{
  tabBarPosition: 'bottom',
  tabBarOptions: {
    activeTintColor: 'white',
    activeBackgroundColor: '#ea526f',
    inactiveTintColor: 'white',
    swipeEnabled: true,
    showLabel: true,
    showIcon: true,
    style: {
      backgroundColor: '#02b3e4',
    },
    indicatorStyle: {
      backgroundColor: 'white',
    }
  },
  swipeEnabled: true,

});
