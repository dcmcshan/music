# Music Room Components

Components for the Music Room Matrix chat with editable musical notation and piano keyboard input.

## Components

### `MusicalStaffEditor`
Editable musical staff using VexFlow. Supports:
- Multiple clefs (treble, bass, alto, tenor)
- Key signatures
- Time signatures
- Adding/removing notes
- Playback (coming soon)

### `PianoKeyboard`
Interactive piano keyboard component:
- Click keys to add notes
- Keyboard shortcuts: A S D F G H J (white keys), W E T Y U (black keys)
- Visual feedback on key press

### `MusicalNotationMessage`
Renders musical notation inline in chat messages. Automatically detects and renders musical sequences from Matrix messages.

## Musical Notation Format

Musical sequences are stored as JSON:

```json
{
  "clef": "treble",
  "key": "C",
  "time": "4/4",
  "notes": [
    { "note": "C/4", "duration": "q" },
    { "note": "D/4", "duration": "q" },
    { "note": "E/4", "duration": "q" },
    { "note": "F/4", "duration": "q" }
  ]
}
```

### Note Format
- **note**: VexFlow note format (e.g., `"C/4"` = middle C, `"D/4"` = D above middle C)
- **duration**: Note duration (`"q"` = quarter, `"8"` = eighth, `"h"` = half, `"w"` = whole)

### Matrix Message Format

When sent to Matrix, musical notation is embedded in the message:

```json
{
  "msgtype": "m.text",
  "body": "🎵 Musical notation\n```musical\n{...JSON...}\n```",
  "format": "org.matrix.custom.html",
  "formatted_body": "<p>🎵 Musical notation</p><pre><code class=\"language-musical\">{...JSON...}</code></pre>",
  "io.inquiry.musical_notation": { ...sequence... }
}
```

## Matrix Room Setup

To create the music room in Matrix:

1. **Create the room** (via Element or Matrix admin):
   ```
   Room alias: #music:matrix.inquiry.institute
   Room name: Music · Musical Notation & Discussion
   ```

2. **Make it public** (optional) or invite users

3. **The room will appear** in the Music Room page at `/music`

## Usage

1. Visit `/music` page
2. Use the piano keyboard or click keys to add notes
3. Adjust clef, key signature, and time signature
4. Click "Send to Chat" to share in Matrix
5. Musical notation renders inline in messages

## Future Enhancements

- [ ] Audio playback using Web Audio API or Tone.js
- [ ] MIDI file export
- [ ] ABC notation support
- [ ] Collaborative editing
- [ ] Music theory analysis
- [ ] Chord recognition
- [ ] Scale suggestions
