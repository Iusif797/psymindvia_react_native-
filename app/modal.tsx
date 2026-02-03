import { Link } from 'expo-router';
import { StyleSheet, Text, View, Platform } from 'react-native';
import BackgroundWrapper from '../components/BackgroundWrapper';

export default function ModalScreen() {
  return (
    <BackgroundWrapper>
      <View style={styles.container}>
        <Text style={styles.title}>Это модальное окно</Text>
        <Link href="/" dismissTo style={styles.link}>
          <Text style={styles.linkText}>На главную</Text>
        </Link>
      </View>
    </BackgroundWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: Platform.select({
      ios: 'Georgia',
      android: 'serif',
      default: 'serif',
    }),
    marginBottom: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4A90A4',
    fontFamily: Platform.select({
      ios: 'Georgia',
      android: 'serif',
      default: 'serif',
    }),
  },
});
