import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MediumFontText } from '../shared/Paragrahp';
import { MaterialCommunityIcons } from '@expo/vector-icons';
interface DarkModeToggleProps {
  onDarkModeToggle: (isDarkMode: boolean) => void;
}

const DarkModeToggle: React.FC<DarkModeToggleProps> = ({ onDarkModeToggle }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    onDarkModeToggle(isDarkMode);
  };

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 20 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>

        <MaterialCommunityIcons name="toggle-switch-off-outline" size={30} color="black" />
        <MediumFontText data="Dark Mode" textstyle={{ fontSize: 17, fontWeight: '500' }} />

      </View>
      <TouchableOpacity style={styles.toggleButton} onPress={toggleDarkMode}>
        <View style={styles.toggleSwitch}>
          <View
            style={[
              styles.toggleIndicator,
              isDarkMode ? styles.toggleIndicatorOn : null
            ]}
          />
        </View>
        {/* <Text style={styles.toggleLabel}>{isDarkMode ? 'ON' : 'OFF'}</Text> */}
      </TouchableOpacity>
    </View>

  );
};

const styles = StyleSheet.create({
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleSwitch: {
    width: 50,
    height: 25,
    borderRadius: 25,
    backgroundColor: 'lightgrey', // Background color when OFF
    borderWidth: 1,
    borderColor: 'grey', // Border color
    justifyContent: 'center',
    padding: 2,
  },
  toggleIndicator: {
    width: 21,
    height: 21,
    borderRadius: 21,
    backgroundColor: 'white', // Indicator color when OFF
  },
  toggleIndicatorOn: {
    transform: [{ translateX: 25 }], // Move indicator to the right for ON state
    backgroundColor: 'white', // Indicator color when ON
  },
  toggleLabel: {
    fontSize: 16,
    marginLeft: 8,
  },
});

export default DarkModeToggle;
