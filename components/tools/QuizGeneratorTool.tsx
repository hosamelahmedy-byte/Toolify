'use client'

import { useState, useCallback } from 'react'
import { BookOpen, RotateCcw, Download, CheckCircle2, XCircle, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react'

type Difficulty = 'easy' | 'medium' | 'hard'
type QuestionType = 'multiple-choice' | 'true-false' | 'mixed'

interface QuizConfig {
  topic: string
  numQuestions: number
  difficulty: Difficulty
  questionType: QuestionType
}

interface QuizOption { label: string; text: string }
interface QuizQuestion {
  id: number
  question: string
  options: QuizOption[]
  correctAnswer: string
  explanation: string
}
interface GeneratedQuiz { title: string; description: string; questions: QuizQuestion[] }

function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}
      className="w-full bg-muted/40 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500 transition-all appearance-none cursor-pointer">
      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  )
}

function QuizCard({ question, index, userAnswer, onAnswer, showResult }: {
  question: QuizQuestion; index: number; userAnswer: string | undefined
  onAnswer: (qId: number, answer: string) => void; showResult: boolean
}) {
  return (
    <div className="bg-muted/40 border border-border rounded-2xl p-6 space-y-4">
      <div className="flex gap-3">
        <span className="flex-shrink-0 w-7 h-7 rounded-full bg-violet-500/20 text-violet-400 text-xs font-bold flex items-center justify-center">{index + 1}</span>
        <p className="text-sm leading-relaxed font-medium">{question.question}</p>
      </div>
      <div className="space-y-2 pl-10">
        {question.options.map((opt) => {
          const isSelected = userAnswer === opt.label
          const isCorrect = opt.label === question.correctAnswer
          let style = 'border-border bg-muted/40 hover:border-violet-500/60'
          if (showResult) {
            if (isCorrect) style = 'border-emerald-500 bg-emerald-500/10 text-emerald-300'
            else if (isSelected && !isCorrect) style = 'border-red-500 bg-red-500/10 text-red-300'
            else style = 'border-border bg-muted/20 text-muted-foreground'
          } else if (isSelected) style = 'border-violet-500 bg-violet-500/10'
          return (
            <button key={opt.label} onClick={() => !showResult && onAnswer(question.id, opt.label)} disabled={showResult}
              className={`w-full text-left text-sm px-4 py-3 rounded-xl border transition-all flex items-center gap-3 ${style} disabled:cursor-not-allowed`}>
              <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px] font-bold flex-shrink-0">{opt.label}</span>
              <span>{opt.text}</span>
              {showResult && isCorrect && <CheckCircle2 className="ml-auto w-4 h-4 text-emerald-400 flex-shrink-0" />}
              {showResult && isSelected && !isCorrect && <XCircle className="ml-auto w-4 h-4 text-red-400 flex-shrink-0" />}
            </button>
          )
        })}
      </div>
      {showResult && (
        <div className="pl-10">
          <div className="mt-2 bg-muted/40 border border-border rounded-xl px-4 py-3 text-xs text-muted-foreground leading-relaxed">
            <span className="text-violet-400 font-semibold">Explanation: </span>{question.explanation}
          </div>
        </div>
      )}
    </div>
  )
}

export function QuizGeneratorTool() {
  const [config, setConfig] = useState<QuizConfig>({ topic: '', numQuestions: 5, difficulty: 'medium', questionType: 'multiple-choice' })
  const [quiz, setQuiz] = useState<GeneratedQuiz | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({})
  const [showResult, setShowResult] = useState(false)
  const [copied, setCopied] = useState(false)

  const score = quiz ? quiz.questions.filter((q) => userAnswers[q.id] === q.correctAnswer).length : 0
  const allAnswered = quiz ? Object.keys(userAnswers).length === quiz.questions.length : false

  const handleGenerate = useCallback(async () => {
    if (!config.topic.trim()) return
    setLoading(true); setError(null); setQuiz(null); setUserAnswers({}); setShowResult(false)
    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.NEXT_PUBLIC_GROQ_API_KEY}` },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant', max_tokens: 1000,
          messages: [
            { role: 'system', content: `You are a quiz generator. Return ONLY valid JSON with this structure: {"title":"string","description":"string","questions":[{"id":1,"question":"string","options":[{"label":"A","text":"string"},{"label":"B","text":"string"},{"label":"C","text":"string"},{"label":"D","text":"string"}],"correctAnswer":"A","explanation":"string"}]}` },
            { role: 'user', content: `Generate a ${config.difficulty } quiz about "${config.topic}". ${config.numQuestions} questions. Type: ${config.questionType}.` }],
        }),
      })
      if (!res.ok) throw new Error('Failed')
      const data = await res.json() as any
      const text = data.choices?.[0]?.message?.content ?? ''
      setQuiz(JSON.parse(text.replace(/```json|```/g, '').trim()))
    } catch { setError('Failed to generate quiz. Please try again.') }
    finally { setLoading(false) }
  }, [config])

  const handleExportJSON = () => {
    if (!quiz) return
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([JSON.stringify(quiz, null, 2)], { type: 'application/json' }))
    a.download = `quiz-${config.topic.replace(/\s+/g, '-')}.json`; a.click()
  }

  return (
    <div className="space-y-6">
      {!quiz && (
        <div className="space-y-5">
          <div>
            <label className="text-xs font-semibold uppercase tracking-widest text-violet-400 mb-1 block">Topic</label>
            <input type="text" placeholder="e.g. World War II, JavaScript, Human Anatomy…"
              value={config.topic} onChange={(e) => setConfig(c => ({ ...c, topic: e.target.value }))}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
              className="w-full bg-muted/40 border border-border rounded-xl px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-violet-500 transition-all" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div><label className="text-xs font-semibold uppercase tracking-widest text-violet-400 mb-1 block">Questions</label>
              <Select value={String(config.numQuestions)} onChange={(v) => setConfig(c => ({ ...c, numQuestions: Number(v) }))} options={[3,5,7,10,15].map(n => ({ value: String(n), label: `${n}` }))} /></div>
            <div><label className="text-xs font-semibold uppercase tracking-widest text-violet-400 mb-1 block">Difficulty</label>
              <Select value={config.difficulty} onChange={(v) => setConfig(c => ({ ...c, difficulty: v as Difficulty }))} options={[{ value: 'easy', label: 'Easy' }, { value: 'medium', label: 'Medium' }, { value: 'hard', label: 'Hard' }]} /></div>
            <div><label className="text-xs font-semibold uppercase tracking-widest text-violet-400 mb-1 block">Type</label>
              <Select value={config.questionType} onChange={(v) => setConfig(c => ({ ...c, questionType: v as QuestionType }))} options={[{ value: 'multiple-choice', label: 'MCQ' }, { value: 'true-false', label: 'True/False' }, { value: 'mixed', label: 'Mixed' }]} /></div>
          </div>
          <button onClick={handleGenerate} disabled={loading || !config.topic.trim()}
            className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm py-3.5 rounded-xl transition-all active:scale-[0.98]">
            {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Generating…</> : <><BookOpen className="w-4 h-4" />Generate Quiz</>}
          </button>
          {error && <p className="text-destructive text-xs text-center">{error}</p>}
        </div>
      )}
      {quiz && (
        <div className="space-y-6">
          <div className="bg-muted/40 border border-border rounded-2xl p-6">
            <div className="flex items-start justify-between gap-4">
              <div><h2 className="text-base font-bold mb-1">{quiz.title}</h2><p className="text-xs text-muted-foreground">{quiz.description}</p></div>
              <button onClick={() => { setQuiz(null); setUserAnswers({}); setShowResult(false) }} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-violet-400 transition-colors"><RotateCcw className="w-3.5 h-3.5" />New Quiz</button>
            </div>
            {showResult && (
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground">Your Score</span>
                  <span className="text-sm font-bold text-violet-400">{score} / {quiz.questions.length}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5">
                  <div className="bg-violet-500 h-1.5 rounded-full transition-all duration-700" style={{ width: `${(score / quiz.questions.length) * 100}%` }} />
                </div>
              </div>
            )}
          </div>
          <div className="space-y-4">
            {quiz.questions.map((q, i) => <QuizCard key={q.id} question={q} index={i} userAnswer={userAnswers[q.id]} onAnswer={(id, ans) => setUserAnswers(p => ({ ...p, [id]: ans }))} showResult={showResult} />)}
          </div>
          <div className="flex gap-3">
            {!showResult && <button onClick={() => setShowResult(true)} disabled={!allAnswered}
              className="flex-1 flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm py-3 rounded-xl transition-all">
              <CheckCircle2 className="w-4 h-4" />{allAnswered ? 'Submit Quiz' : `Answer all ${quiz.questions.length} questions`}
            </button>}
            <button onClick={async () => { await navigator.clipboard.writeText(JSON.stringify(quiz, null, 2)); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
              className="flex items-center gap-1.5 px-4 py-3 rounded-xl border border-border text-muted-foreground hover:text-violet-400 text-xs font-medium transition-all">
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}{copied ? 'Copied!' : 'Copy JSON'}
            </button>
            <button onClick={handleExportJSON} className="flex items-center gap-1.5 px-4 py-3 rounded-xl border border-border text-muted-foreground hover:text-violet-400 text-xs font-medium transition-all">
              <Download className="w-3.5 h-3.5" />Export
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
