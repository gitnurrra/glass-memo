import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  useColorScheme,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { Trash2, Palette, Type, Zap } from 'lucide-react-native';
import LiquidGlassView from '@/components/LiquidGlassView';

interface Settings {
  blurIntensity: number;
  textSize: 'small' | 'medium' | 'large';
  hapticFeedback: boolean;
  autoSave: boolean;
}

const defaultSettings: Settings = {
  blurIntensity: 80,
  textSize: 'medium',
  hapticFeedback: true,
  autoSave: true,
};

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [notesCount, setNotesCount] = useState(0);

  useEffect(() => {
    loadSettings();
    loadNotesCount();
  }, []);

  const loadSettings = async () => {
    try {
      const storedSettings = await AsyncStorage.getItem('glassmemo_settings');
      if (storedSettings) {
        setSettings({ ...defaultSettings, ...JSON.parse(storedSettings) });
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const loadNotesCount = async () => {
    try {
      const storedNotes = await AsyncStorage.getItem('glassmemo_notes');
      if (storedNotes) {
        const notes = JSON.parse(storedNotes);
        setNotesCount(notes.length);
      }
    } catch (error) {
      console.error('Failed to load notes count:', error);
    }
  };

  const saveSettings = async (newSettings: Settings) => {
    try {
      await AsyncStorage.setItem('glassmemo_settings', JSON.stringify(newSettings));
      setSettings(newSettings);
      if (settings.hapticFeedback) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    const newSettings = { ...settings, [key]: value };
    saveSettings(newSettings);
  };

  const clearAllNotes = () => {
    Alert.alert(
      'Clear All Notes',
      `Are you sure you want to delete all ${notesCount} notes? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('glassmemo_notes');
              setNotesCount(0);
              if (settings.hapticFeedback) {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              }
              Alert.alert('Success', 'All notes have been deleted.');
            } catch (error) {
              console.error('Failed to clear notes:', error);
              Alert.alert('Error', 'Failed to delete notes. Please try again.');
            }
          },
        },
      ]
    );
  };

  const SettingCard = ({ children }: { children: React.ReactNode }) => (
    <LiquidGlassView
      blurIntensity={settings.blurIntensity / 100}
      glassStyle={isDark ? 'dark' : 'light'}
      liquidAnimation={true}
      cornerRadius={20}
      style={styles.settingCard}
    >
      {children}
    </LiquidGlassView>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}>
      <LinearGradient
        colors={isDark ? ['#0F172A', '#1E293B'] : ['#F8FAFC', '#E2E8F0']}
        style={StyleSheet.absoluteFill}
      />
      
      <View style={styles.header}>
        <Text style={[styles.title, { color: isDark ? '#F1F5F9' : '#0F172A' }]}>
          Settings
        </Text>
        <Text style={[styles.subtitle, { color: isDark ? '#94A3B8' : '#475569' }]}>
          Customize your experience
        </Text>
      </View>

      <View style={styles.content}>
        <SettingCard>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Zap size={20} color={isDark ? '#60A5FA' : '#3B82F6'} />
              <View style={styles.settingText}>
                <Text style={[styles.settingTitle, { color: isDark ? '#F1F5F9' : '#0F172A' }]}>
                  Haptic Feedback
                </Text>
                <Text style={[styles.settingDescription, { color: isDark ? '#94A3B8' : '#475569' }]}>
                  Feel vibrations for interactions
                </Text>
              </View>
            </View>
            <Switch
              value={settings.hapticFeedback}
              onValueChange={(value) => updateSetting('hapticFeedback', value)}
              trackColor={{ false: isDark ? '#374151' : '#E5E7EB', true: isDark ? '#1E40AF' : '#3B82F6' }}
              thumbColor={settings.hapticFeedback ? '#FFFFFF' : '#9CA3AF'}
            />
          </View>
        </SettingCard>

        <SettingCard>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Palette size={20} color={isDark ? '#60A5FA' : '#3B82F6'} />
              <View style={styles.settingText}>
                <Text style={[styles.settingTitle, { color: isDark ? '#F1F5F9' : '#0F172A' }]}>
                  Blur Intensity
                </Text>
                <Text style={[styles.settingDescription, { color: isDark ? '#94A3B8' : '#475569' }]}>
                  {settings.blurIntensity}% opacity
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.blurControls}>
            {[60, 80, 100].map((intensity) => (
              <TouchableOpacity
                key={intensity}
                onPress={() => updateSetting('blurIntensity', intensity)}
                style={[
                  styles.blurButton,
                  {
                    backgroundColor: settings.blurIntensity === intensity
                      ? (isDark ? '#1E40AF' : '#3B82F6')
                      : (isDark ? '#374151' : '#E5E7EB'),
                  }
                ]}
              >
                <Text
                  style={[
                    styles.blurButtonText,
                    {
                      color: settings.blurIntensity === intensity
                        ? '#FFFFFF'
                        : (isDark ? '#9CA3AF' : '#6B7280'),
                    }
                  ]}
                >
                  {intensity}%
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </SettingCard>

        <SettingCard>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Type size={20} color={isDark ? '#60A5FA' : '#3B82F6'} />
              <View style={styles.settingText}>
                <Text style={[styles.settingTitle, { color: isDark ? '#F1F5F9' : '#0F172A' }]}>
                  Text Size
                </Text>
                <Text style={[styles.settingDescription, { color: isDark ? '#94A3B8' : '#475569' }]}>
                  {settings.textSize.charAt(0).toUpperCase() + settings.textSize.slice(1)}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.textSizeControls}>
            {(['small', 'medium', 'large'] as const).map((size) => (
              <TouchableOpacity
                key={size}
                onPress={() => updateSetting('textSize', size)}
                style={[
                  styles.textSizeButton,
                  {
                    backgroundColor: settings.textSize === size
                      ? (isDark ? '#1E40AF' : '#3B82F6')
                      : (isDark ? '#374151' : '#E5E7EB'),
                  }
                ]}
              >
                <Text
                  style={[
                    styles.textSizeButtonText,
                    {
                      color: settings.textSize === size
                        ? '#FFFFFF'
                        : (isDark ? '#9CA3AF' : '#6B7280'),
                      fontSize: size === 'small' ? 12 : size === 'medium' ? 14 : 16,
                    }
                  ]}
                >
                  Aa
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </SettingCard>

        <SettingCard>
          <TouchableOpacity onPress={clearAllNotes} style={styles.dangerSection}>
            <View style={styles.settingInfo}>
              <Trash2 size={20} color="#EF4444" />
              <View style={styles.settingText}>
                <Text style={[styles.settingTitle, { color: '#EF4444' }]}>
                  Clear All Notes
                </Text>
                <Text style={[styles.settingDescription, { color: isDark ? '#94A3B8' : '#475569' }]}>
                  Delete all {notesCount} notes permanently
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </SettingCard>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: isDark ? '#64748B' : '#94A3B8' }]}>
            GlassMemo v1.0.0
          </Text>
          <Text style={[styles.footerText, { color: isDark ? '#64748B' : '#94A3B8' }]}>
            Minimal floating notes for your thoughts
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
            }
            }
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    marginTop: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  settingCard: {
    marginHorizontal: 8,
    marginVertical: 8,
    padding: 20,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 12,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
  },
  blurControls: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 8,
  },
  blurButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  blurButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  textSizeControls: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 8,
  },
  textSizeButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textSizeButtonText: {
    fontWeight: '600',
  },
  dangerSection: {
    // No additional styles needed
  },
  footer: {
    marginTop: 32,
    marginBottom: 120,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 2,
  },
});