import { useState } from 'react'
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  BookOpen,
  Bookmark,
  Brain,
  Check,
  ChevronRight,
  Clock3,
  FlaskConical,
  HeartPulse,
  Layers3,
  Search,
  Sparkles,
  Stethoscope,
  Syringe,
} from 'lucide-react'

type Topic = {
  title: string
  subtitle: string
  icon: typeof BookOpen
  color: string
  lessons: string
  progress: number
}

const topics: Topic[] = [
  { title: 'Fundamentos', subtitle: 'Conceitos essenciais e segurança', icon: FlaskConical, color: 'mint', lessons: '6 aulas', progress: 0 },
  { title: 'Farmacocinética', subtitle: 'O caminho do fármaco no corpo', icon: Activity, color: 'blue', lessons: '8 aulas', progress: 0 },
  { title: 'Farmacodinâmica', subtitle: 'Mecanismos de ação e efeitos', icon: Brain, color: 'lavender', lessons: '7 aulas', progress: 0 },
  { title: 'Vias de administração', subtitle: 'Escolha, técnica e cuidados', icon: Syringe, color: 'peach', lessons: '5 aulas', progress: 0 },
]

const quickLinks = [
  { title: 'Resumos', subtitle: 'Conteúdo direto ao ponto', icon: BookOpen },
  { title: 'Flashcards', subtitle: 'Revise e memorize', icon: Layers3 },
  { title: 'Questões', subtitle: 'Teste o que aprendeu', icon: Check },
]

function App() {
  const [search, setSearch] = useState('')
  const [activeNav, setActiveNav] = useState('Início')
  const [saved, setSaved] = useState(false)

  const filteredTopics = topics.filter((topic) =>
    `${topic.title} ${topic.subtitle}`.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#inicio" onClick={() => setActiveNav('Início')} aria-label="FarmacoHaggi início">
          <span className="brand-mark"><HeartPulse size={22} strokeWidth={2.1} /></span>
          <span className="brand-name">Farmaco<span>Haggi</span><small>ESTUDO COM PROPÓSITO</small></span>
        </a>

        <div className="sidebar-label">ESPAÇO DE ESTUDO</div>
        <nav className="main-nav" aria-label="Navegação principal">
          {[
            { name: 'Início', icon: Layers3 },
            { name: 'Conteúdos', icon: BookOpen },
            { name: 'Revisão', icon: Brain },
            { name: 'Questões', icon: Check },
          ].map(({ name, icon: Icon }) => (
            <button key={name} className={`nav-item ${activeNav === name ? 'active' : ''}`} onClick={() => setActiveNav(name)}>
              <Icon size={18} /><span>{name}</span>{activeNav === name && <span className="nav-dot" />}
            </button>
          ))}
        </nav>

        <div className="sidebar-note">
          <div className="note-icon"><Sparkles size={17} /></div>
          <p>Um passo de cada vez.</p>
          <span>Consistência também é progresso.</span>
          <div className="note-line"><span /></div>
        </div>

        <div className="sidebar-footer">
          <div className="avatar">H</div>
          <div className="profile-text"><strong>Seu espaço</strong><span>Por Haggi</span></div>
          <button className="icon-button" aria-label="Salvar página" onClick={() => setSaved(!saved)} title={saved ? 'Página salva' : 'Salvar página'}>
            <Bookmark size={17} fill={saved ? 'currentColor' : 'none'} />
          </button>
        </div>
      </aside>

      <main className="main-content" id="inicio">
        <header className="topbar">
          <div className="breadcrumb"><span>FarmacoHaggi</span><ChevronRight size={14} /><strong>{activeNav}</strong></div>
          <div className="topbar-right"><span className="status-dot" /> <span>Seu ritmo, seu caminho</span></div>
        </header>

        <section className="welcome-section">
          <div className="welcome-copy">
            <div className="eyebrow"><span className="eyebrow-line" /> SUA JORNADA COMEÇA AQUI</div>
            <h1>Aprender para <em>cuidar</em><br />melhor.</h1>
            <p>Farmacologia com clareza, organização e propósito — construída para acompanhar sua formação em Enfermagem.</p>
            <button className="primary-button" onClick={() => document.getElementById('conteudos')?.scrollIntoView({ behavior: 'smooth' })}>
              Explorar conteúdos <ArrowRight size={17} />
            </button>
          </div>
          <div className="hero-art" aria-label="Ilustração abstrata de cuidado e ciência">
            <div className="hero-circle circle-one" />
            <div className="hero-circle circle-two" />
            <div className="hero-cross"><span /><span /></div>
            <div className="hero-pill pill-one" />
            <div className="hero-pill pill-two" />
            <div className="hero-orbit orbit-one" />
            <div className="hero-orbit orbit-two" />
            <div className="hero-center"><HeartPulse size={62} strokeWidth={1.15} /></div>
            <div className="art-label label-top"><span className="tiny-dot" /> CIÊNCIA</div>
            <div className="art-label label-bottom">CUIDADO EM CADA DETALHE</div>
          </div>
        </section>

        <section className="stats-row" aria-label="Resumo do progresso">
          <div className="stat-card"><span className="stat-icon mint-bg"><BookOpen size={18} /></span><div><strong>26</strong><span>Aulas planejadas</span></div><span className="stat-caption">para começar</span></div>
          <div className="stat-card"><span className="stat-icon blue-bg"><Clock3 size={18} /></span><div><strong>No seu tempo</strong><span>Ritmo de estudo</span></div><span className="stat-caption">sem pressão</span></div>
          <div className="stat-card"><span className="stat-icon peach-bg"><Stethoscope size={18} /></span><div><strong>Enfermagem</strong><span>Foco na prática clínica</span></div><span className="stat-caption">teoria + cuidado</span></div>
        </section>

        <section className="content-section" id="conteudos">
          <div className="section-heading">
            <div><div className="eyebrow">TRILHA DE APRENDIZAGEM</div><h2>Por onde vamos começar?</h2><p>Escolha um tema e avance etapa por etapa.</p></div>
            <label className="search-box"><Search size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar conteúdo..." aria-label="Buscar conteúdo" /></label>
          </div>

          <div className="topic-grid">
            {filteredTopics.map(({ title, subtitle, icon: Icon, color, lessons, progress }, index) => (
              <article className="topic-card" key={title}>
                <div className="topic-top"><span className={`topic-icon ${color}`}><Icon size={21} /></span><span className="topic-number">0{index + 1}</span></div>
                <h3>{title}</h3><p>{subtitle}</p>
                <div className="topic-meta"><span>{lessons}</span><span>{progress}% iniciado</span></div>
                <div className="progress-track"><span style={{ width: `${progress}%` }} /></div>
                <button className="topic-link" onClick={() => setActiveNav('Conteúdos')}>Acessar trilha <ArrowDownRight size={16} /></button>
              </article>
            ))}
            {filteredTopics.length === 0 && <div className="empty-state">Nenhum tema encontrado para “{search}”. Tente outra palavra.</div>}
          </div>
        </section>

        <section className="bottom-row">
          <div className="study-banner">
            <div className="banner-symbol"><Brain size={24} /></div>
            <div><span className="banner-kicker">DICA DE ESTUDO</span><h3>Entender vem antes de decorar.</h3><p>Conecte o mecanismo de ação ao efeito clínico. A memorização fica mais natural.</p></div>
            <div className="banner-decoration" />
          </div>
          <div className="quick-card">
            <div className="quick-heading"><div><span className="eyebrow">PARA REVISAR</span><h3>Seu kit de estudo</h3></div><span className="quick-spark"><Sparkles size={18} /></span></div>
            {quickLinks.map(({ title, subtitle, icon: Icon }) => <button className="quick-link" key={title} onClick={() => setActiveNav(title)}><span className="quick-link-icon"><Icon size={17} /></span><span className="quick-link-text"><strong>{title}</strong><small>{subtitle}</small></span><ChevronRight size={16} /></button>)}
          </div>
        </section>

        <footer className="footer"><span>FarmacoHaggi <span className="footer-dot">·</span> Estudar também é uma forma de cuidar.</span><span>Feito com intenção <HeartPulse size={13} /></span></footer>
      </main>
    </div>
  )
}

export default App