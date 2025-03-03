import { useParams } from 'react-router';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';

import Layout from 'components/layouts/Default';
import BackButton from 'components/BackButton';
import Streams from './components/Streams';
import Player from './components/Player';

// TODO: back button, play the selected stream

export default function Watch() {
  const { type, id, '*': streamId } = useParams();

  return (
    <>
      {streamId ? (
        <Player />
      ) : (
        <Layout className="max-w-xl py-4">
          <BackButton className="fixed top-4 left-4 z-10" to={`/${type}/${id}`}>
            <ArrowLeftIcon className="size-6 [&>path]:stroke-2" />
          </BackButton>

          <Streams />
        </Layout>
      )}
    </>
  );
}
