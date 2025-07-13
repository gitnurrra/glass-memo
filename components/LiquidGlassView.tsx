import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import { requireNativeComponent, UIManager, findNodeHandle, ViewStyle } from 'react-native';

interface LiquidGlassViewProps {
  style?: ViewStyle;
  blurIntensity?: number;
  glassStyle?: 'adaptive' | 'light' | 'dark';
  liquidAnimation?: boolean;
  cornerRadius?: number;
  children?: React.ReactNode;
}

interface LiquidGlassViewRef {
  startLiquidAnimation: () => void;
  stopLiquidAnimation: () => void;
}

const NativeLiquidGlassView = requireNativeComponent<LiquidGlassViewProps>('LiquidGlassView');

const LiquidGlassView = forwardRef<LiquidGlassViewRef, LiquidGlassViewProps>(
  ({ blurIntensity = 0.8, glassStyle = 'adaptive', liquidAnimation = true, cornerRadius = 20, ...props }, ref) => {
    const nativeRef = useRef(null);

    useImperativeHandle(ref, () => ({
      startLiquidAnimation: () => {
        const reactTag = findNodeHandle(nativeRef.current);
        if (reactTag) {
          UIManager.dispatchViewManagerCommand(
            reactTag,
            'startLiquidAnimation',
            []
          );
        }
      },
      stopLiquidAnimation: () => {
        const reactTag = findNodeHandle(nativeRef.current);
        if (reactTag) {
          UIManager.dispatchViewManagerCommand(
            reactTag,
            'stopLiquidAnimation',
            []
          );
        }
      },
    }));

    return (
      <NativeLiquidGlassView
        ref={nativeRef}
        blurIntensity={blurIntensity}
        glassStyle={glassStyle}
        liquidAnimation={liquidAnimation}
        cornerRadius={cornerRadius}
        {...props}
      />
    );
  }
);

LiquidGlassView.displayName = 'LiquidGlassView';

export default LiquidGlassView;
export type { LiquidGlassViewProps, LiquidGlassViewRef };