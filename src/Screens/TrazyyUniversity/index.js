import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ImageBackground, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import styles from './styles';
import CustomHeader from '../../Components/CustomHeader';
import images from '../../Themes/Images';
import WebViewContainer from '../../Components/WebViewContainer';
import Colors from '../../Themes/Colors';

const TrazyyUniversity = () => {
    const navigation = useNavigation();
    const [searchText, setSearchText] = useState('');

    const modules = [
        { id: 1, title: 'Introduction to Stock Markets', chapters: '24 chapters', color: '#B39DDB' }, // Light faded purple/blue
        { id: 2, title: 'Technical Analysis', chapters: '24 chapters', color: '#90CAF9' }, // Light Blue
        { id: 3, title: 'Fundamental Analysis', chapters: '24 chapters', color: '#F48FB1' }, // Pink
        { id: 4, title: 'Futures Trading', chapters: '24 chapters', color: '#80DEEA' }, // Cyan
        { id: 5, title: 'Options Theory for Professional Trading', chapters: '24 chapters', color: '#FBC02D' }, // Yellow/Gold
        { id: 6, title: 'Option Strategies', chapters: '24 chapters', color: '#CE93D8' }, // Purple
        { id: 7, title: 'Markets and Taxation', chapters: '24 chapters', color: '#9FA8DA' },
        { id: 8, title: 'Currency, Commodity, and Government Securities', chapters: '24 chapters', color: '#FFCC80' },
    ];

    const renderModuleCard = (item) => (
        <View key={item.id} style={styles.cardContainer}>
            <View style={styles.cardHeader}>
                <View style={styles.numberBox}>
                    <Text allowFontScaling={false} style={styles.numberText}>{item.id}</Text>
                </View>
                <Text allowFontScaling={false} style={styles.cardTitle}>{item.title}</Text>
            </View>
            <Text allowFontScaling={false} style={styles.chapterText}>{item.chapters}</Text>
            <Text allowFontScaling={false} style={styles.descriptionText} numberOfLines={3}>
                This stock market class plays a pivotal role in creating your financial security. In this module, you will learn how to get started...
            </Text>
            <View style={styles.actionRow}>
                <TouchableOpacity>
                    <Text allowFontScaling={false} style={styles.linkText}>View module</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Text allowFontScaling={false} style={styles.linkText}>Watch videos</Text>
                </TouchableOpacity>
                <Text allowFontScaling={false} style={styles.linkText}>हिंदी</Text>
            </View>
        </View>
    );

    return (
        <ImageBackground source={images.BGImg} style={styles.container}>
            <View style={styles.headercontainer}>
                <CustomHeader
                    title="Trazyy University"
                    showBack={true}
                    showNotification={true}
                />
                <WebViewContainer />
                <View style={styles.subHeader}>
                    <Text allowFontScaling={false} style={styles.modulesTitle}>Modules</Text>
                    <View style={styles.searchBox}>
                        <Ionicons name="search" size={14} color={Colors.grey} />
                        <TextInput allowFontScaling={false}
                            placeholder="Search"
                            style={styles.searchInput}
                            placeholderTextColor={Colors.grey}
                            value={searchText}
                            onChangeText={setSearchText}
                        />
                    </View>
                </View>
            </View>
            <ScrollView style={styles.contentScroll}>
                <View style={styles.gridContainer}>
                    {modules.map(item => renderModuleCard(item))}
                </View>
            </ScrollView>
        </ImageBackground>
    );
};

export default TrazyyUniversity;
