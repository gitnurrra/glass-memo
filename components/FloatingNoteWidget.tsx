import React from 'react';
import { requireNativeComponent, ViewStyle } from 'react-native';

interface FloatingNoteWidgetProps {
  style?: ViewStyle;
  noteText?: string;
  onTextChange?: (event: { nativeEvent: { text: string } }) => void;
  onPositionChange?: (event: { nativeEvent: { x: number; y: number } }) => void;
}

const NativeFloatingNoteWidget = requireNativeComponent<FloatingNoteWidgetProps>('FloatingNoteWidget');

const FloatingNoteWidget: React.FC<FloatingNoteWidgetProps> = ({
  noteText = '',
  onTextChange,
  onPositionChange,
  ...props
}) => {
  return (
    <NativeFloatingNoteWidget
      noteText={noteText}
      onTextChange={onTextChange}
      onPositionChange={onPositionChange}
      {...props}
    />
  );
};

export default FloatingNoteWidget;
export type { FloatingNoteWidgetProps };