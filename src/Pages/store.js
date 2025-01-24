import {atom} from "recoil"


export const loginCheck = atom({
  key: 'login', // unique ID (with respect to other atoms/selectors)
  default: false, // default value (aka initial value)
});