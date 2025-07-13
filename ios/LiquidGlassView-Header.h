//
//  LiquidGlassView-Header.h
//  GlassMemo
//

#ifndef LiquidGlassView_Header_h
#define LiquidGlassView_Header_h

#import <UIKit/UIKit.h>
#import <React/RCTComponent.h>

@interface LiquidGlassView : UIView

@property (nonatomic, assign) CGFloat blurIntensity;
@property (nonatomic, strong) NSString *glassStyle;
@property (nonatomic, assign) BOOL liquidAnimation;
@property (nonatomic, assign) CGFloat cornerRadius;

@end

@interface FloatingNoteWidget : UIView

@property (nonatomic, strong) NSString *noteText;
@property (nonatomic, copy) RCTDirectEventBlock onTextChange;
@property (nonatomic, copy) RCTDirectEventBlock onPositionChange;

@end

#endif /* LiquidGlassView_Header_h */