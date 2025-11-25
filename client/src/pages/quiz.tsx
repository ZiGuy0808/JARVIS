import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Heart, Flame } from 'lucide-react';
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

export default function QuizPage() {
  const [, navigate] = useLocation();
  const [state, setState] = useState<'menu' | 'playing' | 'lost' | 'loading'>('menu');
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [jarvisMessage, setJarvisMessage] = useState('');
  const [answerCorrect, setAnswerCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    if (state === 'playing' && !currentQuestion) {
      loadQuestion();
    }
  }, [state]);

  const loadQuestion = async () => {
    setState('loading');
    try {
      const response = await fetch(`/api/tony-quiz/next?question=${questionNumber}`);
      const data = await response.json();
      setCurrentQuestion(data.question);
      setJarvisMessage(data.jarvisQuote);
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
        body: JSON.stringify({ answer: index, correct: currentQuestion?.correct })
      });
      const data = await response.json();

      if (data.correct) {
        setAnswerCorrect(true);
        setJarvisMessage(data.jarvisResponse);
      } else {
        setAnswerCorrect(false);
        setJarvisMessage(data.jarvisResponse);
        setTimeout(() => setState('lost'), 2000);
      }
    } catch (error) {
      console.error('Failed to check answer:', error);
    }
  };

  const nextQuestion = () => {
    if (answerCorrect) {
      setQuestionNumber(questionNumber + 1);
      setCurrentQuestion(null);
      loadQuestion();
    }
  };

  const startQuiz = () => {
    setQuestionNumber(1);
    setCurrentQuestion(null);
    setState('playing');
  };

  const resetQuiz = () => {
    setState('menu');
    setQuestionNumber(1);
    setCurrentQuestion(null);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setJarvisMessage('');
    setAnswerCorrect(null);
  };

  // Menu
  if (state === 'menu') {
    return (
      <div className="w-full h-screen bg-gradient-to-b from-background to-background/80 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-2xl"
        >
          <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/30 border-2">
            <CardHeader className="text-center">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="text-5xl mb-4"
              >
                J.A.R.V.I.S.
              </motion.div>
              <CardTitle className="text-4xl font-orbitron">
                Tony Stark Survival Quiz
              </CardTitle>
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
                  Test your knowledge of Tony Stark in an endless survival mode. Questions get progressively harder. Get ONE wrong and you lose. Jarvis will judge your every answer.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-1 gap-3 text-xs"
              >
                <div className="flex gap-2 items-center p-3 bg-red-500/10 rounded-lg border border-red-500/30">
                  <Flame className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <span>One wrong answer = Game Over</span>
                </div>
                <div className="flex gap-2 items-center p-3 bg-blue-500/10 rounded-lg border border-blue-500/30">
                  <span>Questions 1-5: Easy</span>
                </div>
                <div className="flex gap-2 items-center p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
                  <span>Questions 6-10: Medium</span>
                </div>
                <div className="flex gap-2 items-center p-3 bg-orange-500/10 rounded-lg border border-orange-500/30">
                  <span>Questions 11+: Hard → Extreme</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-2"
              >
                <Button
                  onClick={startQuiz}
                  className="w-full bg-primary hover:bg-primary/90 text-lg py-6 font-orbitron"
                  data-testid="button-start-tony-quiz"
                >
                  Enter Jarvis's Interrogation
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/')}
                  className="w-full gap-2"
                  data-testid="button-quiz-back-menu"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Jarvis
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Loading
  if (state === 'loading') {
    return (
      <div className="w-full h-screen bg-gradient-to-b from-background to-background/80 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full" />
          <p className="text-muted-foreground mt-4 font-rajdhani">Jarvis is preparing your interrogation...</p>
        </motion.div>
      </div>
    );
  }

  // Playing
  if (state === 'playing' && currentQuestion) {
    const difficulty = Math.ceil(questionNumber / 5);
    const difficultyLabel = difficulty <= 1 ? 'Easy' : difficulty <= 2 ? 'Medium' : difficulty <= 3 ? 'Hard' : 'Extreme';
    const difficultyColor =
      difficulty <= 1 ? 'text-green-500' : difficulty <= 2 ? 'text-yellow-500' : difficulty <= 3 ? 'text-orange-500' : 'text-red-500';

    return (
      <div className="w-full h-screen bg-gradient-to-b from-background to-background/80 flex flex-col p-4 overflow-hidden">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div>
            <h2 className="text-2xl font-orbitron font-bold">Question {questionNumber}</h2>
            <p className={`text-sm font-rajdhani ${difficultyColor}`}>Difficulty: {difficultyLabel}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={resetQuiz}
            data-testid="button-exit-tony-quiz"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </motion.div>

        {/* Lives */}
        <motion.div className="flex items-center gap-2 mb-6">
          <Heart className="w-6 h-6 text-red-500 fill-red-500" />
          <span className="font-orbitron">ONE STRIKE - NO MISTAKES</span>
        </motion.div>

        {/* Question Card */}
        <div className="flex-1 flex flex-col items-center justify-center overflow-y-auto pb-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            key={currentQuestion.id}
            className="w-full max-w-2xl"
          >
            {/* Jarvis Commentary */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-6 p-4 rounded-lg bg-gradient-to-r from-primary/20 to-transparent border-l-4 border-primary"
            >
              <p className="text-sm font-rajdhani italic text-foreground">"{jarvisMessage}"</p>
            </motion.div>

            {/* Question */}
            <Card className="mb-6 bg-gradient-to-br from-primary/10 to-transparent border-primary/40">
              <CardHeader>
                <CardTitle className="text-2xl leading-tight">{currentQuestion.question}</CardTitle>
              </CardHeader>
            </Card>

            {/* Options */}
            <div className="space-y-2 mb-6">
              {currentQuestion.options.map((option, index) => (
                <motion.button
                  key={index}
                  onClick={() => !showExplanation && handleAnswer(index)}
                  disabled={showExplanation}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all text-sm ${
                    selectedAnswer === index
                      ? answerCorrect
                        ? 'bg-green-500/20 border-green-500 text-green-600 dark:text-green-400'
                        : 'bg-red-500/20 border-red-500 text-red-600 dark:text-red-400'
                      : showExplanation && index === currentQuestion.correct
                        ? 'bg-green-500/20 border-green-500 text-green-600 dark:text-green-400'
                        : 'bg-card/50 border-primary/30 hover:border-primary/60 hover-elevate'
                  }`}
                  whileHover={{ scale: showExplanation ? 1 : 1.02 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  data-testid={`button-quiz-option-${index}`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        selectedAnswer === index
                          ? answerCorrect
                            ? 'border-green-500 bg-green-500'
                            : 'border-red-500 bg-red-500'
                          : showExplanation && index === currentQuestion.correct
                            ? 'border-green-500 bg-green-500'
                            : 'border-primary/50'
                      }`}
                    >
                      {selectedAnswer === index && (
                        <span className="text-white text-xs font-bold">
                          {answerCorrect ? '✓' : '✗'}
                        </span>
                      )}
                      {showExplanation && index === currentQuestion.correct && (
                        <span className="text-white text-xs font-bold">✓</span>
                      )}
                    </div>
                    <span className="flex-1">{option}</span>
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
                  className="mb-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/30"
                >
                  <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">
                    {answerCorrect ? 'Correct!' : 'Wrong Answer'}
                  </p>
                  <p className="text-sm text-muted-foreground">{currentQuestion.explanation}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Next Button */}
            {showExplanation && answerCorrect && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-3"
              >
                <p className="text-xs text-muted-foreground text-center font-mono">
                  Survived {questionNumber} questions
                </p>
                <Button
                  onClick={nextQuestion}
                  className="w-full bg-primary hover:bg-primary/90 text-lg py-6 font-orbitron"
                  data-testid="button-next-tony-question"
                >
                  Next Question (Question {questionNumber + 1})
                </Button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    );
  }

  // Lost
  if (state === 'lost') {
    return (
      <div className="w-full h-screen bg-gradient-to-b from-red-950/20 to-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-2xl"
        >
          <Card className="bg-gradient-to-br from-red-500/20 to-transparent border-red-500/50 border-2">
            <CardHeader className="text-center">
              <motion.div
                animate={{ rotate: [0, -5, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-6xl mb-4"
              >
                ✗
              </motion.div>
              <CardTitle className="text-4xl font-orbitron text-red-500">Game Over</CardTitle>
              <p className="text-muted-foreground mt-2 font-rajdhani">
                You made it {questionNumber} question{questionNumber > 1 ? 's' : ''}
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="p-4 rounded-lg bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/40 text-center"
              >
                <p className="text-lg font-rajdhani font-semibold text-foreground italic">
                  "{jarvisMessage}"
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-center"
              >
                <Badge className="bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/30 text-sm px-3 py-1">
                  Final Score: {questionNumber} Questions Survived
                </Badge>
              </motion.div>

              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/30">
                  <p className="text-xs text-muted-foreground mb-1">Total Questions</p>
                  <p className="text-2xl font-bold text-primary">{questionNumber}</p>
                </div>
                <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/30">
                  <p className="text-xs text-muted-foreground mb-1">Difficulty</p>
                  <p className="text-2xl font-bold text-orange-500">
                    {Math.ceil(questionNumber / 5) <= 1
                      ? 'Easy'
                      : Math.ceil(questionNumber / 5) <= 2
                        ? 'Medium'
                        : Math.ceil(questionNumber / 5) <= 3
                          ? 'Hard'
                          : 'Extreme'}
                  </p>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-2"
              >
                <Button
                  onClick={startQuiz}
                  className="w-full bg-primary hover:bg-primary/90 text-lg py-6 font-orbitron"
                  data-testid="button-retry-tony-quiz"
                >
                  Try Again
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/')}
                  className="w-full gap-2"
                  data-testid="button-return-home"
                >
                  Back to Jarvis
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return null;
}
