import { useState, useEffect } from 'react';
import { View, StyleSheet, } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const GenderComponent = ({
  isCalendarModalVisible,
  closeCalendarModal,
  dateSelected,
  current,
}) => {
  const [gender, setGender] = useState('');
    const [isGenderModalVisible, setIsGenderModalVisible] = useState(false);



 const renderModal = () => {
        return (
            <Modal
                transparent={true}
                visible={isGenderModalVisible}
                animationType="slide"
                onRequestClose={toggleGenderModal}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPressOut={toggleGenderModal}
                >
                    <View style={styles.modalContent}>
                        {genderList.map((item) => (
                            <TouchableOpacity key={item.id} onPress={() => selectGender(item.label)}>
                                <Text style={styles.dropdownOption}>{item.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </TouchableOpacity>
            </Modal>
        )
    }
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },

   modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: responsiveWidth(80),
        padding: responsiveHeight(2),
        backgroundColor: Colors.white,
        borderRadius: 10,
        alignItems: 'center',
    },
    dropdownOption: {
        padding: responsiveHeight(2),
        color: Colors.blue,
        fontWeight: 'bold',
        fontSize: responsiveFontSize(2),
        textAlign: 'center',
    },
});

export default GenderComponent;
