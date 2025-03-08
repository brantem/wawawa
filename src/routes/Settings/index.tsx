import Layout from 'components/Layout';
import BackButton from 'components/BackButton';
import Resources from './components/Resources';
import Streaming from './components/Streaming';
import Player from './components/Player';
import Subtitle from './components/Subtitle';

export default function Settings() {
  return (
    <Layout className="max-md:gap-4">
      <title>Settings - wawawa</title>

      <div className="flex shrink-0 items-center gap-2 md:h-9">
        <BackButton to="/" className="-ml-2" />

        <h1 className="text-xl font-semibold">Settings</h1>
      </div>

      <div className="flex flex-col gap-16">
        <Resources />
        <Streaming />
        <Player />
        <Subtitle />
      </div>
    </Layout>
  );
}
