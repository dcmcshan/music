# Music Room - Standalone Clone

This is a standalone copy of the Music Room components from Inquiry.Institute.

## Structure

```
music/
├── components/
│   └── music/
│       ├── musical-staff-editor.tsx    # Editable musical staff with VexFlow
│       ├── piano-keyboard.tsx          # Interactive piano keyboard
│       ├── musical-notation-message.tsx # Inline notation renderer
│       └── README.md                   # Component documentation
├── app/
│   └── music/
│       └── page.tsx                    # Main music room page
├── lib/
│   └── matrix/
│       └── musical-notation.ts        # Matrix integration helpers
├── 20260130115441_add_music_room.sql  # Database migration
└── README.md                           # This file
```

## Dependencies

Required npm packages:
- `vexflow` - Musical notation rendering
- `react` - React framework
- `next` - Next.js (if using the page component)
- `matrix-js-sdk` - Matrix client (for Matrix integration)

## Usage

### As Standalone Components

Import and use the components in your React/Next.js project:

```tsx
import { MusicalStaffEditor } from './components/music/musical-staff-editor'
import { PianoKeyboard } from './components/music/piano-keyboard'
import { MusicalNotationMessage } from './components/music/musical-notation-message'

// Use in your component
<MusicalStaffEditor
  sequence={mySequence}
  onChange={handleChange}
  onPlay={handlePlay}
/>
```

### With Matrix Integration

If you have a Matrix client instance:

```tsx
import { sendMusicalNotationToMatrix } from './lib/matrix/musical-notation'

await sendMusicalNotationToMatrix(matrixClient, roomId, musicalSequence)
```

## Features

- ✅ Editable musical staff (VexFlow)
- ✅ Interactive piano keyboard
- ✅ Inline musical notation in chat
- ✅ Matrix chat integration
- ✅ Keyboard shortcuts for piano
- ✅ Multiple clefs, key signatures, time signatures

## Original Location

Cloned from: `/Users/danielmcshan/GitHub/Inquiry.Institute`

## License

Part of Inquiry.Institute project.
