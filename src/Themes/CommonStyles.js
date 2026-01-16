import {StyleSheet} from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

import Colors from './Colors';

export const CommonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  authTitleVericalGap: {
    marginVertical: responsiveHeight(3),
  },
  containerwrap: {
    flex: 1,
    paddingHorizontal: responsiveWidth(5),
  },
  marginTop7: {
    marginTop: 7,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
   justifyContent:'space-between'
},
newConatiner:  {flex:1, 
  backgroundColor:Colors.white ,
 marginTop:responsiveHeight(2),
 marginHorizontal:responsiveWidth(3),
 paddingVertical:responsiveHeight(3),
 borderRadius:8

},
  containerBox: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    paddingHorizontal: responsiveWidth(3),
    paddingVertical: responsiveHeight(1),
    marginTop: responsiveHeight(1),
   shadowColor: Colors.grey,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 15,
  },
});
