import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  Platform,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import Colors from '../../Themes/Colors';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { Fonts } from '../../Themes/Fonts';
import Loader from '../../Components/Loader';
import Icon from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';

const ModalDropdown = ({
  visible,
  data,
  onSelect,
  onClose,
  loading,
  onEndReached,
  onEndReachedThreshold = 0.5,
  footerLoading = false,
  searchable = false,
  onSearch,
}) => {
  const isEmpty = !loading && (!data || data.length === 0);
  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.headerContainer}>
                <Text allowFontScaling={false} style={styles.headerTitle}>Choose an option</Text>
                <TouchableOpacity onPress={onClose}>
                  <Icon name="cross" size={30} color={Colors.blue} />
                </TouchableOpacity>
              </View>

              {searchable && (
                <View style={styles.searchContainer}>
                  <Feather name="search" size={20} color={Colors.grey} />
                  <TextInput
                    placeholder="Search Scheme"
                    style={styles.inputStyle}
                    placeholderTextColor={Colors.grey}
                    onChangeText={onSearch}
                    allowFontScaling={false}
                  />
                </View>
              )}

              {loading ? (
                <View style={styles.loaderContainer}>
                  <Loader />
                </View>
              ) : isEmpty ? (
                <View style={styles.centerLogo}>
                  <Text style={styles.errorText}>{"No Data Found"}</Text>
                </View>
              ) : (
                <FlatList
                  data={data}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.itemStyle}
                      onPress={() => {
                        onSelect?.(item);
                        onClose();
                      }}
                    >
                      <Text style={styles.itemText}>{item.label}</Text>
                    </TouchableOpacity>
                  )}
                  onEndReached={onEndReached}
                  onEndReachedThreshold={onEndReachedThreshold}
                  ListFooterComponent={
                    footerLoading ? (
                      <View style={{ paddingVertical: 10 }}>
                        <Loader />
                      </View>
                    ) : null
                  }
                  showsVerticalScrollIndicator
                  persistentScrollbar={Platform.OS === 'ios'}
                  style={{ backgroundColor: Colors.OFFWHITE, maxHeight: responsiveHeight(60) }}
                />

              )
              }
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
};
export default ModalDropdown;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: responsiveHeight(3),
  },
  modalContainer: {
    width: '80%',
    backgroundColor: Colors.white,
    maxHeight: '90%',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
  },
  itemStyle: {
    alignItems: 'center',
    paddingHorizontal: responsiveWidth(3),
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey,
    paddingVertical: responsiveHeight(1.2),
  },
  itemText: {
    fontSize: 11,
    color: Colors.black,
    fontFamily: Fonts.Semibold700,
    textAlign: 'center'
  },


  errorText: {
    color: Colors.blue,
    alignSelf: 'center',
    fontSize: 15,
    fontFamily: Fonts.Semibold700,
  },
  loaderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center'
  },
  centerLogo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: responsiveHeight(2)
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: Fonts.Bold800,
    color: Colors.blue,
    textAlign: 'center',
    width: responsiveWidth(60),
    marginLeft: responsiveWidth(6)
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.OFFWHITE,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.grey,
    paddingHorizontal: responsiveWidth(2),
    marginVertical: responsiveHeight(2),
    height: responsiveHeight(5),
  },
  inputStyle: {
    flex: 1,
    marginLeft: 10,
    fontFamily: Fonts.Medium600,
    color: Colors.black,
    fontSize: 14,
  },
});