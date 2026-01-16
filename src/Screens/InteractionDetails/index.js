import { View, Text, StyleSheet, TouchableOpacity, FlatList, Platform, ScrollView } from 'react-native';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Colors from '../../Themes/Colors';
import { CommonStyles } from '../../Themes/CommonStyles';
import { LinearGradient } from 'expo-linear-gradient';
import CustomHeader from '../../Components/CustomHeader';
import { Fonts } from '../../Themes/Fonts';

const InteractionDetails = ({ route }) => {
  const { firstname, lastname, interactionDetails, email, phoneNumber, points, status, created_date } = route.params;
  
  const formatPhoneNumber = (phoneNumber) => {
    const cleaned = ('' + phoneNumber).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{5})(\d{5})$/);
    if (match) {
      return `+91 ${match[1]} ${match[2]}`;
    }
    return `+91 ${phoneNumber}`;
  };

const formatDateOnly = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);

  if (isNaN(date)) return 'Invalid Date';

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};


  const InteractionRow = ({ item }) => (
    <View style={styles.option}>
      <View style={{ width: responsiveWidth(32) }}>
        <Text allowFontScaling={false} style={[styles.optionText, { width: responsiveWidth(22), textAlign: 'center' }]}>
          {formatDateTime(item.meeting_at)}</Text>
      </View>
      <Text allowFontScaling={false} style={[styles.optionText, { width: responsiveWidth(32), textAlign: 'center' }]}>
        {item.engagement_type_description}
        {item.location_type_description ? `, ${item.location_type_description}` : ''}
      </Text>
      <Text allowFontScaling={false} style={styles.statusText}>{item.status_desc ?? 'N/A'}</Text>
    </View>
  );

  const ProfileCardContainer = () => (
    <TouchableOpacity style={styles.cardContainer}>
      <View style={styles.avatar}>
        <LinearGradient
          colors={['#b9bcbfff', '#dadde1ff', '#dce5f0ff']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.avatar}
        >
          <Text allowFontScaling={false} style={styles.avatarText}>
            {(firstname?.[0] || '').toUpperCase()}
        {(lastname?.[0] || '').toUpperCase()}
          </Text>
        </LinearGradient>
      </View>
      <View style={styles.userInfo}>
        <Text allowFontScaling={false} style={styles.userName}>{firstname ? capitalizeFirstLetter(firstname) : 'N/A'} {lastname ? capitalizeFirstLetter(lastname) : ''}</Text>
      </View>
      <Text allowFontScaling={false} style={styles.userName}>{points || '0'}</Text>
    </TouchableOpacity>
  );
const capitalizeFirstLetter = (str) => {
  if (!str || typeof str !== "string") return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

  const detailsSection = () => (
    <View style={CommonStyles.containerBox}>
      <Text allowFontScaling={false} style={styles.headingText}>Details</Text>
      <View style={styles.option}>
        <Text allowFontScaling={false} style={styles.optionText}>Referral Date</Text>
        <Text allowFontScaling={false} style={styles.refinetext}>{formatDateOnly(created_date)}</Text>
      </View>
      <View style={styles.option}>
        <Text allowFontScaling={false} style={styles.optionText}>Phone No.</Text>
        <Text allowFontScaling={false} style={styles.refinetext}>
          {formatPhoneNumber(phoneNumber)}
        </Text>
      </View>
      <View style={styles.option}>
        <Text allowFontScaling={false} style={styles.optionText}>Email ID</Text>
        <Text allowFontScaling={false} style={styles.refinetext}>{email || 'N/A'}</Text>
      </View>
      <View style={[styles.option, { borderBottomWidth: 0 }]}>
        <Text allowFontScaling={false} style={styles.optionText}>Status</Text>
  <Text allowFontScaling={false} style={styles.refinetext}>
        {status ? capitalizeFirstLetter(status) : 'N/A'}
      </Text>
      </View>
    </View>
  );

  const renderContent = () => {
     if (!interactionDetails || interactionDetails.length === 0) {
      return <Text style={styles.noDataText}>No interaction details available.</Text>;
    } else {
      return (
        <View style={CommonStyles.containerBox}>
          <Text allowFontScaling={false} style={styles.headingText}>Logs</Text>
          <View style={styles.option}>
            <Text allowFontScaling={false} style={styles.refinetext}>Date & Time</Text>
            <Text allowFontScaling={false} style={styles.refinetext}>Interaction Type</Text>
            <Text allowFontScaling={false} style={styles.refinetext}>Status</Text>
          </View>
          <FlatList
            data={interactionDetails}
            renderItem={({ item }) => <InteractionRow item={item} />}
            keyExtractor={item => item.id.toString()}
            style={styles.flatList}
          />
        </View>
      );
    }
  };

  return (
    <View style={CommonStyles.container}>
      <CustomHeader title="Referral Profile" showBack />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {ProfileCardContainer()}
        {detailsSection()}
        {renderContent()}
      </ScrollView>
    </View>
  );
};


const styles = StyleSheet.create({

  flatList: {
    marginTop: responsiveHeight(1),
    paddingBottom: responsiveHeight(8),
  },
  statusText: {
    color: Colors.green,
    fontSize: 14,
    textAlign: 'center',
    fontFamily: Fonts.Semibold700,
    width: responsiveWidth(32)
  },
  avatar: {
    backgroundColor: Colors.lightBlue,
    borderRadius: 50,
    width: responsiveWidth(12),
    height: responsiveWidth(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: Colors.blue,
    fontFamily: Fonts.Bold800,
    fontSize: 16,
  },
  userInfo: {
    marginLeft: responsiveWidth(4),
    flex: 1,
  }, userName: {
    fontSize: responsiveFontSize(2),
    fontFamily: Fonts.Semibold700,
    color: Colors.blue,
  },

  cardContainer: {
    backgroundColor: '#F2FDFF',
    borderRadius: 8,
    paddingHorizontal: responsiveWidth(3),
    paddingVertical: responsiveHeight(2),
    shadowColor: Colors.grey,
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },

  scrollContent: {
    paddingBottom: Platform.OS === 'ios' ? responsiveHeight(13) : responsiveHeight(16),
    paddingHorizontal: responsiveWidth(5),
    marginTop: responsiveHeight(3)
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 16,
    color: Colors.blue,
    marginTop: responsiveHeight(3),
    fontFamily: Fonts.Semibold700,
  },


  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: responsiveHeight(1.3),
    borderBottomColor: '#D9D9D9',
    borderBottomWidth: 1.5
  },

  optionText: {
    fontSize: 14,
    color: Colors.blue,
    fontFamily: Fonts.Medium600,
  },
  refinetext: {
    fontSize: 15,
    color: Colors.black,
    fontFamily: Fonts.Semibold700,

  },
  headingText: {
    fontSize: 18,
    color: Colors.blue,
    fontFamily: Fonts.Semibold700,
  }
});

export default InteractionDetails;




