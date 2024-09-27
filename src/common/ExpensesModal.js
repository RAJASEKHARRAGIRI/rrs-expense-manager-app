import React, { useState, useEffect, useRef } from "react";
import * as AppConstants from "./constants";
import * as CommonFunctions from "./CommonFunctions";
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { toast } from 'react-toastify';
import CommonToastContainer from "./ToastAlert"
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { MultiSelect } from 'primereact/multiselect';
import { RadioButton } from "primereact/radiobutton";
import { Checkbox } from 'primereact/checkbox';
import { Calendar } from 'primereact/calendar';
import { InputTextarea } from 'primereact/inputtextarea';
import { useFormik } from "formik";

export default function ExpensesModal({ expensesInfo, closeExpensesModal }) {
  const [closeModal1, setCloseModal1] = useState(true);
  const [expensesInfoState, setexpensesInfoState] = useState(expensesInfo);
  const [selectedExpenses, setSelectedExpenses] = useState(null);
  const [expensesCategory, setExpensesCategory] = useState([]);
  const [paymentType, setPaymentType] = useState('Cash');
  let isFirstLoad = true;
  let isEdit = expensesInfoState?.id > 0 ? true : false
  
  useEffect(() => {  
    isFirstLoad = !isFirstLoad;  
    if(expensesInfoState?.shopName && isFirstLoad) {
      setTimeout(() => {
        loadFormData();
      }, 100);
    }
  }, []);

  const loadFormData = () => {
    formik.setFieldValue('shopname', expensesInfoState.shopName)
    formik.setFieldValue('billdate', new Date(expensesInfoState.date))
    formik.setFieldValue('amount', expensesInfoState.amount)
    formik.setFieldValue('notes', expensesInfoState.notes)
    setSelectedExpenses(JSON.parse(expensesInfoState.groceries));
    setExpensesCategory(expensesInfoState.category.split(','));
    setPaymentType(expensesInfoState.paymentType);
  };

  const initialValuesData = {
    shopname:'',
    billdate:'',
    amount: null,
    notes:''
  }

 const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValuesData,
    onSubmit:(data) =>{
      console.log("helo");
      handleSubmit(data);
    }
  });

  const handleSubmit = (data) => {
    if (!selectedExpenses || selectedExpenses?.length === 0 ) {
      toast.error(`With out groceries can't save expenses`);
      return;
    }

    let payload = {
      shopName: data.shopname,
      date: data.billdate,
      category: expensesCategory.toString(),
      groceries: JSON.stringify(selectedExpenses),
      amount: data.amount,
      paymentType: paymentType,
      notes: data.notes,
      updatedOn: CommonFunctions.GetCurrentDateTime(),
    };

    if (isEdit) {
      fetch(`${AppConstants.jsonServerApiUrl}/expenses/${expensesInfoState.id}`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then((res) => {
          toast.success("Expense successfully updated");
          document.getElementById("expenseForm").reset();
          closeModal(true);
        })
        .catch((error) => {
          toast.error(`${error.message}, failed to register.`);
        });
    } else {
      fetch(`${AppConstants.jsonServerApiUrl}/expenses`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then((res) => {
          toast.success("Expense successfully saved");
          document.getElementById("expenseForm").reset();
          closeModal(true);
        })
        .catch((error) => {
          toast.error(`${error.message}, failed to register.`);
        });
    }
   
  };

  const closeModal = (flag) => {   
    expensesInfoState.showModal = flag;
    setCloseModal1(false);
    closeExpensesModal();
  }

  const clearForm = () => {
    document.getElementById("expenseForm").reset();
    toast.info(`Form cleared successfully.`);
  };

  useEffect(() => {    
    if(expensesInfoState) {
      setTimeout(() => {
        //loadFormData();
      }, 100);
    }
  }, []);

  const groupedItemTemplate = (option) => {
    return (
        <div className="flex align-items-center">
            <img alt={option.label} src="https://cdn-icons-png.flaticon.com/512/135/135763.png" className={`mr-2 flag flag-${option.code.toLowerCase()}`} style={{ width: '18px' }} />
            <div>{option.label}</div>
        </div>
    );
};

  //expenses multiple select tool bar template
  const panelFooterTemplate = () => {
    const length = selectedExpenses ? selectedExpenses.length : 0;

    return (
        <div className="py-2 px-3">
            <b>{length}</b> item{length > 1 ? 's' : ''} selected.
        </div>
    );
  };

  const filterExpensesListOnType = (e) => {
    let _expensesType = [...expensesCategory];
    if (e.checked) {
        _expensesType.push(e.value);
    } 
    else {
        _expensesType.splice(_expensesType.indexOf(e.value), 1);
    }
    setExpensesCategory(_expensesType);
  };

  return (
    <>
      <CommonToastContainer />
      <Dialog
        header={isEdit ? 'Update Expense' : 'Add Expense'}
        visible={closeModal1}
        style={{ width: "50vw" }}
        onHide={() => closeModal(false)}
        className="prime_dialog"
      >
        <form onSubmit={formik.handleSubmit} id="expenseForm" className="was-validated form-custom-styles">
          <div className="row custom-mt-10">
            <div className="col-sm-12 col-md-12 col-lg-8">
              <div className="flex flex-column gap-2 mb-3 ">
                <label htmlFor="shopname" className="form-label-class">Shop Name</label>
                <InputText id="shopname" name="shopname" value={formik.values.shopname} 
                 onChange={formik.handleChange} required="true"
                className="p-inputtext-sm expenses-form-input" aria-describedby="shopname-help" autoFocus/>
              </div>
            </div>
            <div className="col-sm-12 col-md-12 col-lg-4 mb-3">
              <div className="flex flex-column gap-2">
                <label htmlFor="billDate" className="form-label-class">Bill Date</label>
                <div className="p-inputgroup flex-1">
                  <Calendar required="true" showButtonBar name="billdate" id="billdate" value={formik.values.billdate} onChange={formik.handleChange} />
                  <span className="p-inputgroup-addon p-inputgroup-addon-size ">
                  <i className="pi pi-calendar"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
              
          <div className="row">
            <div className="col-sm-12">
              <label htmlFor="category" className="form-label-class mb-2">Category</label>
              <div className="flex flex-wrap gap-3 mb-3 justify-content-start">
                {AppConstants.groceries.map(function(value, index){
                  return (
                    <div className="flex align-items-center" key={value.code}>
                      <Checkbox inputId={`groceryType${index+1}`} name="groceryType" value={value?.code} onChange={(e) => filterExpensesListOnType(e)} checked={expensesCategory.includes(value?.code)} />
                      <label htmlFor={`groceryType${index+1}`} className="ml-2">{value?.label}</label>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12">
                  <div className="flex flex-column gap-2 mb-3">
                  <label htmlFor="groc_list" className="form-label-class">Groceries</label>
                    <MultiSelect value={selectedExpenses} options={AppConstants.groceries} onChange={(e) => setSelectedExpenses(e.value)} 
                    optionLabel="name" optionGroupLabel="label" optionGroupChildren="items" optionGroupTemplate={groupedItemTemplate}
                    placeholder="Select Groceries" display="chip" className="w-full sm:w-60rem" filter panelFooterTemplate={panelFooterTemplate}/>
                  </div>
              </div>
          </div>

          <div className="row custom-mt-10">
            <div className="col-sm-12 col-md-12 col-lg-6">
              <div className="flex flex-column gap-2 mb-3 ">
                <label htmlFor="amount" className="form-label-class">Amount</label>
                <InputNumber inputId="currency-india" name="amount" id="amount" 
                mode="currency" currency="INR" currencyDisplay="code" locale="en-IN"
                value={formik.values.amount} onValueChange={(e) => {formik.setFieldValue('amount', e.value)}}
                className="p-inputtext-sm" aria-describedby="amount-help" required="true" />
              </div>
            </div>
            <div className="col-sm-12 col-md-12 col-lg-6">
              <div className="flex flex-column gap-2">
                <label htmlFor="type" className="form-label-class mb-1">Payment Type</label>
                <div className="flex justify-content-start gap-3 mb-3">
                <div className="flex align-items-center">
                    <RadioButton inputId="paymentType2" name="paymentType" value="Cash" onChange={(e) => setPaymentType("Cash")} checked={paymentType === 'Cash'} />
                    <label htmlFor="paymentType2" className="ml-2"  required="true">Cash</label>
                </div>
                <div className="flex align-items-center">
                    <RadioButton inputId="paymentType1" name="paymentType" value="Online" onChange={(e) => setPaymentType("Online")} checked={paymentType === 'Online'} />
                    <label htmlFor="paymentType1" className="ml-2"  required="true">Online</label>
                </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-12">
              <div className="flex flex-column gap-2 mt-2">
              <label htmlFor="notes" className="form-label-class">Notes</label>
                <InputTextarea value={formik.values.notes} onChange={formik.handleChange} 
                inputid="notes"  name="notes" rows={2} cols={30} />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="d-flex justify-content-end mt-2">
              <Button label="Cancel" icon="pi pi-times" onClick={() => closeModal(false)} className="p-button-text" />
              <Button  type="submit"  label={isEdit ? 'Update' : 'Save'} icon="pi pi-check" />
            </div>
          </div>

        </form>
      </Dialog>
    </>
  );
}
