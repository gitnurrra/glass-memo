import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  Animated,
  useColorScheme,
  Dimensions,
} from 'react-native';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { Edit3, Save, X } from 'lucide-react-native';

interface FloatingNoteProps {
  content: string;
  onContentChange: (content: string) => void;
  onSave: () => void;
  position: { x: number; y: number };
  onPositionChange: (position: { x: number; y: number }) => void;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function FloatingNote({
  content,
  onContentChange,
  onSave,
  position,
  onPositionChange,
}: FloatingNoteProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [isEditing, setIsEditing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const animatedValue = useRef(new Animated.Value(1)).current;
  const panValue = useRef(new Animated.ValueXY(position)).current;

  const handleLongPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    onSave();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleCancel = () => {
    setIsEditing(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const panResponder = React.useRef(
    require('react-native').PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setIsDragging(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        Animated.spring(animatedValue, {
          toValue: 1.1,
          useNativeDriver: true,
        }).start();
      },
      onPanResponderMove: Animated.event(
        [null, { dx: panValue.x, dy: panValue.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (_, gestureState) => {
        setIsDragging(false);
        Animated.spring(animatedValue, {
          toValue: 1,
          useNativeDriver: true,
        }).start();

        const newX = Math.max(0, Math.min(screenWidth - 200, gestureState.moveX - 100));
        const newY = Math.max(0, Math.min(screenHeight - 150, gestureState.moveY - 75));
        
        panValue.setOffset({
          x: newX,
          y: newY,
        });
        panValue.setValue({ x: 0, y: 0 });
        
        onPositionChange({ x: newX, y: newY });
      },
    })
  ).current;

  if (isEditing) {
    return (
      <Animated.View
        style={[
          styles.floatingContainer,
          styles.editingContainer,
          {
            transform: [
              { translateX: panValue.x },
              { translateY: panValue.y },
              { scale: animatedValue },
            ],
          },
        ]}
      >
        <BlurView
          intensity={100}
          tint={isDark ? 'dark' : 'light'}
          style={styles.editingBlur}
        >
          <View style={styles.editHeader}>
            <Text style={[styles.editTitle, { color: isDark ? '#F1F5F9' : '#0F172A' }]}>
              Edit Note
            </Text>
            <View style={styles.editActions}>
              <Pressable onPress={handleCancel} style={styles.editButton}>
                <X size={16} color={isDark ? '#94A3B8' : '#6B7280'} />
              </Pressable>
              <Pressable onPress={handleSave} style={styles.editButton}>
                <Save size={16} color={isDark ? '#60A5FA' : '#3B82F6'} />
              </Pressable>
            </View>
          </View>
          <TextInput
            style={[
              styles.editInput,
              { color: isDark ? '#F1F5F9' : '#0F172A' }
            ]}
            value={content}
            onChangeText={onContentChange}
            placeholder="Enter your note..."
            placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
            multiline
            autoFocus
          />
        </BlurView>
      </Animated.View>
    );
  }

  return (
    <Animated.View
      style={[
        styles.floatingContainer,
        {
          transform: [
            { translateX: panValue.x },
            { translateY: panValue.y },
            { scale: animatedValue },
          ],
        },
      ]}
      {...panResponder.panHandlers}
    >
      <Pressable onLongPress={handleLongPress}>
        <BlurView
          intensity={80}
          tint={isDark ? 'dark' : 'light'}
          style={[
            styles.noteBlur,
            {
              borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
              shadowColor: isDark ? '#000' : '#000',
              shadowOpacity: isDark ? 0.5 : 0.1,
            }
          ]}
        >
          <View style={styles.noteHeader}>
            <Edit3 size={12} color={isDark ? '#94A3B8' : '#6B7280'} />
          </View>
          <Text 
            style={[
              styles.noteText,
              { color: isDark ? '#F1F5F9' : '#0F172A' }
            ]}
            numberOfLines={3}
          >
            {content || 'Tap to edit...'}
          </Text>
        </BlurView>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  floatingContainer: {
    position: 'absolute',
    width: 200,
    zIndex: 1000,
  },
  editingContainer: {
    width: 300,
    height: 200,
  },
  noteBlur: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 8,
  },
  editingBlur: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
    height: '100%',
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  noteText: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '400',
  },
  editHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  editTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  editActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  editInput: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    textAlignVertical: 'top',
  },
});