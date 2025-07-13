import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { Save, X } from 'lucide-react-native';
import { router } from 'expo-router';
import LiquidGlassView from '@/components/LiquidGlassView';

interface Note {
  id: string;
  content: string;
  createdAt: number;
  isPinned: boolean;
}

export default function CreateNoteScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [noteContent, setNoteContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const saveNote = async () => {
    if (!noteContent.trim()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Empty Note', 'Please write something before saving.');
      return;
    }

    setIsSaving(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      const storedNotes = await AsyncStorage.getItem('glassmemo_notes');
      const existingNotes: Note[] = storedNotes ? JSON.parse(storedNotes) : [];
      
      const newNote: Note = {
        id: Date.now().toString(),
        content: noteContent.trim(),
        createdAt: Date.now(),
        isPinned: false,
      };

      const updatedNotes = [newNote, ...existingNotes];
      await AsyncStorage.setItem('glassmemo_notes', JSON.stringify(updatedNotes));
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setNoteContent('');
      router.push('/');
    } catch (error) {
      console.error('Failed to save note:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', 'Failed to save note. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const clearNote = () => {
    if (noteContent.trim()) {
      Alert.alert(
        'Clear Note',
        'Are you sure you want to clear this note?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Clear', 
            style: 'destructive',
            onPress: () => {
              setNoteContent('');
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
          },
        ]
      );
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}>
        <LinearGradient
          colors={isDark ? ['#0F172A', '#1E293B'] : ['#F8FAFC', '#E2E8F0']}
          style={StyleSheet.absoluteFill}
        />
        
        <View style={styles.header}>
          <Text style={[styles.title, { color: isDark ? '#F1F5F9' : '#0F172A' }]}>
            New Memo
          </Text>
          <Text style={[styles.subtitle, { color: isDark ? '#94A3B8' : '#475569' }]}>
            Jot down your thoughts
          </Text>
        </View>

        <View style={styles.content}>
          <LiquidGlassView
            blurIntensity={1.0}
            glassStyle={isDark ? 'dark' : 'light'}
            liquidAnimation={true}
            cornerRadius={20}
            style={styles.editorCard}
          >
            <TextInput
              style={[
                styles.textInput,
                {
                  color: isDark ? '#F1F5F9' : '#0F172A',
                  backgroundColor: 'transparent',
                }
              ]}
              placeholder="What's on your mind?"
              placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
              value={noteContent}
              onChangeText={setNoteContent}
              multiline
              autoFocus
              textAlignVertical="top"
              maxLength={1000}
            />
            
            <View style={styles.characterCount}>
              <Text style={[styles.countText, { color: isDark ? '#64748B' : '#94A3B8' }]}>
                {noteContent.length}/1000
              </Text>
            </View>
          </LiquidGlassView>

          <View style={styles.actions}>
            <TouchableOpacity
              onPress={clearNote}
              style={[
                styles.actionButton,
                styles.clearButton,
                { backgroundColor: isDark ? '#1E293B' : '#F1F5F9' }
              ]}
              disabled={!noteContent.trim()}
            >
              <X 
                size={20} 
                color={noteContent.trim() ? '#EF4444' : (isDark ? '#475569' : '#94A3B8')} 
              />
              <Text 
                style={[
                  styles.actionText,
                  { color: noteContent.trim() ? '#EF4444' : (isDark ? '#475569' : '#94A3B8') }
                ]}
              >
                Clear
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={saveNote}
              style={[
                styles.actionButton,
                styles.saveButton,
                {
                  backgroundColor: noteContent.trim() 
                    ? (isDark ? '#1E40AF' : '#3B82F6')
                    : (isDark ? '#374151' : '#E5E7EB'),
                }
              ]}
              disabled={!noteContent.trim() || isSaving}
            >
              <Save 
                size={20} 
                color={noteContent.trim() ? '#FFFFFF' : (isDark ? '#6B7280' : '#9CA3AF')} 
              />
              <Text 
                style={[
                  styles.actionText,
                  { color: noteContent.trim() ? '#FFFFFF' : (isDark ? '#6B7280' : '#9CA3AF') }
                ]}
              >
                {isSaving ? 'Saving...' : 'Save'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
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
  editorCard: {
    flex: 1,
    marginHorizontal: 8,
    padding: 24,
    marginBottom: 16,
  },
  textInput: {
    flex: 1,
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '400',
  },
  characterCount: {
    alignItems: 'flex-end',
    marginTop: 16,
  },
  countText: {
    fontSize: 14,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 8,
    paddingBottom: 20,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
  },
  clearButton: {
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  saveButton: {
    // No additional styles needed
  },
  actionText: {
    fontSize: 16,
    fontWeight: '600',
  },
});