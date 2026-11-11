import { FoldProvider } from './folds.jsx';
import Paragraph from './components/Paragraph.jsx';
import Instrument from './components/Instrument.jsx';
import Colophon from './components/Colophon.jsx';

export default function App() {
  return (
    <FoldProvider>
      <div className="sheet">
        <header className="masthead">
          <span className="masthead-mark" aria-hidden="true">¶</span>
          <p className="masthead-hint">
            Underlined phrases unfold in place. This page is as long as you
            want it to be.
          </p>
        </header>
        <main>
          <Paragraph />
        </main>
        <Colophon />
      </div>
      <Instrument />
    </FoldProvider>
  );
}
