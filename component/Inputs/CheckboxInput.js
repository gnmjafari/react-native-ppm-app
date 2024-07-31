import { useState } from "react";
import { Checkbox } from "react-native-paper";

function CheckboxInput({ status, onPressCustom, ...props }) {
  const [value, setValue] = useState(status);

  const handlePress = () => {
    const newValue = !value;
    setValue(newValue);

    if (onPressCustom) {
      onPressCustom(newValue);
    }
  };

  return (
    <Checkbox.Item
      status={value ? "checked" : "unchecked"}
      onPress={handlePress}
      {...props}
    />
  );
}

export default CheckboxInput;
