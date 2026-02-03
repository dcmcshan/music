import { useEffect, useRef } from 'react'
import * as VexFlow from 'vexflow'
import type { MusicalSequence } from './musical-staff-editor'

interface MusicalNotationMessageProps {
  sequence: MusicalSequence
  compact?: boolean
}

/**
 * Component to render musical notation inline in chat messages
 * This is used to display musical sequences sent in Matrix messages
 */
export function MusicalNotationMessage({ sequence, compact = false }: MusicalNotationMessageProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || !sequence.notes || sequence.notes.length === 0) return

    // Check if VexFlow is available
    if (typeof window === 'undefined' || !VexFlow) {
      console.error('VexFlow not available')
      return
    }

    // Clear previous renderer
    containerRef.current.innerHTML = ''

    try {
      const { Renderer, Stave, StaveNote, Voice, Formatter } = VexFlow

    const width = compact ? 300 : 500
    const height = compact ? 120 : 150

    const renderer = new Renderer(containerRef.current, Renderer.Backends.SVG)
    renderer.resize(width, height)
    const context = renderer.getContext()

    // Create stave
    const stave = new Stave(10, 10, width - 20)
    stave.addClef(sequence.clef || 'treble')
    if (sequence.key && sequence.key !== 'C') {
      stave.addKeySignature(sequence.key)
    }
    if (sequence.time) {
      stave.addTimeSignature(sequence.time)
    }
    stave.setContext(context).draw()

    // Add notes
    try {
      const notes = sequence.notes.map((n) => {
        const staveNote = new StaveNote({
          clef: sequence.clef || 'treble',
          keys: [n.note],
          duration: n.duration,
        })
        return staveNote
      })

      const voice = new Voice({ num_beats: 4, beat_value: 4 })
      voice.addTickables(notes)

      new Formatter().joinVoices([voice]).format([voice], width - 40)

      voice.draw(context, stave)
    } catch (error) {
      console.error('Error rendering musical notation:', error)
      if (context) {
        context.setFont('Arial', 12)
        context.fillStyle = '#999'
        context.fillText('Unable to render notation', 50, height / 2)
      }
    }
    } catch (error) {
      console.error('Error initializing VexFlow renderer:', error)
      if (containerRef.current) {
        containerRef.current.innerHTML = '<p class="text-slate-500 text-sm">Unable to render musical notation</p>'
      }
    }
  }, [sequence, compact])

  if (!sequence.notes || sequence.notes.length === 0) {
    return null
  }

  return (
    <div className="my-2 p-2 bg-slate-50 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
      <div ref={containerRef} className="w-full" />
    </div>
  )
}

/**
 * Helper function to parse musical notation from Matrix message content
 * Format: JSON string in message body or custom event type
 */
export function parseMusicalNotationFromMessage(content: any): MusicalSequence | null {
  try {
    // Try to parse from custom format
    if (content['io.inquiry.musical_notation']) {
      return content['io.inquiry.musical_notation'] as MusicalSequence
    }

    // Try to parse from message body (if it's JSON)
    if (typeof content.body === 'string') {
      const match = content.body.match(/```musical\n([\s\S]*?)\n```/)
      if (match) {
        return JSON.parse(match[1]) as MusicalSequence
      }

      // Try parsing entire body as JSON
      try {
        const parsed = JSON.parse(content.body)
        if (parsed.notes && Array.isArray(parsed.notes)) {
          return parsed as MusicalSequence
        }
      } catch {
        // Not JSON, continue
      }
    }

    return null
  } catch (error) {
    console.error('Error parsing musical notation:', error)
    return null
  }
}

/**
 * Helper function to format musical notation for Matrix message
 */
export function formatMusicalNotationForMessage(sequence: MusicalSequence): {
  body: string
  format?: string
  formatted_body?: string
  'io.inquiry.musical_notation'?: MusicalSequence
} {
  return {
    body: `🎵 Musical notation\n\`\`\`musical\n${JSON.stringify(sequence, null, 2)}\n\`\`\``,
    format: 'org.matrix.custom.html',
    formatted_body: `<p>🎵 Musical notation</p><pre><code class="language-musical">${JSON.stringify(sequence, null, 2)}</code></pre>`,
    'io.inquiry.musical_notation': sequence,
  }
}
