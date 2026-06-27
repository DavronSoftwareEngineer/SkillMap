// Defensive, dependency-free highlighter. Takes raw code + language,
// returns an HTML string (already escaped) for use in <code>.
function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function highlight(raw: string, lang: string): string {
  let s = esc(raw);
  const bag: string[] = [];
  const stash = (html: string) => {
    bag.push(html);
    return "\u0001" + (bag.length - 1) + "\u0002";
  };

  let commentRe: RegExp;
  if (lang === "sql") commentRe = /--[^\n]*/g;
  else if (["bash", "yaml", "toml", "nginx", "dockerfile"].includes(lang)) commentRe = /#[^\n]*/g;
  else commentRe = /\/\/[^\n]*/g;

  s = s.replace(commentRe, (m) => stash(`<span class="tc">${m}</span>`));
  s = s.replace(/("[^"\n]*"|'[^'\n]*')/g, (m) => stash(`<span class="ts">${m}</span>`));
  s = s.replace(/\bST_[A-Za-z]+/g, (m) => stash(`<span class="tf">${m}</span>`));
  s = s.replace(/@[A-Za-z]+/g, (m) => stash(`<span class="tn">${m}</span>`));
  try {
    s = s.replace(/(?<![\u0001\d.])\d+(?:\.\d+)?(?![\d.\u0002])/g, (m) => stash(`<span class="tn">${m}</span>`));
  } catch {
    /* lookbehind unsupported - skip number colouring */
  }
  s = s.replace(/\u0001(\d+)\u0002/g, (_, i) => bag[+i]);
  return s;
}
