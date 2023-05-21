import React, { useEffect, useRef } from 'react';

const MMModal = ({ handleClose, show, children }) => {
    const modalRef = useRef();
    const showHideClassName = show ? "mmModal display-block" : "mmModal display-none";

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                handleClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [handleClose]);

    return (
        <div className={showHideClassName}>
            <section className="mmModal-main" ref={modalRef}>
                {children}
            </section>
        </div>
    );
};

export default MMModal;
