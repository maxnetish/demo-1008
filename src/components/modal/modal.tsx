import * as React from 'react';
import {createRef, PureComponent} from "react";

interface IModalDialogComponentProps {
    openModal: boolean;
    className?: string;
}

interface IModalDialogComponentEvents {
    modalDismissed?: () => void;
}

export class ModalDialogComponent extends PureComponent<IModalDialogComponentProps & IModalDialogComponentEvents> {
    private modalRef = createRef<HTMLDialogElement>();

    componentDidUpdate(prevProps: Readonly<IModalDialogComponentProps>, prevState: Readonly<{}>, snapshot?: any): void {
        if (prevProps.openModal !== this.props.openModal && this.modalRef.current) {
            if (this.props.openModal) {
                this.modalRef.current.showModal()
            } else {
                this.modalRef.current.close()
            }
        }
        // this.modalRef.
        // if(this.modalRef.current) {
        //     // this.modalRef.current.addEventListener('close', )
        // }
    }

    render() {
        // TODO pass close event to parent
        // when user close dialog with esc key we have to track this closing to sunc with state
        return (
            <dialog ref={this.modalRef} className={this.props.className}>
                {this.props.children}
            </dialog>
        );
    }
}
