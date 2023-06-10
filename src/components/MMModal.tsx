import * as React from 'react';
import { useEffect, useRef } from 'react';

interface MMModalProps {
    handleClose: () => void;
    show: boolean;
    children: any;
}

const MMModal = ({ handleClose, show, children } : MMModalProps) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const showHideClassName = show ? "mmModal display-block" : "mmModal display-none";

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
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
