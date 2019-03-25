<html>
  <head>
    <meta charset="UTF-8" />
    <title>{parent.opts.title}</title>
    <meta charset="UTF-8" name="state" content={ JSON.stringify(this.opts.req.initialState) }/>
    <meta name="turbolinks-cache-control" content="no-cache">
    <script src="/dist/boot.js" defer></script>
    <yield from="styles"/>
  </head>
  <body>
    <yield/>
  </body>
  <yield from="scripts"/>
  <script src="/dist/main.js" defer></script>
  <script>
  </script>
</html>
