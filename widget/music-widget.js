/**
 * Music Room Widget - Embeddable JavaScript Widget
 * Usage: <script src="https://music.inquiry.institute/widget/music-widget.js"></script>
 *        <div id="music-widget-container"></div>
 */

(function() {
  'use strict';

  // Widget configuration
  const WIDGET_VERSION = '1.0.0';
  const WIDGET_CDN_URL = 'https://music.inquiry.institute';
  
  // Load VexFlow from CDN
  function loadVexFlow() {
    return new Promise((resolve, reject) => {
      if (window.VexFlow) {
        resolve(window.VexFlow);
        return;
      }
      
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/vexflow@5.0.0/build/vexflow.min.js';
      script.onload = () => resolve(window.VexFlow);
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  // Load React from CDN
  function loadReact() {
    return new Promise((resolve, reject) => {
      if (window.React && window.ReactDOM) {
        resolve({ React: window.React, ReactDOM: window.ReactDOM });
        return;
      }
      
      const reactScript = document.createElement('script');
      reactScript.src = 'https://unpkg.com/react@18/umd/react.production.min.js';
      reactScript.crossOrigin = 'anonymous';
      
      const reactDOMScript = document.createElement('script');
      reactDOMScript.src = 'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js';
      reactDOMScript.crossOrigin = 'anonymous';
      
      reactDOMScript.onload = () => {
        if (window.React && window.ReactDOM) {
          resolve({ React: window.React, ReactDOM: window.ReactDOM });
        } else {
          reject(new Error('React failed to load'));
        }
      };
      
      reactScript.onerror = reject;
      reactDOMScript.onerror = reject;
      
      document.head.appendChild(reactScript);
      document.head.appendChild(reactDOMScript);
    });
  }

  // Widget component (simplified version)
  function createMusicWidget(React, VexFlow) {
    const { useState, useEffect, useRef } = React;

    function MusicalStaffEditor({ sequence, onChange, onPlay, height = 200, editable = true }) {
      const containerRef = useRef(null);
      const [currentSequence, setCurrentSequence] = useState(sequence || {
        clef: 'treble',
        key: 'C',
        time: '4/4',
        notes: [],
      });

      useEffect(() => {
        if (!containerRef.current || !VexFlow) return;
        
        containerRef.current.innerHTML = '';
        const { Renderer, Stave, StaveNote, Voice, Formatter } = VexFlow;
        
        const renderer = new Renderer(containerRef.current, {
          width: containerRef.current.clientWidth || 600,
          height: height,
        });
        const context = renderer.getContext();

        const stave = new Stave(10, 10, (containerRef.current.clientWidth || 600) - 20);
        stave.addClef(currentSequence.clef || 'treble');
        if (currentSequence.key && currentSequence.key !== 'C') {
          stave.addKeySignature(currentSequence.key);
        }
        if (currentSequence.time) {
          stave.addTimeSignature(currentSequence.time);
        }
        stave.setContext(context).draw();

        if (currentSequence.notes && currentSequence.notes.length > 0) {
          try {
            const notes = currentSequence.notes.map((n) => {
              return new StaveNote({
                clef: currentSequence.clef || 'treble',
                keys: [n.note],
                duration: n.duration,
              });
            });

            const voice = new Voice({ num_beats: 4, beat_value: 4 });
            voice.addTickables(notes);
            new Formatter().joinVoices([voice]).format([voice], (containerRef.current.clientWidth || 600) - 40);
            voice.draw(context, stave);
          } catch (error) {
            console.error('Error rendering notes:', error);
          }
        }
      }, [currentSequence, height, VexFlow]);

      return React.createElement('div', {
        ref: containerRef,
        style: { width: '100%', overflowX: 'auto' }
      });
    }

    function PianoKeyboard({ onNotePress, octave = 4, showLabels = true, disabled = false }) {
      const [pressedKeys, setPressedKeys] = useState(new Set());
      const whiteKeys = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
      
      const handleNotePress = (note, isSharp = false) => {
        if (disabled) return;
        const fullNote = isSharp ? `${note}#/${octave}` : `${note}/${octave}`;
        const key = `${note}${isSharp ? '#' : ''}`;
        setPressedKeys(prev => new Set(prev).add(key));
        onNotePress?.(fullNote, 'q');
        setTimeout(() => {
          setPressedKeys(prev => {
            const next = new Set(prev);
            next.delete(key);
            return next;
          });
        }, 150);
      };

      return React.createElement('div', {
        style: {
          width: '100%',
          background: '#f1f5f9',
          padding: '1rem',
          borderRadius: '0.5rem',
        }
      }, [
        React.createElement('div', {
          key: 'keys',
          style: {
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            height: '140px',
          }
        }, [
          ...whiteKeys.map((note, index) => {
            const key = note;
            const isPressed = pressedKeys.has(key);
            return React.createElement('button', {
              key: `white-${note}`,
              onClick: () => handleNotePress(note, false),
              disabled: disabled,
              style: {
                width: '40px',
                height: '128px',
                background: isPressed ? '#cbd5e1' : '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '0 0 4px 4px',
                cursor: disabled ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                paddingBottom: '8px',
                fontSize: '12px',
                fontWeight: '500',
                color: '#475569',
                transition: 'background 0.1s',
              },
              onMouseDown: () => handleNotePress(note, false),
            }, showLabels ? note : null);
          }),
        ]),
        showLabels && React.createElement('div', {
          key: 'hint',
          style: {
            marginTop: '8px',
            fontSize: '12px',
            textAlign: 'center',
            color: '#64748b',
          }
        }, 'Click keys to add notes'),
      ]);
    }

    function MusicWidget({ config = {} }) {
      const [sequence, setSequence] = useState({
        clef: config.clef || 'treble',
        key: config.key || 'C',
        time: config.time || '4/4',
        notes: config.notes || [],
      });
      const [isPlaying, setIsPlaying] = useState(false);

      const handleNotePress = (note, duration) => {
        setSequence(prev => ({
          ...prev,
          notes: [...prev.notes, { note, duration: duration || 'q' }],
        }));
      };

      const handlePlay = async () => {
        if (isPlaying || !sequence.notes || sequence.notes.length === 0) return;
        setIsPlaying(true);
        // Simple audio playback
        try {
          const audioContext = new (window.AudioContext || window.webkitAudioContext)();
          const noteFreqs = {
            'C': 261.63, 'C#': 277.18, 'D': 293.66, 'D#': 311.13,
            'E': 329.63, 'F': 349.23, 'F#': 369.99, 'G': 392.00,
            'G#': 415.30, 'A': 440.00, 'A#': 466.16, 'B': 493.88,
          };
          let currentTime = audioContext.currentTime + 0.1;
          for (const noteData of sequence.notes) {
            const match = noteData.note.match(/^([A-G][#]?)\/(\d+)$/);
            if (!match) continue;
            const [, note, octave] = match;
            const frequency = (noteFreqs[note] || 261.63) * Math.pow(2, parseInt(octave) - 4);
            const duration = (noteData.duration === 'q' ? 0.5 : 0.25) * 2;
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            osc.connect(gain);
            gain.connect(audioContext.destination);
            osc.frequency.value = frequency;
            osc.type = 'sine';
            gain.gain.setValueAtTime(0, currentTime);
            gain.gain.linearRampToValueAtTime(0.7, currentTime + 0.01);
            gain.gain.linearRampToValueAtTime(0, currentTime + duration);
            osc.start(currentTime);
            osc.stop(currentTime + duration);
            currentTime += duration + 0.05;
          }
          await new Promise(r => setTimeout(r, (currentTime - audioContext.currentTime) * 1000 + 100));
          audioContext.close();
        } catch (error) {
          console.error('Playback error:', error);
        } finally {
          setIsPlaying(false);
        }
      };

      return React.createElement('div', {
        style: {
          fontFamily: 'system-ui, -apple-system, sans-serif',
          maxWidth: '800px',
          margin: '0 auto',
          padding: '1rem',
        }
      }, [
        React.createElement('div', {
          key: 'header',
          style: { marginBottom: '1rem' }
        }, [
          React.createElement('h2', {
            key: 'title',
            style: { fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }
          }, 'Music Room'),
          React.createElement('p', {
            key: 'subtitle',
            style: { color: '#64748b' }
          }, 'Create and play musical notation'),
        ]),
        React.createElement('div', {
          key: 'editor',
          style: {
            background: 'white',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            padding: '1rem',
            marginBottom: '1rem',
          }
        }, [
          React.createElement(MusicalStaffEditor, {
            key: 'staff',
            sequence: sequence,
            onChange: setSequence,
            onPlay: handlePlay,
            height: 200,
            editable: true,
          }),
          React.createElement('div', {
            key: 'controls',
            style: { marginTop: '1rem', display: 'flex', gap: '0.5rem' }
          }, [
            React.createElement('button', {
              key: 'play',
              onClick: handlePlay,
              disabled: isPlaying || sequence.notes.length === 0,
              style: {
                padding: '0.5rem 1rem',
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                opacity: (isPlaying || sequence.notes.length === 0) ? 0.5 : 1,
              }
            }, isPlaying ? 'Playing...' : '▶ Play'),
            React.createElement('button', {
              key: 'clear',
              onClick: () => setSequence(prev => ({ ...prev, notes: [] })),
              style: {
                padding: '0.5rem 1rem',
                background: '#f1f5f9',
                color: '#475569',
                border: '1px solid #e2e8f0',
                borderRadius: '4px',
                cursor: 'pointer',
              }
            }, 'Clear'),
          ]),
        ]),
        React.createElement('div', {
          key: 'piano',
          style: {
            background: 'white',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            padding: '1rem',
          }
        }, [
          React.createElement(PianoKeyboard, {
            key: 'keyboard',
            onNotePress: handleNotePress,
            octave: 4,
            showLabels: true,
          }),
        ]),
      ]);
    }

    return MusicWidget;
  }

  // Parse notes from various formats
  function parseNotes(input) {
    if (!input) return null;
    
    // If it's already an array, return it
    if (Array.isArray(input)) {
      return input;
    }
    
    // If it's a string, try to parse it
    if (typeof input === 'string') {
      try {
        // Try JSON parse first
        const parsed = JSON.parse(input);
        if (Array.isArray(parsed)) {
          return parsed;
        }
        // If it's an object with notes property
        if (parsed.notes && Array.isArray(parsed.notes)) {
          return parsed.notes;
        }
      } catch (e) {
        // Not JSON, try comma-separated format: "C/4,q|D/4,q|E/4,q"
        if (input.includes('|')) {
          return input.split('|').map(noteStr => {
            const [note, duration = 'q'] = noteStr.split(',');
            return { note: note.trim(), duration: duration.trim() };
          });
        }
        // Try space-separated: "C/4 D/4 E/4"
        const notes = input.split(/\s+/).filter(n => n).map(note => ({
          note: note.trim(),
          duration: 'q' // default to quarter note
        }));
        if (notes.length > 0) return notes;
      }
    }
    
    return null;
  }

  // Parse configuration from container element
  function parseConfig(container) {
    const config = {};
    
    // Parse from data-config attribute (full JSON config)
    if (container.dataset.config) {
      try {
        const parsed = JSON.parse(container.dataset.config);
        Object.assign(config, parsed);
      } catch (e) {
        console.warn('Failed to parse data-config:', e);
      }
    }
    
    // Parse individual data attributes (for easier LLM usage)
    if (container.dataset.clef) config.clef = container.dataset.clef;
    if (container.dataset.key) config.key = container.dataset.key;
    if (container.dataset.time) config.time = container.dataset.time;
    
    // Parse notes from data-notes attribute (supports multiple formats)
    if (container.dataset.notes) {
      const notes = parseNotes(container.dataset.notes);
      if (notes) {
        config.notes = notes;
      }
    }
    
    // Parse from URL parameters (for easy sharing)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('notes')) {
      const notes = parseNotes(urlParams.get('notes'));
      if (notes) {
        config.notes = notes;
      }
    }
    if (urlParams.get('clef')) config.clef = urlParams.get('clef');
    if (urlParams.get('key')) config.key = urlParams.get('key');
    if (urlParams.get('time')) config.time = urlParams.get('time');
    
    return config;
  }

  // Initialize widget when DOM is ready
  function initWidget(containerId = null, customConfig = null) {
    const containers = containerId 
      ? [document.getElementById(containerId)].filter(Boolean)
      : document.querySelectorAll('[data-music-widget], #music-widget-container');
    
    if (containers.length === 0) {
      console.warn('Music widget: No container found. Add <div id="music-widget-container"></div> or <div data-music-widget></div>');
      return;
    }

    Promise.all([loadReact(), loadVexFlow()])
      .then(([{ React, ReactDOM }, VexFlow]) => {
        const MusicWidget = createMusicWidget(React, VexFlow);
        
        containers.forEach(container => {
          // Use custom config if provided, otherwise parse from element/URL
          const config = customConfig || parseConfig(container);
          const root = ReactDOM.createRoot(container);
          root.render(React.createElement(MusicWidget, { config }));
        });
      })
      .catch(error => {
        console.error('Failed to load music widget:', error);
        containers.forEach(container => {
          container.innerHTML = '<p style="color: red;">Failed to load music widget. Please check console for errors.</p>';
        });
      });
  }

  // Auto-initialize when script loads
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidget);
  } else {
    initWidget();
  }

  // Export for manual initialization and programmatic API
  window.MusicWidget = {
    init: initWidget,
    version: WIDGET_VERSION,
    
    // Programmatic API for LLMs and scripts
    render: function(containerId, config) {
      initWidget(containerId, config);
    },
    
    // Helper to create a musical sequence (for LLM use)
    createSequence: function(notes, options = {}) {
      return {
        clef: options.clef || 'treble',
        key: options.key || 'C',
        time: options.time || '4/4',
        notes: Array.isArray(notes) ? notes : parseNotes(notes) || [],
      };
    },
    
    // Parse notes from various formats
    parseNotes: parseNotes,
  };
})();
