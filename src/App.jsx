import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary'
import { RouteLoadingWrapper } from './components/LoadingSpinner'
import { trackAppLoad, trackSessionEnd } from './utils/analytics'
import { useEffect, useRef } from 'react'
import Home from './pages/Home'
import FocusGrid from './games/FocusGrid'
import MemoryRefresh from './games/MemoryRefresh'
import QuickDecision from './games/QuickDecision'
import GuessSmart from './games/GuessSmart'
import ReflexTest from './games/ReflexTest'
import WordSprint from './games/WordSprint'
import ColorFocus from './games/ColorFocus'
import QuickMath from './games/QuickMath'
import PatternRecall from './games/PatternRecall'
import YesNoTrap from './games/YesNoTrap'
import DeskRacer from './games/DeskRacer'
import LaneSwitch from './games/LaneSwitch'
import SpeedClickRally from './games/SpeedClickRally'
import TrafficSignalReflex from './games/TrafficSignalReflex'
import CursorDrift from './games/CursorDrift'
import BreathSync from './games/BreathSync'
import ZenClick from './games/ZenClick'
import OddOneOut from './games/OddOneOut'
import SequenceBuilder from './games/SequenceBuilder'
import GridSum from './games/GridSum'
import SpotTheChange from './games/SpotTheChange'
import FlashCount from './games/FlashCount'
import EmojiMoodMatch from './games/EmojiMoodMatch'
import OneLineStory from './games/OneLineStory'
import OneMinuteChallenge from './games/OneMinuteChallenge'
import NeonDodge from './games/NeonDodge'
import MiniGolfDesk from './games/MiniGolfDesk'
import IsometricOfficeRun from './games/IsometricOfficeRun'
import ColorWave from './games/ColorWave'
import MazeEscapeLite from './games/MazeEscapeLite'
import ParticleBurst from './games/ParticleBurst'
import BridgeBuilderMini from './games/BridgeBuilderMini'
import OrbitControl from './games/OrbitControl'
import StackTheBlocks from './games/StackTheBlocks'
import OfficePinballLite from './games/OfficePinballLite'
import LiquidFlow from './games/LiquidFlow'
import PrismShift from './games/PrismShift'
import MagneticField from './games/MagneticField'
import WaveCollapse from './games/WaveCollapse'
import VortexEscape from './games/VortexEscape'
import CrystalAlign from './games/CrystalAlign'
import StarDrift from './games/StarDrift'
import NeuralSparks from './games/NeuralSparks'
import MirrorDepth from './games/MirrorDepth'
import EventHorizon from './games/EventHorizon'
import SnakesLadders from './games/SnakesLadders'
import Ludo from './games/Ludo'
import Checkers from './games/Checkers'
import ConnectFour from './games/ConnectFour'
import Sudoku from './games/Sudoku'
import Chess from './games/Chess'
import Carrom from './games/Carrom'
import Othello from './games/Othello'
import Backgammon from './games/Backgammon'
import Dominoes from './games/Dominoes'
import AdminAnalytics from './pages/AdminAnalytics'
import './App.css'

const GameRoute = ({ Component }) => (
  <ErrorBoundary>
    <RouteLoadingWrapper>
      <Component />
    </RouteLoadingWrapper>
  </ErrorBoundary>
)

function AppContent() {
  const location = useLocation()
  const startTimeRef = useRef(Date.now())

  useEffect(() => {
    if (!location.pathname.startsWith('/__admin')) {
      trackAppLoad()
      startTimeRef.current = Date.now()
    }

    return () => {
      const duration = Math.floor((Date.now() - startTimeRef.current) / 1000)
      if (duration > 10 && !location.pathname.startsWith('/__admin')) {
        trackSessionEnd(duration)
      }
    }
  }, [location.pathname])

  return null
}

function App() {

  return (
    <ErrorBoundary>
      <Router>
        <AppContent />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/__admin/analytics" element={<AdminAnalytics />} />
          <Route path="/focus-grid" element={<GameRoute Component={FocusGrid} />} />
          <Route path="/memory-refresh" element={<GameRoute Component={MemoryRefresh} />} />
          <Route path="/quick-decision" element={<GameRoute Component={QuickDecision} />} />
          <Route path="/guess-smart" element={<GameRoute Component={GuessSmart} />} />
          <Route path="/reflex-test" element={<GameRoute Component={ReflexTest} />} />
          <Route path="/word-sprint" element={<GameRoute Component={WordSprint} />} />
          <Route path="/color-focus" element={<GameRoute Component={ColorFocus} />} />
          <Route path="/quick-math" element={<GameRoute Component={QuickMath} />} />
          <Route path="/pattern-recall" element={<GameRoute Component={PatternRecall} />} />
          <Route path="/yes-no-trap" element={<GameRoute Component={YesNoTrap} />} />
          <Route path="/desk-racer" element={<GameRoute Component={DeskRacer} />} />
          <Route path="/lane-switch" element={<GameRoute Component={LaneSwitch} />} />
          <Route path="/speed-click-rally" element={<GameRoute Component={SpeedClickRally} />} />
          <Route path="/traffic-signal-reflex" element={<GameRoute Component={TrafficSignalReflex} />} />
          <Route path="/cursor-drift" element={<GameRoute Component={CursorDrift} />} />
          <Route path="/breath-sync" element={<GameRoute Component={BreathSync} />} />
          <Route path="/zen-click" element={<GameRoute Component={ZenClick} />} />
          <Route path="/odd-one-out" element={<GameRoute Component={OddOneOut} />} />
          <Route path="/sequence-builder" element={<GameRoute Component={SequenceBuilder} />} />
          <Route path="/grid-sum" element={<GameRoute Component={GridSum} />} />
          <Route path="/spot-the-change" element={<GameRoute Component={SpotTheChange} />} />
          <Route path="/flash-count" element={<GameRoute Component={FlashCount} />} />
          <Route path="/emoji-mood-match" element={<GameRoute Component={EmojiMoodMatch} />} />
          <Route path="/one-line-story" element={<GameRoute Component={OneLineStory} />} />
          <Route path="/one-minute-challenge" element={<GameRoute Component={OneMinuteChallenge} />} />
          <Route path="/neon-dodge" element={<GameRoute Component={NeonDodge} />} />
          <Route path="/mini-golf-desk" element={<GameRoute Component={MiniGolfDesk} />} />
          <Route path="/office-run" element={<GameRoute Component={IsometricOfficeRun} />} />
          <Route path="/color-wave" element={<GameRoute Component={ColorWave} />} />
          <Route path="/maze-escape" element={<GameRoute Component={MazeEscapeLite} />} />
          <Route path="/particle-burst" element={<GameRoute Component={ParticleBurst} />} />
          <Route path="/bridge-builder" element={<GameRoute Component={BridgeBuilderMini} />} />
          <Route path="/orbit-control" element={<GameRoute Component={OrbitControl} />} />
          <Route path="/stack-blocks" element={<GameRoute Component={StackTheBlocks} />} />
          <Route path="/office-pinball" element={<GameRoute Component={OfficePinballLite} />} />
          <Route path="/liquid-flow" element={<GameRoute Component={LiquidFlow} />} />
          <Route path="/prism-shift" element={<GameRoute Component={PrismShift} />} />
          <Route path="/magnetic-field" element={<GameRoute Component={MagneticField} />} />
          <Route path="/wave-collapse" element={<GameRoute Component={WaveCollapse} />} />
          <Route path="/vortex-escape" element={<GameRoute Component={VortexEscape} />} />
          <Route path="/crystal-align" element={<GameRoute Component={CrystalAlign} />} />
          <Route path="/star-drift" element={<GameRoute Component={StarDrift} />} />
          <Route path="/neural-sparks" element={<GameRoute Component={NeuralSparks} />} />
          <Route path="/mirror-depth" element={<GameRoute Component={MirrorDepth} />} />
          <Route path="/event-horizon" element={<GameRoute Component={EventHorizon} />} />
          <Route path="/snakes-ladders" element={<GameRoute Component={SnakesLadders} />} />
          <Route path="/ludo" element={<GameRoute Component={Ludo} />} />
          <Route path="/checkers" element={<GameRoute Component={Checkers} />} />
          <Route path="/connect-four" element={<GameRoute Component={ConnectFour} />} />
          <Route path="/sudoku" element={<GameRoute Component={Sudoku} />} />
          <Route path="/chess" element={<GameRoute Component={Chess} />} />
          <Route path="/carrom" element={<GameRoute Component={Carrom} />} />
          <Route path="/othello" element={<GameRoute Component={Othello} />} />
          <Route path="/backgammon" element={<GameRoute Component={Backgammon} />} />
          <Route path="/dominoes" element={<GameRoute Component={Dominoes} />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  )
}

export default App
