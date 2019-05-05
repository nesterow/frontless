
module.exports = {
  toggle: {},
  
  hidden: {
    display: 'none',
  },

  main : {
    position: 'relative',
    zIndex: 2,
    borderTop: '1px solid #e6e6e6'
  },

  toggleAll: {
    width: 1,
    height: 1,
    border: 'none',
    opacity: 0,
    position: 'absolute',
    right: '100%',
    bottom: '100%',
    
    '&:checked + label:before': {
      color: '#737373',
    },

    '& + label': {
      width: 60,
      height: 34,
      fontSize: 0,
      position: 'absolute',
      top: 5,
      left: 0,
      transform: 'rotate(90deg)',
      '-webkit-transform': 'rotate(90deg)',

      '&::before': {
        content: '"❯"',
        fontSize: 22,
        color: '#e6e6e6',
        padding: '10px 27px 10px 27px',
      }

    },

  },

  edit: {
    position: 'relative',
    margin: 0,
    width: '100%',
    fontSize: 24,
    fontFamily: 'inherit',
    fontWeight: 'inherit',
    lineHeight: '1.4em',
    color: 'inherit',
    padding: '6px',
    border: '1px solid #999',
    boxShadow: 'inset 0 -1px 5px 0 rgba(0, 0, 0, 0.2)',
    boxSizing: 'border-box',
    '-webkit-font-smoothing': 'antialiased',
    '-moz-osx-font-smoothing': 'grayscale',
  },
  
  newTodo: {
    padding: '16px 16px 16px 60px',
    border: 'none',
    background: 'rgba(0, 0, 0, 0.003)',
    boxShadow: 'inset 0 -2px 1px rgba(0,0,0,0.03)',
    width: '100%',
    '&:focus': {
      outline: 'none',
    }
  },

  todoapp: {

    background: '#fff',
    margin: '130px 0 40px 0',
    position: 'relative',
    boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.2),0 25px 50px 0 rgba(0, 0, 0, 0.1)',
    
    '& input::-webkit-input-placeholder, & input::-moz-placeholder, & input::input-placeholder': {
      fontStyle: 'italic',
      fontWeight: 300,
      color: '#e6e6e6'
    },

    '& h1': {
      position: 'absolute',
      top: '-155px',
      width: '100%',
      fontSize: '100px',
      fontWeight: '100',
      textAlign: 'center',
      color: 'rgba(175, 47, 47, 0.15)',
      textRendering: 'optimizeLegibility',
      '-webkit-text-rendering': 'optimizeLegibility',
      '-moz-text-rendering': 'optimizeLegibility',
    },

    '& li $toggle': {
      textAlign: 'center',
      width: 40,
      height: 'auto',
      position: 'absolute',
      top: 0,
      bottom: 0,
      margin: 'auto 0',
      border: 'none',
      appearance: 'none',
      '-webkit-appearance': 'none',
    }

  },

  todoList: {
    margin: 0,
    padding: 0,
    listStyle: 'none',

    '& li': {
      position: 'relative',
      fontSize: 24,
      borderBottom: '1px solid #ededed',

      '&:last-child': {
        borderBottom: 'none'
      }

    },
  },

  editing: {
    borderBottom: 'none',
	  padding: 0
  },



}
