import React, {useState, useEffect} from 'react';
import {ActivityIndicator, Text, View, StyleSheet, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Picker} from '@react-native-picker/picker';
import {useNavigation} from '@react-navigation/native';

import Colors from '../../styles/Colors';
import axios from '../../network/axios';
import PostItem from './PostItem';
import Button from '../buttons/Button';

const PostFeed = () => {
  const PER_PAGE = 10;
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState([
    {name: '', id: 'Seleccionar categoría'},
  ]);
  const [filteredCategory, setFilteredCategory] = useState('');
  const navigation = useNavigation();
  useEffect(() => {
    const getPosts = async () => {
      if (filteredCategory !== '') {
        setIsLoading(true);
        try {
          let res = await axios.get(
            `/advert/ads/${PER_PAGE}/${currentPage}/${filteredCategory}`,
          );
          setPosts([...posts, ...res.data.data]);
          setTotal(res.data.meta.total);
          setTotalPages(res.data.meta.last_page);
        } catch (e) {
          throw new Error(
            `Error on PostFeed getPosts ${(JSON.stringify(e), e.message)}`,
          );
        }
        setIsLoading(false);
      }
    };
    getPosts();
  }, [currentPage]);

  useEffect(() => {
    const getPosts = async () => {
      if (filteredCategory !== '') {
        setCurrentPage(1);
        setPosts([]);
        setIsLoading(true);
        try {
          await axios
            .get(`/advert/ads/${PER_PAGE}/${currentPage}/${filteredCategory}`)
            .then(res => {
              setPosts(res.data.data);
              setTotal(res.data.meta.total);
              setTotalPages(res.data.meta.last_page);
            })
            .catch(async e => {
              if (e.response.status === 401 || e.response.status === 403) {
                Alert.alert(
                  'No permitido',
                  'Su sesión ha expirado, por favor ingrese de nuevo.',
                  [
                    {
                      text: 'Gracias',
                    },
                  ],
                  {cancelable: false},
                );
                await AsyncStorage.removeItem('userToken');
              }
              throw new Error(
                `Error on PostFeed getPosts line 71 ${e.message}, ${e}`,
              );
            });
        } catch (e) {
          throw new Error(
            `Error on PostFeed getPosts line 75 ${e.message}, ${e}`,
          );
        }
        setIsLoading(false);
      }
    };
    getPosts();
  }, [filteredCategory]);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        let resCategories = await axios.get('/advert/categories');
        setCategories(resCategories.data);
      } catch (e) {
        throw new Error(`Error on PostFeed fetchCategories ${e.message}, ${e}`);
      }
      setIsLoading(false);
    };
    fetchCategories();
  }, []);

  const loadMorePosts = () => {
    setCurrentPage(currentPage + 1);
  };

  const postList = () => {
    if (posts.length) {
      return posts.map(item => (
        <PostItem key={item.id} post={item} size="150" preview={true} />
      ));
    }

    return [];
  };

  const getCategories = () => {
    return categories.map(cat => {
      return <Picker.Item label={cat.title} value={cat.id} key={cat.id} />;
    });
  };

  return (
    <>
      <View style={styles.wrapper}>
        <View style={styles.selectWrapper}>
          <Picker
            selectedValue={filteredCategory}
            itemStyle={styles.pickItem}
            style={styles.labelSelect}
            dropdownIconColor={Colors.white}
            mode="dialog"
            onValueChange={itemValue => setFilteredCategory(itemValue)}>
            <Picker.Item label="Seleccionar categoría" value="" key="0" />
            {getCategories()}
          </Picker>
        </View>

        {postList()}

        {isLoading && (
          <ActivityIndicator
            style={styles.loading}
            size="large"
            color="white"
          />
        )}
        {currentPage < totalPages && (
          <Button
            text="Cargar más"
            variant="primary"
            onPress={loadMorePosts}
            disabled={isLoading}
          />
        )}
      </View>
      {/* <Text style={{color:'white',fontSize:32, padding:15}}>Current Page: {currentPage}</Text> */}
    </>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    padding: 16,
  },
  labelSelect: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  pickItem: {
    color: Colors.white,
  },
});

export default PostFeed;
