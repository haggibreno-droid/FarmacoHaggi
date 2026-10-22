import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import {
  ArrowRight, CheckCircle2, ChevronDown, CircleHelp, Droplets, Eye, EyeOff,
  FlaskConical, HeartPulse, LockKeyhole, Mail, RotateCw, ShieldCheck, Sparkles,
  UserRound, Waves, X,
} from 'lucide-react'
import type { Session } from '@supabase/supabase-js'
import { supabase, supabaseConfigured } from './lib/supabase'

type AuthMode = 'login' | 'signup' | 'recovery'
type WheelOption = { id: string; label: string; color?: string }

// Intentionally empty until Haggi supplies the definitive wheel rules and content.
const wheelOptions: WheelOption[] = []

function WheelStage({ options }: { options: WheelOption[] }) {
  const [spinning, setSpinning] = useState(false)
  const [message, setMessage] = useState('Aguardando as regras da roleta')
  const [selectedResult, setSelectedResult] = useState<WheelOption | null>(null)

  const canSpin = options.length > 0 && !spinning

  function spin() {
    if (!canSpin) return
    setSpinning(true)
    setSelectedResult(null)
    setMessage('Preparando sua rodada…')
    window.setTimeout(() => {
      const result = options[Math.floor(Math.random() * options.length)]
      setSelectedResult(result)
      setSpinning(false)
      setMessage('Resultado da rodada')
    }, 1800)
  }

  return (
    <section className="wheel-panel glass-panel" aria-labelledby="wheel-title">
      <div className="panel-topline">
        <span className="mini-window-icon"><Waves size={15} /></span>
        <span>FARMACOHAGGI / INTERAÇÃO</span>
        <span className="window-status"><i /> COMPONENTE PREPARADO</span>
      </div>
      <div className="wheel-layout">
        <div className={`wheel-wrap ${spinning ? 'is-spinning' : ''}`}>
          <div className="wheel-halo halo-a" />
          <div className="wheel-halo halo-b" />
          <div className="wheel-bubble bubble-a" />
          <div className="wheel-bubble bubble-b" />
          <div className="wheel-disc" aria-hidden="true">
            <div className="disc-shine" />
            <div className="disc-orbit orbit-a" />
            <div className="disc-orbit orbit-b" />
            <div className="disc-center"><HeartPulse size={45} strokeWidth={1.5} /></div>
            <span className="disc-spark spark-a">✦</span><span className="disc-spark spark-b">✧</span>
          </div>
          <div className="wheel-pointer" aria-hidden="true">▼</div>
        </div>
        <div className="wheel-copy">
          <span className="aero-kicker"><Sparkles size={13} /> SEU ESPAÇO DE DESCOBERTA</span>
          <h2 id="wheel-title">Uma rodada de<br /><em>conhecimento.</em></h2>
          <p>A roleta será o coração do FarmacoHaggi. Estamos preparando o espaço para receber as suas regras e opções oficiais.</p>
          <div className="wheel-status-card">
            <span className="status-icon"><CircleHelp size={19} /></span>
            <div><strong>{selectedResult ? selectedResult.label : message}</strong><small>{selectedResult ? 'Resultado selecionado nesta rodada.' : options.length === 0 ? 'O conteúdo será adicionado quando você enviar as especificações.' : `${options.length} opções disponíveis`}</small></div>
          </div>
          <button className="aero-button spin-button" onClick={spin} disabled={!canSpin} aria-describedby="wheel-help">
            <RotateCw size={17} className={spinning ? 'rotate-icon' : ''} /> {spinning ? 'Girando…' : 'Girar a roleta'} <span className="button-glint" />
          </button>
          <p id="wheel-help" className="wheel-help">{options.length === 0 ? 'Disponível assim que definirmos as regras da roleta.' : 'Clique para iniciar uma rodada.'}</p>
        </div>
      </div>
      <div className="panel-bottomline"><span><span className="signal-dot" /> SISTEMA PRONTO PARA CONFIGURAÇÃO</span><span>v0.2 · BETA VISUAL</span></div>
    </section>
  )
}

function AuthDialog({ mode, onClose, onModeChange }: { mode: AuthMode; onClose: () => void; onModeChange: (mode: AuthMode) => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [busy, setBusy] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'error' | 'success' | 'info'; text: string } | null>(null)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFeedback(null)
    if (!supabase || !supabaseConfigured) {
      setFeedback({ type: 'info', text: 'A autenticação real precisa ser conectada a um projeto Supabase. As instruções estão no README.' })
      return
    }
    setBusy(true)
    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { data: { display_name: displayName.trim() } },
        })
        if (error) throw error
        setFeedback({ type: 'success', text: 'Cadastro enviado. Confira seu e-mail para confirmar a conta, se a confirmação estiver ativada no Supabase.' })
      } else if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
        if (error) throw error
        onClose()
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: `${window.location.origin}/`,
        })
        if (error) throw error
        setFeedback({ type: 'success', text: 'Se o endereço estiver cadastrado, você receberá um e-mail com as instruções de recuperação.' })
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Não foi possível concluir a solicitação.'
      setFeedback({ type: 'error', text: message })
    } finally {
      setBusy(false)
    }
  }

  const title = mode === 'signup' ? 'Crie seu espaço' : mode === 'recovery' ? 'Recupere o acesso' : 'Que bom ter você de volta'
  const description = mode === 'signup' ? 'Sua jornada de estudos começa com uma conta.' : mode === 'recovery' ? 'Vamos enviar as instruções para seu e-mail.' : 'Entre para continuar sua jornada de estudos.'

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section className="auth-modal aero-window" role="dialog" aria-modal="true" aria-labelledby="auth-title">
        <div className="modal-titlebar"><span><span className="titlebar-dot" /> CONTA FARMACOHAGGI</span><button onClick={onClose} aria-label="Fechar janela"><X size={17} /></button></div>
        <div className="auth-body">
          <div className="auth-mark"><LockKeyhole size={25} /></div>
          <h2 id="auth-title">{title}</h2><p className="auth-description">{description}</p>
          {!supabaseConfigured && <div className="setup-alert"><ShieldCheck size={17} /><span>Modo de configuração: conecte o Supabase para habilitar a autenticação real. Nenhum login falso será criado.</span></div>}
          <form onSubmit={submit}>
            {mode === 'signup' && <label className="field-label">Como podemos chamar você?<span className="field-control"><UserRound size={17} /><input value={displayName} onChange={(event) => setDisplayName(event.target.value)} placeholder="Seu nome" autoComplete="name" required /></span></label>}
            <label className="field-label">E-mail<span className="field-control"><Mail size={17} /><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="voce@exemplo.com" autoComplete="email" required /></span></label>
            {mode !== 'recovery' && <label className="field-label">Senha<span className="field-control"><LockKeyhole size={17} /><input type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Mínimo de 6 caracteres" autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} minLength={6} required /><button type="button" className="show-password" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></span></label>}
            {feedback && <div className={`form-feedback ${feedback.type}`} role="status">{feedback.text}</div>}
            <button className="aero-button auth-submit" type="submit" disabled={busy}>{busy ? 'Aguarde…' : mode === 'signup' ? 'Criar minha conta' : mode === 'recovery' ? 'Enviar instruções' : 'Entrar'} <ArrowRight size={16} /></button>
          </form>
          <div className="auth-switch">
            {mode === 'login' && <><span>Primeira vez aqui?</span><button onClick={() => onModeChange('signup')}>Criar conta</button><button className="forgot-link" onClick={() => onModeChange('recovery')}>Esqueci a senha</button></>}
            {mode === 'signup' && <><span>Já tem uma conta?</span><button onClick={() => onModeChange('login')}>Entrar</button></>}
            {mode === 'recovery' && <button onClick={() => onModeChange('login')}>Voltar para o login</button>}
          </div>
        </div>
      </section>
    </div>
  )
}

function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [authChecked, setAuthChecked] = useState(false)
  const [authMode, setAuthMode] = useState<AuthMode | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [accountMessage, setAccountMessage] = useState('')

  useEffect(() => {
    if (!supabase) {
      setAuthChecked(true)
      return
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setAuthChecked(true)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setAuthChecked(true)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  const displayName = useMemo(() => {
    const metaName = session?.user.user_metadata?.display_name
    return typeof metaName === 'string' && metaName.trim() ? metaName : session?.user.email?.split('@')[0] ?? 'Estudante'
  }, [session])

  async function signOut() {
    if (!supabase) return
    const { error } = await supabase.auth.signOut()
    setAccountMessage(error ? 'Não foi possível sair. Tente novamente.' : 'Você saiu da sua conta.')
    setMenuOpen(false)
  }

  return (
    <div className="aero-app">
      <div className="sky-wash" aria-hidden="true" />
      <div className="floating-bubble bubble-one" aria-hidden="true" /><div className="floating-bubble bubble-two" aria-hidden="true" /><div className="floating-bubble bubble-three" aria-hidden="true" />
      <header className="site-header aero-window">
        <a className="brand" href="#inicio" aria-label="FarmacoHaggi, início">
          <span className="brand-icon"><span className="brand-drop"><Droplets size={23} /></span><span className="brand-heart"><HeartPulse size={15} /></span></span>
          <span className="brand-wordmark">Farmaco<span>Haggi</span><small>PHARMACY STUDY LAB</small></span>
        </a>
        <nav className="header-nav" aria-label="Navegação principal"><a href="#roleta">A roleta</a><a href="#sobre">O projeto</a></nav>
        <div className="header-account">
          {session ? <div className="account-menu-wrap"><button className="account-chip" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen}><span className="account-avatar">{displayName.charAt(0).toUpperCase()}</span><span>{displayName}</span><ChevronDown size={14} /></button>{menuOpen && <div className="account-menu"><strong>{session.user.email}</strong><button onClick={signOut}>Sair da conta</button></div>}</div> : <><button className="text-button" onClick={() => setAuthMode('login')}>Entrar</button><button className="aero-button header-cta" onClick={() => setAuthMode('signup')}>Criar conta <ArrowRight size={14} /></button></>}
        </div>
      </header>

      <main id="inicio" className="page-content">
        <div className="intro-line"><span className="status-lamp" /> UM CANTINHO DE ESTUDO NA INTERNET <span className="intro-version">✦ WEB EDITION 2000</span></div>
        <section className="hero-copy">
          <div className="hero-text">
            <div className="hero-badge"><Sparkles size={14} /> CIÊNCIA, CUIDADO & CURIOSIDADE</div>
            <h1>Farmacologia com<br /><em>outro brilho.</em></h1>
            <p>Um espaço autoral para explorar a farmacologia aplicada à Enfermagem — com calma, clareza e um toque de nostalgia digital.</p>
            <a className="soft-link" href="#roleta">Conhecer a roleta <ArrowRight size={16} /></a>
          </div>
          <div className="hero-visual" aria-label="Ilustração decorativa aquática">
            <div className="cloud cloud-one" /><div className="cloud cloud-two" />
            <div className="hero-globe"><div className="globe-gloss" /><div className="globe-land land-one" /><div className="globe-land land-two" /><div className="globe-heart"><HeartPulse size={51} /></div></div>
            <div className="orbit orbit-one" /><div className="orbit orbit-two" />
            <div className="mini-bubble mb-one" /><div className="mini-bubble mb-two" /><div className="mini-bubble mb-three" />
            <div className="hero-caption"><span className="caption-dot" /> UM UNIVERSO DE POSSIBILIDADES</div>
          </div>
        </section>

        <section id="roleta" className="wheel-section">
          <div className="section-heading"><div><span className="section-kicker"><Waves size={14} /> O CENTRO DA EXPERIÊNCIA</span><h2>Pronto para girar?</h2><p>Um espaço reservado para a sua próxima descoberta.</p></div><div className="window-counter"><span>01</span> / 01 <span className="counter-dot" /></div></div>
          <WheelStage options={wheelOptions} />
        </section>

        <section id="sobre" className="about-strip aero-window">
          <span className="about-icon"><FlaskConical size={21} /></span><div><strong>Feito para aprender e cuidar.</strong><p>Um projeto de estudo independente, criado por Haggi, para aproximar a farmacologia da prática em Enfermagem.</p></div><span className="about-deco">✧</span>
        </section>
        <footer className="site-footer"><span>© FarmacoHaggi · Por Haggi</span><span><span className="footer-led" /> Conexão de estudo em andamento</span><a href="#inicio">Voltar ao topo ↑</a></footer>
        {accountMessage && <div className="toast-message" role="status"><CheckCircle2 size={16} />{accountMessage}<button onClick={() => setAccountMessage('')} aria-label="Fechar mensagem"><X size={14} /></button></div>}
      </main>
      {!authChecked && <div className="auth-check" aria-live="polite">Verificando sessão segura…</div>}
      {authMode && <AuthDialog mode={authMode} onClose={() => setAuthMode(null)} onModeChange={setAuthMode} />}
    </div>
  )
}

export default App