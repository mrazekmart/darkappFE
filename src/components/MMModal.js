import React from 'react';

const MMModal = ({ handleClose, show, children }) => {
  const showHideClassName = show ? "mmModal display-block" : "mmModal display-none";

  return (
    <div className={showHideClassName} onClick={handleClose}>
      <section className="mmModal-main" onClick={e => e.stopPropagation()}>
        {children}
      </section>
    </div>
  );
};

export default MMModal;