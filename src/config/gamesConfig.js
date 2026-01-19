export const gameCategories = {
  FOCUS: 'Focus & Productivity',
  REFLEX: 'Reflex & Speed',
  LOGIC: 'Logic & Thinking',
  ARCADE: 'Arcade & Visual',
  CALM: 'Calm & Relax',
  CLASSIC: 'Classic Board Games'
}

const addMetadata = (game, featured = false, popular = false, tags = [], underImprovement = false) => ({
  ...game,
  featured,
  popular,
  underImprovement,
  tags: tags.length > 0 ? tags : [game.stressType.toLowerCase(), ...game.categories.map(c => c.toLowerCase().split(' ')[0])]
})

export const games = [
  addMetadata({
    id: 'focus-grid',
    title: 'Focus Grid',
    route: '/focus-grid',
    duration: '2 min break',
    categories: [gameCategories.FOCUS, gameCategories.LOGIC],
    icon: '⚡',
    stressType: 'Focus'
  }, true, true, ['focus', 'quick', 'visual']),
  addMetadata({
    id: 'memory-refresh',
    title: 'Memory Refresh',
    route: '/memory-refresh',
    duration: '3 min break',
    categories: [gameCategories.FOCUS, gameCategories.LOGIC],
    icon: '🧠',
    stressType: 'Logic'
  }, false, true, ['memory', 'logic', 'focus']),
  addMetadata({
    id: 'quick-decision',
    title: 'Quick Decision',
    route: '/quick-decision',
    duration: '2 min break',
    categories: [gameCategories.REFLEX, gameCategories.LOGIC],
    icon: '✋',
    stressType: 'Fun'
  }, true, false, ['fast', 'decision', 'fun']),
  addMetadata({
    id: 'guess-smart',
    title: 'Guess Smart',
    route: '/guess-smart',
    duration: '3 min break',
    categories: [gameCategories.LOGIC],
    icon: '🎯',
    stressType: 'Logic'
  }, false, false, ['logic', 'thinking']),
  addMetadata({
    id: 'reflex-test',
    title: 'Reflex Test',
    route: '/reflex-test',
    duration: '2 min break',
    categories: [gameCategories.REFLEX],
    icon: '⚡',
    stressType: 'Reflex'
  }, true, true, ['reflex', 'fast', 'quick']),
  addMetadata({
    id: 'word-sprint',
    title: 'Word Sprint',
    route: '/word-sprint',
    duration: '2 min break',
    categories: [gameCategories.FOCUS],
    icon: '⌨️',
    stressType: 'Focus'
  }, false, false, ['word', 'typing', 'focus']),
  addMetadata({
    id: 'color-focus',
    title: 'Color Focus',
    route: '/color-focus',
    duration: '3 min break',
    categories: [gameCategories.FOCUS],
    icon: '🎨',
    stressType: 'Focus'
  }, false, false, ['color', 'visual', 'focus']),
  addMetadata({
    id: 'quick-math',
    title: 'Quick Math',
    route: '/quick-math',
    duration: '3 min break',
    categories: [gameCategories.LOGIC],
    icon: '🔢',
    stressType: 'Logic'
  }, false, true, ['math', 'numbers', 'logic']),
  addMetadata({
    id: 'pattern-recall',
    title: 'Pattern Recall',
    route: '/pattern-recall',
    duration: '3 min break',
    categories: [gameCategories.FOCUS, gameCategories.LOGIC],
    icon: '🔲',
    stressType: 'Logic'
  }, false, false, ['pattern', 'memory', 'logic']),
  addMetadata({
    id: 'yes-no-trap',
    title: 'Yes / No Trap',
    route: '/yes-no-trap',
    duration: '2 min break',
    categories: [gameCategories.LOGIC],
    icon: '❓',
    stressType: 'Logic'
  }, false, false, ['logic', 'trick', 'thinking']),
  addMetadata({
    id: 'desk-racer',
    title: 'Desk Racer',
    route: '/desk-racer',
    duration: '2 min break',
    categories: [gameCategories.REFLEX, gameCategories.ARCADE],
    icon: '🏎️',
    stressType: 'Reflex'
  }, true, true, ['racing', 'arcade', 'fast', 'visual']),
  addMetadata({
    id: 'lane-switch',
    title: 'Lane Switch',
    route: '/lane-switch',
    duration: '2 min break',
    categories: [gameCategories.REFLEX, gameCategories.ARCADE],
    icon: '🚗',
    stressType: 'Focus'
  }, false, false, ['racing', 'arcade', 'reflex']),
  addMetadata({
    id: 'speed-click-rally',
    title: 'Speed Click Rally',
    route: '/speed-click-rally',
    duration: '2 min break',
    categories: [gameCategories.REFLEX],
    icon: '🏁',
    stressType: 'Reflex'
  }, false, false, ['clicking', 'fast', 'reflex']),
  addMetadata({
    id: 'traffic-signal-reflex',
    title: 'Traffic Signal Reflex',
    route: '/traffic-signal-reflex',
    duration: '2 min break',
    categories: [gameCategories.REFLEX],
    icon: '🚦',
    stressType: 'Reflex'
  }, false, false, ['reflex', 'reaction', 'fast']),
  addMetadata({
    id: 'cursor-drift',
    title: 'Cursor Drift',
    route: '/cursor-drift',
    duration: '2 min break',
    categories: [gameCategories.REFLEX, gameCategories.ARCADE],
    icon: '🖱️',
    stressType: 'Control'
  }, false, false, ['mouse', 'control', 'arcade']),
  addMetadata({
    id: 'breath-sync',
    title: 'Breath Sync',
    route: '/breath-sync',
    duration: '2 min break',
    categories: [gameCategories.CALM],
    icon: '🧘',
    stressType: 'Focus'
  }, true, false, ['relax', 'calm', 'zen', 'breathing']),
  addMetadata({
    id: 'zen-click',
    title: 'Zen Click',
    route: '/zen-click',
    duration: '2 min break',
    categories: [gameCategories.CALM],
    icon: '🫧',
    stressType: 'Focus'
  }, false, false, ['zen', 'calm', 'relax']),
  addMetadata({
    id: 'odd-one-out',
    title: 'Odd One Out',
    route: '/odd-one-out',
    duration: '2 min break',
    categories: [gameCategories.LOGIC],
    icon: '🔍',
    stressType: 'Logic'
  }, false, false, ['logic', 'pattern', 'find']),
  addMetadata({
    id: 'sequence-builder',
    title: 'Sequence Builder',
    route: '/sequence-builder',
    duration: '3 min break',
    categories: [gameCategories.LOGIC],
    icon: '🔢',
    stressType: 'Logic'
  }, false, false, ['sequence', 'logic', 'numbers']),
  addMetadata({
    id: 'grid-sum',
    title: 'Grid Sum',
    route: '/grid-sum',
    duration: '2 min break',
    categories: [gameCategories.LOGIC],
    icon: '➕',
    stressType: 'Logic'
  }, false, false, ['math', 'grid', 'logic']),
  addMetadata({
    id: 'spot-the-change',
    title: 'Spot The Change',
    route: '/spot-the-change',
    duration: '3 min break',
    categories: [gameCategories.FOCUS],
    icon: '👁️',
    stressType: 'Focus'
  }, false, false, ['visual', 'find', 'focus']),
  addMetadata({
    id: 'flash-count',
    title: 'Flash Count',
    route: '/flash-count',
    duration: '2 min break',
    categories: [gameCategories.FOCUS],
    icon: '⚡',
    stressType: 'Focus'
  }, false, false, ['counting', 'focus', 'quick']),
  addMetadata({
    id: 'emoji-mood-match',
    title: 'Emoji Mood Match',
    route: '/emoji-mood-match',
    duration: '2 min break',
    categories: [gameCategories.LOGIC],
    icon: '😊',
    stressType: 'Fun'
  }, false, false, ['emoji', 'match', 'fun']),
  addMetadata({
    id: 'one-line-story',
    title: 'One-Line Story',
    route: '/one-line-story',
    duration: '2 min break',
    categories: [gameCategories.CALM],
    icon: '📖',
    stressType: 'Fun'
  }, false, false, ['story', 'calm', 'creative']),
  addMetadata({
    id: 'one-minute-challenge',
    title: 'One Minute Challenge',
    route: '/one-minute-challenge',
    duration: '1 min break',
    categories: [gameCategories.FOCUS],
    icon: '⏱️',
    stressType: 'Focus'
  }, false, true, ['quick', '1min', 'fast', 'challenge']),
  addMetadata({
    id: 'neon-dodge',
    title: 'Neon Dodge',
    route: '/neon-dodge',
    duration: '2 min break',
    categories: [gameCategories.REFLEX, gameCategories.ARCADE],
    icon: '💫',
    stressType: 'Reflex'
  }, true, true, ['arcade', 'visual', 'dodge', 'fast']),
  addMetadata({
    id: 'mini-golf-desk',
    title: 'Mini Golf Desk',
    route: '/mini-golf-desk',
    duration: '3 min break',
    categories: [gameCategories.ARCADE],
    icon: '⛳',
    stressType: 'Focus'
  }, false, false, ['golf', 'arcade', 'skill']),
  addMetadata({
    id: 'office-run',
    title: 'Isometric Office Run',
    route: '/office-run',
    duration: '2 min break',
    categories: [gameCategories.REFLEX, gameCategories.ARCADE],
    icon: '🏃',
    stressType: 'Reflex'
  }, false, false, ['running', 'arcade', 'reflex']),
  addMetadata({
    id: 'color-wave',
    title: 'Color Wave',
    route: '/color-wave',
    duration: '2 min break',
    categories: [gameCategories.REFLEX, gameCategories.ARCADE],
    icon: '🌊',
    stressType: 'Reflex'
  }, true, false, ['visual', 'arcade', 'wave', 'color']),
  addMetadata({
    id: 'maze-escape',
    title: 'Maze Escape Lite',
    route: '/maze-escape',
    duration: '3 min break',
    categories: [gameCategories.LOGIC, gameCategories.ARCADE],
    icon: '🧩',
    stressType: 'Logic'
  }, false, false, ['maze', 'puzzle', 'logic']),
  addMetadata({
    id: 'particle-burst',
    title: 'Particle Burst',
    route: '/particle-burst',
    duration: '2 min break',
    categories: [gameCategories.REFLEX, gameCategories.ARCADE],
    icon: '✨',
    stressType: 'Reflex'
  }, false, false, ['visual', 'arcade', 'particles']),
  addMetadata({
    id: 'bridge-builder',
    title: 'Bridge Builder Mini',
    route: '/bridge-builder',
    duration: '2 min break',
    categories: [gameCategories.LOGIC, gameCategories.ARCADE],
    icon: '🌉',
    stressType: 'Focus'
  }, false, false, ['building', 'logic', 'arcade']),
  addMetadata({
    id: 'orbit-control',
    title: 'Orbit Control',
    route: '/orbit-control',
    duration: '2 min break',
    categories: [gameCategories.ARCADE],
    icon: '🪐',
    stressType: 'Control'
  }, false, false, ['control', 'arcade', 'space']),
  addMetadata({
    id: 'stack-blocks',
    title: 'Stack The Blocks',
    route: '/stack-blocks',
    duration: '2 min break',
    categories: [gameCategories.ARCADE],
    icon: '📦',
    stressType: 'Focus'
  }, false, false, ['stacking', 'arcade', 'skill']),
  addMetadata({
    id: 'office-pinball',
    title: 'Office Pinball Lite',
    route: '/office-pinball',
    duration: '3 min break',
    categories: [gameCategories.REFLEX, gameCategories.ARCADE],
    icon: '🎱',
    stressType: 'Reflex'
  }, false, false, ['pinball', 'arcade', 'reflex']),
  addMetadata({
    id: 'liquid-flow',
    title: 'Liquid Flow',
    route: '/liquid-flow',
    duration: '2 min break',
    categories: [gameCategories.ARCADE],
    icon: '💧',
    stressType: 'Reflex'
  }, false, false, ['visual', 'arcade', 'flow']),
  addMetadata({
    id: 'prism-shift',
    title: 'Prism Shift',
    route: '/prism-shift',
    duration: '2 min break',
    categories: [gameCategories.FOCUS, gameCategories.ARCADE],
    icon: '🌈',
    stressType: 'Focus'
  }, false, false, ['visual', 'color', 'focus']),
  addMetadata({
    id: 'magnetic-field',
    title: 'Magnetic Field',
    route: '/magnetic-field',
    duration: '2 min break',
    categories: [gameCategories.ARCADE],
    icon: '🧲',
    stressType: 'Control'
  }, false, false, ['control', 'arcade', 'physics']),
  addMetadata({
    id: 'wave-collapse',
    title: 'Wave Collapse',
    route: '/wave-collapse',
    duration: '2 min break',
    categories: [gameCategories.REFLEX, gameCategories.ARCADE],
    icon: '🌊',
    stressType: 'Reflex'
  }, false, false, ['wave', 'arcade', 'reflex']),
  addMetadata({
    id: 'vortex-escape',
    title: 'Vortex Escape',
    route: '/vortex-escape',
    duration: '2 min break',
    categories: [gameCategories.ARCADE],
    icon: '🌀',
    stressType: 'Control'
  }, false, false, ['control', 'arcade', 'vortex']),
  addMetadata({
    id: 'crystal-align',
    title: 'Crystal Align',
    route: '/crystal-align',
    duration: '2 min break',
    categories: [gameCategories.FOCUS, gameCategories.ARCADE],
    icon: '💎',
    stressType: 'Focus'
  }, false, false, ['visual', 'focus', 'arcade']),
  addMetadata({
    id: 'star-drift',
    title: 'Star Drift',
    route: '/star-drift',
    duration: '2 min break',
    categories: [gameCategories.REFLEX, gameCategories.ARCADE],
    icon: '⭐',
    stressType: 'Reflex'
  }, false, false, ['arcade', 'reflex', 'space']),
  addMetadata({
    id: 'neural-sparks',
    title: 'Neural Sparks',
    route: '/neural-sparks',
    duration: '2 min break',
    categories: [gameCategories.LOGIC, gameCategories.ARCADE],
    icon: '⚡',
    stressType: 'Logic'
  }, false, false, ['logic', 'arcade', 'visual']),
  addMetadata({
    id: 'mirror-depth',
    title: 'Mirror Depth',
    route: '/mirror-depth',
    duration: '2 min break',
    categories: [gameCategories.FOCUS, gameCategories.ARCADE],
    icon: '🪞',
    stressType: 'Focus'
  }, false, false, ['visual', 'focus', 'arcade']),
  addMetadata({
    id: 'event-horizon',
    title: 'Event Horizon',
    route: '/event-horizon',
    duration: '2 min break',
    categories: [gameCategories.ARCADE],
    icon: '🌌',
    stressType: 'Control'
  }, false, false, ['control', 'arcade', 'space']),
  addMetadata({
    id: 'snakes-ladders',
    title: 'Snakes & Ladders',
    route: '/snakes-ladders',
    duration: '3 min break',
    categories: [gameCategories.CLASSIC, gameCategories.LOGIC],
    icon: '🐍',
    stressType: 'Fun'
  }, false, false, ['classic', 'board', 'fun'], true),
  addMetadata({
    id: 'ludo',
    title: 'Ludo (Office Edition)',
    route: '/ludo',
    duration: '3 min break',
    categories: [gameCategories.CLASSIC, gameCategories.LOGIC],
    icon: '🎲',
    stressType: 'Fun'
  }, false, false, ['classic', 'board', 'dice'], true),
  addMetadata({
    id: 'checkers',
    title: 'Checkers',
    route: '/checkers',
    duration: '5 min break',
    categories: [gameCategories.CLASSIC, gameCategories.LOGIC],
    icon: '⚫',
    stressType: 'Logic'
  }, false, true, ['classic', 'board', 'strategy']),
  addMetadata({
    id: 'connect-four',
    title: 'Connect Four',
    route: '/connect-four',
    duration: '3 min break',
    categories: [gameCategories.CLASSIC, gameCategories.LOGIC],
    icon: '🔴',
    stressType: 'Logic'
  }, false, true, ['classic', 'board', 'strategy']),
  addMetadata({
    id: 'sudoku',
    title: 'Sudoku',
    route: '/sudoku',
    duration: '5 min break',
    categories: [gameCategories.CLASSIC, gameCategories.FOCUS],
    icon: '🔢',
    stressType: 'Focus'
  }, false, true, ['classic', 'puzzle', 'numbers']),
  addMetadata({
    id: 'chess',
    title: 'Chess',
    route: '/chess',
    duration: '10 min break',
    categories: [gameCategories.CLASSIC, gameCategories.LOGIC],
    icon: '♟️',
    stressType: 'Logic'
  }, false, false, ['classic', 'board', 'strategy'], true),
  addMetadata({
    id: 'carrom',
    title: 'Carrom (Simplified)',
    route: '/carrom',
    duration: '3 min break',
    categories: [gameCategories.CLASSIC, gameCategories.REFLEX],
    icon: '🎯',
    stressType: 'Control'
  }, false, false, ['classic', 'skill', 'control']),
  addMetadata({
    id: 'othello',
    title: 'Othello',
    route: '/othello',
    duration: '5 min break',
    categories: [gameCategories.CLASSIC, gameCategories.LOGIC],
    icon: '⚪',
    stressType: 'Logic'
  }, false, false, ['classic', 'board', 'strategy']),
  addMetadata({
    id: 'backgammon',
    title: 'Backgammon (Basic)',
    route: '/backgammon',
    duration: '5 min break',
    categories: [gameCategories.CLASSIC, gameCategories.LOGIC],
    icon: '🎲',
    stressType: 'Logic'
  }, false, false, ['classic', 'board', 'dice']),
  addMetadata({
    id: 'dominoes',
    title: 'Dominoes',
    route: '/dominoes',
    duration: '3 min break',
    categories: [gameCategories.CLASSIC, gameCategories.LOGIC],
    icon: '🀄',
    stressType: 'Logic'
  }, false, false, ['classic', 'board', 'matching'])
]

export const allCategories = [
  'All Games',
  gameCategories.FOCUS,
  gameCategories.REFLEX,
  gameCategories.LOGIC,
  gameCategories.ARCADE,
  gameCategories.CALM,
  gameCategories.CLASSIC
]
