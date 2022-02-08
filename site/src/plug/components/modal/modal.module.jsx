import ReactModal from 'react-modal';

const noop = () => { };

export default function Modal({ className, open, title, children, onClose = noop }) {
    return (
        <ReactModal isOpen={open} onRequestClose={onClose} contentLabel={title} ariaHideApp={false}>
            <div className={className}>
                {children}
            </div>
        </ReactModal>
    );
};