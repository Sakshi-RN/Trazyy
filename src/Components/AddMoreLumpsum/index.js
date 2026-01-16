import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal,Platform } from 'react-native';
import Colors from '../../Themes/Colors';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { Fonts } from '../../Themes/Fonts';
import { useNavigation } from '@react-navigation/native';
import { CommonStyles } from '../../Themes/CommonStyles';
import { SelectFolio, SelectScheme } from '../../Assets/svg';
import CustomButton from '../../Components/CustomButton';

const AddMoreLumpsum = ({
  isVisible,
  onClose,
  title,
  folioOption = { label:'', navigateTo: '' },
  schemeOption = { label: '', navigateTo: '' },
}) => {
  const navigation = useNavigation();
  const [selectedOption, setSelectedOption] = useState(null);

  const handleConfirm = () => {
    onClose?.();
    if (selectedOption === 'folios') {
      navigation.navigate(folioOption.navigateTo);
    } else if (selectedOption === 'scheme') {
      navigation.navigate(schemeOption.navigateTo, { resetForm: true });
    }
  };

  return (
    <Modal transparent animationType="slide" visible={isVisible} onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <TouchableOpacity style={styles.backdropArea} activeOpacity={1} onPress={onClose} />
        <View style={styles.sheetContainer}>
          <View style={styles.dragHandle} />
          <Text allowFontScaling={false} style={styles.title}>
            {title}
          </Text>

          <TouchableOpacity
            style={[CommonStyles.containerBox, styles.actionRow]}
            onPress={() => setSelectedOption('folios')}
          >
            <View style={styles.radioContainer}>
              <View
                style={[
                  styles.radioOuter,
                  selectedOption === 'folios' && styles.radioOuterSelected,
                ]}
              >
                {selectedOption === 'folios' && <View style={styles.radioInner} />}
              </View>
            </View>
            <SelectFolio />
            <Text allowFontScaling={false} style={styles.tagGray}>
              {folioOption.label}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[CommonStyles.containerBox, styles.actionRow]}
            onPress={() => setSelectedOption('scheme')}
          >
            <View style={styles.radioContainer}>
              <View
                style={[
                  styles.radioOuter,
                  selectedOption === 'scheme' && styles.radioOuterSelected,
                ]}
              >
                {selectedOption === 'scheme' && <View style={styles.radioInner} />}
              </View>
            </View>
            <SelectScheme />
            <Text allowFontScaling={false} style={styles.tagGray}>
              {schemeOption.label}
            </Text>
          </TouchableOpacity>

          <CustomButton
            title="Continue"
            disabled={!selectedOption}
            onPress={handleConfirm}
            buttonStyle={[
              styles.confirmButton,
              !selectedOption && { backgroundColor: Colors.lightggrey },
            ]}
          />
        </View>
      </View>
    </Modal>
  );
};

export default AddMoreLumpsum;


const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  backdropArea: {
    flex: 1,
  },
  sheetContainer: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    paddingHorizontal: responsiveWidth(5),
    paddingBottom: responsiveHeight(5),
    paddingTop: responsiveHeight(1)
  },
  dragHandle: {
    width: responsiveWidth(45),
    height: responsiveHeight(0.3),
    backgroundColor: Colors.LIGHTGREY,
    borderRadius: 3,
    alignSelf: 'center'
  },
  title: {
    fontSize: 18,
    fontFamily: Fonts.Semibold700,
    marginTop: responsiveHeight(2),
  },
  tagGray: {
    color: Colors.blue,
    fontSize: 15,
    fontFamily: Fonts.Medium600,
    marginLeft: responsiveWidth(3),
    width:responsiveWidth(63)
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  radioContainer: {
    marginRight: responsiveWidth(4),
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.grey,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: Colors.blue,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.blue,
  },
  confirmButton: {
    marginTop: responsiveHeight(3),
  marginBottom:Platform.OS === 'ios' ? 0 : responsiveHeight(3)

  },
  confirmText: {
    color: '#fff',
    fontSize: responsiveHeight(2),
    fontFamily: Fonts.Medium,
  },
});
