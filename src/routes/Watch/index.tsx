import { useParams } from 'react-router';

import Layout from 'components/layouts/Default';
import Streams from './components/Streams';
import Player from './components/Player';

export default function Watch() {
  const params = useParams();

  return (
    <>
      {params.streamId ? (
        <Player />
      ) : (
        <Layout className="px-4 md:px-8">
          <Streams />
        </Layout>
      )}
    </>
  );
}
