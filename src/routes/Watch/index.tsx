import { useParams } from 'react-router';

import Layout from 'components/Layout';
import Streams from './components/Streams';
import Player from './components/Player';

import { useTitle } from './hooks';

export default function Watch() {
  const params = useParams();

  const title = useTitle();

  return (
    <>
      <title>{title || 'wawawa'}</title>

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
