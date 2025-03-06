
import ExpensesModal from "../common/ExpensesModal"

import 'primeicons/primeicons.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';

import React, { useState, useEffect , useRef } from 'react';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import * as AppConstants from "../common/constants";
import UserModal from "../common/UserModal";
import { toast } from 'react-toastify';
import CommonToastContainer from "../common/ToastAlert"
import { ProgressBar } from 'primereact/progressbar';
import { Tag } from 'primereact/tag';
import { OverlayPanel } from 'primereact/overlaypanel';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

export default function ExpensesList() {
  const [editExpenses, setEditExpenses] = useState({showModal: false});
  const [currentPopupRow, setCurrentPopupRow] = useState('');
  const op = useRef(null);
  let rowId = null;

  const [expenses, setExpenses] = useState(null);
    
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {        
        fetchExpenses();
    }, []);

    const fetchExpenses = () => {
        fetch(`${AppConstants.jsonServerApiUrl}/expenses`)
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          setExpenses(getExpenses(res)); 
          setLoading(false) 
        })
        .catch((error) => {      
          toast.error(`${error.message}, Failed to fetch expenses.`);
        });
    }

    const getExpenses = (data) => {
        return [...data || []].map(d => {
            d.date = new Date(d.date);            
            d.groceries = d.groceries.toString();
            return d;
        });
    }

    const formatCurrency = (value) => {
        return value.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
    }

    const [filters, setFilters] = useState({
        'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
        'shopName': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] }
    });

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };
        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    }

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between align-items-center">
                <Button label="Add Expense" className='p-button-success' onClick={(e) => openExpenseAddModal(e)} icon="pi pi-cart-plus"/>
                <span className="p-input-icon-left" style={{width:"43%"}}>
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Search here by Shop name / Category / Groceries / Payment type / Notes / Bill date etc" className='p-inputtext-sm block' style={{width:"100%"}}/>
                </span>
            </div>
        )
    }

    const dateBodyTemplate = (rowData) => {
        return formatDate(rowData.updatedOn);
    }

    const billDateBodyTemplate = (rowData) => {
      return formatDate(rowData.date);
  }

    const formatDate = (value) => {
        value = new Date(value);
        return value.toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    }
    
    const amountBodyTemplate = (rowData) => {        
        return formatCurrency(+rowData?.amount);
    }

    const groceriesBodyTemplate = (rowData) => {   
        let groceriesData = getGroceryDetailsByCode(rowData.groceries);     
        return <> <div className="white-space-nowrap overflow-hidden text-overflow-ellipsis" title={groceriesData}>
          {groceriesData}
        </div> 
        </>
    }

    const getGroceryDetailsByCode = (groceries) => {
      let result ="";
      groceries = JSON.parse(groceries);
      groceries?.map((grocery)=>{
        result += grocery.name+", "
      })
      return result.slice(0, -2); 
    }

    const categoryBodyTemplate = (rowData) => {   
        let categoryData = getGroceryCategoryDetailsByCode(rowData.category);     
        return <> <div className="white-space-nowrap overflow-hidden text-overflow-ellipsis" title={categoryData}>
          {categoryData}
        </div> 
        </>
    }

    const getGroceryCategoryDetailsByCode = (category) => {
      let result ="";
      category.split(",").map((categoryCode)=>{
        let obj = AppConstants.groceries.find(x => x.code === categoryCode);
        if (obj) {
          result += obj.label+", "
        }
      })
      return result.slice(0, -2); 
    }

    const profileStatusBodyTemplate = (rowData) => { 
        let percentage = 55;
        if(rowData?.email && rowData?.phoneNumber &&  rowData?.gender && rowData?.location && rowData?.salary) {
            percentage = 100;
        } else if ((rowData?.email && rowData?.phoneNumber && rowData?.gender) || rowData?.salary) {
            percentage = 75;
        } 
        return <ProgressBar value={percentage}></ProgressBar>;
    }
    
    const actionBodyTemplate = (rowData) => {
        return <>
        <button type="button" className="btn btn-secondary btn-sm gridActionIcon" onClick={(e) => openExpenseEditModal(e, rowData)} > <i className="pi pi-file-edit" ></i></button>
        <button type="button" className="btn btn-danger btn-sm gridActionIcon" onClick={(e) => deleteExpense(e, rowData)}> <i className="pi pi-trash"></i></button>
        </>
    }

    const paymentTypeBodyTemplate = (rowData) => {
        return rowData?.paymentType == "Cash" ? <Tag severity="warning" value="Cash" rounded></Tag> : 
        <Tag severity="success" value="Online" rounded></Tag>;
    }

    function openExpenseEditModal(event, rowData) {
        event.preventDefault();
        rowData.showModal = true;
        setEditExpenses(rowData);
    }

    function deleteExpense(event, rowData) {
        event.preventDefault();
        rowId = rowData.id
        confirmDialog({
          message: (<p>Are you sure you want to delete <b>{rowData.shopName}</b> ?"</p>),
          header: 'Confirmation',
          icon: 'pi pi-exclamation-triangle',
          defaultFocus: 'accept',
          accept,
          reject
      });
    }

    const accept = (id) => {
      fetch(`${AppConstants.jsonServerApiUrl}/expenses/${rowId}`, {
        method: "DELETE"
      })
        .then((res) => {
          toast.success("Successfully deleted");
          fetchExpenses();
        })
        .catch((error) => {
          toast.error(`${error.message}, failed to delete.`);
        });
    }

    const reject = () => { }

    function openExpenseAddModal(event) {
      event.preventDefault();
      let obj = {showModal: true};
      setEditExpenses(obj);
    }

    const closeExpensesModal = () => {
        editExpenses.showModal = false;
        setEditExpenses(false);
        fetchExpenses();
      };

    const header = renderHeader();

  return (
    <>
     <CommonToastContainer/>
     <ConfirmDialog />
     <div className="row">
      <div className="col-sm-8 mb-0 container d-flex align-items-center justify-content-left">
          <h4>Expenses List</h4>
        </div>
        <div className="col-sm-4 mb-0">
          <div className="card bg-info text-white mb-0">
            <div className="card-body mb-0" style={{textAlign:"center", padding: "6px"}}>
              Total Amount Spent: <b>Rs. {expenses?.reduce((accumulator, object) => {return accumulator + object.amount;}, 0)} /-</b>
            </div>
          </div>
        </div>
     </div>
    
      {editExpenses?.showModal ? <ExpensesModal expensesInfo={editExpenses} closeExpensesModal={closeExpensesModal}></ExpensesModal> : ''}

      <div className="datatable-doc-demo">
            <CommonToastContainer/>
            <div className="card">
                <DataTable value={expenses} scrollable  paginator className="p-datatable-expenses" header={header} rows={5}  size="small"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" rowsPerPageOptions={[5,8,10,25,50]}
                    dataKey="id" rowHover  filterDisplay="menu" loading={loading} responsiveLayout="scroll"
                    filters={filters} globalFilterFields={['shopName', 'category','groceries','notes','paymentType','date']} emptyMessage="No users found."
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries">

                    <Column field="shopName" header="Shop Name" sortable  style={{ minWidth: '14rem' }} />
                    <Column field="category" header="Category" sortable  style={{ overflow: 'ellipsis',minWidth:'15rem',maxWidth: '15rem' }} body={categoryBodyTemplate} />
                    <Column field="groceries" header="Groceries" sortable  style={{ overflow: 'ellipsis',minWidth:'15rem',maxWidth: '15rem' }} body={groceriesBodyTemplate}  />
                    <Column field="amount" header="Amount" sortable  dataType="numeric" style={{ minWidth: '8rem' }} body={amountBodyTemplate}/>
                    <Column field="paymentType" header="Payment" sortable  style={{ minWidth: '8rem' }} body={paymentTypeBodyTemplate} />
                    <Column field="notes" header="Notes" sortable  style={{ minWidth: '14rem' }} />
                    <Column field="date" header="Bill Date" sortable dataType="date" style={{ minWidth: '10rem' }} body={billDateBodyTemplate}/>
                    <Column field="updatedOn" header="Updated On" sortable dataType="date" style={{ minWidth: '10rem' }} body={dateBodyTemplate}/>
                    {/* <Column sortable={false}  style={{ minWidth: '8rem' }} body={profileStatusBodyTemplate} /> */}
                    <Column alignFrozen="right" frozen style={{ minWidth: '2rem' }}  body={actionBodyTemplate} />

                </DataTable>
            </div>
        </div> 
    </>
  );
}
