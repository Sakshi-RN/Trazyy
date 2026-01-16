import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Colors from '../../Themes/Colors';
import { Fonts } from '../../Themes/Fonts';

const PromoCard = ({
  SvgImage,
  RightSideSvgImage,
  title,
  subtitle,
  ctaText,
  ctaColor = '#FF3B30',
  onPress,
  borderColor
}) => {
  return (
    <View style={[styles.container, { borderColor }]} onPress={onPress} activeOpacity={0.8}>
      {SvgImage && <SvgImage />}
      <View style={styles.textContainer}>
        <Text allowFontScaling={false} style={styles.title}>{title}</Text>
        <Text allowFontScaling={false} style={styles.subtitle} >{subtitle}</Text>
        {ctaText && (
          <TouchableOpacity onPress={onPress}>
            <Text allowFontScaling={false} style={[styles.ctaText, { color: ctaColor }]}>{ctaText}</Text>
          </TouchableOpacity>)}
      </View>
      {RightSideSvgImage && <RightSideSvgImage />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 10,
    paddingVertical: responsiveHeight(1),
    paddingHorizontal: responsiveWidth(2),
    backgroundColor: Colors.white,
    marginTop: responsiveHeight(2),
    alignItems: 'center',
    elevation: 4,
    shadowColor: Colors.grey,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    borderWidth: 1.2,

  },
  textContainer: {
    flex: 1,
    marginHorizontal: responsiveWidth(3),
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.black,
    fontFamily: Fonts.Bold800,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.darkGrey,
    marginTop: responsiveHeight(0.2),
    fontFamily: Fonts.Semibold700,
    lineHeight: 15
  },
  ctaText: {
    marginTop: responsiveHeight(0.5),
    fontSize: 14,
    fontFamily: Fonts.Semibold700,
  },
});

export default PromoCard;
