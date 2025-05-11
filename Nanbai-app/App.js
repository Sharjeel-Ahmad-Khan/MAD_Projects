 import React, { useState, useEffect, createContext, useContext } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ScrollView,
  Modal,
  StyleSheet,
  Dimensions,
  Alert,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import Svg, { Circle, Text as SvgText, Path } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

// Theme and Language Context
const ThemeContext = createContext();
const useTheme = () => useContext(ThemeContext);

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('English');

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');
  const toggleLanguage = () => setLanguage(language === 'English' ? 'Urdu' : 'English');

  const translations = {
    English: {
      welcome: 'Welcome',
      login: 'Login',
      signup: 'Sign Up',
      menu: 'Menu',
      cart: 'Cart',
      orders: 'Orders',
      profile: 'Profile',
      inventory: 'Inventory',
      reports: 'Reports',
      placeOrder: 'Place Order',
      addToCart: 'Add to Cart',
      schedule: 'Schedule',
      payment: 'Payment',
      cash: 'Cash on Delivery',
      digital: 'Digital Payment',
      nearby: 'Nearby Nanbais',
      rate: 'Rate & Review',
      accept: 'Accept',
      reject: 'Reject',
      notify: 'Notify Customer',
      stock: 'In Stock',
      outOfStock: 'Out of Stock',
      dailySummary: 'Daily Summary',
      revenue: 'Revenue',
      loyalty: 'Loyalty Points',
      promo: 'Apply Promo Code',
      whatsapp: 'Notify via WhatsApp',
      settings: 'Settings',
      logout: 'Logout',
      search: 'Search menu...',
      newOrder: 'New Order Received',
      confirmLogout: 'Are you sure you want to logout?',
      cancel: 'Cancel',
    },
    Urdu: {
      welcome: 'خوش آمدید',
      login: 'لاگ ان',
      signup: 'سائن اپ',
      menu: 'مینو',
      cart: 'کارٹ',
      orders: 'آرڈرز',
      profile: 'پروفائل',
      inventory: 'انوینٹری',
      reports: 'رپورٹس',
      placeOrder: 'آرڈر دیں',
      addToCart: 'کارٹ میں شامل کریں',
      schedule: 'شیڈول',
      payment: 'ادائیگی',
      cash: 'کیش آن ڈیلیوری',
      digital: 'ڈیجیٹل ادائیگی',
      nearby: 'قریبی نانبائی',
      rate: 'ریٹنگ اور جائزہ',
      accept: 'قبول کریں',
      reject: 'مسترد کریں',
      notify: 'صارف کو مطلع کریں',
      stock: 'اسٹاک میں',
      outOfStock: 'اسٹاک سے باہر',
      dailySummary: 'روزانہ خلاصہ',
      revenue: 'آمدنی',
      loyalty: 'لائلٹی پوائنٹس',
      promo: 'پرومو کوڈ لگائیں',
      whatsapp: 'واٹس ایپ کے ذریعے مطلع کریں',
      settings: 'ترتیبات',
      logout: 'لاگ آؤٹ',
      search: 'مینو تلاش کریں...',
      newOrder: 'نیا آرڈر موصول ہوا',
      confirmLogout: 'کیا آپ واقعی لاگ آؤٹ کرنا چاہتے ہیں؟',
      cancel: 'منسوخ کریں',
    },
  };

  const themeStyles = {
    light: {
      background: '#F5F7FA',
      text: '#1A1A1A',
      secondaryText: '#4B5EAA',
      primary: '#007AFF',
      secondary: '#FFFFFF',
      accent: '#FF3B30',
    },
    dark: {
      background: '#1A1A1A',
      text: '#FFFFFF',
      secondaryText: '#A1B1FF',
      primary: '#40C4FF',
      secondary: '#2C2C2C',
      accent: '#FF5555',
    },
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        language,
        toggleLanguage,
        colors: themeStyles[theme],
        t: translations[language],
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

// Mock Data
const mockData = {
  menu: [
    {
      id: '1',
      name: 'Naan',
      price: 20,
      portion: 'Small',
      image: 'https://images.pexels.com/photos/1410236/pexels-photo-1410236.jpeg',
    },
    {
      id: '2',
      name: 'Roti',
      price: 15,
      portion: 'Medium',
      image: 'https://images.pexels.com/photos/1410235/pexels-photo-1410235.jpeg',
    },
    {
      id: '3',
      name: 'Paratha',
      price: 30,
      portion: 'Large',
      image: 'https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg',
    },
    {
      id: '4',
      name: 'Kulcha',
      price: 25,
      portion: 'Small',
      image: 'https://images.pexels.com/photos/1410234/pexels-photo-1410234.jpeg',
    },
    {
      id: '5',
      name: 'Sheermal',
      price: 50,
      portion: 'Medium',
      image: 'https://images.pexels.com/photos/1410233/pexels-photo-1410233.jpeg',
    },
  ],
  nearbyNanbais: [
    { id: 'n1', name: 'Ahmed Nanbai', address: '123 Main St, Karachi', distance: '1.2 km' },
    { id: 'n2', name: 'Bilal Bakery', address: '456 Market Rd, Lahore', distance: '2.5 km' },
  ],
  orders: [
    {
      id: 'o1',
      items: [{ name: 'Naan', quantity: 2 }, { name: 'Roti', quantity: 3 }],
      total: 75,
      status: 'Pending',
      schedule: 'Pickup at 6 PM',
      payment: 'Cash',
    },
  ],
  reviews: [
    { id: 'r1', user: 'Ali', rating: 4, comment: 'Fresh naan, quick service!' },
  ],
  reports: {
    ordersToday: 10,
    revenue: 1500,
  },
  user: {
    name: 'John Doe',
    phone: '0300-1234567',
    address: '789 Street, Karachi',
    favorites: ['Naan', 'Paratha'],
    loyaltyPoints: 90,
    profilePic: null,
  },
  nanbai: {
    name: 'Ahmed Nanbai',
    timings: '8 AM - 8 PM',
    contact: '0300-9876543',
    logo: null,
  },
};

// RoleSelectionScreen
const RoleSelectionScreen = ({ navigation }) => {
  const { colors, t } = useTheme();

  return (
    <LinearGradient colors={[colors.primary, colors.secondary]} style={styles.container}>
      <SafeAreaView style={styles.innerContainer}>
        <Animated.Text entering={FadeInUp.duration(500)} style={[styles.title, { color: '#fff' }]}>
          {t.welcome}
        </Animated.Text>
        <Animated.View entering={FadeInUp.delay(100).duration(500)}>
          <TouchableOpacity
            style={[styles.roleButton, { backgroundColor: colors.secondary }]}
            onPress={() => navigation.navigate('CustomerLogin')}
          >
            <Text style={[styles.roleButtonText, { color: colors.primary }]}>
              {t.login} as Customer
            </Text>
          </TouchableOpacity>
        </Animated.View>
        <Animated.View entering={FadeInUp.delay(200).duration(500)}>
          <TouchableOpacity
            style={[styles.roleButton, { backgroundColor: colors.secondary }]}
            onPress={() => navigation.navigate('NanbaiLogin')}
          >
            <Text style={[styles.roleButtonText, { color: colors.primary }]}>
              {t.login} as Nanbai
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    </LinearGradient>
  );
};

// LoginScreen
const LoginScreen = ({ navigation, route }) => {
  const { colors, t } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const isNanbai = route.name === 'NanbaiLogin';

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password.');
      return;
    }
    Alert.alert('Login', 'Proceeding to main app (mock).');
    navigation.navigate(isNanbai ? 'NanbaiMain' : 'CustomerMain');
  };

  return (
    <LinearGradient colors={[colors.primary, colors.secondary]} style={styles.container}>
      <SafeAreaView style={styles.innerContainer}>
        <Animated.Text entering={FadeInUp.duration(500)} style={[styles.title, { color: '#fff' }]}>
          {t.login}
        </Animated.Text>
        <Animated.View entering={FadeInUp.delay(100).duration(500)}>
          <TextInput
            style={[styles.input, { backgroundColor: colors.secondary, color: colors.text }]}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        </Animated.View>
        <Animated.View entering={FadeInUp.delay(200).duration(500)}>
          <TextInput
            style={[styles.input, { backgroundColor: colors.secondary, color: colors.text }]}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </Animated.View>
        <Animated.View entering={FadeInUp.delay(300).duration(500)}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={handleLogin}
          >
            <Text style={styles.buttonText}>{t.login}</Text>
          </TouchableOpacity>
        </Animated.View>
        <TouchableOpacity
          onPress={() => navigation.navigate(isNanbai ? 'NanbaiSignup' : 'CustomerSignup')}
        >
          <Text style={[styles.link, { color: '#fff' }]}>{t.signup}</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
  );
};

// SignupScreen
const SignupScreen = ({ navigation, route }) => {
  const { colors, t } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const isNanbai = route.name === 'NanbaiSignup';

  const handleSignup = () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill all fields.');
      return;
    }
    Alert.alert('Signup', 'Proceeding to main app (mock).');
    navigation.navigate(isNanbai ? 'NanbaiMain' : 'CustomerMain');
  };

  return (
    <LinearGradient colors={[colors.primary, colors.secondary]} style={styles.container}>
      <SafeAreaView style={styles.innerContainer}>
        <Animated.Text entering={FadeInUp.duration(500)} style={[styles.title, { color: '#fff' }]}>
          {t.signup}
        </Animated.Text>
        <Animated.View entering={FadeInUp.delay(100).duration(500)}>
          <TextInput
            style={[styles.input, { backgroundColor: colors.secondary, color: colors.text }]}
            placeholder="Name"
            value={name}
            onChangeText={setName}
          />
        </Animated.View>
        <Animated.View entering={FadeInUp.delay(200).duration(500)}>
          <TextInput
            style={[styles.input, { backgroundColor: colors.secondary, color: colors.text }]}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        </Animated.View>
        <Animated.View entering={FadeInUp.delay(300).duration(500)}>
          <TextInput
            style={[styles.input, { backgroundColor: colors.secondary, color: colors.text }]}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </Animated.View>
        <Animated.View entering={FadeInUp.delay(400).duration(500)}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={handleSignup}
          >
            <Text style={styles.buttonText}>{t.signup}</Text>
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    </LinearGradient>
  );
};

// CustomerHomeScreen
const CustomerHomeScreen = ({ navigation }) => {
  const { colors, t } = useTheme();
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [schedule, setSchedule] = useState('Pickup');
  const [payment, setPayment] = useState('Cash');
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMenu = mockData.menu.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addToCart = (item) => {
    setCart([...cart, { ...item, quantity: 1 }]);
  };

  const updateQuantity = (id, delta) => {
    setCart(
      cart
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(1, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const calculateTotal = () => {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return subtotal - discount;
  };

  const handleApplyPromo = () => {
    if (!promoCode) {
      Alert.alert('Error', 'Please enter a promo code.');
      return;
    }
    if (promoCode.toLowerCase() === 'save10') {
      setDiscount(10);
      Alert.alert('Success', 'Promo code applied! 10 PKR discount.');
    } else {
      Alert.alert('Error', 'Invalid promo code.');
    }
  };

  const handlePlaceOrder = () => {
    if (!cart.length) {
      Alert.alert('Error', 'Cart is empty.');
      return;
    }
    if (!schedule || !payment) {
      Alert.alert('Error', 'Please select schedule and payment options.');
      return;
    }
    const newOrder = {
      id: `o${mockData.orders.length + 1}`,
      items: cart,
      total: calculateTotal(),
      status: 'Pending',
      schedule: schedule === 'Pickup' ? 'Pickup at 6 PM' : 'Delivery at 7 PM',
      payment,
    };
    mockData.orders.push(newOrder);
    Alert.alert('Order Placed', 'Order placed successfully!');
    setShowCart(false);
    setCart([]);
    setDiscount(0);
    setPromoCode('');
  };

  const renderMenuItem = ({ item, index }) => (
    <Animated.View entering={FadeInDown.delay(index * 100).duration(500)}>
      <View style={[styles.menuItem, { backgroundColor: colors.secondary }]}>
        <Image source={{ uri: item.image }} style={styles.menuImage} />
        <View style={styles.menuDetails}>
          <Text style={[styles.menuName, { color: colors.text }]}>{item.name}</Text>
          <Text style={[styles.menuPrice, { color: colors.secondaryText }]}>
            PKR {item.price} ({item.portion})
          </Text>
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: colors.primary }]}
            onPress={() => addToCart(item)}
          >
            <Text style={styles.addButtonText}>{t.addToCart}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>{t.menu}</Text>
      <TextInput
        style={[styles.input, { backgroundColor: colors.secondary, color: colors.text }]}
        placeholder={t.search}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={filteredMenu}
        renderItem={renderMenuItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.menuList}
      />
      {cart.length > 0 && (
        <TouchableOpacity
          style={[styles.cartButton, { backgroundColor: colors.primary }]}
          onPress={() => setShowCart(true)}
        >
          <Text style={styles.cartButtonText}>
            {t.cart} ({cart.length})
          </Text>
        </TouchableOpacity>
      )}
      <Modal visible={showCart} animationType="slide" transparent>
        <Animated.View entering={FadeInUp.duration(300)} style={styles.modalContainer}>
          <SafeAreaView style={[styles.modalContent, { backgroundColor: colors.secondary }]}>
            <ScrollView contentContainerStyle={styles.modalScroll}>
              <View style={styles.modalHeader}>
                <Text style={[styles.title, { color: colors.text }]}>{t.cart}</Text>
                <TouchableOpacity onPress={() => setShowCart(false)}>
                  <Ionicons name="close" size={24} color={colors.text} />
                </TouchableOpacity>
              </View>
              <FlatList
                data={cart}
                renderItem={({ item }) => (
                  <View style={[styles.cartItem, { backgroundColor: colors.background }]}>
                    <Text style={[styles.cartItemName, { color: colors.text }]}>
                      {item.name} (PKR {item.price})
                    </Text>
                    <View style={styles.quantityControls}>
                      <TouchableOpacity onPress={() => updateQuantity(item.id, -1)}>
                        <Ionicons name="remove" size={24} color={colors.primary} />
                      </TouchableOpacity>
                      <Text style={[styles.quantity, { color: colors.text }]}>
                        {item.quantity}
                      </Text>
                      <TouchableOpacity onPress={() => updateQuantity(item.id, 1)}>
                        <Ionicons name="add" size={24} color={colors.primary} />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
                keyExtractor={(item) => item.id}
              />
              <View style={styles.scheduleContainer}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>{t.schedule}</Text>
                <View style={styles.scheduleOptions}>
                  <TouchableOpacity
                    style={[
                      styles.scheduleOption,
                      schedule === 'Pickup' && { backgroundColor: colors.primary },
                    ]}
                    onPress={() => setSchedule('Pickup')}
                  >
                    <Text
                      style={[
                        styles.scheduleOptionText,
                        { color: schedule === 'Pickup' ? '#fff' : colors.text },
                      ]}
                    >
                      Pickup
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.scheduleOption,
                      schedule === 'Delivery' && { backgroundColor: colors.primary },
                    ]}
                    onPress={() => setSchedule('Delivery')}
                  >
                    <Text
                      style={[
                        styles.scheduleOptionText,
                        { color: schedule === 'Delivery' ? '#fff' : colors.text },
                      ]}
                    >
                      Delivery
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.paymentContainer}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>{t.payment}</Text>
                <TouchableOpacity
                  style={styles.paymentOption}
                  onPress={() => setPayment('Cash')}
                >
                  <Ionicons
                    name={payment === 'Cash' ? 'radio-button-on' : 'radio-button-off'}
                    size={24}
                    color={colors.primary}
                  />
                  <Text style={[styles.paymentText, { color: colors.text }]}>{t.cash}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.paymentOption}
                  onPress={() => setPayment('Digital')}
                >
                  <Ionicons
                    name={payment === 'Digital' ? 'radio-button-on' : 'radio-button-off'}
                    size={24}
                    color={colors.primary}
                  />
                  <Text style={[styles.paymentText, { color: colors.text }]}>
                    {t.digital} (JazzCash, EasyPaisa, Card)
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.promoContainer}>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.background, color: colors.text }]}
                  placeholder={t.promo}
                  value={promoCode}
                  onChangeText={setPromoCode}
                />
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: colors.primary }]}
                  onPress={handleApplyPromo}
                >
                  <Text style={styles.buttonText}>Apply</Text>
                </TouchableOpacity>
              </View>
              <Text style={[styles.totalText, { color: colors.text }]}>
                Total: PKR {calculateTotal()}
              </Text>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: colors.primary }]}
                onPress={handlePlaceOrder}
              >
                <Text style={styles.buttonText}>{t.placeOrder}</Text>
              </TouchableOpacity>
            </ScrollView>
          </SafeAreaView>
        </Animated.View>
      </Modal>
    </SafeAreaView>
  );
};

// CustomerOrdersScreen
const CustomerOrdersScreen = ({ navigation }) => {
  const { colors, t } = useTheme();

  const renderOrder = ({ item, index }) => (
    <Animated.View entering={FadeInDown.delay(index * 100).duration(500)}>
      <View style={[styles.orderItem, { backgroundColor: colors.secondary }]}>
        <Text style={[styles.orderTitle, { color: colors.text }]}>Order #{item.id}</Text>
        <Text style={[styles.orderDetails, { color: colors.secondaryText }]}>
          Items: {item.items.map((i) => `${i.name} x${i.quantity}`).join(', ')}
        </Text>
        <Text style={[styles.orderDetails, { color: colors.secondaryText }]}>
          Total: PKR {item.total}
        </Text>
        <Text style={[styles.orderDetails, { color: colors.secondaryText }]}>
          {item.schedule}
        </Text>
        <Text style={[styles.orderDetails, { color: colors.secondaryText }]}>
          Payment: {item.payment}
        </Text>
        <Text style={[styles.orderStatus, { color: colors.primary }]}>
          Status: {item.status}
        </Text>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={() => navigation.navigate('OrderTracking', { orderId: item.id })}
        >
          <Text style={styles.buttonText}>Track Order</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>{t.orders}</Text>
      <FlatList
        data={mockData.orders}
        renderItem={renderOrder}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.orderList}
      />
    </SafeAreaView>
  );
};

// OrderTrackingScreen
const OrderTrackingScreen = ({ route }) => {
  const { colors, t } = useTheme();
  const { orderId } = route.params;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Track Order #{orderId}</Text>
      <View style={styles.trackingContainer}>
        <Text style={[styles.trackingStatus, { color: colors.text }]}>Status: Pending</Text>
        <Text style={[styles.trackingInfo, { color: colors.secondaryText }]}>
          Real-time tracking unavailable in Snack.
        </Text>
      </View>
    </SafeAreaView>
  );
};

// CustomerProfileScreen
const CustomerProfileScreen = ({ navigation }) => {
  const { colors, t, toggleTheme, toggleLanguage, language } = useTheme();
  const [name, setName] = useState(mockData.user.name);
  const [phone, setPhone] = useState(mockData.user.phone);
  const [address, setAddress] = useState(mockData.user.address);
  const [profilePic, setProfilePic] = useState(mockData.user.profilePic);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');

  const handleSaveProfile = () => {
    if (!name || !phone || !address) {
      Alert.alert('Error', 'Please fill all fields.');
      return;
    }
    mockData.user.name = name;
    mockData.user.phone = phone;
    mockData.user.address = address;
    mockData.user.profilePic = profilePic;
    Alert.alert('Success', 'Profile updated successfully.');
  };

  const handlePickImage = () => {
    const mockImageUri = `https://picsum.photos/100?random=${Math.random()}`;
    setProfilePic(mockImageUri);
    Alert.alert('Success', 'Profile picture updated (mocked).');
  };

  const handleSubmitReview = () => {
    if (rating === 0 || !review.trim()) {
      Alert.alert('Error', 'Please provide a rating and review.');
      return;
    }
    mockData.reviews.push({
      id: `r${mockData.reviews.length + 1}`,
      user: mockData.user.name,
      rating,
      comment: review,
    });
    Alert.alert('Success', 'Review submitted successfully.');
    setRating(0);
    setReview('');
  };

  const handleLogout = () => {
    Alert.alert(
      t.logout,
      t.confirmLogout,
      [
        { text: t.cancel, style: 'cancel' },
        {
          text: t.logout,
          style: 'destructive',
          onPress: () => {
            // Reset user-related states
            setName(mockData.user.name);
            setPhone(mockData.user.phone);
            setAddress(mockData.user.address);
            setProfilePic(mockData.user.profilePic);
            navigation.replace('RoleSelection');
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.profileScroll}>
        <Text style={[styles.title, { color: colors.text }]}>{t.profile}</Text>
        <View style={styles.profileSection}>
          <TouchableOpacity onPress={handlePickImage}>
            <Image
              source={
                profilePic ? { uri: profilePic } : { uri: 'https://picsum.photos/100' }
              }
              style={styles.profilePic}
            />
          </TouchableOpacity>
          <TextInput
            style={[styles.input, { backgroundColor: colors.secondary, color: colors.text }]}
            value={name}
            onChangeText={setName}
            placeholder="Name"
          />
          <TextInput
            style={[styles.input, { backgroundColor: colors.secondary, color: colors.text }]}
            value={phone}
            onChangeText={setPhone}
            placeholder="Phone"
            keyboardType="phone-pad"
          />
          <TextInput
            style={[styles.input, { backgroundColor: colors.secondary, color: colors.text }]}
            value={address}
            onChangeText={setAddress}
            placeholder="Address"
          />
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={handleSaveProfile}
          >
            <Text style={styles.buttonText}>Save Profile</Text>
          </TouchableOpacity>
          <Text style={[styles.profileLabel, { color: colors.text }]}>
            Favorites: {mockData.user.favorites.join(', ') || 'None'}
          </Text>
          <Text style={[styles.profileLabel, { color: colors.primary }]}>
            {t.loyalty}: {mockData.user.loyaltyPoints} (10 more for free naan)
          </Text>
        </View>
        <View style={styles.reviewSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t.rate}</Text>
          <View style={styles.ratingStars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setRating(star)}>
                <Ionicons
                  name={star <= rating ? 'star' : 'star-outline'}
                  size={30}
                  color={colors.primary}
                />
              </TouchableOpacity>
            ))}
          </View>
          <TextInput
            style={[styles.input, { backgroundColor: colors.secondary, color: colors.text }]}
            placeholder="Write your review..."
            value={review}
            onChangeText={setReview}
            multiline
            numberOfLines={4}
          />
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={handleSubmitReview}
          >
            <Text style={styles.buttonText}>Submit Review</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.nearbySection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t.nearby}</Text>
          <Image
            source={{ uri: 'https://picsum.photos/300/200' }}
            style={styles.mapPlaceholder}
          />
          <FlatList
            data={mockData.nearbyNanbais}
            renderItem={({ item }) => (
              <View style={[styles.nanbaiItem, { backgroundColor: colors.secondary }]}>
                <Text style={[styles.nanbaiName, { color: colors.text }]}>{item.name}</Text>
                <Text style={[styles.nanbaiAddress, { color: colors.secondaryText }]}>
                  {item.address} ({item.distance})
                </Text>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: colors.primary }]}
                  onPress={() => Alert.alert('Directions', 'Google Maps integration required.')}
                >
                  <Text style={styles.buttonText}>Directions</Text>
                </TouchableOpacity>
              </View>
            )}
            keyExtractor={(item) => item.id}
          />
        </View>
        <View style={styles.settingsSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t.settings}</Text>
          <View style={styles.settingItem}>
            <Text style={[styles.settingText, { color: colors.text }]}>Toggle Theme</Text>
            <Switch value={colors.background === '#1A1A1A'} onValueChange={toggleTheme} />
          </View>
          <View style={styles.settingItem}>
            <Text style={[styles.settingText, { color: colors.text }]}>
              Language: {language === 'English' ? '🇬🇧 English' : '🇵🇰 Urdu'}
            </Text>
            <Switch value={language === 'Urdu'} onValueChange={toggleLanguage} />
          </View>
        </View>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.accent }]}
          onPress={handleLogout}
        >
          <Text style={styles.buttonText}>{t.logout}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

// NanbaiOrdersScreen
const NanbaiOrdersScreen = () => {
  const { colors, t } = useTheme();

  useEffect(() => {
    if (mockData.orders.length > 0) {
      const latestOrder = mockData.orders[mockData.orders.length - 1];
      if (latestOrder.status === 'Pending') {
        Alert.alert(t.newOrder, `Order #${latestOrder.id} received!`);
      }
    }
  }, [mockData.orders]);

  const handleAccept = (orderId) => {
    mockData.orders = mockData.orders.map((order) =>
      order.id === orderId ? { ...order, status: 'Accepted' } : order
    );
    Alert.alert('Order Accepted', `Order ${orderId} accepted.`);
  };

  const handleReject = (orderId) => {
    mockData.orders = mockData.orders.map((order) =>
      order.id === orderId ? { ...order, status: 'Rejected' } : order
    );
    Alert.alert('Order Rejected', `Order ${orderId} rejected.`);
  };

  const handleNotify = () => {
    Alert.alert('Notification', 'Customer notified (mock).');
  };

  const handleWhatsApp = () => {
    Alert.alert('WhatsApp', 'WhatsApp integration unavailable in Snack.');
  };

  const renderOrder = ({ item, index }) => (
    <Animated.View entering={FadeInDown.delay(index * 100).duration(500)}>
      <View style={[styles.orderItem, { backgroundColor: colors.secondary }]}>
        <Text style={[styles.orderTitle, { color: colors.text }]}>Order #{item.id}</Text>
        <Text style={[styles.orderDetails, { color: colors.secondaryText }]}>
          Items: {item.items.map((i) => `${i.name} x${i.quantity}`).join(', ')}
        </Text>
        <Text style={[styles.orderDetails, { color: colors.secondaryText }]}>
          Total: PKR {item.total}
        </Text>
        <Text style={[styles.orderDetails, { color: colors.secondaryText }]}>
          Status: {item.status}
        </Text>
        <View style={styles.orderActions}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.primary }]}
            onPress={() => handleAccept(item.id)}
            disabled={item.status !== 'Pending'}
          >
            <Text style={styles.actionButtonText}>{t.accept}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.accent }]}
            onPress={() => handleReject(item.id)}
            disabled={item.status !== 'Pending'}
          >
            <Text style={styles.actionButtonText}>{t.reject}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.primary }]}
            onPress={handleNotify}
          >
            <Text style={styles.actionButtonText}>{t.notify}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#25D366' }]}
            onPress={handleWhatsApp}
          >
            <Text style={styles.actionButtonText}>{t.whatsapp}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>{t.orders}</Text>
      <FlatList
        data={mockData.orders}
        renderItem={renderOrder}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.orderList}
      />
    </SafeAreaView>
  );
};

// NanbaiInventoryScreen
const NanbaiInventoryScreen = () => {
  const { colors, t } = useTheme();
  const [inventory, setInventory] = useState(
    mockData.menu.map((item) => ({ ...item, inStock: true }))
  );

  const toggleStock = (id) => {
    setInventory(
      inventory.map((item) =>
        item.id === id ? { ...item, inStock: !item.inStock } : item
      )
    );
  };

  const renderItem = ({ item, index }) => (
    <Animated.View entering={FadeInDown.delay(index * 100).duration(500)}>
      <View style={[styles.inventoryItem, { backgroundColor: colors.secondary }]}>
        <Text style={[styles.inventoryName, { color: colors.text }]}>{item.name}</Text>
        <Text style={[styles.inventoryPrice, { color: colors.secondaryText }]}>
          PKR {item.price}
        </Text>
        <View style={styles.stockToggle}>
          <Text style={[styles.stockLabel, { color: colors.text }]}>
            {item.inStock ? t.stock : t.outOfStock}
          </Text>
          <Switch value={item.inStock} onValueChange={() => toggleStock(item.id)} />
        </View>
      </View>
    </Animated.View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>{t.inventory}</Text>
      <FlatList
        data={inventory}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.inventoryList}
      />
    </SafeAreaView>
  );
};

// NanbaiReportsScreen
const NanbaiReportsScreen = () => {
  const { colors, t } = useTheme();

  const maxOrders = 20;
  const maxRevenue = 3000;
  const orderAngle = (mockData.reports.ordersToday / maxOrders) * 360;
  const revenueAngle = (mockData.reports.revenue / maxRevenue) * 360;

  const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  const describeArc = (x, y, radius, startAngle, endAngle) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    return [
      'M',
      start.x,
      start.y,
      'A',
      radius,
      radius,
      0,
      largeArcFlag,
      0,
      end.x,
      end.y,
    ].join(' ');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>{t.reports}</Text>
      <ScrollView contentContainerStyle={styles.reportContainer}>
        <Animated.View
          entering={FadeInUp.duration(500)}
          style={[styles.reportCard, { backgroundColor: colors.secondary }]}
        >
          <Text style={[styles.reportTitle, { color: colors.text }]}>{t.dailySummary}</Text>
          <Text style={[styles.reportDetail, { color: colors.secondaryText }]}>
            Orders: {mockData.reports.ordersToday}
          </Text>
          <Text style={[styles.reportDetail, { color: colors.secondaryText }]}>
            {t.revenue}: PKR {mockData.reports.revenue}
          </Text>
        </Animated.View>
        <Animated.View
          entering={FadeInUp.delay(100).duration(500)}
          style={[styles.chartContainer, { backgroundColor: colors.secondary }]}
        >
          <Svg height="200" width="200">
            <Circle
              cx="100"
              cy="100"
              r="80"
              stroke={colors.secondaryText}
              strokeWidth="10"
              fill="none"
            />
            <Path
              d={describeArc(100, 100, 80, 0, orderAngle)}
              stroke={colors.primary}
              strokeWidth="10"
              fill="none"
            />
            <SvgText
              x="100"
              y="110"
              textAnchor="middle"
              fontSize="20"
              fill={colors.text}
            >
              {mockData.reports.ordersToday}
            </SvgText>
          </Svg>
          <Text style={[styles.chartLabel, { color: colors.text }]}>Orders Today</Text>
        </Animated.View>
        <Animated.View
          entering={FadeInUp.delay(200).duration(500)}
          style={[styles.chartContainer, { backgroundColor: colors.secondary }]}
        >
          <Svg height="200" width="200">
            <Circle
              cx="100"
              cy="100"
              r="80"
              stroke={colors.secondaryText}
              strokeWidth="10"
              fill="none"
            />
            <Path
              d={describeArc(100, 100, 80, 0, revenueAngle)}
              stroke={colors.accent}
              strokeWidth="10"
              fill="none"
            />
            <SvgText
              x="100"
              y="110"
              textAnchor="middle"
              fontSize="20"
              fill={colors.text}
            >
              {mockData.reports.revenue}
            </SvgText>
          </Svg>
          <Text style={[styles.chartLabel, { color: colors.text }]}>Revenue (PKR)</Text>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

// NanbaiProfileScreen
const NanbaiProfileScreen = ({ navigation }) => {
  const { colors, t } = useTheme();
  const [name, setName] = useState(mockData.nanbai.name);
  const [timings, setTimings] = useState(mockData.nanbai.timings);
  const [contact, setContact] = useState(mockData.nanbai.contact);
  const [logo, setLogo] = useState(mockData.nanbai.logo);

  const handleSave = () => {
    if (!name || !timings || !contact) {
      Alert.alert('Error', 'Please fill all fields.');
      return;
    }
    mockData.nanbai.name = name;
    mockData.nanbai.timings = timings;
    mockData.nanbai.contact = contact;
    mockData.nanbai.logo = logo;
    Alert.alert('Success', 'Profile updated successfully.');
  };

  const handlePickLogo = () => {
    const mockLogoUri = `https://picsum.photos/100?random=${Math.random()}`;
    setLogo(mockLogoUri);
    Alert.alert('Success', 'Logo updated (mocked).');
  };

  const handleLogout = () => {
    Alert.alert(
      t.logout,
      t.confirmLogout,
      [
        { text: t.cancel, style: 'cancel' },
        {
          text: t.logout,
          style: 'destructive',
          onPress: () => {
            // Reset nanbai-related states
            setName(mockData.nanbai.name);
            setTimings(mockData.nanbai.timings);
            setContact(mockData.nanbai.contact);
            setLogo(mockData.nanbai.logo);
            navigation.replace('RoleSelection');
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.profileScroll}>
        <Text style={[styles.title, { color: colors.text }]}>{t.profile}</Text>
        <TouchableOpacity onPress={handlePickLogo}>
          <Image
            source={logo ? { uri: logo } : { uri: 'https://picsum.photos/100' }}
            style={styles.profilePic}
          />
        </TouchableOpacity>
        <TextInput
          style={[styles.input, { backgroundColor: colors.secondary, color: colors.text }]}
          placeholder="Store Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={[styles.input, { backgroundColor: colors.secondary, color: colors.text }]}
          placeholder="Timings"
          value={timings}
          onChangeText={setTimings}
        />
        <TextInput
          style={[styles.input, { backgroundColor: colors.secondary, color: colors.text }]}
          placeholder="Contact Number"
          value={contact}
          onChangeText={setContact}
          keyboardType="phone-pad"
        />
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={handleSave}
        >
          <Text style={styles.buttonText}>Save Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.accent }]}
          onPress={handleLogout}
        >
          <Text style={styles.buttonText}>{t.logout}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

// Navigation Setup
const Stack = createStackNavigator();
const CustomerTab = createBottomTabNavigator();
const NanbaiTab = createBottomTabNavigator();

const CustomerMain = () => {
  const { colors, t } = useTheme();

  return (
    <CustomerTab.Navigator
      screenOptions={{
        tabBarStyle: { backgroundColor: colors.secondary, paddingBottom: 8 },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.secondaryText,
      }}
    >
      <CustomerTab.Screen
        name="Home"
        component={CustomerHomeScreen}
        options={{
          tabBarLabel: t.menu,
          tabBarIcon: ({ color }) => <Ionicons name="restaurant" size={24} color={color} />,
        }}
      />
      <CustomerTab.Screen
        name="Orders"
        component={CustomerOrdersScreen}
        options={{
          tabBarLabel: t.orders,
          tabBarIcon: ({ color }) => <Ionicons name="cart" size={24} color={color} />,
        }}
      />
      <CustomerTab.Screen
        name="Profile"
        component={CustomerProfileScreen}
        options={{
          tabBarLabel: t.profile,
          tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} />,
        }}
      />
    </CustomerTab.Navigator>
  );
};

const NanbaiMain = () => {
  const { colors, t } = useTheme();

  return (
    <NanbaiTab.Navigator
      screenOptions={{
        tabBarStyle: { backgroundColor: colors.secondary, paddingBottom: 8 },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.secondaryText,
      }}
    >
      <NanbaiTab.Screen
        name="Orders"
        component={NanbaiOrdersScreen}
        options={{
          tabBarLabel: t.orders,
          tabBarIcon: ({ color }) => <Ionicons name="cart" size={24} color={color} />,
        }}
      />
      <NanbaiTab.Screen
        name="Inventory"
        component={NanbaiInventoryScreen}
        options={{
          tabBarLabel: t.inventory,
          tabBarIcon: ({ color }) => <Ionicons name="list" size={24} color={color} />,
        }}
      />
      <NanbaiTab.Screen
        name="Reports"
        component={NanbaiReportsScreen}
        options={{
          tabBarLabel: t.reports,
          tabBarIcon: ({ color }) => <Ionicons name="bar-chart" size={24} color={color} />,
        }}
      />
      <NanbaiTab.Screen
        name="Profile"
        component={NanbaiProfileScreen}
        options={{
          tabBarLabel: t.profile,
          tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} />,
        }}
      />
    </NanbaiTab.Navigator>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="RoleSelection">
          <Stack.Screen
            name="RoleSelection"
            component={RoleSelectionScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="CustomerLogin"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="CustomerSignup"
            component={SignupScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="NanbaiLogin"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="NanbaiSignup"
            component={SignupScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="CustomerMain"
            component={CustomerMain}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="NanbaiMain"
            component={NanbaiMain}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="OrderTracking"
            component={OrderTrackingScreen}
            options={{ title: 'Track Order' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    marginBottom: 24,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  roleButton: {
    padding: 18,
    borderRadius: 14,
    alignItems: 'center',
    marginVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  roleButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  input: {
    borderRadius: 14,
    padding: 16,
    marginVertical: 12,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  button: {
    padding: 18,
    borderRadius: 14,
    alignItems: 'center',
    marginVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  link: {
    marginTop: 16,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
  },
  menuItem: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 14,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  menuImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  menuDetails: {
    flex: 1,
    marginLeft: 12,
  },
  menuName: {
    fontSize: 20,
    fontWeight: '600',
  },
  menuPrice: {
    fontSize: 16,
    marginVertical: 6,
  },
  addButton: {
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cartButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    padding: 14,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  cartButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    maxHeight: height * 0.9,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalScroll: {
    padding: 20,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  cartItemName: {
    fontSize: 18,
    fontWeight: '500',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantity: {
    marginHorizontal: 12,
    fontSize: 18,
  },
  scheduleContainer: {
    marginVertical: 20,
    padding: 16,
    borderRadius: 14,
    backgroundColor: '#f9f9f9',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginVertical: 10,
  },
  scheduleOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scheduleOption: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 6,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  scheduleOptionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  paymentContainer: {
    marginVertical: 20,
    padding: 16,
    borderRadius: 14,
    backgroundColor: '#f9f9f9',
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  paymentText: {
    marginLeft: 10,
    fontSize: 16,
  },
  promoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  totalText: {
    fontSize: 20,
    fontWeight: '600',
    marginVertical: 16,
    textAlign: 'center',
  },
  orderItem: {
    padding: 16,
    borderRadius: 14,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  orderTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  orderDetails: {
    fontSize: 16,
    marginVertical: 4,
  },
  orderStatus: {
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 6,
  },
  orderList: {
    paddingBottom: 20,
  },
  trackingContainer: {
    marginVertical: 20,
  },
  trackingStatus: {
    fontSize: 20,
    fontWeight: '600',
  },
  trackingInfo: {
    fontSize: 16,
    marginTop: 10,
  },
  profileSection: {
    marginVertical: 20,
    alignItems: 'center',
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginVertical: 20,
  },
  profileLabel: {
    fontSize: 18,
    marginVertical: 6,
  },
  profileScroll: {
    paddingBottom: 40,
  },
  reviewSection: {
    marginVertical: 20,
  },
  ratingStars: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  nearbySection: {
    marginVertical: 20,
  },
  mapPlaceholder: {
    width: '100%',
    height: 200,
    borderRadius: 14,
    marginBottom: 10,
  },
  nanbaiItem: {
    padding: 16,
    borderRadius: 14,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  nanbaiName: {
    fontSize: 18,
    fontWeight: '600',
  },
  nanbaiAddress: {
    fontSize: 16,
    marginVertical: 6,
  },
  settingsSection: {
    marginVertical: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  settingText: {
    fontSize: 18,
  },
  orderActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  actionButton: {
    padding: 12,
    borderRadius: 12,
    marginRight: 10,
    marginVertical: 6,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  inventoryItem: {
    padding: 16,
    borderRadius: 14,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  inventoryName: {
    fontSize: 18,
    fontWeight: '600',
  },
  inventoryPrice: {
    fontSize: 16,
    marginVertical: 6,
  },
  stockToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  stockLabel: {
    fontSize: 16,
  },
  inventoryList: {
    paddingBottom: 20,
  },
  reportContainer: {
    paddingBottom: 40,
  },
  reportCard: {
    padding: 20,
    borderRadius: 14,
    marginVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  reportTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  reportDetail: {
    fontSize: 16,
    marginVertical: 6,
  },
  chartContainer: {
    alignItems: 'center',
    padding: 20,
    borderRadius: 14,
    marginVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  chartLabel: {
    fontSize: 18,
    marginTop: 10,
  },
});

export default App;