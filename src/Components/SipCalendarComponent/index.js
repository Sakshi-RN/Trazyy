import { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const SipCalendarComponent = ({
  isCalendarModalVisible,
  closeCalendarModal,
  dateSelected,
  current,
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

  const today = new Date();
const minDate = new Date(today.getFullYear(), today.getMonth(), 1); // start of current month
const maxDate = new Date(today.getFullYear(), today.getMonth() + 2, 0); // end of next month


  return (
    <View style={styles.container}>
      <DateTimePickerModal
        isVisible={isCalendarModalVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={closeCalendarModal}
        minimumDate={minDate}
        maximumDate={maxDate}
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

export default SipCalendarComponent;
