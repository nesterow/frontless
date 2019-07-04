import JSDOMGlobal from 'jsdom-global'
import ssr from '@riotjs/ssr/register'
import {mount, register, install, component} from '@frontless/riot'
import {render} from '@frontless/core'
import {expect, use} from 'chai'
import sinonChai from 'sinon-chai'

describe('render function', function() {

  this.timeout(5000)

  before(() => {
    use(sinonChai)
    ssr()
  })

  it('it can render pages', async () => {
    
    

    const PAGE_NAME = 'index-page'
    const Page = require('./render/page.riot').default
    register('index-page', Page)
    register('test', require('./render/test.riot').default)
    register('with-jss', require('./render/with-jss.riot').default)

    const {output, state, shared, layout, head, stylesheet } = await render(PAGE_NAME, Page, {}, ['styles'])
    
    expect(typeof output).to.be.equal('string')
    expect(output).to.match(/<index-page is="page"/)
    expect(layout).to.be.equal('test-layout')


    //expect to have styles in passed head
    expect(head).to.match(/<style/)
    expect(head).to.match(/.test-class/)

    //expect to receive jss styles
    expect(stylesheet).to.match(/font-weight: 600/)

    //check if state was set after all `fetch` operations are complete
    const STATE = JSON.parse(state)
    expect(STATE["page"].value).to.be.equal('test')
    expect(STATE["test"].value).to.be.equal('component')
    expect(STATE['with-jss'].value).to.be.equal('component-2')

    //check if shared attributes were set after all `fetch` operations are complete
    const ATTRS = JSON.parse(shared)
    expect(ATTRS["page"][0].name).to.be.equal('styles')
    expect(ATTRS["test"][0].name).to.be.equal('styles')
    expect(ATTRS["with-jss"][0].name).to.be.equal('styles')
    expect(ATTRS["with-jss"][0].data.test.fontWeight).to.be.equal(600)

    return true
  })

})