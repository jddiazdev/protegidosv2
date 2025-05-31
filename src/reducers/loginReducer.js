const loginReducer = (prevState, action) => {
  switch (action.type) {
    case 'RETRIEVE_TOKEN':
      return {
        ...prevState,
        userToken: action.token,
      };
    case 'LOGIN':
      return {
        ...prevState,
        userEmail: action.email,
        userToken: action.token,
      };
    case 'LOGOUT':
      return {
        ...prevState,
        userEmail: null,
        userToken: null,
      };
    case 'REGISTER':
      return {
        ...prevState,
        userEmail: action.email,
        userToken: action.token,
      };
    case 'RESTORE_TOKEN':
      return {
        ...prevState,
        userToken: action.token,
      };
  }
};

export default loginReducer;
