import React from 'react';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { Text } from 'react-native';

export interface Item {
  id: string;
  text: string;
}


export default function EditableDeletableItem ( {item} : {item : Item}) {
  //you may comment the <ReanimatedSwipeable> component and observe no more warnings.
  return (
     <ReanimatedSwipeable>
      <Text>
        {item.text}
      </Text>
    </ReanimatedSwipeable>
  );
}
