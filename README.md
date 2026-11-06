# Escala 12x36 Annecy

Calendário da escala 12x36 (plantão dia sim, dia não), com feriados nacionais e municipais do Rio de Janeiro.

- Abre sempre no mês atual
- Toque em "Início da Escala" e escolha um dia em que você trabalhou; o resto é calculado sozinho
- A data fica salva no próprio aparelho (localStorage)

**App:** https://poolmix14.github.io/escala/

## Estrutura

- `app/` — código-fonte (React + Vite + Tailwind)
- raiz (`index.html`, `assets/`) — app compilado, que o GitHub Pages serve direto (Settings → Pages → Deploy from a branch → `main` / `root`)

## Desenvolvimento

```bash
npm install
npm run dev     # testar localmente
npm run build   # gera o app compilado na raiz; depois é só fazer commit e push
```
