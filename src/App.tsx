import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, BookOpen, Check, RotateCw, Volume2, VolumeX, Waves, Trophy, GitBranch, House, RotateCcw } from 'lucide-react'
import { drugs, type Drug } from './pharmacologyData'

type View = 'home' | 'mission' | 'result' | 'flow' | 'reference'
type Question = { id: string; prompt: string; answer: string; choices: string[]; explanation: string; source: string }
type SavedState = { remaining: string[]; history: string[]; answers: Record<string, {correct: number; total: number}>; flowDone: string[] }
const KEY = 'laboratorio-farmacologia-progress-v1'
const initialSaved = (): SavedState => ({remaining: drugs.map(d=>d.id), history: [], answers: {}, flowDone: []})
function readSaved(): SavedState { try { const raw = localStorage.getItem(KEY); if (!raw) return initialSaved(); const parsed = JSON.parse(raw) as SavedState; return { ...initialSaved(), ...parsed } } catch { return initialSaved() } }
function shuffle<T,>(items:T[]):T[] { const copy=[...items]; for(let i=copy.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]]} return copy }
function questionsFor(drug: Drug): Question[] {
  const questions: Question[] = []
  const otherGroups = drugs.filter(d=>d.group!==drug.group)
  const make = (id:string,prompt:string,answer:string,wrong:string[],explanation:string) => {
    const choices = shuffle(Array.from(new Set([answer,...wrong.filter(Boolean).filter(x=>x!==answer)])).slice(0,4))
    if(choices.length>=2) questions.push({id,prompt,answer,choices,explanation,source:''})
  }
  make('class', 'A qual classe farmacológica o fármaco pertence?', drug.className, shuffle(otherGroups.map(d=>d.className)).filter(x=>x!==drug.className).filter((x,i,a)=>a.indexOf(x)===i).slice(0,3), 'Revise a relação entre o fármaco e sua classificação.')
  if(drug.receptor) make('receptor','Qual receptor ou alvo é indicado no material para este fármaco?',drug.receptor,shuffle(drugs.filter(d=>d.receptor && d.receptor!==drug.receptor).map(d=>d.receptor!)).filter((x,i,a)=>a.indexOf(x)===i).slice(0,3),'Revise a relação entre o fármaco e seu alvo.')
  if(drug.effect) make('effect','Qual efeito principal está associado a este fármaco?',drug.effect,shuffle(drugs.filter(d=>d.effect && d.effect!==drug.effect).map(d=>d.effect!).filter(x=>x.length<125)).slice(0,3),'Revise a relação entre o fármaco e seu efeito.')
  if(drug.indications) make('indication','Qual indicação aparece no material para este fármaco?',drug.indications,shuffle(drugs.filter(d=>d.indications && d.indications!==drug.indications).map(d=>d.indications!).filter(x=>x.length<105)).slice(0,3),'Revise a informação farmacológica.')
  return questions
}
function App() {
  const [view,setView] = useState<View>('home')
  const [saved,setSaved] = useState<SavedState>(()=>readSaved())
  const [selected,setSelected] = useState<Drug|null>(null)
  const [pendingDrug,setPendingDrug] = useState<Drug|null>(null)
  const [revealing,setRevealing] = useState(false)
  const [rotation,setRotation] = useState(0)
  const [spinning,setSpinning] = useState(false)
  const [sound,setSound] = useState(false)
  const [questionIndex,setQuestionIndex] = useState(0)
  const [questions,setQuestions] = useState<Question[]>([])
  const [choice,setChoice] = useState('')
  const [confirmed,setConfirmed] = useState(false)
  const [sessionResults,setSessionResults] = useState<boolean[]>([])
  const [flowChoice,setFlowChoice] = useState('')
  const [flowChecked,setFlowChecked] = useState(false)
  const [search,setSearch] = useState('')
  const [wheelListOpen,setWheelListOpen] = useState(false)
  useEffect(()=>{ localStorage.setItem(KEY,JSON.stringify(saved)) },[saved])
  const available = useMemo(()=>drugs.filter(d=>saved.remaining.includes(d.id)),[saved.remaining])
  const currentQuestion = questions[questionIndex]
  const correctCount = sessionResults.filter(Boolean).length
  const filteredDrugs = useMemo(()=>drugs.filter(d=>(d.name+' '+d.group+' '+d.className).toLowerCase().includes(search.toLowerCase())),[search])
  function beep(freq=650,duration=.055){ if(!sound) return; try { const Ctx=window.AudioContext || (window as any).webkitAudioContext; const ctx=new Ctx(); const osc=ctx.createOscillator(); const gain=ctx.createGain(); osc.type='sine'; osc.frequency.value=freq; gain.gain.value=.035; osc.connect(gain); gain.connect(ctx.destination); osc.start(); gain.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+duration); osc.stop(ctx.currentTime+duration); osc.onended=()=>ctx.close() } catch {} }
  function beginMissionFor(drug: Drug){ const qs=questionsFor(drug);setQuestions(qs);setQuestionIndex(0);setChoice('');setConfirmed(false);setSessionResults([]);setRevealing(false);setView('mission') }
  function startMission(){ if(!selected)return; beginMissionFor(selected) }
  function spin(){ if(spinning || revealing || available.length===0) return; const index=Math.floor(Math.random()*available.length); const drug=available[index]; const step=360/available.length; const target=(360-(index+.5)*step+360)%360; const next=rotation + 360*5 + ((target-(rotation%360)+360)%360); setSelected(null);setPendingDrug(drug);setRevealing(false);setSpinning(true);setRotation(next); let ticks=0; const interval=window.setInterval(()=>{ticks++;beep(ticks>15?900:560, ticks>15?.035:.025);if(ticks>=22)window.clearInterval(interval)},125); window.setTimeout(()=>{setSpinning(false);setSelected(drug);setPendingDrug(null);setRevealing(true);setSaved(prev=>({...prev,remaining:prev.remaining.filter(id=>id!==drug.id),history:prev.history.includes(drug.id)?prev.history:[...prev.history,drug.id]}));beep(820,.12);window.setTimeout(()=>beginMissionFor(drug),3000)},4200) }
  function confirmAnswer(){ if(!choice||confirmed||!currentQuestion||!selected)return;const ok=choice===currentQuestion.answer;setSessionResults(prev=>[...prev,ok]);setConfirmed(true);beep(ok?800:260,.1) }
  function nextQuestion(){if(!selected)return;if(questionIndex+1>=questions.length){const total=sessionResults.length;setSaved(prev=>({...prev,answers:{...prev.answers,[selected.id]:{correct:sessionResults.filter(Boolean).length,total}}}));setView('result');return}setQuestionIndex(i=>i+1);setChoice('');setConfirmed(false)}
  function newRound(){setSaved(prev=>({...prev,remaining:drugs.map(d=>d.id)}));setSelected(null);setView('home')}
  function goHome(){setView('home');setSelected(null)}
  const [flowChoices,setFlowChoices] = useState<string[]>([])
  useEffect(()=>{setFlowChoices(selected?shuffle(Array.from(new Set(drugs.map(d=>d.group)))).slice(0,4).filter(g=>g!==selected.group).concat(selected.group).sort(()=>Math.random()-.5):[])},[selected?.id,view])
  function checkFlow(){if(!selected||!flowChoice)return;setFlowChecked(true);if(flowChoice===selected.group){setSaved(prev=>({...prev,flowDone:Array.from(new Set([...prev.flowDone,selected.id]))}));beep(780,.1)}else beep(260,.1)}
  return <div className="aero-app lab-app">
    <div className="sky-wash" aria-hidden="true"/><div className="floating-bubble bubble-one"/><div className="floating-bubble bubble-two"/><div className="floating-bubble bubble-three"/>
    <header className="site-header aero-window lab-header">
      <a className="brand" href="#inicio" onClick={e=>{e.preventDefault();goHome()}}><span className="brand-icon"><span className="brand-drop"><Waves size={23}/></span></span><span className="brand-wordmark">Laboratório <span>de Farmacologia</span><small>ESTUDO INTERATIVO · ENFERMAGEM</small></span></a>
      <nav className="header-nav"><button className={view==='home'?'nav-active':''} onClick={goHome}><House size={14}/> Início</button><button className={view==='flow'?'nav-active':''} onClick={()=>setView('flow')} disabled={view==='mission'||spinning||revealing}><GitBranch size={14}/> Fluxograma</button><button className={view==='reference'?'nav-active':''} onClick={()=>{setSearch('');setView('reference')}} disabled={view==='mission'||spinning||revealing}><BookOpen size={14}/> Fármacos</button></nav>
      <button className="sound-toggle" onClick={()=>setSound(s=>!s)} aria-label={sound?'Desativar sons':'Ativar sons'} title={sound?'Desativar sons':'Ativar sons'}>{sound?<Volume2 size={17}/>:<VolumeX size={17}/>}<span>Som {sound?'ligado':'desligado'}</span></button>
    </header>
    <main id="inicio" className="lab-main">
      {view==='home' && <>
        <div className="lab-topline"><span><i className="status-lamp"/> LABORATÓRIO DE FARMACOLOGIA</span><span>{saved.history.length} / {drugs.length} sorteados nesta rodada</span></div>
        <section className="roulette-hero">
          <div className="roulette-title"><span className="section-kicker">SORTEIO DE ESTUDO</span><h1>Qual será o próximo <em>fármaco?</em></h1></div>
          <div className="roulette-stage">
            <div className="roulette-glow"/>
            <div className={'roulette-wheel '+(spinning?'wheel-spinning':'')} style={{transform:'rotate('+rotation+'deg)'}}>
              <div className="wheel-face" style={{background: 'conic-gradient('+available.map((_,i)=>{const hue=196+(i%5)*7;return 'hsl('+hue+' 76% '+(84+(i%3)*3)+'%) '+(i*100/Math.max(available.length,1))+'% '+((i+1)*100/Math.max(available.length,1))+'%'}).join(',')+')'}}>
                <div className="wheel-center"><Waves size={29}/><small>FÁRMACO</small></div>
                {!spinning && available.length<=18 && available.map((d,i)=> <span key={d.id} className="wheel-label" style={{transform:'translate(-50%,-50%) rotate('+(i*360/available.length+180/available.length)+'deg) translateY(-112px)'}}>{d.name}</span>)}
              </div>
            </div>
            <div className="roulette-pointer" aria-hidden="true"><span/></div>
          </div>
          {revealing && selected && <div className="draw-result reveal-result" key={selected.id}><span>FÁRMACO SORTEADO</span><strong>{selected.name}</strong></div>}
          {!selected && !spinning && <p className="roulette-caption">{available.length ? 'Uma rodada por fármaco · sem repetição' : 'Todos os fármacos desta rodada foram sorteados.'}</p>}
          <button className="aero-button spin-button lab-spin" onClick={spin} disabled={spinning||revealing||available.length===0}><RotateCw size={17} className={spinning?'rotate-icon':''}/>{spinning?'Girando…':revealing?'Fármaco sorteado…':available.length===0?'Rodada concluída':'Girar roleta'}</button>
          {available.length===0 && <button className="soft-action" onClick={newRound}><RotateCcw size={15}/> Iniciar nova rodada</button>}
          <div className="wheel-meta"><span><span className="signal-dot"/> {available.length} elegíveis</span><button className="text-button" onClick={()=>setWheelListOpen(v=>!v)}>{wheelListOpen?'Ocultar lista':'Ver lista de fármacos'}</button></div>
          {wheelListOpen && !spinning && <div className="eligible-list">{available.map(d=><span key={d.id}>{d.name}</span>)}{available.length===0&&<span>Rodada concluída</span>}</div>}
        </section>
        <section className="lab-bottom-nav"><button onClick={()=>setView('reference')}><BookOpen size={18}/><span><strong>Consultar conteúdo</strong><small>{drugs.length} fármacos cadastrados</small></span><ArrowRight size={16}/></button><button onClick={()=>setView('flow')}><GitBranch size={18}/><span><strong>Fluxograma</strong><small>{saved.flowDone.length} classificações concluídas</small></span><ArrowRight size={16}/></button><div className="progress-mini"><span>Progresso da rodada</span><strong>{Math.round(saved.history.length/drugs.length*100)}%</strong><div><i style={{width:(saved.history.length/drugs.length*100)+'%'}}/></div></div></section>
      </>}
      {view==='mission' && selected && currentQuestion && <section className="study-screen glass-panel">
        <div className="screen-top"><button className="back-button" onClick={()=>setView('home')}><ArrowLeft size={16}/> Sair da missão</button><span>MISSÃO · {selected.name}</span></div>
        <div className="question-progress"><span>Questão {questionIndex+1} de {questions.length}</span><div>{questions.map((q,i)=><i key={q.id} className={i<questionIndex?'done':i===questionIndex?'current':''}/>)}</div></div>
        <span className="section-kicker">FÁRMACO EM ESTUDO</span><h1 className="drug-title">{selected.name}</h1><h2 className="question-title">{currentQuestion.prompt}</h2>
        <div className="answer-options">{currentQuestion.choices.map((c,i)=><button key={c} className={'answer-option '+(choice===c?'chosen':'')+(confirmed&&c===currentQuestion.answer?' correct':'')+(confirmed&&choice===c&&c!==currentQuestion.answer?' incorrect':'')} onClick={()=>!confirmed&&setChoice(c)} disabled={confirmed}><span>{String.fromCharCode(65+i)}</span>{c}{confirmed&&c===currentQuestion.answer&&<Check size={18}/>}</button>)}</div>
        {confirmed && <div className={'answer-feedback '+(choice===currentQuestion.answer?'feedback-correct':'feedback-wrong')}><strong>{choice===currentQuestion.answer?'Resposta correta':'Vamos revisar'}</strong><p>{currentQuestion.explanation}</p></div>}
        <div className="question-footer"><span>{confirmed?sessionResults[sessionResults.length-1]?'Acerto registrado':'Resposta registrada':'Escolha uma alternativa'}</span>{!confirmed?<button className="aero-button primary-action" disabled={!choice} onClick={confirmAnswer}>Confirmar resposta <Check size={16}/></button>:<button className="aero-button primary-action" onClick={nextQuestion}>{questionIndex+1===questions.length?'Ver resultado':'Próxima questão'} <ArrowRight size={16}/></button>}</div>
      </section>}
      {view==='result' && selected && <section className="study-screen glass-panel result-screen">
        <div className="result-trophy"><Trophy size={30}/></div><span className="section-kicker">MISSÃO CONCLUÍDA</span><h1>{selected.name}</h1><p className="result-subtitle">Seu resultado nesta missão</p>
        <div className="score-grid"><div><strong>{sessionResults.length}</strong><span>Respondidas</span></div><div><strong>{correctCount}</strong><span>Acertos</span></div><div><strong>{sessionResults.length-correctCount}</strong><span>Erros</span></div><div><strong>{Math.round(correctCount/Math.max(sessionResults.length,1)*100)}%</strong><span>Aproveitamento</span></div></div>
        <div className="review-list"><h2>Revisão das respostas</h2>{questions.map((q,i)=><div key={q.id} className="review-item"><span className={sessionResults[i]?'review-ok':'review-no'}>{sessionResults[i]?'✓':'!'}</span><div><strong>{q.prompt}</strong><p>Resposta: {q.answer}</p></div></div>)}</div>
        <div className="result-actions"><button className="aero-button primary-action" onClick={()=>setView('flow')}>Classificar no fluxograma <GitBranch size={16}/></button><button className="soft-action" onClick={()=>setView('reference')}>Consultar fármaco</button><button className="soft-action" onClick={goHome}>Voltar à roleta <RotateCcw size={15}/></button></div>
      </section>}
      {view==='flow' && <section className="study-screen glass-panel flow-screen">
        <div className="screen-top"><button className="back-button" onClick={goHome}><ArrowLeft size={16}/> Início</button><span>ATIVIDADE DE CLASSIFICAÇÃO</span></div>
        <span className="section-kicker">FLUXOGRAMA INTERATIVO</span><h1>Onde esse fármaco se encaixa?</h1><p className="muted-copy">Escolha a categoria que considera correta.</p>
        {!selected ? <div className="flow-empty"><BookOpen size={24}/><p>Sorteie um fármaco primeiro para iniciar a classificação.</p><button className="aero-button primary-action" onClick={goHome}>Ir à roleta <ArrowRight size={16}/></button></div> : <><div className="flow-chain"><div>CLASSE / GRUPO</div><ArrowRight size={18}/><div className="flow-drug" draggable onDragStart={e=>e.dataTransfer.setData("text/plain",selected.id)} title="Arraste para uma categoria">{selected.name}</div></div><h2 className="flow-question">Selecione o grupo farmacológico:</h2><div className="flow-targets">{flowChoices.map(group=><button key={group} className={'flow-target '+(flowChoice===group?'chosen':'')+(flowChecked&&group===selected.group?' correct':'')+(flowChecked&&flowChoice===group&&group!==selected.group?' incorrect':'')} onClick={()=>{if(!flowChecked)setFlowChoice(group)}} onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();if(!flowChecked)setFlowChoice(group)}} disabled={flowChecked}>{group}</button>)}</div>{flowChecked&&<div className={'answer-feedback '+(flowChoice===selected.group?'feedback-correct':'feedback-wrong')}><strong>{flowChoice===selected.group?'Classificação correta!':'Ainda não.'}</strong><p>{selected.name} pertence ao grupo {selected.group}.</p></div>}<div className="question-footer"><span>{saved.flowDone.length} fármacos classificados</span>{!flowChecked?<button className="aero-button primary-action" disabled={!flowChoice} onClick={checkFlow}>Verificar <Check size={16}/></button>:<button className="aero-button primary-action" onClick={()=>{setFlowChoice('');setFlowChecked(false);setView('home')}}>Concluir <ArrowRight size={16}/></button>}</div></>}
      </section>}
      {view==='reference' && <section className="reference-screen glass-panel"><div className="screen-top"><button className="back-button" onClick={()=>setView(selected?'home':'home')}><ArrowLeft size={16}/> Voltar</button><span>CONSULTA</span></div><span className="section-kicker">CONSULTA FARMACOLÓGICA</span><h1>Fichas de fármacos</h1><div className="reference-search"><BookOpen size={17}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar fármaco ou classe…" aria-label="Buscar fármaco ou classe"/></div><div className="reference-grid">{filteredDrugs.map(d=><article className="drug-card" key={d.id}><div className="drug-card-top"><span>Fármaco</span></div><h2>{d.name}</h2><p><strong>Classe:</strong> {d.className}</p>{d.receptor&&<details><summary>Receptor</summary><p>{d.receptor}</p></details>}{d.effect&&<details><summary>Efeito principal</summary><p>{d.effect}</p></details>}{d.indications&&<details><summary>Indicações</summary><p>{d.indications}</p></details>}{d.notes&&<details><summary>Observações do material</summary><p>{d.notes}</p></details>}<button className="soft-action" onClick={()=>{setSelected(d);setView('home')}}>Selecionar para estudar <ArrowRight size={14}/></button></article>)}</div></section>}
      <footer className="lab-footer"><span>Laboratório de Farmacologia · Por Haggi</span><span>Estudo interativo de farmacologia</span></footer>
    </main>
  </div>
}
export default App
