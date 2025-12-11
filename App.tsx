import React, { use, useEffect } from 'react';
import 'react-native-get-random-values';

import RootNavigator from './src/navigation/RootNavigator';
import { createTables } from './src/database/database';

export default function App() {

  useEffect(() => {
    createTables();
  }, []);
  
  return <RootNavigator />;
}
