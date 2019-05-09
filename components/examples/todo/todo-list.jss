
module.exports = {

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
      },

      '& label': {
        wordBreak: 'break-all',
        padding: '15px 15px 15px 60px',
        display: 'block',
        lineHeight: '1.2',
        transition: 'color 0.4s'
      },
      '&.completed label': {
        color: '#d9d9d9',
        textDecoration: 'line-through'
      },
      '&:hover .destroy': {
        display: 'block'
      },
      '& .destroy': {
        display: 'none',
        position: 'absolute',
        top: 0,
        right: 10,
        bottom: 0,
        width: 40,
        height: 40,
        margin: 'auto 0',
        background: 'transparent',
        borderRadius: 180,
        border: '1px solid #ccc',
        fontSize: 30,
        color: '#cc9a9a',
        marginBottom: 11,
        transition: 'color 0.2s ease-out',
        '&:hover': {
          color: '#af5b5e'
        },
        '&:after': {
          content: '"×"',
          position: 'relative',
          top: -5
        }
      }
    },
  },

  editing: {
    borderBottom: 'none',
    padding: 0,
    '& .view': {
      display: 'none',
    }
  },

  editItem: {
    display: 'block',
    width: 'calc(100% - 43px)',
    padding: '12px 16px',
    margin: '0 0 0 43px'
  },

  toggle: {
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
    opacity: 0,

    '& + label': {
      backgroundImage: `url(data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%22-10%20-18%20100%20135%22%3E%3Ccircle%20cx%3D%2250%22%20cy%3D%2250%22%20r%3D%2250%22%20fill%3D%22none%22%20stroke%3D%22%23ededed%22%20stroke-width%3D%223%22/%3E%3C/svg%3E)`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center left',
    },
    '&:checked + label':{
      backgroundImage: `url(data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%22-10%20-18%20100%20135%22%3E%3Ccircle%20cx%3D%2250%22%20cy%3D%2250%22%20r%3D%2250%22%20fill%3D%22none%22%20stroke%3D%22%23bddad5%22%20stroke-width%3D%223%22/%3E%3Cpath%20fill%3D%22%235dc2af%22%20d%3D%22M72%2025L42%2071%2027%2056l-4%204%2020%2020%2034-52z%22/%3E%3C/svg%3E)`,
    }
  }




}
