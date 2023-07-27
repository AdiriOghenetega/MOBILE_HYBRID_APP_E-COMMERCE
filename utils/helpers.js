import Toast from 'react-native-root-toast'
import AsyncStorage from '@react-native-async-storage/async-storage';


export const toast = (message)=>{
    Toast.show(message, {
      duration: Toast.durations.SHORT,
      position: Toast.positions.CENTER
    });
  }

  export const storeData = async (name,value) => {
    try {
      const jsonValue = JSON.stringify(value)
      await AsyncStorage.setItem(name, jsonValue)
    } catch (e) {
      toast(e)
    }
  }

  export const getData = async (name) => {
    try {
      const jsonValue = await AsyncStorage.getItem(name)
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch(e) {
      toast(e)
    }
  }

  export function numberWithCommas(x) {
    let parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}