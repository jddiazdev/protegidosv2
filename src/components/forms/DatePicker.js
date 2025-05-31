import React, {useState} from 'react';
import {View, Text, StyleSheet, TextInput} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {TouchableOpacity} from 'react-native';

import Colors from '../../styles/Colors';

const DatePicker = React.forwardRef((props, ref) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [date, setDate] = useState(props.value);
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = date => {
    hideDatePicker();
    let strDate = date.toISOString().slice(0, 10);
    setDate(strDate);
    props.handleFormValueChange(props.formKey, strDate);
  };

  return (
    <View style={styles.formFieldWrapper}>
      <Text style={props.isValid ? styles.formLabel : styles.formLabelError}>
        {props.label}
      </Text>
      <TouchableOpacity onPress={showDatePicker}>
        <View style={[styles.formInput, props.isValid ? '' : styles.borderRed]}>
          <Text style={styles.textValue}>{date}</Text>
        </View>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
      <TextInput
        autoCorrect={false}
        style={{display: 'none'}}
        value={date}
        ref={ref}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  formFieldWrapper: {},
  formLabel: {
    color: 'white',
    fontSize: 16,
  },
  formLabelError: {
    color: '#e03131',
    fontSize: 16,
  },
  formInput: {
    height: 40,
    borderBottomColor: 'white',
    borderBottomWidth: 1,
    color: Colors.secondary,
    paddingHorizontal: 8,
    marginBottom: 32,
  },
  borderRed: {
    borderBottomColor: '#e03131',
  },
  textValue: {
    color: Colors.secondary,
    position: 'absolute',
    bottom: 8,
    left: 8,
  },
});
// const ref = React.createRef();
export default DatePicker;
