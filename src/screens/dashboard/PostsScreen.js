import React from 'react';
import {SafeAreaView, StatusBar, StyleSheet, Text, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import Colors from '../../styles/Colors';
import BackButton from '../../components/header/BackButton';
import PostFeed from '../../components/dashboard/PostFeed';

const PostsScreen = ({route}) => {
  const {user} = route.params;
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <SafeAreaView style={styles.mainWrapper}>
        <KeyboardAwareScrollView>
          <BackButton />
          <View style={styles.ctnAddPost}>
            <Text style={styles.title}>Clasificados</Text>
          </View>
          <PostFeed user={user} />
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  mainWrapper: {
    backgroundColor: Colors.primary,
    flex: 1,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    color: 'white',
  },
  ctnAddPost: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default PostsScreen;
