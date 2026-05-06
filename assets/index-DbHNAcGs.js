(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))a(e);new MutationObserver(e=>{for(const r of e)if(r.type==="childList")for(const c of r.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&a(c)}).observe(document,{childList:!0,subtree:!0});function s(e){const r={};return e.integrity&&(r.integrity=e.integrity),e.referrerPolicy&&(r.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?r.credentials="include":e.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function a(e){if(e.ep)return;e.ep=!0;const r=s(e);fetch(e.href,r)}})();const l=[{id:"emma-johnson",name:"Emma Johnson"},{id:"liam-smith",name:"Liam Smith"},{id:"olivia-williams",name:"Olivia Williams"},{id:"noah-brown",name:"Noah Brown"},{id:"ava-jones",name:"Ava Jones"},{id:"elijah-davis",name:"Elijah Davis"},{id:"sophia-miller",name:"Sophia Miller"},{id:"lucas-wilson",name:"Lucas Wilson"},{id:"isabella-moore",name:"Isabella Moore"},{id:"mason-taylor",name:"Mason Taylor"},{id:"mia-anderson",name:"Mia Anderson"},{id:"ethan-thomas",name:"Ethan Thomas"},{id:"charlotte-jackson",name:"Charlotte Jackson"},{id:"aiden-white",name:"Aiden White"},{id:"amelia-harris",name:"Amelia Harris"},{id:"jackson-martin",name:"Jackson Martin"},{id:"harper-thompson",name:"Harper Thompson"},{id:"sebastian-garcia",name:"Sebastian Garcia"},{id:"evelyn-martinez",name:"Evelyn Martinez"},{id:"matthew-robinson",name:"Matthew Robinson"},{id:"abigail-clark",name:"Abigail Clark"},{id:"david-rodriguez",name:"David Rodriguez"},{id:"emily-lewis",name:"Emily Lewis"}],g="noa_presentation_ratings";function d(t){const n=t??localStorage;try{const s=n.getItem(g);return s?JSON.parse(s)??{}:{}}catch{return{}}}function h(t,n,s,a){const e=localStorage,r=d(e);r[t]={score:n,notes:s??""},e.setItem(g,JSON.stringify(r))}function o(t){return String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function f(t){const n=t.filter(a=>a.rating!==null&&a.rating!==void 0).sort((a,e)=>e.rating.score-a.rating.score),s=t.filter(a=>a.rating===null||a.rating===void 0);return[...n,...s]}const p=document.getElementById("app");let i=null;function u(){const t=d(),n=Object.keys(t).length;p.innerHTML=`
    <div class="screen">
      <header class="header">
        <div class="header-top">
          <h1 class="title">Presentations</h1>
          <button class="btn btn-outline" data-action="summary">Summary</button>
        </div>
        <div class="progress">${n} / ${l.length} rated</div>
      </header>
      <ul class="student-list" role="list">
        ${l.map(s=>{const a=t[s.id];return`
            <li class="student-card${a?" rated":""}"
                data-action="open-rating"
                data-student-id="${o(s.id)}"
                role="button"
                tabindex="0"
                aria-label="Rate ${o(s.name)}${a?", currently "+a.score+" out of 10":", not yet rated"}">
              <div class="student-info">
                <span class="student-name">${o(s.name)}</span>
                ${a?`<span class="score-chip">${a.score} / 10</span>`:""}
              </div>
              <span class="status-badge ${a?"badge-rated":"badge-unrated"}">${a?"Rated":"Unrated"}</span>
            </li>
          `}).join("")}
      </ul>
    </div>
  `}function v(t){const n=l.find(r=>r.id===t);if(!n)return;const s=d()[t]??null;i=s?s.score:null;const a=document.createElement("div");a.className="overlay",a.setAttribute("role","dialog"),a.setAttribute("aria-modal","true"),a.setAttribute("aria-label",`Rate ${n.name}`),a.innerHTML=`
    <div class="rating-card" role="document">
      <div class="rating-header">
        <h2 class="rating-name">${o(n.name)}</h2>
        <button class="close-btn" data-action="close-rating" aria-label="Close">&#x2715;</button>
      </div>
      <div class="score-section">
        <div class="score-label">Score (1&ndash;10)</div>
        <div class="score-grid" role="group" aria-label="Select score from 1 to 10">
          ${[1,2,3,4,5,6,7,8,9,10].map(r=>`
            <button class="score-btn${i===r?" selected":""}"
                    data-action="select-score"
                    data-score="${r}"
                    aria-pressed="${i===r}"
                    aria-label="Score ${r}">${r}</button>
          `).join("")}
        </div>
      </div>
      <div class="notes-section">
        <label class="notes-label" for="notes-field">Notes <span class="optional">(optional)</span></label>
        <textarea id="notes-field"
                  class="notes-field"
                  placeholder="Quick impression&#8230;"
                  maxlength="200"
                  rows="3">${o(s?s.notes:"")}</textarea>
      </div>
      <div class="rating-footer">
        <button class="btn btn-secondary" data-action="close-rating">Cancel</button>
        <button class="btn btn-primary" data-action="save-rating" data-student-id="${o(t)}">Save</button>
      </div>
    </div>
  `,document.body.appendChild(a);const e=a.querySelector(i?`.score-btn[data-score="${i}"]`:".score-btn");e==null||e.focus()}function m(){var t;(t=document.querySelector(".overlay"))==null||t.remove(),i=null}function y(t){i=t,document.querySelectorAll(".score-btn").forEach(n=>{const a=parseInt(n.dataset.score,10)===t;n.classList.toggle("selected",a),n.setAttribute("aria-pressed",String(a))})}function $(t){var s,a;if(!i){const e=document.querySelector(".score-grid");e==null||e.classList.remove("shake"),e==null||e.offsetWidth,e==null||e.classList.add("shake");return}const n=((a=(s=document.getElementById("notes-field"))==null?void 0:s.value)==null?void 0:a.trim())??"";h(t,i,n),m(),u()}function S(){const t=d(),n=l.map(e=>({...e,rating:t[e.id]??null})),s=f(n),a=s.filter(e=>e.rating).length;p.innerHTML=`
    <div class="screen summary-screen">
      <header class="header">
        <div class="header-top">
          <button class="btn btn-ghost" data-action="home">&#8592; Back</button>
          <h1 class="title">Summary</h1>
          <button class="btn btn-outline" data-action="print">Print</button>
        </div>
        <div class="progress">${a} / ${l.length} rated</div>
      </header>
      <ul class="summary-list" role="list">
        ${s.map((e,r)=>{const c=!!e.rating,b=c?r+1:"&mdash;";return`
            <li class="summary-card${c?"":" unrated"}">
              <div class="summary-rank" aria-hidden="true">${b}</div>
              <div class="summary-content">
                <div class="summary-name">${o(e.name)}</div>
                ${c?`<div class="summary-score">${e.rating.score} / 10</div>
                     ${e.rating.notes?`<div class="summary-notes">${o(e.rating.notes)}</div>`:""}`:'<div class="summary-unrated-label">Not rated</div>'}
              </div>
            </li>
          `}).join("")}
      </ul>
    </div>
  `}document.addEventListener("click",t=>{const n=t.target.closest("[data-action]");if(n)switch(n.dataset.action){case"summary":S();break;case"home":u();break;case"open-rating":v(n.dataset.studentId);break;case"close-rating":m();break;case"select-score":y(parseInt(n.dataset.score,10));break;case"save-rating":$(n.dataset.studentId);break;case"print":window.print();break}});document.addEventListener("keydown",t=>{t.key==="Escape"&&document.querySelector(".overlay")&&m()});document.addEventListener("keydown",t=>{if(t.key!=="Enter"&&t.key!==" ")return;const n=t.target.closest('[data-action="open-rating"]');n&&(t.preventDefault(),v(n.dataset.studentId))});u();
