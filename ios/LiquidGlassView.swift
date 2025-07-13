import UIKit
import SwiftUI

@available(iOS 15.0, *)
class LiquidGlassView: UIView {
    
    private var blurEffectView: UIVisualEffectView!
    private var vibrancyEffectView: UIVisualEffectView!
    private var gradientLayer: CAGradientLayer!
    private var noiseLayer: CALayer!
    private var animationTimer: Timer?
    
    // Properties exposed to React Native
    var blurIntensity: CGFloat = 0.8 {
        didSet { updateBlurEffect() }
    }
    
    var glassStyle: String = "adaptive" {
        didSet { updateGlassStyle() }
    }
    
    var liquidAnimation: Bool = true {
        didSet { toggleLiquidAnimation() }
    }
    
    var cornerRadius: CGFloat = 20 {
        didSet { updateCornerRadius() }
    }
    
    override init(frame: CGRect) {
        super.init(frame: frame)
        setupLiquidGlass()
    }
    
    required init?(coder: NSCoder) {
        super.init(coder: coder)
        setupLiquidGlass()
    }
    
    private func setupLiquidGlass() {
        // Create the base blur effect
        let blurEffect = UIBlurEffect(style: .systemUltraThinMaterial)
        blurEffectView = UIVisualEffectView(effect: blurEffect)
        blurEffectView.frame = bounds
        blurEffectView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        addSubview(blurEffectView)
        
        // Add vibrancy effect for depth
        let vibrancyEffect = UIVibrancyEffect(blurEffect: blurEffect, style: .fill)
        vibrancyEffectView = UIVisualEffectView(effect: vibrancyEffect)
        vibrancyEffectView.frame = bounds
        vibrancyEffectView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        blurEffectView.contentView.addSubview(vibrancyEffectView)
        
        // Create gradient overlay for liquid glass effect
        setupGradientLayer()
        
        // Add subtle noise texture
        setupNoiseLayer()
        
        // Configure glass appearance
        updateCornerRadius()
        updateGlassStyle()
        
        // Start liquid animation
        if liquidAnimation {
            startLiquidAnimation()
        }
    }
    
    private func setupGradientLayer() {
        gradientLayer = CAGradientLayer()
        gradientLayer.frame = bounds
        gradientLayer.colors = [
            UIColor.white.withAlphaComponent(0.3).cgColor,
            UIColor.clear.cgColor,
            UIColor.white.withAlphaComponent(0.1).cgColor
        ]
        gradientLayer.locations = [0.0, 0.5, 1.0]
        gradientLayer.startPoint = CGPoint(x: 0, y: 0)
        gradientLayer.endPoint = CGPoint(x: 1, y: 1)
        gradientLayer.type = .radial
        
        vibrancyEffectView.contentView.layer.addSublayer(gradientLayer)
    }
    
    private func setupNoiseLayer() {
        noiseLayer = CALayer()
        noiseLayer.frame = bounds
        noiseLayer.opacity = 0.05
        
        // Generate noise texture
        let noiseImage = generateNoiseTexture(size: CGSize(width: 100, height: 100))
        noiseLayer.contents = noiseImage?.cgImage
        noiseLayer.contentsGravity = .resizeAspectFill
        
        vibrancyEffectView.contentView.layer.addSublayer(noiseLayer)
    }
    
    private func generateNoiseTexture(size: CGSize) -> UIImage? {
        UIGraphicsBeginImageContextWithOptions(size, false, 0)
        guard let context = UIGraphicsGetCurrentContext() else { return nil }
        
        for x in 0..<Int(size.width) {
            for y in 0..<Int(size.height) {
                let alpha = CGFloat.random(in: 0...1)
                UIColor.white.withAlphaComponent(alpha).setFill()
                context.fill(CGRect(x: x, y: y, width: 1, height: 1))
            }
        }
        
        let image = UIGraphicsGetImageFromCurrentImageContext()
        UIGraphicsEndImageContext()
        return image
    }
    
    private func updateBlurEffect() {
        let intensity = max(0.1, min(1.0, blurIntensity))
        blurEffectView.alpha = intensity
    }
    
    private func updateGlassStyle() {
        var blurStyle: UIBlurEffect.Style
        
        switch glassStyle {
        case "light":
            blurStyle = .systemUltraThinMaterialLight
        case "dark":
            blurStyle = .systemUltraThinMaterialDark
        default:
            blurStyle = .systemUltraThinMaterial
        }
        
        let blurEffect = UIBlurEffect(style: blurStyle)
        blurEffectView.effect = blurEffect
        
        let vibrancyEffect = UIVibrancyEffect(blurEffect: blurEffect, style: .fill)
        vibrancyEffectView.effect = vibrancyEffect
    }
    
    private func updateCornerRadius() {
        layer.cornerRadius = cornerRadius
        layer.cornerCurve = .continuous
        clipsToBounds = true
        
        // Add subtle border
        layer.borderWidth = 0.5
        layer.borderColor = UIColor.white.withAlphaComponent(0.2).cgColor
    }
    
    private func startLiquidAnimation() {
        animationTimer = Timer.scheduledTimer(withTimeInterval: 0.1, repeats: true) { _ in
            self.animateLiquidEffect()
        }
    }
    
    private func stopLiquidAnimation() {
        animationTimer?.invalidate()
        animationTimer = nil
    }
    
    private func toggleLiquidAnimation() {
        if liquidAnimation {
            startLiquidAnimation()
        } else {
            stopLiquidAnimation()
        }
    }
    
    private func animateLiquidEffect() {
        let animation = CABasicAnimation(keyPath: "transform.rotation")
        animation.duration = 20.0
        animation.repeatCount = .infinity
        animation.fromValue = 0
        animation.toValue = 2 * Double.pi
        
        gradientLayer.add(animation, forKey: "liquidRotation")
        
        // Subtle scale animation
        let scaleAnimation = CAKeyframeAnimation(keyPath: "transform.scale")
        scaleAnimation.values = [1.0, 1.02, 1.0]
        scaleAnimation.keyTimes = [0.0, 0.5, 1.0]
        scaleAnimation.duration = 4.0
        scaleAnimation.repeatCount = .infinity
        
        gradientLayer.add(scaleAnimation, forKey: "liquidPulse")
    }
    
    override func layoutSubviews() {
        super.layoutSubviews()
        blurEffectView.frame = bounds
        vibrancyEffectView.frame = bounds
        gradientLayer.frame = bounds
        noiseLayer.frame = bounds
    }
    
    // Touch interaction effects
    override func touchesBegan(_ touches: Set<UITouch>, with event: UIEvent?) {
        super.touchesBegan(touches, with: event)
        animateTouchDown()
    }
    
    override func touchesEnded(_ touches: Set<UITouch>, with event: UIEvent?) {
        super.touchesEnded(touches, with: event)
        animateTouchUp()
    }
    
    override func touchesCancelled(_ touches: Set<UITouch>, with event: UIEvent?) {
        super.touchesCancelled(touches, with: event)
        animateTouchUp()
    }
    
    private func animateTouchDown() {
        UIView.animate(withDuration: 0.1, delay: 0, options: .curveEaseOut) {
            self.transform = CGAffineTransform(scaleX: 0.98, y: 0.98)
            self.alpha = 0.9
        }
    }
    
    private func animateTouchUp() {
        UIView.animate(withDuration: 0.2, delay: 0, usingSpringWithDamping: 0.8, initialSpringVelocity: 0.5) {
            self.transform = .identity
            self.alpha = 1.0
        }
    }
}