import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Heart, Flame, Trophy, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correct: number;
  difficulty: number;
  category: string;
  explanation: string;
}

type QuizMode = 'menu' | 'mode-select' | 'playing' | 'lost' | 'won' | 'loading';

export default function QuizPage() {
  const [, navigate] = useLocation();
  const [state, setState] = useState<QuizMode>('menu');
  const [currentMode, setCurrentMode] = useState<'regular' | 'endless'>('regular');
  const [sessionId, setSessionId] = useState<string>('');
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [jarvisMessage, setJarvisMessage] = useState('');
  const [answerCorrect, setAnswerCorrect] = useState<boolean | null>(null);
  const [highScore, setHighScore] = useState<number>(0);
  const [difficultyIndicator, setDifficultyIndicator] = useState('');

  // Load high score from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('tony-quiz-high-score');
    if (saved) setHighScore(parseInt(saved));
  }, []);

  // Save high score to localStorage
  const updateHighScore = (newScore: number) => {
    if (newScore > highScore) {
      setHighScore(newScore);
      localStorage.setItem('tony-quiz-high-score', newScore.toString());
    }
  };

  const startQuiz = async (mode: 'regular' | 'endless') => {
    setState('loading');
    setCurrentMode(mode);
    setQuestionNumber(1);
    setCurrentQuestion(null);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setJarvisMessage('');
    setAnswerCorrect(null);

    try {
      const response = await fetch(`/api/tony-quiz/start?mode=${mode}`);
      const data = await response.json();
      setSessionId(data.sessionId);
      loadQuestion(1, data.sessionId, mode);
    } catch (error) {
      console.error('Failed to start quiz:', error);
      setState('menu');
    }
  };

  const loadQuestion = async (qNum: number, session: string, mode: 'regular' | 'endless') => {
    setState('loading');
    try {
      const response = await fetch(
        `/api/tony-quiz/next?question=${qNum}&sessionId=${session}&mode=${mode}`
      );
      const data = await response.json();
      setCurrentQuestion(data.question);
      setJarvisMessage(data.jarvisQuote);
      setDifficultyIndicator(data.difficultyIndicator);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setAnswerCorrect(null);
      setState('playing');
    } catch (error) {
      console.error('Failed to load question:', error);
      setState('menu');
    }
  };

  const handleAnswer = async (index: number) => {
    setSelectedAnswer(index);
    setShowExplanation(true);

    try {
      const response = await fetch('/api/tony-quiz/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answer: index, correct: currentQuestion?.correct }),
      });
      const data = await response.json();

      if (data.correct) {
        setAnswerCorrect(true);
        setJarvisMessage(data.jarvisResponse);
      } else {
        setAnswerCorrect(false);
        setJarvisMessage(data.jarvisResponse);
        // Update high score for endless mode
        if (currentMode === 'endless') {
          updateHighScore(questionNumber);
        }
        setTimeout(() => setState('lost'), 2000);
      }
    } catch (error) {
      console.error('Failed to check answer:', error);
    }
  };

  const nextQuestion = () => {
    if (answerCorrect) {
      if (currentMode === 'regular' && questionNumber === 10) {
        // Victory in regular mode
        setState('won');
      } else {
        // Continue to next question
        const nextQNum = questionNumber + 1;
        setQuestionNumber(nextQNum);
        setCurrentQuestion(null);
        loadQuestion(nextQNum, sessionId, currentMode);
      }
    }
  };

  const resetQuiz = () => {
    setState('menu');
    setQuestionNumber(1);
    setCurrentQuestion(null);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setJarvisMessage('');
    setAnswerCorrect(null);
    setSessionId('');
  };

  // ============= MENU STATE =============
  if (state === 'menu') {
    return (
      <div className="w-full min-h-screen bg-gradient-to-b from-background to-background/80 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-2xl"
        >
          <div className="flex items-center justify-between mb-6">
            <Button
              onClick={() => navigate('/')}
              variant="ghost"
              size="sm"
              data-testid="button-back-to-home"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Jarvis
            </Button>
            <div className="text-right">
              <Badge variant="secondary" className="text-lg px-3 py-1">
                High Score: {highScore}
              </Badge>
            </div>
          </div>

          <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/30 border-2">
            <CardHeader className="text-center">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="text-5xl mb-4"
              >
                J.A.R.V.I.S.
              </motion.div>
              <CardTitle className="text-4xl font-orbitron">Tony Stark Survival Quiz</CardTitle>
              <p className="text-muted-foreground mt-2 font-rajdhani">
                One Strike and You're Out. Can You Survive Jarvis's Interrogation?
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-4 rounded-lg bg-gradient-to-r from-primary/20 to-cyan-500/20 border border-primary/40"
              >
                <p className="text-sm font-rajdhani mb-3 text-foreground font-semibold">
                  "Do you really think you know Tony Stark better than I do?"
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Choose your quiz mode below. Get ONE wrong and you lose. Jarvis will judge your
                  every answer. We have 1000+ variations to keep things fresh!
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="space-y-3"
              >
                <Button
                  onClick={() => startQuiz('regular')}
                  className="w-full bg-primary hover:bg-primary/90 text-lg py-6 font-orbitron"
                  data-testid="button-start-regular-quiz"
                >
                  <Heart className="w-5 h-5 mr-2" />
                  Regular Mode - 10 Questions to Win
                </Button>

                <Button
                  onClick={() => startQuiz('endless')}
                  className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-lg py-6 font-orbitron"
                  data-testid="button-start-endless-quiz"
                >
                  <Flame className="w-5 h-5 mr-2" />
                  Endless Mode - How Many Can You Handle?
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="grid grid-cols-1 gap-3 text-xs"
              >
                <div className="flex gap-2 items-center p-3 bg-red-500/10 rounded-lg border border-red-500/30">
                  <Flame className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <span>One wrong answer = Game Over</span>
                </div>
                <div className="flex gap-2 items-center p-3 bg-blue-500/10 rounded-lg border border-blue-500/30">
                  <Zap className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  <span>1000+ Question Variations - Never the Same Quiz Twice</span>
                </div>
                <div className="flex gap-2 items-center p-3 bg-orange-500/10 rounded-lg border border-orange-500/30">
                  <Trophy className="w-5 h-5 text-orange-500 flex-shrink-0" />
                  <span>Endless Mode: Track Your High Score and Challenge Yourself</span>
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // ============= PLAYING STATE =============
  if (state === 'playing' && currentQuestion) {
    const getDifficultyColor = (difficulty: number) => {
      if (difficulty <= 2) return 'bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30';
      if (difficulty <= 4) return 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30';
      if (difficulty <= 6) return 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-500/30';
      if (difficulty <= 8) return 'bg-orange-500/20 text-orange-600 dark:text-orange-400 border-orange-500/30';
      return 'bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/30';
    };

    return (
      <div className="w-full min-h-screen bg-gradient-to-b from-background to-background/80 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-3xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button
                onClick={resetQuiz}
                variant="ghost"
                size="sm"
                data-testid="button-quit-quiz"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Quit
              </Button>
              <Badge variant="secondary">
                Question {questionNumber} {currentMode === 'regular' ? '/ 10' : ''}
              </Badge>
            </div>
            {currentMode === 'endless' && (
              <Badge className="bg-orange-500/20 text-orange-600 dark:text-orange-400">
                High Score: {highScore}
              </Badge>
            )}
          </div>

          <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/30 border-2">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="text-xl md:text-2xl font-orbitron mb-2 leading-relaxed">
                    {currentQuestion.question}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Badge className={getDifficultyColor(currentQuestion.difficulty)}>
                      {difficultyIndicator}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {currentQuestion.category}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Jarvis Message */}
              {jarvisMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-lg bg-gradient-to-r from-primary/20 to-cyan-500/20 border border-primary/40 italic text-sm"
                >
                  "{jarvisMessage}"
                </motion.div>
              )}

              {/* Answer Options */}
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <motion.button
                    key={index}
                    onClick={() => !showExplanation && handleAnswer(index)}
                    disabled={showExplanation}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`w-full p-3 md:p-4 rounded-lg border-2 transition-all text-left font-rajdhani ${selectedAnswer === index
                      ? answerCorrect
                        ? 'border-green-500/80 bg-green-500/10'
                        : 'border-red-500/80 bg-red-500/10'
                      : 'border-primary/30 hover:border-primary/60 bg-primary/5'
                      } ${showExplanation ? 'cursor-not-allowed' : 'cursor-pointer hover-elevate'}`}
                    data-testid={`button-answer-${index}`}
                    whileHover={!showExplanation ? { scale: 1.02 } : {}}
                    whileTap={!showExplanation ? { scale: 0.98 } : {}}
                  >
                    <div className="flex items-center gap-3">
                      <motion.div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${selectedAnswer === index
                          ? answerCorrect
                            ? 'bg-green-500/30'
                            : 'bg-red-500/30'
                          : 'bg-primary/20'
                          }`}
                      >
                        {String.fromCharCode(65 + index)}
                      </motion.div>
                      <span className="flex-1 text-sm md:text-base leading-snug">{option}</span>
                      {selectedAnswer === index && showExplanation && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                        >
                          {answerCorrect ? (
                            <span className="text-green-500 font-bold">✓</span>
                          ) : (
                            <span className="text-red-500 font-bold">✗</span>
                          )}
                        </motion.div>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Explanation */}
              <AnimatePresence>
                {showExplanation && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 rounded-lg bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-primary/40"
                  >
                    <p className="text-sm font-semibold mb-2">Explanation:</p>
                    <p className="text-sm text-muted-foreground">{currentQuestion.explanation}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Next Button */}
              {showExplanation && answerCorrect && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Button
                    onClick={nextQuestion}
                    className="w-full bg-primary hover:bg-primary/90 py-6 font-orbitron"
                    data-testid="button-next-question"
                  >
                    {currentMode === 'regular' && questionNumber === 10
                      ? 'Victory! View Results'
                      : 'Next Question'}
                  </Button>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // ============= LOST STATE =============
  if (state === 'lost') {
    return (
      <div className="w-full min-h-screen bg-gradient-to-b from-background to-background/80 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-2xl"
        >
          <Card className="bg-gradient-to-br from-red-500/10 to-transparent border-red-500/30 border-2">
            <CardHeader className="text-center">
              <motion.div
                animate={{ rotate: [0, -5, 5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="text-5xl mb-4"
              >
                💀
              </motion.div>
              <CardTitle className="text-4xl font-orbitron">Game Over</CardTitle>
              <p className="text-muted-foreground mt-2 font-rajdhani">Jarvis is not impressed.</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-4 rounded-lg bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/40"
              >
                <p className="text-sm font-rajdhani mb-3 text-foreground font-semibold">
                  "{jarvisMessage}"
                </p>
              </motion.div>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-muted-foreground text-sm mb-2">Questions Answered</p>
                  <p className="text-4xl font-bold font-orbitron">{questionNumber}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm mb-2">
                    {currentMode === 'endless' ? 'High Score' : 'Max Possible'}
                  </p>
                  <p className="text-4xl font-bold font-orbitron">
                    {currentMode === 'endless' ? highScore : '10'}
                  </p>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-2"
              >
                <Button
                  onClick={() => startQuiz(currentMode)}
                  className="w-full bg-primary hover:bg-primary/90 py-6 font-orbitron"
                  data-testid="button-try-again"
                >
                  Try Again
                </Button>
                <Button
                  onClick={resetQuiz}
                  variant="secondary"
                  className="w-full py-6 font-orbitron"
                  data-testid="button-back-to-menu"
                >
                  Back to Menu
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // ============= WON STATE (Regular Mode Only) =============
  if (state === 'won') {
    return (
      <div className="w-full min-h-screen bg-gradient-to-b from-background to-background/80 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-2xl"
        >
          <Card className="bg-gradient-to-br from-green-500/10 to-transparent border-green-500/30 border-2">
            <CardHeader className="text-center">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-5xl mb-4"
              >
                👑
              </motion.div>
              <CardTitle className="text-4xl font-orbitron">Victory!</CardTitle>
              <p className="text-muted-foreground mt-2 font-rajdhani">
                You've proven yourself worthy of Tony's legacy.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-4 rounded-lg bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/40"
              >
                <p className="text-sm font-rajdhani text-foreground font-semibold">
                  "Impressive, Sir would approve of your performance."
                </p>
              </motion.div>

              <div className="text-center">
                <p className="text-muted-foreground text-sm mb-2">Questions Mastered</p>
                <p className="text-5xl font-bold font-orbitron">10 / 10</p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-2"
              >
                <Button
                  onClick={() => startQuiz('endless')}
                  className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 py-6 font-orbitron"
                  data-testid="button-try-endless"
                >
                  Challenge Endless Mode
                </Button>
                <Button
                  onClick={resetQuiz}
                  variant="secondary"
                  className="w-full py-6 font-orbitron"
                  data-testid="button-back-to-menu-victory"
                >
                  Back to Menu
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // ============= LOADING STATE =============
  const isWebSearching = currentMode === 'endless' && questionNumber >= 3;

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-background to-background/80 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        {isWebSearching ? (
          <>
            {/* Web Search Animation */}
            <div className="relative mb-6">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center"
                style={{ boxShadow: '0 0 40px rgba(6, 182, 212, 0.5)' }}
              >
                <span className="text-4xl">🌐</span>
              </motion.div>
              {/* Scanning lines */}
              <motion.div
                animate={{ top: ['10%', '90%', '10%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="absolute left-0 right-0 h-1 bg-cyan-400/50"
                style={{ boxShadow: '0 0 10px rgba(6, 182, 212, 0.8)' }}
              />
            </div>
            <motion.p
              className="text-lg md:text-2xl font-orbitron mt-4 text-cyan-400"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              🔍 SEARCHING STARK DATABASE...
            </motion.p>
            <p className="text-muted-foreground mt-2">Finding an extremely hard question just for you...</p>
            <motion.div
              className="flex justify-center gap-1 mt-4"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-8 bg-cyan-500 rounded"
                  animate={{ scaleY: [0.3, 1, 0.3] }}
                  transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                />
              ))}
            </motion.div>
          </>
        ) : (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="text-6xl mb-4 inline-block"
            >
              ⚙️
            </motion.div>
            <p className="text-2xl font-orbitron mt-4">
              {questionNumber <= 2 ? 'Warming Up...' :
                questionNumber <= 5 ? 'Increasing Difficulty...' :
                  questionNumber <= 8 ? 'Getting Serious...' :
                    '💀 Preparing Nightmare Question...'}
            </p>
            <p className="text-muted-foreground mt-2">
              {currentMode === 'endless' ?
                `Question ${questionNumber} incoming...` :
                'Jarvis is preparing your interrogation...'}
            </p>
          </>
        )}
      </motion.div>
    </div>
  );
}
