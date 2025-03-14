import React, { useState, useEffect, useRef } from "react";
import * as AppConstants from "../common/constants";
import * as CommonFunctions from "../common/CommonFunctions";
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { toast } from 'react-toastify';
import CommonToastContainer from "../common/ToastAlert"
import { InputText } from 'primereact/inputtext';

export default function ExpenseSubCategoryModal({ categoryInfo, closeCategoryModal }) {
  const [categoryInfoState, setCategoryInfoState] = useState(categoryInfo);
  const [closeModal1, setCloseModal1] = useState(true);
  const [subCategories, setSubCategories] = useState(null);


   const fetchSubCategoriesById = () => {
          fetch(`${AppConstants.jsonServerApiUrl}/categories/${categoryInfoState.id}`,{
            method: "GET",
            headers: { "content-type": "application/json" },
          })
          .then((res) => {
            return res.json();
          })
          .then((response) => {
            setSubCategories(response); 
            if(response && response.items && response.items.length > 0) {
              document.getElementById("categoryJson").value =  JSON.stringify(response?.items, null, 2)
            } else {
              document.getElementById("categoryJson").value =  JSON.stringify([{
                "id": "Add unique id (number)",
                "productName": "Add product name here (string)",
                "productCode": "Add unique product code (string)",
                "category": categoryInfoState.code //fixed
              },], null, 2)
            }

          })
          .catch((error) => {      
            toast.error(`${error.message}, Failed to fetch sub categories.`);
          });
      }

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    let payload = {
      items: JSON.parse(data.get("categoryJson")),
      updatedOn: CommonFunctions.GetCurrentDateTime(),
    };

      //update category and sub categories
      fetch(`${AppConstants.jsonServerApiUrl}/categories/${categoryInfoState.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then((res) => {
          toast.success("Sub Category successfully Saved");
          res.json().then((res) => {
            document.getElementById("subCategoryForm").reset();
            closeModal(true);
          });
        })
        .catch((error) => {
          toast.error(`${error.message}, failed to register.`);
        });

  };

  const closeModal = (flag) => {
    categoryInfoState.showModal = flag;
    setCloseModal1(false);
    closeCategoryModal();
  }

  useEffect(() => {
    if (categoryInfoState) {
      setTimeout(() => {
        loadFormData();
      }, 100);

      fetchSubCategoriesById();
    }
  }, []);

  const loadFormData = () => {
    if (!categoryInfoState.isAdd) {
      document.getElementById("categoryName").innerHTML = "<b>Name: </b>"+categoryInfoState.name;
      document.getElementById("code").innerHTML = "<b>Code:</b> "+categoryInfoState.code;
    }
  };

  return (
    <>
      <CommonToastContainer />
      <Dialog
        header="Assign Sub Categories"
        visible={closeModal1}
        style={{ width: "58vw" }}
        onHide={() => closeModal(false)}
        className="prime_dialog"
      >
        
        <div className="row mb-0">
          <div className="col-sm-6">
            <p id="categoryName">Name: </p> 
          </div>
          <div className="col-sm-6">
          <p id="code">Code: </p> 
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          id="subCategoryForm"
          className="was-validated"
        >
          <div className="row">
              <div className="col-sm-12 mb-3">
                <label htmlFor="categoryJson" className="form-label form-label-class" style={{ fontSize: "14px" }}>Sub Categories JSON:    </label>
                <span className="text-muted" style={{ fontSize: "12px" }}> 
                  <ul >
                    <li style={{listStyle:"disc"}}>Value should be valid json format</li>
                    <li style={{listStyle:"disc"}}>Can add multiple sub categories in same format metioned below in array list</li>
                    <li style={{listStyle:"disc"}}>In object "category" property value is fixed (don't change)</li>
                    </ul>
                  </span>
                <textarea
                  rows="15"
                  className="form-control"
                  style={{ fontSize: "12px" }}
                  id="categoryJson"
                  placeholder="Enter sub category json format"
                  name="categoryJson"
                  autoComplete="off"
                  required
                />
              
              </div>

              <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                <button
                  className="btn btn-lg btn-warning w-5 fs-6 rounded-5"
                  type="submit"
                >
                  Save&nbsp;
                  <i className={`fa-solid fa-chevron-right pe-2`}></i>
                </button>
              </div>
            </div>
        </form>

      </Dialog>
    </>
  );
}
