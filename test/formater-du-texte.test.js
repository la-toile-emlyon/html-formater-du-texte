const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

describe('HTML Formater du texte', () => {
  let htmlContent;
  let dom;
  let document;

  beforeAll(() => {
    const htmlPath = path.join(__dirname, '../index.html');
    
    
    // Read the HTML file
    // Lecture du fichier HTML
    htmlContent = fs.readFileSync(htmlPath, 'utf-8');
    
    // Parse HTML with jsdom
    // Parser le HTML avec jsdom
    dom = new JSDOM(htmlContent);
    document = dom.window.document;
  });

  test('Test n°1 : Le fichier index.html doit exister', () => {
    // index.html file should exist
    const htmlPath = path.join(__dirname, '../index.html');
    expect(fs.existsSync(htmlPath)).toBe(true);
  });

  test('Test n°2 : Le HTML doit être bien formé (pas de balises non fermées)', () => {
    // HTML should be well-formed (no unclosed tags)
    
    // Check that the HTML parses without errors
    // Vérifier que le HTML se parse sans erreurs
    expect(htmlContent).toBeTruthy();
    
    // Verify no orphan closing tags (basic check)
    // Vérifier qu'il n'y a pas de balises fermantes orphelines (vérification basique)
    const openTags = (htmlContent.match(/<(?!br|meta|link|img|hr)[a-z]+[^>]*(?<!\/)\s*>/gi) || []).length;
    const closeTags = (htmlContent.match(/<\/[a-z]+>/gi) || []).length;
    
    // More specific: check common unclosed tags
    // Plus spécifique : vérifier les balises courantes non fermées
    const unclosedPatterns = [
      /<\s*p(?:\s|>)[^]*?(?!<\/p>)(<\s*(?:p|div|h[1-6]|ul|ol|section|article)|\n\n|$)/i,
      /<\s*li(?:\s|>)[^]*?(?!<\/li>)(<\s*(?:li|ul|ol|div))/i,
      /<\s*strong(?:\s|>)[^]*?(?!<\/strong>)(<\s*[a-z]|<\/[a-z])/i,
      /<\s*em(?:\s|>)[^]*?(?!<\/em>)(<\s*[a-z]|<\/[a-z])/i
    ];
    
    expect(htmlContent).not.toMatch(/<\s*p\s*>(?![\s\S]*?<\/p>)/);
    expect(htmlContent).not.toMatch(/<\s*strong\s*>(?![\s\S]*?<\/strong>)/);
    expect(htmlContent).not.toMatch(/<\s*em\s*>(?![\s\S]*?<\/em>)/);
  });

  test('Test n°3 : Le HTML doit contenir une seule balise h1', () => {
    // HTML should contain a single h1 tag
    const h1Elements = document.querySelectorAll('h1');
    expect(h1Elements.length).toBe(1);
    expect(h1Elements[0].textContent.trim()).toBeTruthy();
  });

  test('Test n°4 : Le HTML doit contenir une balise h2', () => {
    // HTML should contain h2 tag
    const h2Elements = document.querySelectorAll('h2');
    expect(h2Elements.length).toBeGreaterThan(0);
  });

  test('Test n°5 : Le HTML doit contenir des balises p (paragraphe)', () => {
    // HTML should contain p (paragraph) tags
    const pElements = document.querySelectorAll('body p');
    expect(pElements.length).toBeGreaterThan(0);
    pElements.forEach(p => {
      expect(p.textContent.trim()).toBeTruthy();
    });
  });

  test('Test n°6 : Le HTML doit contenir des balises br (saut de ligne)', () => {
    // HTML should contain br (line break) tags
    const brElements = document.querySelectorAll('br');
    expect(brElements.length).toBeGreaterThan(0);
  });

  test('Test n°7 : Le HTML doit contenir une liste ordonnée (ol) avec des éléments li', () => {
    // HTML should contain ol (ordered list) with li elements
    const olElements = document.querySelectorAll('ol');
    expect(olElements.length).toBeGreaterThan(0);
    
    olElements.forEach(ol => {
      const liElements = ol.querySelectorAll(':scope > li');
      expect(liElements.length).toBeGreaterThan(0);
      liElements.forEach(li => {
        expect(li.textContent.trim()).toBeTruthy();
      });
    });
  });

  test('Test n°8 : Le HTML doit contenir une liste non ordonnée (ul) avec des éléments li', () => {
    // HTML should contain ul (unordered list) with li elements
    const ulElements = document.querySelectorAll('ul');
    expect(ulElements.length).toBeGreaterThan(0);
    
    ulElements.forEach(ul => {
      const liElements = ul.querySelectorAll(':scope > li');
      expect(liElements.length).toBeGreaterThan(0);
      liElements.forEach(li => {
        expect(li.textContent.trim()).toBeTruthy();
      });
    });
  });

  test('Test n°9 : Le HTML doit contenir des balises em (emphase/italique)', () => {
    // HTML should contain em (emphasis/italic) tags
    const emElements = document.querySelectorAll('em');
    expect(emElements.length).toBeGreaterThan(0);
    emElements.forEach(em => {
      expect(em.textContent.trim()).toBeTruthy();
    });
  });

  test('Test n°10 : Le HTML doit contenir des balises strong', () => {
    // HTML should contain strong tags
    const strongElements = document.querySelectorAll('strong');
    expect(strongElements.length).toBeGreaterThan(0);
    strongElements.forEach(strong => {
      expect(strong.textContent.trim()).toBeTruthy();
    });
  });

  test('Test n°11 : Tous les éléments li doivent être à l\'intérieur de ol ou ul', () => {
    // All li elements should be inside ol or ul
    const liElements = document.querySelectorAll('li');
    expect(liElements.length).toBeGreaterThan(0);
    
    liElements.forEach(li => {
      const parent = li.parentElement;
      expect(parent.tagName).toMatch(/^(OL|UL)$/);
    });
  });

  test('Test n°12 : Tous les éléments strong et em doivent avoir un contenu non vide', () => {
    // All strong and em elements should have non-empty content
    const formattingElements = document.querySelectorAll('strong, em');
    expect(formattingElements.length).toBeGreaterThan(0);
    
    formattingElements.forEach(element => {
      expect(element.textContent.trim()).toBeTruthy();
    });
  });

  test('Test n°13 : La structure HTML doit suivre un ordre logique (h1 avant h2/h3)', () => {
    // HTML structure should follow logical order (h1 before h2/h3)
    const h1 = document.querySelector('h1');
    const h2 = document.querySelector('h2');
    
    expect(h1).toBeTruthy();
    expect(h2).toBeTruthy();
    
    // h1 should appear before h2 in document order
    // h1 doit apparaître avant h2 dans l'ordre du document
    const h1Index = Array.from(document.body.querySelectorAll('*')).indexOf(h1);
    const h2Index = Array.from(document.body.querySelectorAll('*')).indexOf(h2);
    expect(h1Index).toBeLessThan(h2Index);
  });

  test('Test n°14 : Pas de balises fermantes orphelines sans balises ouvrantes correspondantes', () => {
    // No orphan closing tags without matching opening tags
    const closingTags = htmlContent.match(/<\/[a-z]+>/gi) || [];
    
    // Count opening and closing tags for key elements
    // Compter les balises ouvrantes et fermantes pour les éléments clés
    const tagsToCheck = ['p', 'strong', 'em', 'li', 'ol', 'ul', 'h1', 'h2', 'h3'];
    
    tagsToCheck.forEach(tag => {
      const openRegex = new RegExp(`<${tag}(?:\\s|>)`, 'gi');
      const closeRegex = new RegExp(`</${tag}>`, 'gi');
      
      const openCount = (htmlContent.match(openRegex) || []).length;
      const closeCount = (htmlContent.match(closeRegex) || []).length;
      
      expect(closeCount).toBeLessThanOrEqual(openCount);
    });
  });

  test('Test n°15 : Le body doit contenir toutes les balises requises', () => {
    // Body should contain all required tags
    const body = document.body;
    expect(body).toBeTruthy();
    
    // Verify that required tags are in the body
    // Vérifier que les balises requises sont dans le body
    expect(body.querySelector('h1')).toBeTruthy();
    expect(body.querySelector('h2')).toBeTruthy();
    expect(body.querySelector('p')).toBeTruthy();
    expect(body.querySelector('br')).toBeTruthy();
    expect(body.querySelector('ol')).toBeTruthy();
    expect(body.querySelector('ul')).toBeTruthy();
    expect(body.querySelector('em')).toBeTruthy();
    expect(body.querySelector('strong')).toBeTruthy();
  });

  test('Test n°16 : Tout le contenu du body doit être à l\'intérieur des balises', () => {
    // all body content should be inside tags
    const body = document.body;
    expect(body).toBeTruthy();
    
    // Check that all text content in body is inside tags (no direct text nodes)
    // Vérifier que tout le contenu textuel dans le body est à l'intérieur des balises (pas de nœuds textuels directs)
    const textNodes = Array.from(body.childNodes).filter(node => node.nodeType === 3 && node.textContent.trim() !== '');
    expect(textNodes.length).toBe(0);
  });

  test('Test n°17 (bonus): La langue du document doit être définie sur fr', () => {
    // Document language must be set to fr
    // La langue du document doit être définie sur fr
    const htmlElement = document.documentElement;
    expect(htmlElement).toBeTruthy();
    const lang = htmlElement.getAttribute('lang');
    expect(lang).toBe('fr');
  });

  test('Test n°18 (bonus): Le title du document doit être modifié (pas "Document")', () => {
    // Document title must be modified (not "Document")
    // Le titre du document doit être modifié (pas "Document")
    const title = document.title;
    expect(title).toBeTruthy();
    expect(title).not.toBe('Document');
  });
});
