import { useEffect, useRef, useState } from 'react'
import * as VexFlow from 'vexflow'

export interface MusicalNote {
  note: string // e.g., "C/4", "D/4", "E/4"
  duration: string // e.g., "q" (quarter), "8" (eighth), "h" (half)
}

export interface MusicalSequence {
  clef?: 'treble' | 'bass' | 'alto' | 'tenor'
  key?: string // e.g., "C", "G", "F"
  time?: string // e.g., "4/4", "3/4", "2/4"
  notes: MusicalNote[]
}

interface MusicalStaffEditorProps {
  sequence?: MusicalSequence
  onChange?: (sequence: MusicalSequence) => void
  onPlay?: (sequence: MusicalSequence) => void
  height?: number
  editable?: boolean
}

export function MusicalStaffEditor({
  sequence,
  onChange,
  onPlay,
  height = 200,
  editable = true,
}: MusicalStaffEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const rendererRef = useRef<any>(null)
  const [currentSequence, setCurrentSequence] = useState<MusicalSequence>(
    sequence || {
      clef: 'treble',
      key: 'C',
      time: '4/4',
      notes: [],
    }
  )

  useEffect(() => {
    if (sequence) {
      setCurrentSequence(sequence)
    }
  }, [sequence])

  useEffect(() => {
    if (!containerRef.current) return

    // Clear previous renderer
    if (rendererRef.current) {
      containerRef.current.innerHTML = ''
    }

    // Create new renderer
    const { Renderer, Stave, StaveNote, Voice, Formatter } = VexFlow

    const renderer = new Renderer(containerRef.current, Renderer.Backends.SVG)
    renderer.resize(containerRef.current.clientWidth || 600, height)
    const context = renderer.getContext()
    rendererRef.current = renderer

    // Create stave
    const stave = new Stave(10, 10, (containerRef.current.clientWidth || 600) - 20)
    stave.addClef(currentSequence.clef || 'treble')
    if (currentSequence.key && currentSequence.key !== 'C') {
      stave.addKeySignature(currentSequence.key)
    }
    if (currentSequence.time) {
      stave.addTimeSignature(currentSequence.time)
    }
    stave.setContext(context).draw()

    // Add notes if any
    if (currentSequence.notes.length > 0) {
      try {
        const notes = currentSequence.notes.map((n) => {
          const staveNote = new StaveNote({
            clef: currentSequence.clef || 'treble',
            keys: [n.note],
            duration: n.duration,
          })
          return staveNote
        })

        const voice = new Voice({ num_beats: 4, beat_value: 4 })
        voice.addTickables(notes)

        new Formatter().joinVoices([voice]).format([voice], (containerRef.current.clientWidth || 600) - 40)

        voice.draw(context, stave)
      } catch (error) {
        console.error('Error rendering notes:', error)
        // Draw empty stave message
        context.setFont('Arial', 12)
        context.fillText('Invalid notation', 50, height / 2)
      }
    } else {
      // Draw placeholder
      context.setFont('Arial', 12)
      context.fillStyle = '#999'
      context.fillText('Click piano keys or add notes to create music', 50, height / 2)
    }
  }, [currentSequence, height])

  const addNote = (note: string, duration: string = 'q') => {
    const newSequence = {
      ...currentSequence,
      notes: [...currentSequence.notes, { note, duration }],
    }
    setCurrentSequence(newSequence)
    onChange?.(newSequence)
  }

  const clearNotes = () => {
    const newSequence = {
      ...currentSequence,
      notes: [],
    }
    setCurrentSequence(newSequence)
    onChange?.(newSequence)
  }

  const removeLastNote = () => {
    if (currentSequence.notes.length > 0) {
      const newSequence = {
        ...currentSequence,
        notes: currentSequence.notes.slice(0, -1),
      }
      setCurrentSequence(newSequence)
      onChange?.(newSequence)
    }
  }

  return (
    <div className="w-full border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex gap-2">
          <select
            value={currentSequence.clef || 'treble'}
            onChange={(e) => {
              const newSequence = { ...currentSequence, clef: e.target.value as any }
              setCurrentSequence(newSequence)
              onChange?.(newSequence)
            }}
            disabled={!editable}
            className="text-sm border border-slate-300 dark:border-slate-600 rounded px-2 py-1 bg-white dark:bg-slate-800"
          >
            <option value="treble">Treble</option>
            <option value="bass">Bass</option>
            <option value="alto">Alto</option>
            <option value="tenor">Tenor</option>
          </select>
          <select
            value={currentSequence.key || 'C'}
            onChange={(e) => {
              const newSequence = { ...currentSequence, key: e.target.value }
              setCurrentSequence(newSequence)
              onChange?.(newSequence)
            }}
            disabled={!editable}
            className="text-sm border border-slate-300 dark:border-slate-600 rounded px-2 py-1 bg-white dark:bg-slate-800"
          >
            <option value="C">C</option>
            <option value="G">G</option>
            <option value="D">D</option>
            <option value="A">A</option>
            <option value="E">E</option>
            <option value="B">B</option>
            <option value="F#">F#</option>
            <option value="C#">C#</option>
            <option value="F">F</option>
            <option value="Bb">Bb</option>
            <option value="Eb">Eb</option>
            <option value="Ab">Ab</option>
            <option value="Db">Db</option>
            <option value="Gb">Gb</option>
          </select>
          <select
            value={currentSequence.time || '4/4'}
            onChange={(e) => {
              const newSequence = { ...currentSequence, time: e.target.value }
              setCurrentSequence(newSequence)
              onChange?.(newSequence)
            }}
            disabled={!editable}
            className="text-sm border border-slate-300 dark:border-slate-600 rounded px-2 py-1 bg-white dark:bg-slate-800"
          >
            <option value="4/4">4/4</option>
            <option value="3/4">3/4</option>
            <option value="2/4">2/4</option>
            <option value="6/8">6/8</option>
            <option value="2/2">2/2</option>
          </select>
        </div>
        {editable && (
          <div className="flex gap-2">
            <button
              onClick={removeLastNote}
              disabled={currentSequence.notes.length === 0}
              className="px-3 py-1 text-sm bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50"
            >
              Undo
            </button>
            <button
              onClick={clearNotes}
              disabled={currentSequence.notes.length === 0}
              className="px-3 py-1 text-sm bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50"
            >
              Clear
            </button>
            {onPlay && (
              <button
                onClick={() => onPlay(currentSequence)}
                disabled={currentSequence.notes.length === 0}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                ▶ Play
              </button>
            )}
          </div>
        )}
      </div>
      <div ref={containerRef} className="w-full overflow-x-auto" />
      {editable && (
        <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          Click piano keys below to add notes
        </div>
      )}
    </div>
  )
}

// Export helper to add notes from piano
export function useMusicalStaffEditor() {
  return {
    addNote: (note: string, duration: string = 'q') => {
      // This will be used by the piano component
    },
  }
}
