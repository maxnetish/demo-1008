import * as React from 'react';
import {createRef, PureComponent} from "react";

interface IModalDialogComponentProps {
    openModal: boolean;
    className?: string;
}

export class ModalDialogComponent extends PureComponent<IModalDialogComponentProps> {
    private modalRef = createRef<HTMLDialogElement>();

    componentDidUpdate(prevProps: Readonly<IModalDialogComponentProps>, prevState: Readonly<{}>, snapshot?: any): void {
        if (prevProps.openModal !== this.props.openModal && this.modalRef.current) {
            if (this.props.openModal) {
                this.modalRef.current.showModal()
            } else {
                this.modalRef.current.close()
            }
        }
    }

    render() {
        return (
            <dialog ref={this.modalRef} className={this.props.className}>
                {this.props.children}
            </dialog>
        );
    }
}
