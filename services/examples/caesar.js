module.exports = (app) => {
  
  // Caesar Shift
  const caesar = (text, shift) => {
    return String.fromCharCode(
      ...text.split('').map(char => ((char.charCodeAt() - 97 + shift) % 26) + 97),
    );
  }

  app.use('caesar', {
    
    async get(string, params) {
      const {query = {}} = params;
      const shift = query.decrypt ? -1 : 1;
      return app.setState('caesar-shift', {
        result: caesar(string, shift)
      })
    }
  })
}