<search-example>
  <div class="columns">
    <div class="column col-mx-6 col-mx-auto">
      <div style={flexCenter}>
        <div class="input-group input-inline has-icon-right">
          <span class="input-group-addon">
           💓 Deewdle >>
          </span>
          <input onkeyup={ search } class="form-input" type="text" id="echo" placeholder="Find your dude...">
          <i if={loading} class="form-icon loading"></i>
        </div>
      </div>
      <br/>
      <div class="empty" if={!data.length}>
        <div class="empty-icon">
          <i class="icon icon-people"></i>
        </div>
        <p class="empty-title h5">Nothing Found</p>
        <p class="empty-subtitle">We're sorry...</p>
      </div>
      <div style={flexCenter}>
        <div class="card d-inline-block" each={data} style={divCard}>
          <div class="card-header">
            <div class="card-title h5">{firstName} {lastName}</div>
            <div class="card-subtitle text-gray">Person</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <script>

    import client from 'lib/client';
    import {debounce} from 'lodash';

    // component id
    this._id = 'search-example';
    this.data = [];
    this.loading = false;

    const find = async (q) => {
      return await client.service('playground/search-example').get(q || 'a');
    }

    // the compoent will be rendered
    // when the last method done(<name>) is called 
    this.on('server', async () => {
      this.await('get users');
      await find();
      this.done('get users');
    })
    
    // this works on the client
    this.search = debounce(
      async function(ev){
        this.update({loading:true})
        await find(ev.target.value)
        this.update({loading:false})
      },
    200);


    // styles
    this.flexCenter = {
      'justify-content': 'center', 
      'display': 'flex',
      'flex-wrap': 'wrap',
    };

    this.divCard = {
      width:250,
      margin: 6
    };

  </script>
</search-example>