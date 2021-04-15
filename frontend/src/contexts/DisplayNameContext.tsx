import React from "react";

const y: React.Dispatch<React.SetStateAction<string>> = () => {};
const DisplayNameContext = React.createContext({
  displayName: '',
  setDisplayName: y,
});

export default DisplayNameContext