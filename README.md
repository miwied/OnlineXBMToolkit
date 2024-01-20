# OnlineXBMToolkit
This web-based tool was designed for editing and converting images into the XBM (X BitMap) format. I developed it for a private project and now I wanted to outsource it as a standalone app. It has many bundled features compared to other xbm-editors.


-VUE app with VUETIFY lib
-input -> grid / image size (can be equaled...)
-output download xbm or copy array (array can be modified)

- edit
-> shift, rotate, invert, paint ...
can be toggeled to preview

limitations
->gird size > 200

# Features:
- Image Upload & Size Adjustment: Users can upload image files (SVG, PNG, JPG, JPEG) and adjust their dimensions (width and height) in pixels.

- Grid Customization: The tool offers the ability to customize grid sizes, with individual control over grid width and height. A lock feature allows for maintaining equal dimensions for both grid and image sizes.
- Editing Modes: Two primary modes are available – Edit and Preview. In Edit mode, users can directly manipulate the XBM array, whereas Preview mode provides a visual representation of the XBM data.
- Editing Features: Includes basic image manipulation functions like shifting (left, right, up, down), rotation (left, right), inversion, and clearing the image. The tool also supports undo and redo actions for convenient editing.
- XBM Conversion: The tool converts uploaded images into the XBM format, considering the specified grid and image sizes.
- Output Handling: Users can download the converted XBM file or copy the XBM array to the clipboard. The tool displays a formatted version of the XBM array, aiding in understanding and usage.
- Responsive Design: The tool’s interface is responsive, making it accessible and functional across various devices and screen sizes.