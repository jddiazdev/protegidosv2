import React from 'react';
import {Image, Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const PostItem = ({post, size, preview = false}) => {
  const navigation = useNavigation();
  const imageSize = parseInt(size);

  return (
    <>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('PostDetail', {post});
        }}
        style={styles.itemWrapper}>
        <View style={styles.itemContent}>
          <Image
            style={{
              width: imageSize,
              height: imageSize,
            }}
            source={{
              uri: post.picture,
            }}
          />
          <View style={styles.ctnItemText}>
            <Text style={styles.itemTitle}>{post.title}</Text>
            {preview && <Text style={styles.itemDesc}>{post.excerpt}</Text>}
            {!preview && (
              <Text style={styles.itemDesc}>{post.description}</Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  itemWrapper: {
    backgroundColor: 'white',
    marginBottom: 8,
  },
  itemContent: {
    flexDirection: 'row',
  },
  ctnItemText: {
    padding: 16,
    flexShrink: 1,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#343434',
  },
  itemDesc: {
    marginTop: 12,
    fontSize: 14,
    color: '#777',
  },
});

export default PostItem;
