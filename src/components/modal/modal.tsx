import * as React from 'react';
import {PureComponent} from "react";

interface IModalDialogComponentProps {
    openModal: boolean;
    className?: string;
}

interface IModalDialogComponentEvents {
    // when user press 'esc' and dialog hides
    modalDismissed?: () => void;
}

export class ModalDialogComponent extends PureComponent<IModalDialogComponentProps & IModalDialogComponentEvents> {
    private dialogElementRef: HTMLDialogElement | null = null;

    private setDialogRefAndCloseListener = (elm: HTMLDialogElement) => {
        if (this.dialogElementRef) {
            this.dialogElementRef.removeEventListener('close', this.onUserCloseDialog);
        }
        this.dialogElementRef = elm;
        if (this.dialogElementRef) {
            // elm can be empty!
            this.dialogElementRef.addEventListener('close', this.onUserCloseDialog);
        }
    };

    private onUserCloseDialog: EventListener = evt => {
        // pass close event to parent
        // when user close dialog with esc key we have to track this closing to sunc with state
        if (this.props.openModal && this.dialogElementRef && !this.dialogElementRef.open && this.props.modalDismissed) {
            this.props.modalDismissed();
        }
    };

    componentDidUpdate(prevProps: Readonly<IModalDialogComponentProps>, prevState: Readonly<{}>, snapshot?: any): void {
        if (prevProps.openModal !== this.props.openModal && this.dialogElementRef) {
            if (this.props.openModal && !this.dialogElementRef.open) {
                this.dialogElementRef.showModal();
            } else if (!this.props.openModal && this.dialogElementRef.open) {
                this.dialogElementRef.close();
            }
        }
    }

    componentWillUnmount(): void {
        if (this.dialogElementRef) {
            this.dialogElementRef.removeEventListener('close', this.onUserCloseDialog);
        }
    }

    render() {
        return (
            <dialog ref={this.setDialogRefAndCloseListener} className={this.props.className}>
                {this.props.children}
            </dialog>
        );
    }
}
