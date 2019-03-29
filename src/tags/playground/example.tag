<example>
  <ul class="tab tab-block">
    <li class={{'tab-item': true, active: view === 1}} onclick={()=> update({view:1})}>
      <a >Client</a>
    </li>
    <li class={{'tab-item': true, active: view === 2}} onclick={()=> update({view:2})}>
      <a >Server</a>
    </li>
  </ul>
  <div show={view === 1}>
    <code data-gist-id="258eef25c98570914a35f1cdb0358bd0"></code>
  </div>
  <div show={view === 2}>
    <code data-gist-id="2369ac56e9fbae0e94f24518251829a4"></code>
  </div>
  
  <script>
    this.view = 1;
  </script>
</example>