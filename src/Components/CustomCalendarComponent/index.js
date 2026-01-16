import { useState, useEffect } from 'react';
import { View, StyleSheet, } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const CustomCalendarComponent = ({
  isCalendarModalVisible,
  closeCalendarModal,
  dateSelected,
  current,
  maximumDate = new Date(),
  minimumDate,
}) => {
  const [date, setDate] = useState('');

  const handleConfirm = (selectedDate) => {
    const formattedDate = formatDate(selectedDate);
    setDate(formattedDate);
    dateSelected(formatDateValue(selectedDate));
    closeCalendarModal();
  };

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const formatDateValue = formatDate;

  useEffect(() => {
    const initialDate = current ? formatDate(new Date(current)) : '';
    setDate(initialDate);
  }, [current]);

  return (
    <View style={styles.container}>
      <DateTimePickerModal
        isVisible={isCalendarModalVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={closeCalendarModal}
        maximumDate={maximumDate}
        minimumDate={minimumDate}
        themeVariant="light"
        textColor="#000"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default CustomCalendarComponent;