#import <React/RCTViewManager.h>

@interface FloatingNoteWidgetManager : RCTViewManager
@end

@implementation FloatingNoteWidgetManager

RCT_EXPORT_MODULE(FloatingNoteWidget)

- (UIView *)view
{
    return [[FloatingNoteWidget alloc] init];
}

RCT_EXPORT_VIEW_PROPERTY(noteText, NSString)
RCT_EXPORT_VIEW_PROPERTY(onTextChange, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onPositionChange, RCTDirectEventBlock)

@end