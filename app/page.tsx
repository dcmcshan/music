'use client'

import { useState } from 'react'
import { ElementWeb } from '@/components/element-web'
import { MusicalStaffEditor, type MusicalSequence } from '@/components/music/musical-staff-editor'
import { PianoKeyboard } from '@/components/music/piano-keyboard'
import { MusicalNotationMessage, formatMusicalNotationForMessage } from '@/components/music/musical-notation-message'

export default function MusicRoomPage() {
  const [currentSequence, setCurrentSequence] = useState<MusicalSequence>({
    clef: 'treble',
    key: 'C',
    time: '4/4',
    notes: [],
  })
  const [showEditor, setShowEditor] = useState(true)

  // Get Matrix room alias for music room
  // This should match the room created in Matrix
  const roomAlias = '#music:matrix.inquiry.institute'

  const handleNotePress = (note: string, duration?: string) => {
    const newSequence = {
      ...currentSequence,
      notes: [...currentSequence.notes, { note, duration: duration || 'q' }],
    }
    setCurrentSequence(newSequence)
  }

  const handlePlay = (sequence: MusicalSequence) => {
    // TODO: Implement audio playback using Web Audio API or Tone.js
    console.log('Playing sequence:', sequence)
    // For now, just log it
    alert('Audio playback coming soon!')
  }

  const handleSendToChat = () => {
    if (currentSequence.notes.length === 0) {
      alert('Add some notes first!')
      return
    }

    // Format the sequence for Matrix
    const messageContent = formatMusicalNotationForMessage(currentSequence)
    console.log('Message content to send:', messageContent)

    // TODO: Integrate with Matrix SDK to send message
    // For now, show instructions
    alert(
      'To send musical notation to the chat:\n\n' +
      '1. Copy the JSON below\n' +
      '2. Paste it in the Matrix chat\n' +
      '3. The notation will render automatically\n\n' +
      JSON.stringify(currentSequence, null, 2)
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          Music Room
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Discuss music with editable musical notation and piano keyboard input
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Left column: Musical tools */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Musical Staff Editor
              </h2>
              <button
                onClick={() => setShowEditor(!showEditor)}
                className="px-3 py-1 text-sm bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded hover:bg-slate-200 dark:hover:bg-slate-700"
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
                    className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded hover:bg-slate-200 dark:hover:bg-slate-700"
                  >
                    Clear
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Preview of current sequence */}
          {currentSequence.notes.length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Preview
              </h3>
              <MusicalNotationMessage sequence={currentSequence} compact={true} />
            </div>
          )}
        </div>

        {/* Right column: Matrix chat */}
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              Matrix Chat
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Musical notation will render inline in messages
            </p>
          </div>
          <div className="h-[calc(100vh-300px)] min-h-[600px]">
            <ElementWeb
              roomAlias={roomAlias}
              height="100%"
              className="h-full"
            />
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
          How to use:
        </h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-blue-800 dark:text-blue-200">
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
