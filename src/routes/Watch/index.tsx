import { useParams } from 'react-router';

import Layout from 'components/Layout';
import Streams from './components/Streams';
import Player from './components/Player';

export default function Watch() {
  const params = useParams();

  return (
    <>
      {params.streamId ? (
        <Player />
      ) : (
        <Layout>
          <Streams />
        </Layout>
      )}
    </>
  );
}
