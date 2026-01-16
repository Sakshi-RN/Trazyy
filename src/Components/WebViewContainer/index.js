// import { useEffect, useState } from 'react';
// import { View, StyleSheet, Text, Platform } from 'react-native';
// import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
// import Colors from '../../Themes/Colors';
// import { CommonStyles } from '../../Themes/CommonStyles';
// import Loader from '../../Components/Loader';
// import { Fonts } from '../../Themes/Fonts';
// import getEnvVars from '../../utils/config';
// import { formatCurrency } from '../../utils/formatCurrency';


// function WebViewContainer() {
//   const [indices, setIndices] = useState([]);
//   const [loading, setLoading] = useState(true);
//       const { baseURL, endpoints } = getEnvVars();

//   useEffect(() => {
//     fetchIndices();
//   }, []);

//   const fetchIndices = async () => {
//     try {
//       const response = await fetch(
//  `${baseURL}${endpoints.GET_NEFT}`
//       );
//       const json = await response.json();
//       if (json?.status && json?.response?.status) {
//         setIndices(json.response.results);
//       }
//     } catch (error) {
//     } finally {
//       setLoading(false);
//     }
//   };


// const renderIndex = (item) => {
//   return (
//     <View key={item.index_name} style={[CommonStyles.containerBox, styles.addiitionalBoxStyle]}>
//       {loading ? (
//         <View style={styles.centerLogo}>
//         <Loader />   
//         </View>
//       ) : (
//         <>
//           <Text allowFontScaling={false} style={styles.NiftyText}>
//             {item.index_name.toUpperCase()}
//           </Text>
//           <Text allowFontScaling={false} style={styles.greenAmount}>
//             {formatCurrency(item.price)}
//           </Text>
//           <Text allowFontScaling={false} style={styles.NiftyText}>
//             {item.change.toFixed(2)} ({item.percentChange.toFixed(2)}%)
//           </Text>
//         </>
//       )}
//     </View>
//   );
// };


//   return (
//     <View style={styles.webviewContainer}>
//       {indices.map((item) => renderIndex(item))}
//     </View>
//   );
// }



// const styles = StyleSheet.create({
  
//   webviewContainer: {
//     height: Platform.OS === 'ios' ? responsiveHeight(9) : responsiveHeight(9),
//     backgroundColor: Colors.blue,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: responsiveWidth(6)
//   },
//   NiftyText: {
//     color: Colors.black,
//     fontSize: 12,
//     fontFamily: Fonts.Semibold700,
//     alignSelf: 'center'
//   },
//   greenAmount: {
//     color: Colors.green,
//     fontSize: 13,
//     fontFamily: Fonts.Semibold700,
//     alignSelf: 'center'
//   },
//   addiitionalBoxStyle: {
//     paddingVertical: responsiveHeight(0.2),
//     marginTop:0
//   },
//   centerLogo:{
//     alignSelf:'center'
//   }
// })

// export default WebViewContainer

import React from 'react'
import { View, StyleSheet,Platform} from 'react-native'
import { responsiveHeight } from 'react-native-responsive-dimensions'
import { WebView } from 'react-native-webview'

function WebViewContainer() {
  const tradingViewHtml = `
    <!DOCTYPE html>
   <html><head></head><body><div class="tradingview-widget-container" style="width: 100%; height: 78px;">
  <iframe scrolling="no" allowtransparency="true" frameborder="0" src="https://www.tradingview-widget.com/embed-widget/ticker-tape/?locale=in#%7B%22symbols%22%3A%5B%7B%22description%22%3A%22BSE%22%2C%22proName%22%3A%22BSE%3ASENSEX%22%7D%2C%7B%22description%22%3A%22NASDAQ%22%2C%22proName%22%3A%22NASDAQ%3ANDX%22%7D%2C%7B%22description%22%3A%22FTSE%22%2C%22proName%22%3A%22SPREADEX%3AFTSE%22%7D%2C%7B%22description%22%3A%22CAC%22%2C%22proName%22%3A%22NASDAQ%3ACAC%22%7D%2C%7B%22description%22%3A%22USD%20to%20INR%22%2C%22proName%22%3A%22FX_IDC%3AUSDINR%22%7D%2C%7B%22description%22%3A%22EUR%20to%20INR%22%2C%22proName%22%3A%22FX_IDC%3AEURINR%22%7D%2C%7B%22description%22%3A%22GBP%20to%20INR%22%2C%22proName%22%3A%22FX_IDC%3AGBPINR%22%7D%2C%7B%22description%22%3A%22BRENT%20Crude%20USD%22%2C%22proName%22%3A%22FX_IDC%3AUSDBRO%22%7D%5D%2C%22showSymbolLogo%22%3Atrue%2C%22colorTheme%22%3A%22light%22%2C%22isTransparent%22%3Afalse%2C%22displayMode%22%3A%22adaptive%22%2C%22width%22%3A%22100%25%22%2C%22height%22%3A78%2C%22utm_source%22%3A%22www-investek-in.filesusr.com%22%2C%22utm_medium%22%3A%22widget_new%22%2C%22utm_campaign%22%3A%22ticker-tape%22%2C%22page-uri%22%3A%22www-investek-in.filesusr.com%2Fhtml%2F89c87b_60e32e9160a631477748aa531454eeb1.html%22%7D" title="ticker tape TradingView widget" lang="en" style="user-select: none; box-sizing: border-box; display: block; height: 46px; width: 100%;"></iframe>
  <div class="tradingview-widget-copyright"><a href="https://in.tradingview.com/?utm_source=www-investek-in.filesusr.com&amp;utm_medium=widget_new&amp;utm_campaign=ticker-tape" rel="noopener nofollow" target="_blank"><span class="blue-text">Track all markets on TradingView</span></a></div>
  
<style>
    .tradingview-widget-copyright {
        font-size: 13px !important;
        line-height: 32px !important;
        text-align: center !important;
        vertical-align: middle !important;
        /* @mixin sf-pro-display-font; */
        font-family: -apple-system, BlinkMacSystemFont, 'Trebuchet MS', Roboto, Ubuntu, sans-serif !important;
        color: #B2B5BE !important;
    }

    .tradingview-widget-copyright .blue-text {
        color: #2962FF !important;
    }

    .tradingview-widget-copyright a {
        text-decoration: none !important;
        color: #B2B5BE !important;
    }

    .tradingview-widget-copyright a:visited {
        color: #B2B5BE !important;
    }

    .tradingview-widget-copyright a:hover .blue-text {
        color: #1E53E5 !important;
    }

    .tradingview-widget-copyright a:active .blue-text {
        color: #1848CC !important;
    }

    .tradingview-widget-copyright a:visited .blue-text {
        color: #2962FF !important;
    }
    </style></div>
<!-- TradingView Widget END --></body></html>
  `

  return (
    <View style={styles.webviewContainer}>
      <WebView
        originWhitelist={['*']}
        source={{ html: tradingViewHtml }}
        style={styles.webview}
        pointerEvents="none"
      />
    </View>
  )
}

const styles = StyleSheet.create({

  webviewContainer: {
    height: Platform.OS === 'ios' ? responsiveHeight(4) : responsiveHeight(5),
    // top:responsiveHeight(-18)
  },
  webview: {
    height: '100%',
  },
})

export default WebViewContainer
