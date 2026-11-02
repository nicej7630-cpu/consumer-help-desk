// Consumer Help Desk: site search. Runs on the page itself, so it works in every translated language.
const ENTRIES = [
  { t:'Getting a refund', k:'refund money back return seller chargeback', u:'guides.html#refunds', d:'Ask the seller in writing, keep receipts, and set a clear deadline.' },
  { t:'Faulty goods', k:'faulty broken defect damaged quality repair replacement', u:'guides.html#faulty', d:'What to do when goods break, or are not as described.' },
  { t:'Online shopping', k:'online shop website seller check reviews delivery', u:'guides.html#online', d:'Check the seller before you pay, and read the return policy.' },
  { t:'Subscriptions', k:'subscription cancel free trial recurring monthly charge', u:'guides.html#subscriptions', d:'Read the terms, and cancel in writing with proof.' },
  { t:'Money and banking', k:'bank account card payment fraud unauthorised transaction', u:'guides.html#money', d:'If your bank account or card is misused, act quickly.' },
  { t:'Scam alerts', k:'scam fraud fake phishing text message delivery investment romance', u:'scam-alerts.html', d:'Warning signs, and what to do if you think you have been scammed.' },
  { t:'File a complaint', k:'complaint report problem issue send', u:'complaint.html', d:'Send your complaint privately to the Help Desk.' },
  { t:'Check your complaint', k:'status reference progress check', u:'status.html', d:'See the status of a complaint you have sent.' },
  { t:'Share your experience', k:'testimony story experience review', u:'testimony.html', d:'Tell others what happened, with your consent.' },
  { t:'Privacy notice', k:'privacy data personal information', u:'privacy.html', d:'What we collect, why, and your choices.' }
];

function searchSite(q){
  const words = q.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if(!words.length) return [];
  return ENTRIES.filter(e => {
    const hay = (e.t + ' ' + e.k + ' ' + e.d).toLowerCase();
    return words.every(w => hay.includes(w));
  });
}

function attachSearch(){
  const input = document.getElementById('sq');
  const box = document.getElementById('sr');
  if(!input || !box) return;
  input.addEventListener('input', () => {
    const q = input.value.trim();
    if(!q){ box.innerHTML = ''; return; }
    const res = searchSite(q);
    box.innerHTML = res.length
      ? res.map(r => '<a class="sr-item" href="' + r.u + '"><b>' + r.t + '</b><span>' + r.d + '</span></a>').join('')
      : '<div class="sr-none">No matching topic. Try another word, or <a href="contact.html">contact us</a>.</div>';
  });
}

(function addSearchStyle(){
  const st = document.createElement('style');
  st.textContent = '.sbox{max-width:640px;margin:1.2rem auto 0;padding:0 1.2rem;position:relative}' +
    '.sbox label{display:block;font-weight:700;color:#0F5C8F;margin-bottom:.4rem}' +
    '.sbox input{width:100%;padding:.8rem 1rem;border:1px solid #CBD5E1;border-radius:8px;font:inherit}' +
    '.sbox input:focus{outline:2px solid #1D6FA3;border-color:#1D6FA3}' +
    '.sr{margin-top:.5rem}' +
    '.sr-item{display:block;background:#fff;border:1px solid #D6DEE6;border-radius:8px;padding:.7rem .9rem;margin-bottom:.5rem;text-decoration:none;color:#1B1B1B}' +
    '.sr-item b{display:block;color:#0F5C8F}.sr-item span{font-size:.9rem;color:#3A3A3A}' +
    '.sr-none{padding:.6rem;color:#5A6B7A;font-size:.92rem}';
  document.head.appendChild(st);
})();

document.addEventListener('DOMContentLoaded', attachSearch);
