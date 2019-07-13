
export default {
  promptIcon: {
    position: 'absolute !important',
    fontSize: '35px !important',
    color: 'darkgrey',
    top: 10,
    left: 12,
  },
  filters: {
    display: 'flex',
    flexWrap: 'wrap',
    '& *:last-child:not(:first-child)': {
      borderBottomRightRadius: 0,
      borderTopRightRadius: 0,
    },
    '& *:first-child:not(:last-child)': {
      borderBottomLeftRadius: 0,
      borderTopLeftRadius: 0,
    }
  },
  filterButton: {
    cursor: 'pointer',
    display: 'inline-block',
    outline: 0,
    fontSize: '.7rem',
    height: '1.4rem',
    padding: '.05rem .3rem',
    flex: '1 0 0',
    background: '#fff',
    borderColor: '#ccc',
    border: '1px solid',
    color: '#333',
  },
  filterActive: {
    background: 'burlywood',
  },
  pagination: {
    display: 'flex',
    listStyle: 'none',
    margin: '.2rem 0',
    padding: '.2rem 0',
    '& li': {
      flex: '1 0 50%',
      fontSize: '13px',
      padding: '10px',
      color: 'burlywood',
      textDecoration: 'none',
      cursor: 'pointer',
    },
    '& li:last-child':{
      textAlign: 'right'
    }
  },
  pageCounter: {
    textAlign: 'center',
    pointerEvents: 'none',
    position: 'absolute',
    bottom: '12px',
    left: '46%',
    fontSize: '13px',
    color: 'burlywood',
  },
  hidden: {
    display: 'none',
  },

  main : {
    position: 'relative',
    zIndex: 2,
    borderTop: '1px solid #e6e6e6',
    '&::after': {
      color: 'burlywood !important'
    },
  },

  todoname : {
    padding: 26
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
    padding: '16px',
    border: '1px solid #999',
    boxShadow: 'inset 0 -1px 5px 0 rgba(0, 0, 0, 0.2)',
    boxSizing: 'border-box',
    '-webkit-font-smoothing': 'antialiased',
    '-moz-osx-font-smoothing': 'grayscale',
    '&:focus' : {
      outline: 'none'
    }
  },
  
  newTodo: {
    padding: '16px 16px 16px 60px',
    border: 'none',
    background: 'rgba(0, 0, 0, 0.003)',
    boxShadow: 'inset 0 -2px 1px rgba(0,0,0,0.03)',
    width: '100%',
    '&:focus': {
      outline: 'none',
    },
    '&::placeholder': {
      fontStyle: 'italic',
      fontWeight: 300,
      color: '#aaa'
    },
  },

  todoapp: {

    background: '#fff',
    // margin: '130px 0 40px 0',
    position: 'relative',
    // boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.2),0 25px 50px 0 rgba(0, 0, 0, 0.1)',
    borderRadius: 16,
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
    paddingBottom: 40,

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
        },
        '&:focus': {
          outline: 'none',
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
