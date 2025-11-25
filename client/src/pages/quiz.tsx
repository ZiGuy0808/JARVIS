import { useState, useMemo } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Award, Target, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correct: number;
  category: string;
  difficulty: string;
  explanation: string;
}

export default function QuizPage() {
  const [, navigate] = useLocation();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizState, setQuizState] = useState<'menu' | 'loading' | 'playing' | 'finished'>('menu');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard' | 'random'>('random');

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const startQuiz = async (selectedDifficulty: 'easy' | 'medium' | 'hard' | 'random') => {
    setDifficulty(selectedDifficulty);
    setQuizState('loading');

    // Load questions from server
    try {
      const response = await fetch(`/api/quiz?difficulty=${selectedDifficulty}`);
      const data = await response.json();
      setQuestions(data.questions);
      setCurrentQuestion(0);
      setScore(0);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setQuizState('playing');
    } catch (error) {
      console.error('Failed to load quiz:', error);
      setQuizState('menu');
    }
  };

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index);
    setShowExplanation(true);
    if (index === currentQ.correct) {
      setScore(score + 1);
    }
  };

  const goToNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setQuizState('finished');
    }
  };

  const resetQuiz = () => {
    setQuizState('menu');
    setQuestions([]);
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'easy':
        return 'bg-green-500/20 text-green-600 dark:text-green-400';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400';
      case 'hard':
        return 'bg-red-500/20 text-red-600 dark:text-red-400';
      default:
        return 'bg-blue-500/20 text-blue-600 dark:text-blue-400';
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'iron-man':
        return 'bg-red-500/20 text-red-600 dark:text-red-400';
      case 'tony-stark':
        return 'bg-purple-500/20 text-purple-600 dark:text-purple-400';
      case 'suits':
        return 'bg-blue-500/20 text-blue-600 dark:text-blue-400';
      case 'mcu':
        return 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-400';
      default:
        return 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-400';
    }
  };

  // Menu
  if (quizState === 'menu') {
    return (
      <div className="w-full h-screen bg-gradient-to-b from-background to-background/80 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-2xl"
        >
          <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/30">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center mb-4">
                <Target className="w-12 h-12 text-primary" />
              </div>
              <CardTitle className="text-4xl">MCU Quiz</CardTitle>
              <CardDescription className="text-base">
                Test your Iron Man and MCU knowledge with Jarvis!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <p className="text-sm font-semibold text-muted-foreground">Select Difficulty</p>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={() => startQuiz('easy')}
                    className="h-auto py-4 flex flex-col items-center gap-1 bg-green-500/20 hover:bg-green-500/30 text-green-600 dark:text-green-400 border border-green-500/30"
                    variant="outline"
                    data-testid="button-quiz-easy"
                  >
                    <span className="font-bold">Easy</span>
                    <span className="text-xs">10 questions</span>
                  </Button>
                  <Button
                    onClick={() => startQuiz('medium')}
                    className="h-auto py-4 flex flex-col items-center gap-1 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-600 dark:text-yellow-400 border border-yellow-500/30"
                    variant="outline"
                    data-testid="button-quiz-medium"
                  >
                    <span className="font-bold">Medium</span>
                    <span className="text-xs">10 questions</span>
                  </Button>
                  <Button
                    onClick={() => startQuiz('hard')}
                    className="h-auto py-4 flex flex-col items-center gap-1 bg-red-500/20 hover:bg-red-500/30 text-red-600 dark:text-red-400 border border-red-500/30"
                    variant="outline"
                    data-testid="button-quiz-hard"
                  >
                    <span className="font-bold">Hard</span>
                    <span className="text-xs">10 questions</span>
                  </Button>
                  <Button
                    onClick={() => startQuiz('random')}
                    className="h-auto py-4 flex flex-col items-center gap-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30"
                    variant="outline"
                    data-testid="button-quiz-random"
                  >
                    <span className="font-bold">Random</span>
                    <span className="text-xs">Mixed difficulty</span>
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-4 border-t">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">20+</p>
                  <p className="text-xs text-muted-foreground">MCU Questions</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">3</p>
                  <p className="text-xs text-muted-foreground">Difficulty Levels</p>
                </div>
              </div>

              <Button
                variant="outline"
                onClick={() => navigate('/')}
                className="w-full gap-2"
                data-testid="button-quiz-back"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Jarvis
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Loading
  if (quizState === 'loading') {
    return (
      <div className="w-full h-screen bg-gradient-to-b from-background to-background/80 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Initializing quiz...</p>
        </div>
      </div>
    );
  }

  // Playing
  if (quizState === 'playing' && currentQ) {
    return (
      <div className="w-full h-screen bg-gradient-to-b from-background to-background/80 flex flex-col p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => resetQuiz()}
            data-testid="button-quiz-exit"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="text-center flex-1">
            <p className="text-sm font-mono text-muted-foreground">
              Question {currentQuestion + 1} of {questions.length}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-primary">{score} points</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1 bg-primary/20 rounded-full overflow-hidden mb-6">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-cyan-500"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Quiz Card */}
        <div className="flex-1 flex items-center justify-center overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            key={currentQuestion}
            className="w-full max-w-2xl"
          >
            <Card className="bg-gradient-to-br from-card to-card/50 border-primary/30">
              <CardHeader>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <Badge className={getDifficultyColor(currentQ.difficulty)}>
                    {currentQ.difficulty}
                  </Badge>
                  <Badge className={getCategoryColor(currentQ.category)}>
                    {currentQ.category.replace('-', ' ')}
                  </Badge>
                </div>
                <CardTitle className="text-2xl">{currentQ.question}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Options */}
                <div className="space-y-2">
                  {currentQ.options.map((option, index) => (
                    <motion.button
                      key={index}
                      onClick={() => !showExplanation && handleAnswer(index)}
                      disabled={showExplanation}
                      className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                        selectedAnswer === index
                          ? index === currentQ.correct
                            ? 'bg-green-500/20 border-green-500 text-green-600 dark:text-green-400'
                            : 'bg-red-500/20 border-red-500 text-red-600 dark:text-red-400'
                          : showExplanation && index === currentQ.correct
                            ? 'bg-green-500/20 border-green-500 text-green-600 dark:text-green-400'
                            : 'bg-card/50 border-primary/30 hover:border-primary/60 hover-elevate'
                      }`}
                      whileHover={{ scale: showExplanation ? 1 : 1.02 }}
                      data-testid={`button-quiz-option-${index}`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                            selectedAnswer === index
                              ? index === currentQ.correct
                                ? 'border-green-500 bg-green-500'
                                : 'border-red-500 bg-red-500'
                              : showExplanation && index === currentQ.correct
                                ? 'border-green-500 bg-green-500'
                                : 'border-primary/50'
                          }`}
                        >
                          {selectedAnswer === index && (
                            <span className="text-white text-xs">
                              {index === currentQ.correct ? '✓' : '✗'}
                            </span>
                          )}
                          {showExplanation && index === currentQ.correct && (
                            <span className="text-white text-xs">✓</span>
                          )}
                        </div>
                        <span>{option}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>

                {/* Explanation */}
                {showExplanation && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30"
                  >
                    <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-1">
                      Explanation
                    </p>
                    <p className="text-sm text-muted-foreground">{currentQ.explanation}</p>
                  </motion.div>
                )}

                {/* Next Button */}
                {showExplanation && (
                  <Button
                    onClick={goToNextQuestion}
                    className="w-full"
                    data-testid="button-quiz-next"
                  >
                    {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  // Finished
  if (quizState === 'finished') {
    const percentage = Math.round((score / questions.length) * 100);
    let resultMessage = '';
    let resultIcon = '';

    if (percentage === 100) {
      resultMessage = 'Perfect! You are a true Iron Man expert!';
      resultIcon = '🏆';
    } else if (percentage >= 80) {
      resultMessage = 'Excellent! You know your MCU!';
      resultIcon = '⭐';
    } else if (percentage >= 60) {
      resultMessage = 'Good! You have solid MCU knowledge!';
      resultIcon = '👍';
    } else if (percentage >= 40) {
      resultMessage = 'Not bad! Keep watching the films!';
      resultIcon = '📺';
    } else {
      resultMessage = 'Time to rewatch the Iron Man movies!';
      resultIcon = '🎬';
    }

    return (
      <div className="w-full h-screen bg-gradient-to-b from-background to-background/80 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-2xl"
        >
          <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/30">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center mb-4">
                <Award className="w-12 h-12 text-primary" />
              </div>
              <CardTitle className="text-4xl">Quiz Complete!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Score Circle */}
              <div className="flex justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="relative w-40 h-40 rounded-full bg-gradient-to-br from-primary/20 to-cyan-500/20 border-2 border-primary/50 flex items-center justify-center"
                >
                  <div className="text-center">
                    <p className="text-5xl font-bold text-primary">{percentage}%</p>
                    <p className="text-sm text-muted-foreground">
                      {score}/{questions.length}
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* Result Message */}
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground mb-2">{resultMessage}</p>
                <Badge className="bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border-cyan-500/30">
                  Difficulty: {difficulty === 'random' ? 'Mixed' : difficulty}
                </Badge>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {Math.ceil((score / questions.length) * 100)}%
                  </p>
                  <p className="text-xs text-muted-foreground">Accuracy</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{questions.length}</p>
                  <p className="text-xs text-muted-foreground">Questions</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">
                    {score}
                  </p>
                  <p className="text-xs text-muted-foreground">Correct</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button
                  onClick={resetQuiz}
                  className="flex-1"
                  data-testid="button-quiz-retake"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Take Another Quiz
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/')}
                  className="flex-1"
                  data-testid="button-quiz-home"
                >
                  Back to Jarvis
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return null;
}
