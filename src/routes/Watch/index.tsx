import { useParams } from 'react-router';

import Layout from 'components/layouts/Default';
import Streams from './components/Streams';
import Player from './components/Player';

export default function Watch() {
  const { '*': streamId } = useParams();

  return (
    <>
      {streamId ? (
        <Player />
      ) : (
        <Layout className="max-md:px-4">
          <Streams />
        </Layout>
      )}
    </>
  );
}
