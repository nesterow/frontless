<playground>

 <html style={{
      padding: 24
    }}>
    <section>
      <header class="navbar">
        sadas
      </header>
      <div class="container" style={{width: '90%'}}>
        <div class="columns">
          <div class="column" style={{padding: 48}}>
            <search-example>
            </search-example>
          </div>
          <div class="column">
            <example></example>
          </div>
        </div>
      </div>
    </section>
    <yield to="scripts">
      <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js" defer></script>
      <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/gist-embed/2.7.1/gist-embed.min.js" defer></script>
    </yield>
  </html>

  <script>
    import 'tags/playground/example.tag';
    import 'tags/playground/search.example.tag';
    
    this.code = (what) => {
      return this.opts.req.query[what];
    }

  </script>
  
</playground>