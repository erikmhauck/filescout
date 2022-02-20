import React from 'react';
import { RootDocument } from '../../../common/dataModels';
import logger from '../../logger';
import { RootRow } from './rootRow';

const log = logger('roots');

interface RootsProps {}

const useRoots = () => {
  const [roots, setRoots] = React.useState<RootDocument[]>([]);

  const getRoots = async () => {
    const response = await fetch('/api/roots', {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'GET',
    });
    const responseJson: RootDocument[] = await response.json();
    if (responseJson.length > 0) {
      setRoots(responseJson);
    }
  };

  React.useEffect(() => {
    getRoots();
  }, [setRoots]);

  return roots;
};

export const Roots = ({}: RootsProps) => {
  const roots = useRoots();

  log.info(`Rendering roots! ${JSON.stringify(roots)}`);

  return (
    <div>
      {roots.length > 0 && (
        <div>
          <h2>Roots:</h2>
          <div>
            {roots.map((root) => (
              <div key={root._id}>
                <RootRow root={root} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
