import Layout from 'components/layouts/Default';
import BackButton from 'components/BackButton';
import Resources from './components/Resources';
import Streaming from './components/Streaming';
import Subtitle from './components/Subtitle';

export default function Settings() {
  return (
    <Layout className="px-4 max-md:gap-4 md:px-8">
      <div className="mt-3 flex shrink-0 items-center gap-2 md:mt-6 md:h-9">
        <BackButton to="/" className="-ml-2" />

        <h1 className="text-xl font-semibold">Settings</h1>
      </div>

      <div className="flex flex-col gap-16">
        <Resources />
        <Streaming />
        <Subtitle />
      </div>
    </Layout>
  );
}
