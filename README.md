# GlassMemo - A Liquid Glass implementation

A minimal floating notes app with true native iOS liquid glass effects using UIVisualEffectView and custom glass morphism.

## Native iOS Components

### LiquidGlassView
- **UIVisualEffectView + UIGlassEffect**: True iOS glass morphism with system blur effects
- **Liquid Animation**: Continuous gradient rotation and subtle scaling animations
- **Adaptive Theming**: Automatically adapts to light/dark mode
- **Touch Interactions**: Responsive scaling and opacity changes on touch
- **Noise Texture**: Subtle procedural noise overlay for authentic glass texture

### FloatingNoteWidget
- **Draggable Interface**: Pan gesture support with spring animations
- **Long Press Editing**: Long press to enter edit mode with keyboard
- **Auto-sizing Text**: Dynamic text view that adapts to content
- **Position Persistence**: Saves widget position across app sessions

## Setup Instructions

1. **Add to iOS Project**:
   ```bash
   # Copy all iOS files to your iOS project
   cp ios/* YourProject/ios/YourProject/
   ```

2. **Configure Bridging Header**:
   - Add `GlassMemo-Bridging-Header.h` to your project
   - Set in Build Settings: `Objective-C Bridging Header`

3. **Link Native Modules**:
   ```javascript
   // In your React Native app
   import LiquidGlassView from './components/LiquidGlassView';
   import FloatingNoteWidget from './components/FloatingNoteWidget';
   ```

4. **Build and Run**:
   ```bash
   npx react-native run-ios
   ```

## Usage Examples

### Basic Liquid Glass Card
```jsx
<LiquidGlassView
  blurIntensity={0.9}
  glassStyle="adaptive"
  liquidAnimation={true}
  cornerRadius={20}
  style={{ padding: 20 }}
>
  <Text>Your content here</Text>
</LiquidGlassView>
```

### Floating Note Widget
```jsx
<FloatingNoteWidget
  noteText={noteContent}
  onTextChange={(event) => setNoteContent(event.nativeEvent.text)}
  onPositionChange={(event) => savePosition(event.nativeEvent)}
  style={{ width: 200, height: 120 }}
/>
```

## Features

- ✨ **True iOS Glass Effects**: Uses UIVisualEffectView for authentic system blur
- 🌊 **Liquid Animations**: Continuous morphing gradients and subtle movements
- 🎨 **Adaptive Design**: Automatically matches system appearance
- 👆 **Touch Responsive**: Smooth animations on user interaction
- 📱 **Native Performance**: 60fps animations with Core Animation
- 🔧 **Customizable**: Adjustable blur intensity, corner radius, and animation speed

## Technical Details

- **iOS 15.0+**: Requires modern iOS for advanced blur effects
- **UIVisualEffectView**: System-level blur with vibrancy effects
- **CAGradientLayer**: Hardware-accelerated gradient animations
- **Core Animation**: Smooth 60fps liquid morphing effects
- **React Native Bridge**: Seamless integration with JavaScript

The implementation provides true native iOS liquid glass effects that cannot be replicated with web technologies, offering authentic system-level blur, vibrancy, and performance.
