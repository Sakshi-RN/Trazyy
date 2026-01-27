import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import styles from './styles';
import { LinearGradient } from 'expo-linear-gradient';
import WebViewContainer from '../../Components/WebViewContainer';
import images from '../../Themes/Images';
import CustomHeader from '../../Components/CustomHeader';



const HiAiSays = () => {
    const navigation = useNavigation();
    const [selectedMonth, setSelectedMonth] = useState('December');
    const [selectedYear, setSelectedYear] = useState('2025');

    const data = [
        {
            id: '1',
            title: 'Why Gujarat\'s GIFT City is a game changer for India?',
            date: 'December 31, 2025',
            image: require('../../Assets/Images/LoginBG.png'), // Placeholder image, replace if actual assets
            //  available
        },
        {
            id: '2',
            title: 'REITs & InvITs 2.0: India\'s Quiet Revolution in Passive Income',
            date: 'December 16, 2025',
            image: require('../../Assets/Images/LoginBG.png'), // Placeholder
        },
        {
            id: '3',
            title: 'Rights Issues in India: Trends and Insights for FY 2025-26',
            date: 'December 15, 2025',
            image: require('../../Assets/Images/LoginBG.png'), // Placeholder
        },
    ];

    const renderCard = ({ item }) => (
        <LinearGradient
            colors={['#1899D4', '#046ABC', '#046ABC', '#1899D4', '#1899D4',]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.blueContainerStyle}
        >
            <TouchableOpacity>
                <Image source={item.image} style={styles.cardImage} />
                <View >
                    <Text allowFontScaling={false} style={styles.cardTitle}>{item.title}</Text>
                    <Text allowFontScaling={false} style={styles.cardDate}>{item.date}</Text>
                </View>
            </TouchableOpacity>
        </LinearGradient>
    );

    return (
        <ImageBackground source={images.BGImg} style={styles.scrollContent}>
            <View style={styles.headercontainer}>
            <CustomHeader
                title="HiAi SAYS"
                showBack={true}
                showNotification={true}
            />
            <WebViewContainer />
            <View style={styles.filterContainer}>
                <View style={styles.filterWrapper}>
                    <Text allowFontScaling={false} style={styles.filterLabel}>Month</Text>
                    <TouchableOpacity style={styles.dropdown}>
                        <Text allowFontScaling={false} style={styles.dropdownText}>{selectedMonth}</Text>
                        <Ionicons name="chevron-down" size={20} color="#333" />
                    </TouchableOpacity>
                </View>
                <View style={styles.filterWrapper}>
                    <Text allowFontScaling={false} style={styles.filterLabel}>Year</Text>
                    <TouchableOpacity style={styles.dropdown}>
                        <Text allowFontScaling={false} style={styles.dropdownText}>{selectedYear}</Text>
                        <Ionicons name="chevron-down" size={20} color="#333" />
                    </TouchableOpacity>
                </View>
            </View>
            </View>
            <ScrollView style={styles.contentContainer}>
                <View style={styles.cardsGrid}>
                    {data.map((item) => (
                        <View key={item.id} style={styles.gridItem}>
                            {renderCard({ item })}
                        </View>
                    ))}
                </View>
            </ScrollView>
        </ImageBackground>
    );
};

export default HiAiSays;
