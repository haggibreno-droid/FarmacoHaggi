import { useState } from 'react'
import { ArrowRight, CircleHelp, Droplets, FlaskConical, HeartPulse, RotateCw, Sparkles, Waves } from 'lucide-react'

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

function App() {
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
        <div className="header-account"><span className="header-note">SEU ESPAÇO DE ESTUDO</span></div>
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
      </main>
    </div>
  )
}

export default App
