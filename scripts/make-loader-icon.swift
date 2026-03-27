import AppKit
import CoreGraphics
import Foundation
import ImageIO
import UniformTypeIdentifiers

let scriptURL = URL(fileURLWithPath: #filePath)
let repoRootURL = scriptURL.deletingLastPathComponent().deletingLastPathComponent()
let inputURL = repoRootURL.appendingPathComponent("public/icons/Assets.xcassets/AppIcon.appiconset/192.png")
let outputURL = repoRootURL.appendingPathComponent("public/icons/loader-icon.png")

guard let image = NSImage(contentsOf: inputURL) else {
  fatalError("Could not load input image")
}

var rect = NSRect(origin: .zero, size: image.size)

guard let sourceImage = image.cgImage(forProposedRect: &rect, context: nil, hints: nil) else {
  fatalError("Could not create source CGImage")
}

let width = sourceImage.width
let height = sourceImage.height
let bytesPerPixel = 4
let bytesPerRow = width * bytesPerPixel
let bitsPerComponent = 8
var pixels = [UInt8](repeating: 0, count: height * bytesPerRow)

guard let context = CGContext(
  data: &pixels,
  width: width,
  height: height,
  bitsPerComponent: bitsPerComponent,
  bytesPerRow: bytesPerRow,
  space: CGColorSpaceCreateDeviceRGB(),
  bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue
) else {
  fatalError("Could not create CGContext")
}

context.draw(sourceImage, in: CGRect(x: 0, y: 0, width: width, height: height))

for offset in stride(from: 0, to: pixels.count, by: bytesPerPixel) {
  let red = Int(pixels[offset])
  let green = Int(pixels[offset + 1])
  let blue = Int(pixels[offset + 2])
  let alpha = Int(pixels[offset + 3])

  if alpha == 0 {
    continue
  }

  let minChannel = min(red, green, blue)
  let maxChannel = max(red, green, blue)
  let brightness = (red + green + blue) / 3

  if brightness >= 246 && maxChannel - minChannel <= 18 {
    pixels[offset + 3] = 0
  } else if brightness >= 232 && maxChannel - minChannel <= 24 {
    let fadedAlpha = UInt8(max(0, min(255, 255 - ((brightness - 232) * 10))))
    pixels[offset + 3] = min(pixels[offset + 3], fadedAlpha)
  }
}

guard let outputImage = context.makeImage() else {
  fatalError("Could not create output CGImage")
}

guard let destination = CGImageDestinationCreateWithURL(
  outputURL as CFURL,
  UTType.png.identifier as CFString,
  1,
  nil
) else {
  fatalError("Could not create image destination")
}

CGImageDestinationAddImage(destination, outputImage, nil)

guard CGImageDestinationFinalize(destination) else {
  fatalError("Could not write output image")
}

print("Created public/icons/loader-icon.png")