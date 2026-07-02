import { renderToStaticMarkup } from 'react-dom/server';
import App from './App.jsx';

/**
 * Build-time entry. Renders the app to static HTML so the deployed
 * index.html ships real content (not an empty root div) for crawlers,
 * link-preview bots, and no-JS clients. This markup is never hydrated:
 * on the client, main.jsx re-renders into #root, so it is a static
 * snapshot for machines, replaced by the interactive app for humans.
 */
export function render() {
  return renderToStaticMarkup(<App />);
}
