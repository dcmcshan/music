/**
 * Matrix integration helpers for sending and receiving musical notation
 */

import type { MusicalSequence } from '@/components/music/musical-staff-editor'
import { formatMusicalNotationForMessage, parseMusicalNotationFromMessage } from '@/components/music/musical-notation-message'

/**
 * Send a musical sequence to a Matrix room
 * Requires a Matrix client instance
 */
export async function sendMusicalNotationToMatrix(
  client: any, // Matrix client from matrix-js-sdk
  roomId: string,
  sequence: MusicalSequence
): Promise<string | null> {
  try {
    const messageContent = formatMusicalNotationForMessage(sequence)
    
    // Send as a regular message with custom content
    const response = await client.sendEvent(roomId, 'm.room.message', {
      msgtype: 'm.text',
      body: messageContent.body,
      format: messageContent.format,
      formatted_body: messageContent.formatted_body,
      // Add custom field for easier parsing
      'io.inquiry.musical_notation': messageContent['io.inquiry.musical_notation'],
    })

    return response.event_id
  } catch (error) {
    console.error('Error sending musical notation to Matrix:', error)
    return null
  }
}

/**
 * Check if a Matrix message contains musical notation
 */
export function messageContainsMusicalNotation(content: any): boolean {
  return parseMusicalNotationFromMessage(content) !== null
}

/**
 * Extract musical notation from a Matrix message
 */
export function extractMusicalNotationFromMessage(content: any): MusicalSequence | null {
  return parseMusicalNotationFromMessage(content)
}

/**
 * Create a Matrix message renderer that can display musical notation inline
 * This can be used with Element Web or custom Matrix clients
 */
export function createMusicalNotationRenderer() {
  return {
    /**
     * Check if message should be rendered with musical notation
     */
    shouldRender: (content: any) => messageContainsMusicalNotation(content),
    
    /**
     * Render musical notation from message content
     */
    render: (content: any) => {
      const sequence = extractMusicalNotationFromMessage(content)
      if (!sequence) return null
      
      // Return React component props or HTML string
      return {
        type: 'musical_notation',
        sequence,
      }
    },
  }
}
