import React from 'react';
import logger from '../logger';
import RootResult from '../models/rootResult';
import { RootRow } from './rootRow';

const log = logger('roots');

interface RootsProps {
  roots: RootResult[];
}

export const Roots = ({ roots }: RootsProps) => {
  log.info(`Rendering results! ${JSON.stringify(roots)}`);

  return (
    <div>
      {roots.length > 0 && (
        <div>
          <h2>Roots:</h2>
          <ul>
            {roots.map((root) => (
              <li key={root._id}>
                <RootRow root={root} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
