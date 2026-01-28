import { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ImageBackground, TextInput, Linking, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import styles from './styles';
import CustomHeader from '../../Components/CustomHeader';
import images from '../../Themes/Images';
import WebViewContainer from '../../Components/WebViewContainer';
import Colors from '../../Themes/Colors';
import axios from 'axios';
import Loader from '../../Components/Loader';
import getEnvVars from '../../utils/config';

const TrazyyUniversity = () => {
    const navigation = useNavigation();
    const [searchText, setSearchText] = useState('');
    const [universities, setUniversities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [visibleCount, setVisibleCount] = useState(6);
    const { baseURL, endpoints } = getEnvVars();

    const fetchUniversities = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${baseURL}${endpoints.UNIVERSITIES}`,
                { params: { categoryId: "" } }
            );
            if (response.data?.status && (response.data?.statusCode === "0" || response.data?.statusCode === 0)) {
                setUniversities(response.data?.response || []);
            } else {
                console.log('API Error:', response.data?.statusMessage);
            }

        } catch (error) {
            console.error('Fetch University Error:', error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchUniversities();
        }, [])
    );

    const handleCardPress = (url) => {
        if (url) {
            navigation.navigate('AsperoWebView', {
                url: url,
            });
        } else {
            Alert.alert("Link Unavailable", "No URL provided for this university.");
        }
    };

    const renderModuleCard = (item) => (
        <TouchableOpacity key={item.id} style={styles.cardContainer} onPress={() => handleCardPress(item.university_url)}>
            <View style={styles.cardHeader}>
                <View style={styles.numberBox}>
                    <Text allowFontScaling={false} style={styles.numberText}>{item.id}</Text>
                </View>
                <Text allowFontScaling={false} style={styles.cardTitle}>{item.university_name}</Text>
            </View>
            <Text allowFontScaling={false} style={styles.descriptionText} numberOfLines={3}>
                {item.description}
            </Text>
            {/* <View style={styles.actionRow}>
                <TouchableOpacity onPress={() => handleCardPress(item.university_url)}>
                    <Text allowFontScaling={false} style={styles.linkText}>View module</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleCardPress(item.university_url)}>
                    <Text allowFontScaling={false} style={styles.linkText}>Watch videos</Text>
                </TouchableOpacity>
                <Text allowFontScaling={false} style={styles.linkText}>हिंदी</Text>
            </View> */}
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Loader />
            </View>
        );
    }

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
                    {universities.slice(0, visibleCount).map(item => renderModuleCard(item))}
                </View>
                {visibleCount < universities.length && (

                    <TouchableOpacity
                        style={styles.viewMoreButton}
                        onPress={() => setVisibleCount(prev => prev + 6)}
                    >
                        <Text allowFontScaling={false} style={styles.viewMoreText}>View More</Text>
                    </TouchableOpacity>
                )}
            </ScrollView>
        </ImageBackground>
    );
};

export default TrazyyUniversity;
