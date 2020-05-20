import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  PermissionsAndroid,
  TextInput,
} from 'react-native';
import Voice from '@react-native-community/voice';
const Main = () => {
  const [permission, setPermission] = useState(false);
  const [results, setResults] = useState([]);
  const [searchString, setSearchString] = useState('');

  useEffect(() => {
    askPermission();
  }, []);

  Voice.onSpeechResults = e => {
    console.log('onSpeechResults: ', e);
    setResults(e.value);
  };

  const askPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: 'We need access to microphone',
          message: 'We need access to start recognition',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        setPermission(true);
      } else {
        setPermission(false);
      }
    } catch (err) {
      console.warn(err);
    }
  };
  const startRecording = async () => {
    try {
      await Voice.start('en-US');
    } catch (e) {
      console.error(e);
    }
  };
  const stopRecording = () => {
    Voice.stop();
  };
  return (
    <View style={styles.scrollView}>
      <Text style={styles.header}>Voice recognition</Text>
      <TouchableOpacity
        style={styles.record}
        onPress={() => {
          askPermission();
          setResults([]);
        }}
        onPressIn={permission && startRecording}
        onPressOut={stopRecording}>
        <Text>Hold and talk</Text>
      </TouchableOpacity>
      <Text style={styles.text}>Result of recognition</Text>
      {results.map((result, index) => (
        <View key={index} style={styles.result}>
          <Text style={{marginHorizontal: 5}}>{index + 1}.</Text>
          <TouchableOpacity onPress={() => setSearchString(result)}>
            <Text>{result}</Text>
          </TouchableOpacity>
        </View>
      ))}

      <Text style={styles.text}>You select</Text>
      <TextInput
        value={searchString}
        onChangeText={text => setSearchString(text)}
      />
    </View>
  );
};

export default Main;

const styles = StyleSheet.create({
  header: {
    fontSize: 18,
  },
  scrollView: {
    backgroundColor: '#fff',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  record: {
    padding: 10,
    borderWidth: 2,
    marginVertical: 20,
  },
  text: {
    fontSize: 20,
    marginVertical: 10,
  },
  result: {
    padding: 10,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
