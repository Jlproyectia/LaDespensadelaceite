import fs from 'node:fs';
import {arrowIcon} from './src/icons.js';

const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const translations = {...readJson('data/ui-en.json'), ...readJson('data/attributes-en.json')};
const escape = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
const englishReviews = fs.readFileSync('data/google-five-star.tsv', 'utf8').trim().split(/\r?\n/).map(line => line.split('\t')[1]);
const menu = readJson('data/menu.json');
for (const item of [...menu.sections.flatMap(section => section.items), ...menu.extras]) {
  translations[item.name + ' ' + (item.description || '')] = translations[item.name] + (item.description ? ' ' + translations[item.description] : '');
}
const ignored = new Set(['ES', 'EN', 'place', 'other', 'website', 'es_ES']);
function translate(value) {
  const text = value.trim();
  if (text === '4,6') return '4.6';
  if (/^\d+,\d{2}\s*€$/.test(text)) return '€' + text.replace(/\s*€$/, '').replace(',', '.');
  if (!text || !/[a-záéíóúñ]/i.test(text)) return value;
  if (Object.hasOwn(translations, text)) return value.replace(text, translations[text]);
  if (Object.hasOwn(translations, value)) return translations[value];
  if (text.startsWith('Ampliar: ')) return 'Enlarge: ' + translate(text.slice(9));
  for (const [suffix, english] of [[', recreación con IA', ', AI recreation'], [', interpretación con IA', ', AI interpretation']]) {
    if (text.endsWith(suffix)) return translate(text.slice(0, -suffix.length)) + english;
  }
  if (ignored.has(text) || /^(https?:|width=)/.test(text)) return value;
  throw new Error('Missing English translation: ' + text);
}

export function buildLanguages() {
  const pages = ['index', 'carta', 'galeria', 'celebraciones', 'opiniones', 'informacion'];
  for (const page of pages) {
    let spanish = fs.readFileSync(`dist/${page}.html`, 'utf8');
    const protectedBlocks = [];
    let english = spanish.replace(/<script\b[^>]*>[\s\S]*?<\/script>|<a class="review-card card"[\s\S]*?<\/a>/g, block => {
      const index = protectedBlocks.push(block) - 1;
      return `<!--protected:${index}-->`;
    });
    english = english.split(/(<[^>]+>)/g).map(part => part.startsWith('<')
      ? part.replace(/\b(alt|aria-label|placeholder|data-caption|data-name|content)="([^"]*)"/g, (_, attr, value) => `${attr}="${escape(translate(value))}"`)
      : translate(part)).join('');
    let reviewIndex = 0;
    english = english.replace(/<!--protected:(\d+)-->/g, (_, index) => {
      let block = protectedBlocks[Number(index)];
      if (block.startsWith('<a ')) {
        block = block.replace(/<blockquote[^>]*>.*?<\/blockquote>/s, `<blockquote lang="en">“${escape(englishReviews[reviewIndex++])}”</blockquote>`)
          .replace('5 de 5 estrellas', '5 out of 5 stars').replace('Reseña de Google · 5/5', 'Google review · 5/5');
      }
      return block;
    });
    english = english.replace('<html lang="es"', '<html lang="en"').replace('content="es_ES"', 'content="en_GB"')
      .replace(/href="(index|carta|galeria|celebraciones|opiniones|informacion)\.html/g, 'href="$1.en.html');
    // Keep canonical and structured-data URLs aligned with the English page.
    english = english.replace(/(<link rel="canonical" href=")([^"]+)(")/, (_, prefix, url, end) => prefix + url.replace(/[^/]*$/, `${page}.en.html`) + end);
    english = english.replace(/<script type="application\/ld\+json">(.*?)<\/script>/s, (_, json) => {
      const data = JSON.parse(json);
      data.inLanguage = 'en';
      data.hasMenu = data.hasMenu.replace('carta.html', 'carta.en.html');
      data.servesCuisine = ['Spanish', 'Mediterranean'];
      return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
    });
    for (const [language, html] of [['es', spanish], ['en', english]]) {
      const selector = `<div class="language-switch" role="group" aria-label="${language === 'es' ? 'Idioma' : 'Language'}"><a href="${page}.html" lang="es" hreflang="es" aria-label="Español"${language === 'es' ? ' aria-current="true"' : ''}>ES</a><span aria-hidden="true">/</span><a href="${page}.en.html" lang="en" hreflang="en" aria-label="English"${language === 'en' ? ' aria-current="true"' : ''}>EN</a></div>`;
      let output = html.replace('<button class="nav-toggle"', selector + '<button class="nav-toggle"');
      const toggle = output.match(/<button class="nav-toggle"[^>]*>[\s\S]*?<\/button>/)[0];
      output = output.replace(toggle, '').replace('<div class="nav-inner">', '<div class="nav-inner">' + toggle)
        .replace('</header>', '</header><div class="nav-backdrop" aria-hidden="true"></div>');
      const directions = {'↗':'external', '←':'left', '→':'right', '↓':'down', '↑':'up'};
      output = output.split(/(<script\b[^>]*>[\s\S]*?<\/script>|<[^>]+>)/g).map(part => part.startsWith('<') ? part : part.replace(/[↗←→↓↑]/g, arrow => arrowIcon(directions[arrow]))).join('');
      fs.writeFileSync(`dist/${page}${language === 'en' ? '.en' : ''}.html`, output);
    }
  }
  fs.copyFileSync('src/i18n.js', 'dist/i18n.js');
  fs.copyFileSync('src/icons.js', 'dist/icons.js');
  fs.copyFileSync('src/kitchen-scroll.js', 'dist/kitchen-scroll.js');
  fs.appendFileSync('dist/site.css', fs.readFileSync('src/languages.css', 'utf8'));
}
