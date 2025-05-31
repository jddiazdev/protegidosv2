import {useState} from 'react';

export const useFormValidate = (rules, values) => {
  const [formRules, setFormRules] = useState(rules);

  const isEmpty = value => {
    return /^(?!\s*$).+/.test(value) ? false : true;
  };
  const isValidEmail = value => {
    // eslint-disable-next-line
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)
      ? true
      : false;
  };

  const isValidPhone = value => {
    // eslint-disable-next-line
    return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(
      value,
    )
      ? true
      : false;
  };
  const isValidInput = key => {
    if (rules[key] === undefined || !rules[key]) {
      return true;
    }

    if (rules[key].includes('required')) {
      if (isEmpty(values[key])) {
        return false;
      }
    }
    if (rules[key].includes('email')) {
      if (!isValidEmail(values[key])) {
        return false;
      }
    }
    if (rules[key].includes('phone')) {
      if (!isValidPhone(values[key])) {
        return false;
      }
    }
    if (rules[key].includes('excerpt')) {
      if (values[key].length > 50) {
        return false;
      }
    }
    if (rules[key].includes('tweet')) {
      if (values[key].length > 220) {
        return false;
      }
    }
    if (rules[key].includes('text')) {
      if (values[key].length > 500) {
        return false;
      }
    }
    return true;
  };
  const isValidForm = () => {
    for (let key in values) {
      if (!isValidInput(key)) {
        return false;
      }
    }
    return true;
  };

  return [formRules, isValidForm, isValidInput];
};
