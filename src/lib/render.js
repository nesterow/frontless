import riot from './riot';

riot.settings.asyncRenderTimeout = 20000;

/**
 *
 * @param {string} path - path to riot tag
 * @param {Object|undefined} opts - riot compiler options
 * @async
 */
export async function render(path, opts={}) {
  const tag = riot.require(path);
  return await riot.renderAsync(tag, opts);
}
/**
 * Render a page async using Riot Template
 * @param {string} tag - riot tag name
 * @param {Object} opts - riot tag options
 * @async
 */
export async function renderPage(tag, opts={}) {
  const data = await riot.renderAsync(tag, opts);
  const unwrap = new RegExp('\<(\/?)' +tag+ '\>', 'gi');
  return Promise.resolve(data.replace(unwrap, ''));
}
