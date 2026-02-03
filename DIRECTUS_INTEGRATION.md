# Directus/Commonplace Integration Guide

How to embed the Music Room widget in Directus (Commonplace CMS).

## Quick Start

### Option 1: HTML Block (Recommended)

1. In Directus, create or edit a page/article
2. Add an **HTML Block** or **Custom HTML** field
3. Paste this code:

```html
<script src="https://music.inquiry.institute/widget/music-widget.js"></script>
<div id="music-widget-container"></div>
```

4. Save and publish

### Option 2: Custom Component

If your Directus setup supports custom components:

```html
<div data-music-widget></div>
<script src="https://music.inquiry.institute/widget/music-widget.js"></script>
```

## Configuration Options

### Basic Configuration

```html
<div data-music-widget 
     data-config='{"clef":"treble","key":"C","time":"4/4"}'></div>
<script src="https://music.inquiry.institute/widget/music-widget.js"></script>
```

### With Notes (LLM-Friendly)

The widget accepts notes in multiple formats, making it easy for LLMs to generate musical notation:

#### Format 1: Simple Space-Separated (Easiest for LLMs)
```html
<div data-music-widget data-notes="C/4 D/4 E/4 F/4 G/4"></div>
<script src="https://music.inquiry.institute/widget/music-widget.js"></script>
```

#### Format 2: Pipe-Separated with Durations
```html
<div data-music-widget data-notes="C/4,q|D/4,q|E/4,q|F/4,q"></div>
<script src="https://music.inquiry.institute/widget/music-widget.js"></script>
```

#### Format 3: JSON Array (Full Control)
```html
<div data-music-widget 
     data-notes='[{"note":"C/4","duration":"q"},{"note":"D/4","duration":"q"},{"note":"E/4","duration":"q"}]'>
</div>
<script src="https://music.inquiry.institute/widget/music-widget.js"></script>
```

#### Format 4: Individual Attributes
```html
<div data-music-widget 
     data-notes="C/4 D/4 E/4"
     data-clef="treble"
     data-key="C"
     data-time="4/4">
</div>
<script src="https://music.inquiry.institute/widget/music-widget.js"></script>
```

### Configuration Parameters

- `clef`: `"treble"`, `"bass"`, `"alto"`, `"tenor"` (default: `"treble"`)
- `key`: Key signature like `"C"`, `"G"`, `"F"`, `"D"`, etc. (default: `"C"`)
- `time`: Time signature like `"4/4"`, `"3/4"`, `"2/4"` (default: `"4/4"`)
- `notes`: Notes in various formats (see LLM_USAGE.md for details)

### Example with Initial Notes

```html
<div data-music-widget 
     data-config='{
       "clef":"treble",
       "key":"G",
       "time":"4/4",
       "notes":[
         {"note":"C/4","duration":"q"},
         {"note":"D/4","duration":"q"},
         {"note":"E/4","duration":"q"}
       ]
     }'></div>
<script src="https://music.inquiry.institute/widget/music-widget.js"></script>
```

## Directus Field Setup

### For Rich Text Editor

If using a rich text editor that supports HTML:

1. Switch to HTML/Source mode
2. Insert the widget code
3. Switch back to visual mode (widget will render)

### For Custom HTML Field

1. Create a custom field of type "String" or "Text"
2. Set format to "HTML"
3. Add the widget code directly

### For WYSIWYG Editor

Some WYSIWYG editors support iframe embeds. You can also use:

```html
<iframe 
  src="https://music.inquiry.institute/widget/demo.html" 
  width="100%" 
  height="800" 
  frameborder="0">
</iframe>
```

## Widget Features

The widget includes:
- ✅ Editable musical staff (VexFlow)
- ✅ Interactive piano keyboard
- ✅ Audio playback
- ✅ Note editing (add/remove)
- ✅ Clef, key signature, time signature controls
- ✅ Responsive design

## Styling

The widget is self-contained and includes its own styles. It will:
- Adapt to container width
- Use system fonts
- Work in light/dark themes (inherits from page)

### Custom Styling

You can wrap the widget container to add custom styling:

```html
<div style="max-width: 800px; margin: 0 auto; padding: 2rem;">
  <div id="music-widget-container"></div>
  <script src="https://music.inquiry.institute/widget/music-widget.js"></script>
</div>
```

## Troubleshooting

### Widget Not Loading

1. Check browser console for errors
2. Verify the script URL is accessible: `https://music.inquiry.institute/widget/music-widget.js`
3. Ensure container element exists before script loads

### Notes Not Rendering

1. Check that VexFlow loaded correctly
2. Verify React and ReactDOM are available
3. Check browser console for VexFlow errors

### Audio Not Playing

1. Ensure browser supports Web Audio API
2. Check browser console for audio errors
3. Some browsers require user interaction before playing audio

## API Reference

### Manual Initialization

```javascript
// Wait for widget to load
window.MusicWidget.init();

// Or initialize specific container
const container = document.getElementById('my-music-widget');
window.MusicWidget.init();
```

### Widget Version

```javascript
console.log(window.MusicWidget.version); // "1.0.0"
```

## Example: Full Page Embed

For a full-page music room in Directus:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Music Room</title>
</head>
<body>
  <div id="music-widget-container"></div>
  <script src="https://music.inquiry.institute/widget/music-widget.js"></script>
</body>
</html>
```

## LLM Integration

For LLM-generated musical notation, see **LLM_USAGE.md** for detailed examples and formats.

Quick example for LLMs:
```html
<!-- LLM can generate this simple format -->
<div data-music-widget data-notes="C/4 D/4 E/4 F/4 G/4"></div>
<script src="https://music.inquiry.institute/widget/music-widget.js"></script>
```

## Support

- Widget URL: https://music.inquiry.institute/widget/music-widget.js
- Demo: https://music.inquiry.institute/widget/demo.html
- LLM Guide: See `LLM_USAGE.md` for LLM integration examples
- Repository: https://github.com/dcmcshan/music
