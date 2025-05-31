import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {AuthContext} from '../context';

import StartScreen from '../screens/StartScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import TermsScreen from '../screens/TermsScreen';
import SliderScreen from '../screens/SliderScreen';

// Logged
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import MembershipScreen from '../screens/dashboard/MembershipScreen';
import EmergencyScreen from '../screens/dashboard/EmergencyScreen';
import ReportTripScreen from '../screens/dashboard/ReportTripScreen';
import OurCoverageScreen from '../screens/dashboard/OurCoverageScreen';
import UpdateProfileScreen from '../screens/dashboard/UpdateProfileScreen';
import UploadDocumentsScreen from '../screens/dashboard/UploadDocumentsScreen';
import PostsScreen from '../screens/dashboard/PostsScreen';
import AddPostScreen from '../screens/dashboard/AddPostScreen';
import PostDeatilScreen from '../screens/dashboard/PostDetailScreen';
import PlansScreen from '../screens/PlansScreen';
import WebviewScreen from '../screens/WebviewScreen';
import RecoverPasswordScreen from '../screens/RecoverPasswordScreen';

// Lawyer
import RegisterCaseScreen from '../screens/lawyer/RegisterCaseScreen';
import ChoosePost from '../screens/dashboard/ChoosePost';

const Stack = createNativeStackNavigator();

const navigation = (authContext, loginState) => (
  <AuthContext.Provider value={authContext}>
    <NavigationContainer>
      <Stack.Navigator>
        {loginState.userToken ? (
          <>
            <Stack.Screen
              name="Dashboard"
              component={DashboardScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Membership"
              component={MembershipScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Emergency"
              component={EmergencyScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="ReportTrip"
              component={ReportTripScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="OurCoverage"
              component={OurCoverageScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="UpdateProfile"
              component={UpdateProfileScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Slider"
              component={SliderScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="UploadDocuments"
              component={UploadDocumentsScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="ChoosePost"
              component={ChoosePost}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Posts"
              component={PostsScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="AddPost"
              component={AddPostScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="PostDetail"
              component={PostDeatilScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="RegisterCase"
              component={RegisterCaseScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Plans"
              component={PlansScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="RecoverPassword"
              component={RecoverPasswordScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Webview"
              component={WebviewScreen}
              options={{headerShown: false}}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Start"
              component={StartScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Terms"
              component={TermsScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Slider"
              component={SliderScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="RecoverPassword"
              component={RecoverPasswordScreen}
              options={{headerShown: false}}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  </AuthContext.Provider>
);

export default navigation;
