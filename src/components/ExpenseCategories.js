import 'primeicons/primeicons.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';

import React, { useState, useEffect } from 'react';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import * as AppConstants from "../common/constants";
import ExpenseCategoryModal from "../components/ExpenseCategoryModal";
import ExpenseSubCategoryModal from "../components/ExpenseSubCategoryModal";
import { toast } from 'react-toastify';
import CommonToastContainer from "../common/ToastAlert"
import { ProgressBar } from 'primereact/progressbar';
import { Tag } from 'primereact/tag';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

import '../common/css/DataTable.css';

export default function ExpenseCategories() {
    const [categories, setCategories] = useState(null);
    const [editCategory, setEditCategory] = useState(null);

    //subcategory
    const [categoryInfo, setCategoryInfo] = useState(null);
    
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [loading, setLoading] = useState(true);
    let rowId = null;
    useEffect(() => {        
        fetchCategories();
    }, []);

    const fetchCategories = () => {
        fetch(`${AppConstants.jsonServerApiUrl}/categories`)
        .then((res) => {
          return res.json();
        })
        .then((res) => {
            setCategories(getCategories(res)); 
            setLoading(false) 
        })
        .catch((error) => {      
          toast.error(`${error.message}, Failed to fetch categories.`);
        });
    }

    const getCategories = (data) => {
        return [...data || []].map(d => {
            d.updatedOn = new Date(d.updatedOn);
            return d;
        });
    }

    function deleteCategory(event, rowData) {
        debugger
            event.preventDefault();
            rowId = rowData.id
            confirmDialog({
              message: (<p>Are you sure you want to delete <b>{rowData.name}</b> ?"</p>),
              header: 'Confirmation',
              icon: 'pi pi-exclamation-triangle',
              defaultFocus: 'accept',
              accept,
              reject
          });
        }
    
        const accept = (id) => {
          fetch(`${AppConstants.jsonServerApiUrl}/categories/${rowId}`, {
            method: "DELETE"
          })
            .then((res) => {
              toast.success("Successfully deleted");
              fetchCategories();
            })
            .catch((error) => {
              toast.error(`${error.message}, failed to delete.`);
            });
        }
    
        const reject = () => { }

    const [filters, setFilters] = useState({
        'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
        'name': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] }
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
                {/* <h5 className="m-0">Expense Categories</h5> */}
                <Button label="Add Category" className='p-button-success' onClick={(e) => openCategoryEditModal(e, {}, true)} icon="pi pi-plus"/>
                <span className="p-input-icon-left" style={{width:"20%"}}>
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Search here" className='p-inputtext-sm block' style={{width:"100%"}}/>
                </span>
            </div>
        )
    }

    const dateBodyTemplate = (rowData) => {
        return formatDate(rowData.updatedOn);
    }   

    const formatDate = (value) => {
        value = new Date(value);
        return value.toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    }
    
    
    const actionBodyTemplate = (rowData) => {
        return <>
        <button type="button" title='Assign Sub Categories' className='btn btn-success btn-sm gridActionIcon' onClick={(e) => openSubCategoryModal(e, rowData)}><i className="fa fa-list-ul" aria-hidden="true"></i></button>
        <Button type="button" title='Edit Record' className='p-button-secondary gridActionIcon' icon="pi pi-file-edit" onClick={(e) => openCategoryEditModal(e, rowData, false)}></Button>
         <button type="button" className="btn btn-danger btn-sm gridActionIcon" title='Delete Record' onClick={(e) => deleteCategory(e, rowData)}> <i className="pi pi-trash"></i></button>
        </>
    }

    function openCategoryEditModal(event, rowData, isAdd) {
        event.preventDefault();
        rowData.showModal = true;
        rowData.isAdd = isAdd;
        setEditCategory(rowData);
    }

    function openSubCategoryModal(event, rowData) {
        event.preventDefault();
        rowData.showModal = true;
        setCategoryInfo(rowData);
    }

    const closeCategoryModal = () => {
        editCategory.showModal = false;
        setEditCategory(false);
        fetchCategories();
    };

    const closeSubCategoryModal = () => {
        categoryInfo.showModal = false;
        setCategoryInfo(false);
    };

    const header = renderHeader();

    return (
        <>
         <div className="row">
         <div className="col-sm-8 mb-0  align-items-center justify-content-left">
            <h4>Expense Categories</h4>
        </div>
        </div>
        {categoryInfo?.showModal ? <ExpenseSubCategoryModal  categoryInfo={categoryInfo} closeCategoryModal={closeSubCategoryModal}></ExpenseSubCategoryModal> : ''} 
        {editCategory?.showModal ? <ExpenseCategoryModal  categoryInfo={editCategory} closeCategoryModal={closeCategoryModal}></ExpenseCategoryModal> : ''} 
        <div className="datatable-doc-demo">
            <CommonToastContainer/>
               <ConfirmDialog />
            <div className="card">
                <DataTable value={categories} scrollable  paginator className="p-datatable-customers" header={header} rows={5}  size="small"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" rowsPerPageOptions={[5,8,10,25,50]}
                    dataKey="id" rowHover  filterDisplay="menu" loading={loading} responsiveLayout="scroll"
                    filters={filters} globalFilterFields={['name']} emptyMessage="No categories found."
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries">

                    <Column field="id" header="Id" sortable  style={{ minWidth: '10rem !important' }} />
                    <Column field="name" header="Name" sortable  style={{ minWidth: '18rem' }} />
                    <Column field="code" header="Code" sortable  style={{ minWidth: '12rem' }} />
                    <Column field="updatedOn" header="Updated On" sortable dataType="date" style={{ minWidth: '10rem' }} body={dateBodyTemplate}/>
                    <Column alignFrozen="right" frozen style={{ minWidth: '2rem' }}  body={actionBodyTemplate} />

                </DataTable>
            </div>
        </div>
        </>
    );
}
            