
(function(){
  const searchBox = document.getElementById('searchBox');
  const result = document.getElementById('searchResult');
  const panels = Array.from(document.querySelectorAll('.doc-panel, .section-block'));
  function normalize(s){ return (s || '').toLowerCase().normalize('NFKC'); }
  function runSearch(){
    const q = normalize(searchBox.value.trim());
    let shown = 0;
    panels.forEach(p => {
      p.classList.remove('highlight-hit');
      if(!q){ p.classList.remove('hidden-by-search'); shown++; return; }
      const hit = normalize(p.innerText).includes(q);
      p.classList.toggle('hidden-by-search', !hit);
      if(hit){ shown++; p.classList.add('highlight-hit'); }
    });
    result.textContent = q ? `${shown} セクションがヒットしました。` : '検索語を入力すると該当セクションを絞り込みます。';
  }
  searchBox && searchBox.addEventListener('input', runSearch);
  document.getElementById('clearSearch')?.addEventListener('click', () => { searchBox.value=''; runSearch(); });
  document.getElementById('expandAll')?.addEventListener('click', () => { searchBox.value=''; runSearch(); });
  document.getElementById('printPage')?.addEventListener('click', () => window.print());

  const progressInputs = Array.from(document.querySelectorAll('[data-progress]'));
  progressInputs.forEach(input => {
    const key = 'french-study-' + input.dataset.progress;
    input.checked = localStorage.getItem(key) === '1';
    input.closest('.check-card')?.classList.toggle('done', input.checked);
    input.addEventListener('change', () => {
      localStorage.setItem(key, input.checked ? '1' : '0');
      input.closest('.check-card')?.classList.toggle('done', input.checked);
    });
  });

  document.querySelectorAll('[data-copy-section]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.getAttribute('data-copy-section');
      const sec = document.getElementById(id);
      const title = sec?.querySelector('.doc-heading h2')?.innerText || id;
      try{ await navigator.clipboard.writeText(title); btn.textContent = 'コピー済み'; setTimeout(()=>btn.textContent='章タイトルをコピー',1200); }catch(e){ alert(title); }
    });
  });

  const back = document.getElementById('backToTop');
  window.addEventListener('scroll', () => { back.classList.toggle('show', window.scrollY > 800); });
  back?.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));
})();
