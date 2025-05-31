import React from 'react';
import {View, Text, StyleSheet, TextInput} from 'react-native';
import Colors from '../../styles/Colors';

const FormField = React.forwardRef((props, ref) => (
  <View style={styles.formFieldWrapper}>
    <Text style={props.isValid ? styles.formLabel : styles.formLabelError}>
      {props.label}
    </Text>
    <TextInput
      autoCorrect={false}
      placeholder={props.placeholder}
      editable={!props.editable ? true : false}
      style={[styles.formInput, props.isValid ? '' : styles.borderRed]}
      maxLength={props.maxLength ? props.maxLength : 500}
      onChange={event =>
        props.handleFormValueChange(props.formKey, event.nativeEvent.text)
      }
      {...props.textInputProps}
      onSubmitEditing={props.onSubmitEditing}
      ref={ref}
      value={props.value}
    />
  </View>
));

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
    minHeight: 40,
    borderBottomColor: 'white',
    borderBottomWidth: 1,
    color: Colors.secondary,
    paddingHorizontal: 8,
    marginBottom: 32,
    minWidth: 220,
  },
  borderRed: {
    borderBottomColor: '#e03131',
  },
});
// const ref = React.createRef();
export default FormField;
