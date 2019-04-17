import React, { Component } from 'react'
import Panel from 'muicss/lib/react/panel';
import Tabs from 'muicss/lib/react/tabs';
import Tab from 'muicss/lib/react/tab';
import Gist from 'react-gist'

export default class Gists extends Component {

  render() {
    return (
      <Panel>
        <Tabs defaultSelectedIndex={0}>
          {
            this.props.files.map((file) => (
              <Tab value={this.props.id} label={file} key={file}>
                <Gist id={this.props.id} file={file} />
              </Tab>
            ))
          }
        </Tabs>
      </Panel>
    )
  }

}
