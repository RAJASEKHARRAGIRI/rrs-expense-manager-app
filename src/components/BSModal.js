import React, { Component, Fragment } from 'react';
import { render } from 'react-dom';
import { Modal } from 'bootstrap';

export class BsModal extends Component {
  constructor() {
    super();
    this.state = {};
    this.modal = undefined;
    this.modalElement = undefined;
  }

  componentDidMount() {
    this.modal = new Modal(this.modalElement);
  }

  componentWillUnmount() {
    if (this.modal) {
      this.modal.dispose();
    }
  }

  onClickBtn() {
    this.modal.show();
  }

  render() {
    return (
      <Fragment>
        <button
          type="button"
          className="btn btn-primary mt-5"
          onClick={() => this.onClickBtn()}
        >
          Launch demo modal
        </button>
        <div
          className="modal fade"
          tabindex="-1"
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
