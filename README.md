# FarmacoHaggi

Plataforma autoral de estudos de Farmacologia aplicada à Enfermagem, com identidade visual Frutiger Aero, azul-bebê e referências da internet retrô dos anos 90/2000.

## Tecnologias

- React + TypeScript + Vite
- Lucide React
- Supabase Auth e Postgres com Row Level Security (RLS), preparados para configuração

## Rodar localmente

Requer Node.js.

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Ativar autenticação real e dados privados

1. Crie um projeto no Supabase.
2. Em Project Settings / API, copie a Project URL e a chave publicável (ou anon key legada).
3. Preencha `.env.local` usando o formato de `.env.example`.
4. No Supabase, abra SQL Editor e execute `supabase/schema.sql`.
5. Em Authentication / URL Configuration, configure a Site URL e as Redirect URLs do endereço local e, após o deploy, do domínio publicado.
6. Ajuste as opções de confirmação de e-mail em Authentication conforme desejar.

**Nunca** coloque a `service_role` key no frontend ou em variáveis `VITE_*`. O frontend usa somente a chave publicável/anon; o isolamento dos dados deve ser garantido pelas políticas RLS do banco.

O modal já implementa cadastro por e-mail/senha, login, sair e solicitação de recuperação de senha via Supabase Auth. Sem as variáveis de ambiente, o site informa que a integração ainda precisa ser configurada e não simula autenticação.

## Banco de dados e privacidade

O arquivo `supabase/schema.sql` cria tabelas de dados pessoais de estudo e sessões futuras da roleta, ambas com políticas RLS vinculando os registros a `auth.uid()`. A aplicação ainda não grava resultados da roleta, pois as regras e categorias serão fornecidas posteriormente.

## Roleta

A roleta é um componente modular preparado para receber opções tipadas. O conjunto de opções permanece intencionalmente vazio; o botão fica desabilitado até que Haggi forneça as categorias, regras e resultados reais. Não foram inventadas perguntas ou segmentos educacionais.

## Estado e validação

A reformulação foi gravada no GitHub. É necessário instalar dependências e executar `npm run build` localmente ou em CI para validar a compilação. Cadastro/login reais dependem de configurar um projeto Supabase e executar o SQL acima. O deploy não foi realizado.

Projeto criado por Haggi.
