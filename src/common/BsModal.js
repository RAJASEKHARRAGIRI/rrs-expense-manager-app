import React, { Component, Fragment } from 'react';
import { render } from 'react-dom';
import { Modal } from 'bootstrap';

export class BsCommonModal extends Component {
  constructor() {
    super();
    this.state = {};
    this.modal = undefined;
    this.modalElement = undefined;
    this.mountCount = 0;
  }

  componentDidMount() {
    this.mountCount++;
    this.modal = new Modal(this.modalElement);
    if (this.mountCount > 1) {
        this.modal.show();
    }
  }

  componentWillUnmount() {
    if (this.modal) {
      this.modal.dispose();
    }
  }

  render() {
    return (
      <Fragment>
        <div
          className="modal fade"
          tabIndex="-1"
          ref={(ref) => {
            this.modalElement = ref;
          }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Modal titlerrs</h5>
                <button
                  type="button"
                  className="btn-close"
                  data-dismiss="modal"
                  aria-label="Close"
                />
              </div>
              <div className="modal-body">
                <p>Modal body text goes here.</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                >
                  Close
                </button>
                <button type="button" className="btn btn-primary">
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}
