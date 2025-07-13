import UIKit
import SwiftUI

@available(iOS 15.0, *)
class FloatingNoteWidget: UIView {
    
    private var liquidGlassView: LiquidGlassView!
    private var textView: UITextView!
    private var isDragging = false
    private var initialTouchPoint: CGPoint = .zero
    
    var noteText: String = "" {
        didSet { textView.text = noteText }
    }
    
    var onTextChange: ((String) -> Void)?
    var onPositionChange: ((CGPoint) -> Void)?
    
    override init(frame: CGRect) {
        super.init(frame: frame)
        setupFloatingWidget()
    }
    
    required init?(coder: NSCoder) {
        super.init(coder: coder)
        setupFloatingWidget()
    }
    
    private func setupFloatingWidget() {
        // Create liquid glass background
        liquidGlassView = LiquidGlassView(frame: bounds)
        liquidGlassView.cornerRadius = 16
        liquidGlassView.blurIntensity = 0.9
        liquidGlassView.liquidAnimation = true
        addSubview(liquidGlassView)
        
        // Create text view
        textView = UITextView()
        textView.backgroundColor = .clear
        textView.font = UIFont.systemFont(ofSize: 14, weight: .medium)
        textView.textColor = .label
        textView.isScrollEnabled = false
        textView.textContainer.lineBreakMode = .byWordWrapping
        textView.textContainer.maximumNumberOfLines = 4
        textView.delegate = self
        textView.text = "Tap to edit..."
        textView.textColor = .secondaryLabel
        
        liquidGlassView.addSubview(textView)
        
        // Setup constraints
        textView.translatesAutoresizingMaskIntoConstraints = false
        NSLayoutConstraint.activate([
            textView.topAnchor.constraint(equalTo: liquidGlassView.topAnchor, constant: 12),
            textView.leadingAnchor.constraint(equalTo: liquidGlassView.leadingAnchor, constant: 12),
            textView.trailingAnchor.constraint(equalTo: liquidGlassView.trailingAnchor, constant: -12),
            textView.bottomAnchor.constraint(equalTo: liquidGlassView.bottomAnchor, constant: -12)
        ])
        
        liquidGlassView.translatesAutoresizingMaskIntoConstraints = false
        NSLayoutConstraint.activate([
            liquidGlassView.topAnchor.constraint(equalTo: topAnchor),
            liquidGlassView.leadingAnchor.constraint(equalTo: leadingAnchor),
            liquidGlassView.trailingAnchor.constraint(equalTo: trailingAnchor),
            liquidGlassView.bottomAnchor.constraint(equalTo: bottomAnchor)
        ])
        
        // Add pan gesture for dragging
        let panGesture = UIPanGestureRecognizer(target: self, action: #selector(handlePan(_:)))
        addGestureRecognizer(panGesture)
        
        // Add long press for editing
        let longPressGesture = UILongPressGestureRecognizer(target: self, action: #selector(handleLongPress(_:)))
        longPressGesture.minimumPressDuration = 0.5
        addGestureRecognizer(longPressGesture)
    }
    
    @objc private func handlePan(_ gesture: UIPanGestureRecognizer) {
        switch gesture.state {
        case .began:
            isDragging = true
            initialTouchPoint = gesture.location(in: superview)
            animateDragStart()
            
        case .changed:
            let translation = gesture.translation(in: superview)
            let newCenter = CGPoint(
                x: initialTouchPoint.x + translation.x,
                y: initialTouchPoint.y + translation.y
            )
            center = newCenter
            
        case .ended, .cancelled:
            isDragging = false
            animateDragEnd()
            onPositionChange?(frame.origin)
            
        default:
            break
        }
    }
    
    @objc private func handleLongPress(_ gesture: UILongPressGestureRecognizer) {
        if gesture.state == .began {
            textView.becomeFirstResponder()
            animateEditMode()
        }
    }
    
    private func animateDragStart() {
        UIView.animate(withDuration: 0.2, delay: 0, usingSpringWithDamping: 0.8, initialSpringVelocity: 0.5) {
            self.transform = CGAffineTransform(scaleX: 1.05, y: 1.05)
            self.liquidGlassView.blurIntensity = 1.0
        }
    }
    
    private func animateDragEnd() {
        UIView.animate(withDuration: 0.3, delay: 0, usingSpringWithDamping: 0.7, initialSpringVelocity: 0.3) {
            self.transform = .identity
            self.liquidGlassView.blurIntensity = 0.9
        }
    }
    
    private func animateEditMode() {
        UIView.animate(withDuration: 0.3, delay: 0, usingSpringWithDamping: 0.8, initialSpringVelocity: 0.5) {
            self.transform = CGAffineTransform(scaleX: 1.1, y: 1.1)
            self.liquidGlassView.cornerRadius = 20
        } completion: { _ in
            UIView.animate(withDuration: 0.2) {
                self.transform = .identity
            }
        }
    }
}

extension FloatingNoteWidget: UITextViewDelegate {
    func textViewDidBeginEditing(_ textView: UITextView) {
        if textView.textColor == .secondaryLabel {
            textView.text = ""
            textView.textColor = .label
        }
    }
    
    func textViewDidEndEditing(_ textView: UITextView) {
        if textView.text.isEmpty {
            textView.text = "Tap to edit..."
            textView.textColor = .secondaryLabel
        }
        onTextChange?(textView.text)
    }
    
    func textViewDidChange(_ textView: UITextView) {
        onTextChange?(textView.text)
    }
}