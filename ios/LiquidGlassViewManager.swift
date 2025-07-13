import Foundation
import React

@objc(LiquidGlassViewManager)
class LiquidGlassViewManager: RCTViewManager {
    
    override func view() -> UIView! {
        return LiquidGlassView()
    }
    
    override static func requiresMainQueueSetup() -> Bool {
        return true
    }
    
    @objc func startLiquidAnimation(_ reactTag: NSNumber) {
        bridge.uiManager.addUIBlock { (uiManager, viewRegistry) in
            guard let view = viewRegistry?[reactTag] as? LiquidGlassView else { return }
            DispatchQueue.main.async {
                view.liquidAnimation = true
            }
        }
    }
    
    @objc func stopLiquidAnimation(_ reactTag: NSNumber) {
        bridge.uiManager.addUIBlock { (uiManager, viewRegistry) in
            guard let view = viewRegistry?[reactTag] as? LiquidGlassView else { return }
            DispatchQueue.main.async {
                view.liquidAnimation = false
            }
        }
    }
}