import { useState } from 'react'
import { MusicalStaffEditor, type MusicalSequence } from './components/musical-staff-editor'
import { PianoKeyboard } from './components/piano-keyboard'
import { MusicalNotationMessage, formatMusicalNotationForMessage } from './components/musical-notation-message'

export default function App() {
  const [currentSequence, setCurrentSequence] = useState<MusicalSequence>({
    clef: 'treble',
    key: 'C',
    time: '4/4',
    notes: [],
  })
  const [showEditor, setShowEditor] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)

  // Matrix room alias
  const roomAlias = '#music:matrix.inquiry.institute'
  const elementUrl = `https://element.inquiry.institute/#/room/${encodeURIComponent(roomAlias)}`

  const handleNotePress = (note: string, duration?: string) => {
    const newSequence = {
      ...currentSequence,
      notes: [...currentSequence.notes, { note, duration: duration || 'q' }],
    }
    setCurrentSequence(newSequence)
  }

  const handlePlay = async (sequence: MusicalSequence) => {
    if (isPlaying || !sequence.notes || sequence.notes.length === 0) return
    
    setIsPlaying(true)
    try {
      // Simple audio playback using Web Audio API
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const tempo = 120
      const beatDuration = 60 / tempo
      
      const noteFreqs: Record<string, number> = {
        'C': 261.63, 'C#': 277.18, 'D': 293.66, 'D#': 311.13,
        'E': 329.63, 'F': 349.23, 'F#': 369.99, 'G': 392.00,
        'G#': 415.30, 'A': 440.00, 'A#': 466.16, 'B': 493.88,
      }
      
      let currentTime = audioContext.currentTime + 0.1
      
      for (const noteData of sequence.notes) {
        const match = noteData.note.match(/^([A-G][#]?)\/(\d+)$/)
        if (!match) continue
        
        const [, note, octave] = match
        const baseFreq = noteFreqs[note] || 261.63
        const frequency = baseFreq * Math.pow(2, parseInt(octave) - 4)
        const duration = (noteData.duration === 'q' ? 0.5 : noteData.duration === 'h' ? 1.0 : 0.25) * beatDuration * 4
        
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()
        
        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)
        
        oscillator.frequency.value = frequency
        oscillator.type = 'sine'
        
        gainNode.gain.setValueAtTime(0, currentTime)
        gainNode.gain.linearRampToValueAtTime(0.7, currentTime + 0.01)
        gainNode.gain.setValueAtTime(0.7, currentTime + duration - 0.1)
        gainNode.gain.linearRampToValueAtTime(0, currentTime + duration)
        
        oscillator.start(currentTime)
        oscillator.stop(currentTime + duration)
        
        currentTime += duration + 0.05
      }
      
      await new Promise(resolve => setTimeout(resolve, (currentTime - audioContext.currentTime) * 1000 + 100))
      audioContext.close()
    } catch (error) {
      console.error('Error playing audio:', error)
      alert('Audio playback failed. Please check browser console.')
    } finally {
      setIsPlaying(false)
    }
  }

  const handleSendToChat = () => {
    if (currentSequence.notes.length === 0) {
      alert('Add some notes first!')
      return
    }

    const messageContent = formatMusicalNotationForMessage(currentSequence)
    const formattedMessage = `🎵 Musical notation\n\n\`\`\`json\n${JSON.stringify(currentSequence, null, 2)}\n\`\`\`\n\n_Paste this in the Matrix chat - the notation will render automatically._`
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(formattedMessage).then(() => {
        alert('Musical notation copied to clipboard! Paste it in the Matrix chat.')
      }).catch(() => {
        alert('Musical notation:\n\n' + formattedMessage)
      })
    } else {
      alert('Musical notation:\n\n' + formattedMessage)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Music Room
        </h1>
        <p className="text-slate-600">
          Discuss music with editable musical notation and piano keyboard input
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="space-y-4">
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-900">
                Musical Staff Editor
              </h2>
              <button
                onClick={() => setShowEditor(!showEditor)}
                className="px-3 py-1 text-sm bg-slate-100 text-slate-700 rounded hover:bg-slate-200"
              >
                {showEditor ? 'Hide' : 'Show'}
              </button>
            </div>

            {showEditor && (
              <>
                <MusicalStaffEditor
                  sequence={currentSequence}
                  onChange={setCurrentSequence}
                  onPlay={handlePlay}
                  height={200}
                  editable={true}
                />

                {isPlaying && (
                  <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800 flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    Playing...
                  </div>
                )}

                <div className="mt-4">
                  <PianoKeyboard
                    onNotePress={handleNotePress}
                    octave={4}
                    showLabels={true}
                  />
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={handleSendToChat}
                    disabled={currentSequence.notes.length === 0}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Send to Chat
                  </button>
                  <button
                    onClick={() => {
                      setCurrentSequence({
                        clef: 'treble',
                        key: 'C',
                        time: '4/4',
                        notes: [],
                      })
                    }}
                    className="px-4 py-2 bg-slate-100 text-slate-700 rounded hover:bg-slate-200"
                  >
                    Clear
                  </button>
                </div>
              </>
            )}
          </div>

          {currentSequence.notes.length > 0 && (
            <div className="bg-white rounded-lg border border-slate-200 p-4">
              <h3 className="text-sm font-semibold text-slate-700 mb-2">
                Preview
              </h3>
              <MusicalNotationMessage sequence={currentSequence} compact={true} />
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900">
              Matrix Chat
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Musical notation will render inline in messages
            </p>
          </div>
          <div className="h-[600px] min-h-[600px]">
            <iframe
              src={elementUrl}
              className="w-full h-full border-0"
              allow="camera; microphone; fullscreen; autoplay"
              title="Element Web - Matrix Chat"
            />
          </div>
        </div>
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">
          How to use:
        </h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-blue-800">
          <li>Click piano keys or use your computer keyboard (A S D F G H J) to add notes</li>
          <li>Adjust clef, key signature, and time signature as needed</li>
          <li>Click "Send to Chat" to share your musical notation in the Matrix room</li>
          <li>Musical notation will render inline in chat messages</li>
          <li>Use the chat to discuss music theory, compositions, and collaborate</li>
        </ul>
      </div>
    </div>
  )
}
