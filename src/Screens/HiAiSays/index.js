import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, ImageBackground, Modal, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import styles from './styles';
import { LinearGradient } from 'expo-linear-gradient';
import WebViewContainer from '../../Components/WebViewContainer';
import images from '../../Themes/Images';
import CustomHeader from '../../Components/CustomHeader';
import axios from 'axios';
import Loader from '../../Components/Loader';
import getEnvVars from '../../utils/config';



const HiAiSays = () => {
    const navigation = useNavigation();
    const [selectedMonth, setSelectedMonth] = useState('January');
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
    const [showMonthPicker, setShowMonthPicker] = useState(false);
    const [showYearPicker, setShowYearPicker] = useState(false);
    const [yearsList, setYearsList] = useState([]);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const { baseURL, endpoints } = getEnvVars();

    const monthsList = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    useEffect(() => {
        const currentYear = new Date().getFullYear();
        // Generate last 3 years: current, current-1, current-2
        const years = [currentYear.toString(), (currentYear - 1).toString(), (currentYear - 2).toString()];
        setYearsList(years);
    }, []);

    const getMonthNumber = (monthName) => {
        const index = monthsList.indexOf(monthName);
        return index !== -1 ? index + 1 : null;
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const monthNumber = getMonthNumber(selectedMonth);
            const payload = {
                categoryId: "4",
                month: monthNumber,
                year: parseInt(selectedYear)
            };

            const queryParams = {
                ...payload,
                category_id: payload.categoryId
            };

            console.log("Fetching HiAiSays params (GET):", queryParams);

            const response = await axios.get(
                `${baseURL}${endpoints.UNIVERSITIES}`,
                // { params: queryParams }
            );

            console.log('HiAiSays API Response:', JSON.stringify(response.data));

            if (response.data?.status && (response.data?.statusCode === "0" || response.data?.statusCode === 0)) {
                setData(response.data?.response || []);
            } else {
                console.warn('HiAiSays API Error:', response.data?.statusMessage);
                setData([]);
            }
        } catch (error) {
            console.error('HiAiSays Fetch Error:', error);
            if (error.response) {
                console.log('Error Data:', JSON.stringify(error.response.data));
                console.log('Error Status:', error.response.status);
            }
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [selectedMonth, selectedYear]);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    const renderCard = ({ item }) => (
        <LinearGradient
            colors={['#1899D4', '#046ABC', '#046ABC', '#1899D4', '#1899D4',]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.blueContainerStyle}
        >
            <TouchableOpacity onPress={() => {
                if (item.university_url) {
                    navigation.navigate('AsperoWebView', { url: item.university_url });
                }
            }}>
                <Image source={{ uri: item.image_url }} style={styles.cardImage} />
                <View >
                    <Text allowFontScaling={false} style={styles.cardTitle} numberOfLines={2}>{item.description}</Text>
                    <Text allowFontScaling={false} style={styles.cardDate}>{formatDate(item.createdAt)}</Text>
                </View>
            </TouchableOpacity>
        </LinearGradient>
    );

    const renderPickerModal = (visible, data, onSelect, onClose) => (
        <Modal
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
            animationType="fade"
        >
            <TouchableOpacity style={styles.modalOverlay} onPress={onClose}>
                <View style={styles.pickerContent}>
                    <FlatList
                        data={data}
                        keyExtractor={(item) => item}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.pickerItem}
                                onPress={() => {
                                    onSelect(item);
                                    onClose();
                                }}
                            >
                                <Text allowFontScaling={false} style={styles.pickerItemText}>{item}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </TouchableOpacity>
        </Modal>
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
                        <TouchableOpacity style={styles.dropdown} onPress={() => setShowMonthPicker(true)}>
                            <Text allowFontScaling={false} style={styles.dropdownText}>{selectedMonth}</Text>
                            <Ionicons name="chevron-down" size={20} color="#333" />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.filterWrapper}>
                        <Text allowFontScaling={false} style={styles.filterLabel}>Year</Text>
                        <TouchableOpacity style={styles.dropdown} onPress={() => setShowYearPicker(true)}>
                            <Text allowFontScaling={false} style={styles.dropdownText}>{selectedYear}</Text>
                            <Ionicons name="chevron-down" size={20} color="#333" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            {loading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Loader />
                </View>
            ) : (
                <ScrollView style={styles.contentContainer}>
                    {data.length > 0 ? (
                        <View style={styles.cardsGrid}>
                            {data.map((item) => (
                                <View key={item.id} style={styles.gridItem}>
                                    {renderCard({ item })}
                                </View>
                            ))}
                        </View>
                    ) : (
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Text allowFontScaling={false} style={styles.errorText}>No data available</Text>
                        </View>
                    )}
                </ScrollView>
            )}

            {renderPickerModal(showMonthPicker, monthsList, setSelectedMonth, () => setShowMonthPicker(false))}
            {renderPickerModal(showYearPicker, yearsList, setSelectedYear, () => setShowYearPicker(false))}
        </ImageBackground>
    );
};

export default HiAiSays;
