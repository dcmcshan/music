# Music Widget - LLM Integration Guide

The music widget accepts notes as arguments in multiple formats, making it easy for LLMs to generate and display musical notation.

## Quick Start for LLMs

### Format 1: Data Attributes (Recommended)

```html
<div data-music-widget 
     data-notes='[{"note":"C/4","duration":"q"},{"note":"D/4","duration":"q"},{"note":"E/4","duration":"q"}]'
     data-clef="treble"
     data-key="C"
     data-time="4/4">
</div>
<script src="https://music.inquiry.institute/widget/music-widget.js"></script>
```

### Format 2: Simple Note String

```html
<div data-music-widget 
     data-notes="C/4,q|D/4,q|E/4,q|F/4,q">
</div>
<script src="https://music.inquiry.institute/widget/music-widget.js"></script>
```

### Format 3: Space-Separated Notes

```html
<div data-music-widget 
     data-notes="C/4 D/4 E/4 F/4">
</div>
<script src="https://music.inquiry.institute/widget/music-widget.js"></script>
```

### Format 4: URL Parameters

```
https://music.inquiry.institute/?notes=[{"note":"C/4","duration":"q"},{"note":"D/4","duration":"q"}]&clef=treble&key=C
```

### Format 5: JavaScript API

```javascript
window.MusicWidget.render('my-container', {
  clef: 'treble',
  key: 'C',
  time: '4/4',
  notes: [
    { note: 'C/4', duration: 'q' },
    { note: 'D/4', duration: 'q' },
    { note: 'E/4', duration: 'q' }
  ]
});
```

## Note Format

### VexFlow Format
- **Note**: `"C/4"` = Middle C (C in octave 4)
- **Note**: `"D#/5"` = D# in octave 5
- **Note**: `"Bb/3"` = Bb in octave 3

### Duration Codes
- `"w"` = whole note
- `"h"` = half note
- `"q"` = quarter note (default)
- `"8"` = eighth note
- `"16"` = sixteenth note

## LLM Prompt Examples

### Example 1: Generate C Major Scale

```
Generate HTML to display a C major scale (C D E F G A B C) using the music widget.
Use quarter notes and treble clef.
```

**Output:**
```html
<div data-music-widget 
     data-notes='[{"note":"C/4","duration":"q"},{"note":"D/4","duration":"q"},{"note":"E/4","duration":"q"},{"note":"F/4","duration":"q"},{"note":"G/4","duration":"q"},{"note":"A/4","duration":"q"},{"note":"B/4","duration":"q"},{"note":"C/5","duration":"q"}]'
     data-clef="treble"
     data-key="C">
</div>
<script src="https://music.inquiry.institute/widget/music-widget.js"></script>
```

### Example 2: Simple Format

```
Display the notes C, E, G as a C major chord using the music widget.
```

**Output:**
```html
<div data-music-widget data-notes="C/4,q|E/4,q|G/4,q"></div>
<script src="https://music.inquiry.institute/widget/music-widget.js"></script>
```

### Example 3: Melody

```
Create a simple melody: C D E F G F E D C using the music widget.
```

**Output:**
```html
<div data-music-widget 
     data-notes="C/4 D/4 E/4 F/4 G/4 F/4 E/4 D/4 C/4"
     data-clef="treble">
</div>
<script src="https://music.inquiry.institute/widget/music-widget.js"></script>
```

## Supported Input Formats

### 1. JSON Array (Full Format)
```json
[
  {"note": "C/4", "duration": "q"},
  {"note": "D/4", "duration": "q"},
  {"note": "E/4", "duration": "q"}
]
```

### 2. Pipe-Separated (Simple)
```
C/4,q|D/4,q|E/4,q
```

### 3. Space-Separated (Simplest)
```
C/4 D/4 E/4
```

### 4. Object with Notes Property
```json
{
  "clef": "treble",
  "key": "C",
  "time": "4/4",
  "notes": [
    {"note": "C/4", "duration": "q"},
    {"note": "D/4", "duration": "q"}
  ]
}
```

## Configuration Options

### Clef
- `"treble"` (default)
- `"bass"`
- `"alto"`
- `"tenor"`

### Key Signature
- `"C"` (default)
- `"G"`, `"D"`, `"A"`, `"E"`, `"B"`, `"F#"`
- `"F"`, `"Bb"`, `"Eb"`, `"Ab"`, `"Db"`, `"Gb"`

### Time Signature
- `"4/4"` (default)
- `"3/4"`, `"2/4"`, `"6/8"`, `"2/2"`

## Directus/Commonplace Integration

### For LLM-Generated Content

When an LLM generates musical notation in Directus:

1. **Store notes as JSON** in a field
2. **Use HTML block** to render:

```html
<div data-music-widget 
     data-notes="{{notes_field}}"
     data-clef="{{clef_field|default:'treble'}}">
</div>
<script src="https://music.inquiry.institute/widget/music-widget.js"></script>
```

### Template Example

```html
<!-- In Directus template -->
<div data-music-widget 
     data-notes='{{article.musical_notation}}'
     data-clef="{{article.clef|default:'treble'}}"
     data-key="{{article.key|default:'C'}}">
</div>
<script src="https://music.inquiry.institute/widget/music-widget.js"></script>
```

## JavaScript API

### Create Sequence Helper

```javascript
// For LLMs generating JavaScript
const sequence = window.MusicWidget.createSequence(
  [
    { note: 'C/4', duration: 'q' },
    { note: 'D/4', duration: 'q' },
    { note: 'E/4', duration: 'q' }
  ],
  { clef: 'treble', key: 'C', time: '4/4' }
);

window.MusicWidget.render('container-id', sequence);
```

### Parse Notes

```javascript
// Parse from string
const notes = window.MusicWidget.parseNotes('C/4 D/4 E/4');
// Returns: [{note: 'C/4', duration: 'q'}, ...]
```

## Best Practices for LLMs

1. **Use simple format** when possible: `data-notes="C/4 D/4 E/4"`
2. **Include duration** for complex rhythms: `data-notes="C/4,q|D/4,8|E/4,q"`
3. **Specify clef** for bass lines: `data-clef="bass"`
4. **Use JSON** for full control: `data-notes='[{"note":"C/4","duration":"q"}]'`

## Examples

### C Major Scale
```html
<div data-music-widget data-notes="C/4 D/4 E/4 F/4 G/4 A/4 B/4 C/5"></div>
```

### C Major Chord
```html
<div data-music-widget data-notes="C/4 E/4 G/4"></div>
```

### Twinkle Twinkle Little Star
```html
<div data-music-widget 
     data-notes="C/4 C/4 G/4 G/4 A/4 A/4 G/4 F/4 F/4 E/4 E/4 D/4 D/4 C/4">
</div>
```

### With Different Durations
```html
<div data-music-widget 
     data-notes='[{"note":"C/4","duration":"h"},{"note":"E/4","duration":"q"},{"note":"G/4","duration":"q"}]'>
</div>
```
