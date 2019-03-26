import riot from '../riot';
import './test-parent.tag';
import './test-child.tag';
riot.settings.asyncRenderTimeout = 10000;

describe('waiter', () => {
  beforeAll( () => {
    const elem = document.createElement('test-parent');
    document.body.appendChild(elem);
  });

  it('should emit "ready" event after ~3.5 seconds', () => {
    const tag = riot.mount('test-parent')[0];
    const startTime = new Date().getTime();
    return new Promise( (resolve, reject) => {
      tag.on('ready', ()=> {
        const elapsed = new Date().getTime() - startTime;
        if (elapsed >= 3500) {
          resolve('rendered properly');
        // eslint-disable-next-line brace-style
        }
        // eslint-disable-next-line prefer-promise-reject-errors
        else {
          // eslint-disable-next-line prefer-promise-reject-errors
          reject(
              `Component renedered sooner than asyc calls. 
                    GOT: ${elapsed}ms; 
                    EXPECTED: >= 3500ms`
          );
        }
      });
    });
  });
});
