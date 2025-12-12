'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'

/**
 * Dog position interface
 * Defines the x and y coordinates for where the dog image appears on screen
 */
interface DogPosition {
    x: number
    y: number
}

export default function Home() {
    const [score, setScore] = useState(0)
    const [dogPosition, setDogPosition] = useState<DogPosition | null>(null)
    const [isVisible, setIsVisible] = useState(false)
    const [gameStarted, setGameStarted] = useState(false)
    const [highScore, setHighScore] = useState(0)

    /**
     * Generates a random position for the dog image within the viewport
     * Ensures the dog appears fully within the screen boundaries with padding
     * @param imageSize - The size of the dog image in pixels (default: 120px)
     * @returns Object containing x and y coordinates in pixels
     */
    const getRandomPosition = useCallback(
        (imageSize: number = 120): DogPosition => {
            const padding = 20
            const maxX = window.innerWidth - imageSize - padding
            const maxY = window.innerHeight - imageSize - padding * 2 - 180 // Account for header

            return {
                x: Math.random() * maxX + padding,
                y: Math.random() * maxY + padding + 100, // Offset for header
            }
        },
        [],
    )

    /**
     * Shows the dog image at a random position on the screen
     * This function is called repeatedly during active gameplay
     */
    const showDog = useCallback(() => {
        setDogPosition(getRandomPosition())
        setIsVisible(true)
    }, [getRandomPosition])

    /**
     * Hides the dog image from the screen
     * Called after the dog is tapped or after the timeout period
     */
    const hideDog = useCallback(() => {
        setIsVisible(false)
        setDogPosition(null)
    }, [])

    /**
     * Handles the tap/click event when user boops the dog
     * Increments score, hides the current dog, and shows a new one
     * Updates high score if current score exceeds it
     */
    const handleBoop = useCallback(() => {
        setScore((prev) => {
            const newScore = prev + 1
            if (newScore > highScore) {
                setHighScore(newScore)
            }
            return newScore
        })
        hideDog()

        // Show next dog after a short delay
        setTimeout(() => {
            showDog()
        }, 500)
    }, [hideDog, showDog, highScore])

    /**
     * Starts a new game session
     * Resets score to 0 and initiates the first dog appearance
     */
    const startGame = useCallback(() => {
        setScore(0)
        setGameStarted(true)
        showDog()
    }, [showDog])

    /**
     * Ends the current game session
     * Hides the dog and returns to the start screen
     */
    const endGame = useCallback(() => {
        setGameStarted(false)
        hideDog()
    }, [hideDog])

    /**
     * Game loop effect
     * Automatically hides and reshows the dog every 1.5 seconds during active gameplay
     * If player doesn't tap in time, dog disappears and reappears elsewhere
     */
    useEffect(() => {
        if (!gameStarted || !isVisible) return

        const timer = setTimeout(() => {
            hideDog()
            setTimeout(() => {
                showDog()
            }, 300)
        }, 1500)

        return () => clearTimeout(timer)
    }, [gameStarted, isVisible, hideDog, showDog])

    return (
        <main className="min-h-screen bg-gradient-to-b from-blue-400 to-purple-500 relative overflow-hidden touch-none select-none">
            {/* Score Display Header */}
            <div className="absolute top-0 left-0 right-0 p-4 bg-black/20 backdrop-blur-sm z-10">
                <div className="max-w-md mx-auto flex justify-between items-center text-white">
                    <div className="text-2xl font-bold">Score: {score}</div>
                    <div className="text-lg">Best: {highScore}</div>
                </div>
            </div>

            {/* Start Screen */}
            {!gameStarted && (
                <div className="flex flex-col items-center justify-center min-h-screen p-4">
                    <h1 className="text-5xl font-bold text-white mb-4 text-center drop-shadow-lg">
                        Boop the Snoot! 🐕
                    </h1>
                    <p className="text-xl text-white mb-8 text-center max-w-md">
                        Tap the dog as fast as you can to score points!
                    </p>
                    <button
                        onClick={startGame}
                        className="bg-white text-purple-600 px-8 py-4 rounded-full text-2xl font-bold shadow-lg hover:scale-105 active:scale-95 transition-transform"
                    >
                        Start Game
                    </button>
                    {highScore > 0 && (
                        <p className="text-white text-lg mt-4">
                            Your best score: {highScore}
                        </p>
                    )}
                </div>
            )}

            {/* Game Screen */}
            {gameStarted && (
                <>
                    {/* Dog Image */}
                    {isVisible && dogPosition && (
                        <div
                            onClick={handleBoop}
                            style={{
                                position: 'absolute',
                                left: `${dogPosition.x}px`,
                                top: `${dogPosition.y}px`,
                                cursor: 'pointer',
                            }}
                            className="transition-all duration-200 animate-bounce"
                        >
                            <div className="w-32 h-32 rounded-full overflow-hidden shadow-2xl hover:scale-110 active:scale-90 transition-transform">
                                <Image
                                    src="/images/ada_transparent.png"
                                    alt="Ada the dog"
                                    width={128}
                                    height={128}
                                    className="object-cover w-full h-full"
                                    priority
                                />
                            </div>
                        </div>
                    )}

                    {/* End Game Button */}
                    <div className="fixed bottom-6 left-0 right-0 flex justify-center z-20 pb-6">
                        <button
                            onClick={endGame}
                            className="bg-white/90 text-purple-600 px-6 py-3 rounded-full font-bold shadow-lg hover:scale-105 active:scale-95 transition-transform"
                        >
                            End Game
                        </button>
                    </div>
                </>
            )}
        </main>
    )
}
