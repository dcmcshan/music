'use client'

import { useState, useCallback, useEffect } from 'react'
import type { MusicalNote } from './musical-staff-editor'

interface PianoKeyboardProps {
  onNotePress?: (note: string, duration?: string) => void
  octave?: number // Default octave (4 = middle C)
  showLabels?: boolean
  disabled?: boolean
}

const WHITE_KEYS = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
const BLACK_KEYS = ['C#', 'D#', '', 'F#', 'G#', 'A#', '']

// Map keyboard keys to notes
const KEYBOARD_MAP: Record<string, string> = {
  'a': 'C',
  'w': 'C#',
  's': 'D',
  'e': 'D#',
  'd': 'E',
  'f': 'F',
  't': 'F#',
  'g': 'G',
  'y': 'G#',
  'h': 'A',
  'u': 'A#',
  'j': 'B',
}

export function PianoKeyboard({
  onNotePress,
  octave = 4,
  showLabels = true,
  disabled = false,
}: PianoKeyboardProps) {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set())

  const handleNotePress = useCallback(
    (note: string, isSharp: boolean = false) => {
      if (disabled) return

      const fullNote = isSharp ? `${note}#/${octave}` : `${note}/${octave}`
      const key = `${note}${isSharp ? '#' : ''}`
      setPressedKeys((prev) => new Set(prev).add(key))

      onNotePress?.(fullNote, 'q') // Default to quarter note

      // Release after a short delay for visual feedback
      setTimeout(() => {
        setPressedKeys((prev) => {
          const next = new Set(prev)
          next.delete(key)
          return next
        })
      }, 150)
    },
    [onNotePress, octave, disabled]
  )

  // Handle computer keyboard input
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (disabled) return
      const note = KEYBOARD_MAP[e.key.toLowerCase()]
      if (note && !pressedKeys.has(note)) {
        const isSharp = e.key.toLowerCase() === 'w' || e.key.toLowerCase() === 'e' || 
                       e.key.toLowerCase() === 't' || e.key.toLowerCase() === 'y' || 
                       e.key.toLowerCase() === 'u'
        handleNotePress(note, isSharp)
      }
    },
    [handleNotePress, pressedKeys, disabled]
  )

  // Set up keyboard listeners
  useEffect(() => {
    if (typeof window === 'undefined') return
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const renderKey = (note: string, index: number, isBlack: boolean = false) => {
    const key = isBlack ? `${note}#` : note
    const isPressed = pressedKeys.has(key)
    const hasBlackKey = BLACK_KEYS[index] !== ''

    if (isBlack) {
      if (!hasBlackKey) return null
      return (
        <button
          key={`black-${note}-${index}`}
          onClick={() => handleNotePress(note, true)}
          disabled={disabled}
          className={`
            absolute w-8 h-24 bg-slate-800 dark:bg-slate-700 rounded-b
            hover:bg-slate-700 dark:hover:bg-slate-600
            active:bg-slate-900 dark:active:bg-slate-800
            transition-colors z-10
            ${isPressed ? 'bg-slate-900 dark:bg-slate-900' : ''}
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
          style={{
            left: `${(index * 40) + 28}px`,
          }}
          aria-label={`${note} sharp`}
        />
      )
    }

    return (
      <button
        key={`white-${note}-${index}`}
        onClick={() => handleNotePress(note, false)}
        disabled={disabled}
        className={`
          w-10 h-32 bg-white dark:bg-slate-100 border border-slate-300 dark:border-slate-400 rounded-b
          hover:bg-slate-50 dark:hover:bg-slate-200
          active:bg-slate-200 dark:active:bg-slate-300
          transition-colors
          ${isPressed ? 'bg-slate-200 dark:bg-slate-300' : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          flex items-end justify-center pb-2
        `}
        aria-label={note}
      >
        {showLabels && (
          <span className="text-xs text-slate-600 dark:text-slate-700 font-medium">{note}</span>
        )}
      </button>
    )
  }

  return (
    <div className="w-full bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
      <div className="relative flex justify-center" style={{ height: '140px' }}>
        {/* White keys */}
        <div className="flex relative">
          {WHITE_KEYS.map((note, index) => renderKey(note, index, false))}
        </div>
        {/* Black keys */}
        <div className="absolute top-0 flex">
          {BLACK_KEYS.map((note, index) => {
            if (!note) return null
            return renderKey(note.replace('#', ''), index, true)
          })}
        </div>
      </div>
      {showLabels && (
        <div className="mt-2 text-xs text-center text-slate-600 dark:text-slate-400">
          Use keyboard: A S D F G H J (white keys) or W E T Y U (black keys)
        </div>
      )}
    </div>
  )
}
