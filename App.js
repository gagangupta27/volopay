

import React,{useEffect,useState,useCallback} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  FlatList,
  Text,
  useColorScheme,
  View,
  Image,
  Dimensions,
  TextInput,
  StyleSheet
} from 'react-native';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [pageNo,setPageNo] = useState(0);
  const [data,setData] = useState([]);
  const [search,setSearch] = useState("");

  useEffect(() => {
    if(search == ""){
      fetch('https://api.giphy.com/v1/gifs/trending?api_key=zS6vod4EAq8VI2JksdKfR2gqzQY7gGmg', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
      }).then((response) => response.json())
      .then((json) => {
        if(json?.meta?.status == 200){
          var temp = []
          json.data.forEach(id => {
            temp.push(id?.images?.preview_gif)
          });
          setData(temp)
        }else{
          alert("API ERROR")
        }
      })
    }
  }, [search])

  const debounce = (func) => {
    let timer;
    return function (...args) {
      const context = this;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        timer = null;
        func.apply(context, args);
      }, 1000);
    };
  };

  const handleChange = (value) => {
    if(value != ""){
      fetch('https://api.giphy.com/v1/gifs/search?api_key=zS6vod4EAq8VI2JksdKfR2gqzQY7gGmg&q=' + value, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
      }).then((response) => response.json())
      .then((json) => {
        if(json?.meta?.status == 200){
          var temp = []
          json.data.forEach(id => {
            temp.push(id?.images?.preview_gif)
          });
          setData(temp)
        }else{
          alert("API ERROR")
        }
      })
    }
  };

  const debounceFunc = useCallback(
    debounce(handleChange), 
  []);



  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <View style={styles.inputContainer}>
        <TextInput 
            value={search}
            placeholder={"Seach..."}
            onChangeText={(text)=>{
              setSearch(text)
              debounceFunc(text)
            }}
            style={styles.input}
          />
        </View>

        <FlatList
          maxToRenderPerBatch={10}
          data={data}
          onEndReached={() => {
              fetch('https://api.giphy.com/v1/gifs/trending?api_key=zS6vod4EAq8VI2JksdKfR2gqzQY7gGmg&offset=' + data.length, {
                method: 'GET',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json'
                },
              }).then((response) => response.json())
              .then((json) => {
                if(json?.meta?.status == 200){
                  var temp = []
                  json.data.forEach(id => {
                    temp.push(id?.images?.preview_gif)
                  });
                  setData((prev) => {
                    return [...prev, ...temp];
                  });
                }else{
                  alert("API ERROR")
                }
              })
            }}
            style={styles.flatList}
            renderItem={({item,index}) => (
              <View 
                style={[{height:item?.height > 400 ? 180 : 150,},styles.renderItem]}
                >
                  <Image key={index} source={{uri:item?.url}} style={styles.image}/>
              </View>
            )}
            numColumns={2}
            keyExtractor={(item, index) => index.toString()}
          />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#202020',
  },
  inputContainer: {
    padding:10
  },
  input:{
    elevation:100,
    padding:10,
    borderRadius:5,
    borderWidth:1,
  },
  flatList:{
    marginTop:20,
    backgroundColor:"#202020"
  },
  renderItem:{
    width:(windowWidth - 40)/2,
    padding:10,
    margin:10,
    backgroundColor:"#202020",
    justifyContent:"center",
    alignItems:"center",
    borderRadius:4,
    elevation:20,
  },
  image:{
    height:"100%",
    width:"100%",
    borderRadius:5,
    overflow:"hidden"
  }
});


export default App;
