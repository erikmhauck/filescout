import { List } from '@mui/material';
import React from 'react';
import { RootDocument } from '../../../common/dataModels';
import { RootRow } from './RootRow';

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
  return (
    <>
      {roots.length > 0 && (
        <List>
          {roots.map((root) => (
            <div key={root._id}>
              <RootRow root={root} />
            </div>
          ))}
        </List>
      )}
    </>
  );
};
