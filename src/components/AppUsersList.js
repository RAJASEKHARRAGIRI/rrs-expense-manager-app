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
import UserModal from "../common/UserModal";
import { toast } from 'react-toastify';
import CommonToastContainer from "../common/ToastAlert"
import { ProgressBar } from 'primereact/progressbar';
import { Tag } from 'primereact/tag';

import '../common/css/DataTable.css';

export default function AppUsersList() {
    const [customers, setCustomers] = useState(null);
    const [editCustomer, setEditCustomer] = useState(null);
    
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {        
        fetchUsers();
    }, []);

    const fetchUsers = () => {
        fetch(`${AppConstants.jsonServerApiUrl}/users`)
        .then((res) => {
          return res.json();
        })
        .then((res) => {
            setCustomers(getCustomers(res)); 
            setLoading(false) 
        })
        .catch((error) => {      
          toast.error(`${error.message}, Failed to fetch users.`);
        });
    }

    const getCustomers = (data) => {
        return [...data || []].map(d => {
            d.date = new Date(d.date);
            return d;
        });
    }

    const formatCurrency = (value) => {
        return value.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
    }

    const [filters, setFilters] = useState({
        'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
        'fullName': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] }
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
                <h5 className="m-0">Registered Users</h5>
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
    
    const balanceBodyTemplate = (rowData) => {        
        return formatCurrency(+rowData?.salary);
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
        return <Button type="button" className='p-button-secondary' icon="pi pi-user-edit" onClick={(e) => openUserEditModal(e, rowData)}></Button>;
    }

    const genderBodyTemplate = (rowData) => {
        return rowData?.gender === "male" ? <Tag severity="warning" value="Male" rounded></Tag> : 
        <Tag severity="success" value="Female" rounded></Tag>;
    }

    function openUserEditModal(event, rowData) {
        event.preventDefault();
        rowData.showModal = true;
        setEditCustomer(rowData);
    }

    const closeUserModal = () => {
        editCustomer.showModal = false;
        setEditCustomer(false);
        fetchUsers();
      };

    const header = renderHeader();

    return (
        <>
        {editCustomer?.showModal ? <UserModal  userInfo={editCustomer} closeUserModal={closeUserModal}></UserModal> : ''} 
        <div className="datatable-doc-demo">
            <CommonToastContainer/>
            <div className="card">
                <DataTable value={customers} scrollable  paginator className="p-datatable-customers" header={header} rows={8}  size="small"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" rowsPerPageOptions={[5,8,10,25,50]}
                    dataKey="id" rowHover  filterDisplay="menu" loading={loading} responsiveLayout="scroll"
                    filters={filters} globalFilterFields={['fullName', 'phoneNumber','email','gender','location']} emptyMessage="No users found."
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries">

                    <Column field="fullName" header="Name" sortable  style={{ minWidth: '14rem' }} />
                    <Column field="email" header="Email" sortable  style={{ minWidth: '14rem' }} />
                    <Column field="phoneNumber" header="Phone Number" sortable  style={{ minWidth: '12rem' }} />
                    <Column field="gender" header="Gender" sortable  style={{ minWidth: '8rem' }} body={genderBodyTemplate} />
                    <Column field="location" header="Location" sortable  style={{ minWidth: '14rem' }} />
                    <Column field="salary" header="Salary" sortable  dataType="numeric" style={{ minWidth: '8rem' }} body={balanceBodyTemplate}/>
                    <Column field="updatedOn" header="Updated On" sortable dataType="date" style={{ minWidth: '10rem' }} body={dateBodyTemplate}/>
                    {/* <Column sortable={false}  style={{ minWidth: '8rem' }} body={profileStatusBodyTemplate} /> */}
                    <Column alignFrozen="right" frozen style={{ minWidth: '2rem' }}  body={actionBodyTemplate} />

                </DataTable>
            </div>
        </div>
        </>
    );
}
            