#import <React/RCTViewManager.h>
#import <React/RCTUIManager.h>

@interface LiquidGlassViewManager : RCTViewManager
@end

@implementation LiquidGlassViewManager

RCT_EXPORT_MODULE(LiquidGlassView)

- (UIView *)view
{
    return [[LiquidGlassView alloc] init];
}

// Export properties to React Native
RCT_EXPORT_VIEW_PROPERTY(blurIntensity, CGFloat)
RCT_EXPORT_VIEW_PROPERTY(glassStyle, NSString)
RCT_EXPORT_VIEW_PROPERTY(liquidAnimation, BOOL)
RCT_EXPORT_VIEW_PROPERTY(cornerRadius, CGFloat)

// Export methods
RCT_EXPORT_METHOD(startLiquidAnimation:(nonnull NSNumber *)reactTag)
{
    [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, UIView *> *viewRegistry) {
        LiquidGlassView *view = (LiquidGlassView *)viewRegistry[reactTag];
        if (view && [view isKindOfClass:[LiquidGlassView class]]) {
            dispatch_async(dispatch_get_main_queue(), ^{
                view.liquidAnimation = YES;
            });
        }
    }];
}

RCT_EXPORT_METHOD(stopLiquidAnimation:(nonnull NSNumber *)reactTag)
{
    [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, UIView *> *viewRegistry) {
        LiquidGlassView *view = (LiquidGlassView *)viewRegistry[reactTag];
        if (view && [view isKindOfClass:[LiquidGlassView class]]) {
            dispatch_async(dispatch_get_main_queue(), ^{
                view.liquidAnimation = NO;
            });
        }
    }];
}

@end