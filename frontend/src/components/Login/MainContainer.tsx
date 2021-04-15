import React from 'react';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  background: {
    display: 'flex',
    justifyContent: 'center',
    height: '100%',
  },
  container: {
    position: 'relative',
    flex: '1',
  },
  innerContainer: {
    display: 'block',
    height: 'auto',
    width: 'calc(100% - 40px)',
    margin: '10px auto',
    maxWidth: '1200px',

    borderRadius: '8px',
    border: '1px solid #ccc',
    overflow: 'hidden',
    position: 'relative',
  },
  content: {
    background: 'white',
    width: '100%',
    padding: '2em',
    flex: 1,
  },
  subContentContainer: {
    marginTop: '1em',
    width: '100%',
  },
}));

interface MainContainerProps {
  children: React.ReactNode;
  subContent?: React.ReactNode;
}

const MainContainer = ({children, subContent}: MainContainerProps): JSX.Element => {
  const classes = useStyles();

  return (
    <div className={classes.background}>
      <div className={classes.container}>
        <div className={classes.innerContainer}>
          <div className={classes.content}>{children}</div>
        </div>
        {subContent && <div className={classes.subContentContainer}>{subContent}</div>}
      </div>
    </div>
  );
};

MainContainer.defaultProps = {
  subContent: <></>,
}

export default MainContainer;