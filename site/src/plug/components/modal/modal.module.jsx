import { memo, useEffect, useState } from 'react';
import classNames from 'classnames';

import ReactModal from 'react-modal';

import styles from './modal.module.css';

const customStyles = {
    content: {
        padding: 0,
        inset: '10%'
    },
};

const Modal = memo(({ className, open, title, children, onClose = () => { } }) => {
    const [visible, setVisible] = useState(false);
    useEffect(() => setVisible(open), [open]);
    return (
        <ReactModal isOpen={visible} onRequestClose={onClose} contentLabel={title} style={customStyles} ariaHideApp={false}>
            <div className={styles.root}>
                <div className={styles.header}>
                    <span className={styles.name}>{title || ''}</span>
                    <span className={styles.icon} onClick={() => {setVisible(false); onClose()}} />
                </div>
                <div className={classNames(styles.content, className)}>
                    {children}
                </div>
            </div>
        </ReactModal>
    );
});

Modal.displayName = 'Modal';

export default Modal;