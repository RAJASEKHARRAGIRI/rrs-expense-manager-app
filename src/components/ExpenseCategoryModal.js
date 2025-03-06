import React, { useState, useEffect, useRef } from "react";
import * as AppConstants from "../common/constants";
import * as CommonFunctions from "../common/CommonFunctions";
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { toast } from 'react-toastify';
import CommonToastContainer from "../common/ToastAlert"
import { InputText } from 'primereact/inputtext';

export default function ExpenseCategoryModal({ categoryInfo, closeCategoryModal }) {
  const [categoryInfoState, setCategoryInfoState] = useState(categoryInfo);
  const [closeModal1, setCloseModal1] = useState(true);


  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    let payload = {
      name: data.get("categoryName"),
      code: data.get("code"),
      updatedOn: CommonFunctions.GetCurrentDateTime(),
    };

    if (categoryInfoState.isAdd) {
      fetch(`${AppConstants.jsonServerApiUrl}/categories`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then((res) => {
          toast.success("Category successfully saved");
          document.getElementById("categoryForm").reset();
          closeModal(true);
        })
        .catch((error) => {
          toast.error(`${error.message}, failed to register.`);
        });
    } else {
      //update category
      fetch(`${AppConstants.jsonServerApiUrl}/categories/${categoryInfoState.id}`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then((res) => {
          toast.success("Category successfully updated");
          res.json().then((res) => {
            setCategoryInfoState(res);
            document.getElementById("categoryForm").reset();
            closeModal(true);
          });
        })
        .catch((error) => {
          toast.error(`${error.message}, failed to register.`);
        });
    }

  };

  const closeModal = (flag) => {
    categoryInfoState.showModal = flag;
    setCloseModal1(false);
    closeCategoryModal();
  }

  const clearForm = () => {
    document.getElementById("categoryForm").reset();
    toast.info(`Form cleared successfully.`);
  };

  useEffect(() => {
    if (categoryInfoState) {
      setTimeout(() => {
        loadFormData();
      }, 100);
    }
  }, []);

  const loadFormData = () => {
    if(!categoryInfoState.isAdd){
    document.getElementById("categoryName").value = categoryInfoState.name;
    document.getElementById("code").value = categoryInfoState.code;
    }
  };

  return (
    <>
      <CommonToastContainer />
      <Dialog
        header={categoryInfoState.isAdd ? "Add category" : "Update category"}
        visible={closeModal1}
        style={{ width: "30vw" }}
        onHide={() => closeModal(false)}
        className="prime_dialog"
      // footer={footerContent}
      >
        <div className="row">
          <div className="col-sm-12">
            <form
              onSubmit={handleSubmit}
              id="categoryForm"
              className="was-validated form-custom-styles"
            >
              <div className="mb-2">
                <label htmlFor="categoryName" className="form-label form-label-class"> {/** fw-bold */}
                  Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="categoryName"
                  placeholder="Enter category name"
                  name="categoryName"
                  autoComplete="off"
                  autoFocus
                  required
                />
              </div>

              <div className="mb-2">
                <label htmlFor="code" className="form-label form-label-class"> {/** fw-bold */}
                  Code
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="code"
                  placeholder="Enter category code"
                  name="code"
                  autoComplete="off"
                  autoFocus
                  required
                  pattern="^\S+$" 
                />
                <label>res</label>
              </div>

              <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                <button
                  className="btn btn-lg btn-warning w-100 fs-6 rounded-5"
                  type="submit"
                >
                  {categoryInfoState.isAdd ? "Add Category": "Update Category"}&nbsp;
                  <i className={`fa-solid fa-chevron-right pe-2`}></i>
                </button>
                <button
                  type="button"
                  onClick={clearForm}
                  className="btn btn-lg btn-default fs-6 rounded-5"
                >
                  Clear
                </button>
              </div>
            </form>
          </div>
        </div>
      </Dialog>
    </>
  );
}
