import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import GameRules from '../components/GameRules'
import './OneLineStory.css'

const storyStarters = [
  'The office was unusually quiet when...',
  'Sarah opened her email to find...',
  'During the team meeting, Mark noticed...',
  'The deadline was approaching when suddenly...',
  'As the presentation began, everyone saw...',
  'The coffee machine broke down just as...',
  'When the new intern arrived, they discovered...',
  'The project manager announced that...',
  'At 5 PM on Friday, the team realized...',
  'The client called with unexpected news:'
]

function OneLineStory() {
  const [currentStarter, setCurrentStarter] = useState('')
  const [userSentence, setUserSentence] = useState('')
  const [savedStories, setSavedStories] = useState(() => {
    const saved = localStorage.getItem('one-line-stories')
    return saved ? JSON.parse(saved) : []
  })

  const rules = [
    'Read the opening line',
    'Add one sentence only to continue the story',
    'Save your entry locally',
    'Be creative and concise'
  ]

  useEffect(() => {
    loadNewStarter()
  }, [])

  const loadNewStarter = () => {
    const starter = storyStarters[Math.floor(Math.random() * storyStarters.length)]
    setCurrentStarter(starter)
    setUserSentence('')
  }

  const handleSave = () => {
    if (!userSentence.trim()) return

    const story = {
      starter: currentStarter,
      continuation: userSentence,
      date: new Date().toLocaleString()
    }

    const updated = [story, ...savedStories].slice(0, 10)
    setSavedStories(updated)
    localStorage.setItem('one-line-stories', JSON.stringify(updated))
    loadNewStarter()
  }

  const clearStories = () => {
    setSavedStories([])
    localStorage.removeItem('one-line-stories')
  }

  return (
    <Layout 
      showBackButton={true}
      gameTitle="One-Line Story"
      gameSubtitle="Encourages creativity and quick thinking"
    >
      <div className="game-container">
        <GameRules title="How to Play" rules={rules} />
        <div className="story-section">
          <div className="story-starter">{currentStarter}</div>
          <textarea
            className="story-input"
            value={userSentence}
            onChange={(e) => setUserSentence(e.target.value)}
            placeholder="Continue the story with one sentence..."
            rows="4"
          />
          <div className="story-actions">
            <button className="save-button" onClick={handleSave} disabled={!userSentence.trim()}>
              Save Story
            </button>
            <button className="new-button" onClick={loadNewStarter}>
              New Starter
            </button>
          </div>
        </div>
        {savedStories.length > 0 && (
          <div className="saved-stories">
            <div className="stories-header">
              <h3>Saved Stories</h3>
              <button className="clear-button" onClick={clearStories}>
                Clear All
              </button>
            </div>
            {savedStories.map((story, index) => (
              <div key={index} className="story-item">
                <div className="story-complete">
                  <span className="story-part">{story.starter}</span>
                  <span className="story-part user">{story.continuation}</span>
                </div>
                <div className="story-date">{story.date}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}

export default OneLineStory
