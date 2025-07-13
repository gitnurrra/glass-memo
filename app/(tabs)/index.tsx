import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
  useColorScheme,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { CreditCard as Edit3, Trash2, Pin } from 'lucide-react-native';
import LiquidGlassView from '@/components/LiquidGlassView';
import FloatingNoteWidget from '@/components/FloatingNoteWidget';

interface Note {
  id: string;
  content: string;
  createdAt: number;
  isPinned: boolean;
}

const { width: screenWidth } = Dimensions.get('window');

export default function NotesScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<string | null>(null);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const storedNotes = await AsyncStorage.getItem('glassmemo_notes');
      if (storedNotes) {
        setNotes(JSON.parse(storedNotes));
      }
    } catch (error) {
      console.error('Failed to load notes:', error);
    }
  };

  const saveNotes = async (updatedNotes: Note[]) => {
    try {
      await AsyncStorage.setItem('glassmemo_notes', JSON.stringify(updatedNotes));
      setNotes(updatedNotes);
    } catch (error) {
      console.error('Failed to save notes:', error);
    }
  };

  const togglePin = async (noteId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const updatedNotes = notes.map(note =>
      note.id === noteId ? { ...note, isPinned: !note.isPinned } : note
    );
    await saveNotes(updatedNotes);
  };

  const deleteNote = async (noteId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const updatedNotes = notes.filter(note => note.id !== noteId);
    await saveNotes(updatedNotes);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      return 'Today';
    } else if (diffDays === 2) {
      return 'Yesterday';
    } else if (diffDays <= 7) {
      return `${diffDays - 1} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const sortedNotes = [...notes].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return b.createdAt - a.createdAt;
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}>
      <LinearGradient
        colors={isDark ? ['#0F172A', '#1E293B'] : ['#F8FAFC', '#E2E8F0']}
        style={StyleSheet.absoluteFill}
      />
      
      <View style={styles.header}>
        <Text style={[styles.title, { color: isDark ? '#F1F5F9' : '#0F172A' }]}>
          GlassMemo
        </Text>
        <Text style={[styles.subtitle, { color: isDark ? '#94A3B8' : '#475569' }]}>
          {notes.length} notes
        </Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {sortedNotes.length === 0 ? (
          <LiquidGlassView
            blurIntensity={0.8}
            glassStyle={isDark ? 'dark' : 'light'}
            liquidAnimation={true}
            style={styles.emptyCard}
          >
            <Text style={[styles.emptyTitle, { color: isDark ? '#F1F5F9' : '#0F172A' }]}>
              No notes yet
            </Text>
            <Text style={[styles.emptySubtitle, { color: isDark ? '#94A3B8' : '#475569' }]}>
              Tap the + button to create your first floating memo
            </Text>
          </LiquidGlassView>
        ) : (
          sortedNotes.map((note, index) => (
            <Pressable
              key={note.id}
              onLongPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                setSelectedNote(selectedNote === note.id ? null : note.id);
              }}
              style={({ pressed }) => [
                styles.noteCard,
                { transform: [{ scale: pressed ? 0.98 : 1 }] },
              ]}
            >
              <LiquidGlassView
                blurIntensity={1.0}
                glassStyle={isDark ? 'dark' : 'light'}
                liquidAnimation={true}
                cornerRadius={20}
                style={[
                  styles.noteCardBlur,
                  {
                    borderColor: note.isPinned 
                      ? (isDark ? '#60A5FA' : '#3B82F6')
                      : (isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'),
                    borderWidth: note.isPinned ? 1.5 : 1,
                  }
                ]}
              >
                <View style={styles.noteHeader}>
                  <View style={styles.noteInfo}>
                    {note.isPinned && (
                      <Pin 
                        size={16} 
                        color={isDark ? '#60A5FA' : '#3B82F6'} 
                        style={styles.pinIcon}
                      />
                    )}
                    <Text style={[styles.noteDate, { color: isDark ? '#94A3B8' : '#475569' }]}>
                      {formatDate(note.createdAt)}
                    </Text>
                  </View>
                  
                  {selectedNote === note.id && (
                    <View style={styles.noteActions}>
                      <TouchableOpacity
                        onPress={() => togglePin(note.id)}
                        style={[styles.actionButton, { backgroundColor: isDark ? '#1E293B' : '#F1F5F9' }]}
                      >
                        <Pin 
                          size={16} 
                          color={note.isPinned ? (isDark ? '#60A5FA' : '#3B82F6') : (isDark ? '#94A3B8' : '#475569')} 
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => deleteNote(note.id)}
                        style={[styles.actionButton, { backgroundColor: isDark ? '#1E293B' : '#F1F5F9' }]}
                      >
                        <Trash2 size={16} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
                
                <Text 
                  style={[styles.noteContent, { color: isDark ? '#F1F5F9' : '#0F172A' }]}
                  numberOfLines={4}
                >
                  {note.content}
                </Text>
              </LiquidGlassView>
            </Pressable>
          ))
        )}
        
        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
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
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  emptyCard: {
    marginHorizontal: 8,
    marginVertical: 12,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 40,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 40,
    paddingHorizontal: 32,
    lineHeight: 24,
  },
  noteCard: {
    marginHorizontal: 8,
    marginVertical: 8,
  },
  noteCardBlur: {
    borderRadius: 20,
    padding: 20,
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  noteInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pinIcon: {
    marginRight: 8,
  },
  noteDate: {
    fontSize: 14,
    fontWeight: '500',
  },
  noteActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noteContent: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
  },
  bottomPadding: {
    height: 120,
  },
});