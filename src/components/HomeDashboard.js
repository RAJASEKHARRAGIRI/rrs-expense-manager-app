import React from "react";
import * as AppConstants from "../common/constants";
import { toast } from 'react-toastify';
import CommonToastContainer from "../common/ToastAlert"
import { Card } from 'primereact/card';
import { Chart } from 'primereact/chart';

export default class HomeDashboardComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
      userCount: 0,
      expensesList: [],
      totalAmount: 12345,
      paymentTypeCount: {},
      categoryTypeCount: {},
      chartData:{},
      chartData1:{},
      chartOptions:{},
      sortedExpenses:[{}]
    }
  }

  componentDidMount() {
      this.fetchExpenses()
      fetch(`${AppConstants.jsonServerApiUrl}/users`)
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        this.setState({
          userCount: res.length
        })
      })
      .catch((error) => {      
        toast.error(`${error.message}, Failed to fetch users data.`);
      });
    }

  fetchExpenses = () => {
      fetch(`${AppConstants.jsonServerApiUrl}/expenses`)
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        let expenses = this.getExpenses(res);
        let sortObj = expenses.sort((firstEl,secondEl) => firstEl.amount - secondEl.amount);
        let total = expenses.reduce((accumulator, object) => {return accumulator + object.amount;}, 0);
        this.setState({
          totalAmount: total,
          paymentTypeCount: this.paymentTypeCount(expenses),
          categoryTypeCount: this.categoryTypeCount(expenses),
          sortedExpenses: sortObj.reverse(),
          expensesList: expenses
        })
        this.loadCharts();
      })
      .catch((error) => {      
        toast.error(`${error.message}, Failed to fetch expenses.`);
      });
  }

  loadCharts() {
    let documentStyle = getComputedStyle(document.documentElement);
    let documentStyle1 = getComputedStyle(document.documentElement);
    let data = {
          labels: ['Fruits', 'Vegetables', 'Meats', 'Dairy', 'Kirana Shop', 'Snacks'],
          datasets: [
              {
                  data: [this.state.categoryTypeCount?.fruits, this.state.categoryTypeCount?.vegetables, this.state.categoryTypeCount?.meats,
                    this.state.categoryTypeCount?.dairy,this.state.categoryTypeCount?.kiranaShop, this.state.categoryTypeCount?.snacks],
                  backgroundColor: [
                      documentStyle.getPropertyValue('--blue-500'), 
                      documentStyle.getPropertyValue('--yellow-500'), 
                      documentStyle.getPropertyValue('--green-500'),
                      documentStyle.getPropertyValue('--pink-500'),
                      documentStyle.getPropertyValue('--orange-500'),
                      documentStyle.getPropertyValue('--red-500')
                  ],
                  hoverBackgroundColor: [
                      documentStyle.getPropertyValue('--blue-400'), 
                      documentStyle.getPropertyValue('--yellow-400'), 
                      documentStyle.getPropertyValue('--green-400'),
                      documentStyle.getPropertyValue('--pink-400'),
                      documentStyle.getPropertyValue('--orange-400'),
                      documentStyle.getPropertyValue('--red-400')
                  ]
              }
          ]
      }

      let data1 = {
        labels: ['Cash', 'Online'],
        datasets: [
            {
                data: [this.state.paymentTypeCount?.cash, this.state.paymentTypeCount?.online],
                backgroundColor: [
                    documentStyle1.getPropertyValue('--blue-500'), 
                    documentStyle1.getPropertyValue('--yellow-500'), 
                ],
                hoverBackgroundColor: [
                    documentStyle1.getPropertyValue('--blue-400'), 
                    documentStyle1.getPropertyValue('--yellow-400'), 
                ]
            }
        ]
    }
      let  options = {
          plugins: {
              legend: {
                  labels: {
                      usePointStyle: true,
                  }
              }
          }
      };

      this.setState({  chartData: data, chartOptions: options, chartData1: data1})
  }

  paymentTypeCount(obj) {
    return obj.reduce((acc, curVal) => {
        if (curVal.paymentType === 'Cash') {
              acc.cash++;
          }
          else {
              acc.online++;
          }
          return acc;
      }, {online: 0, cash: 0});
  }

  categoryTypeCount(obj) {
    return obj.reduce((acc, curVal) => {
      let temp = curVal.category.split(',');
        temp.forEach((item, i) => {
          switch(item){
            case 'vegetables':
              acc.vegetables++;
              break;
            case 'kiranaShop':
              acc.kiranaShop++;
              break;
            case 'dairy':
              acc.dairy++;
              break;
            case 'meats':
              acc.meats++;
              break;
            case 'fruits':
              acc.fruits++;
              break;
            case 'snacks':
              acc.snacks++;
              break;
          }
        });
        return acc;
    }, {vegetables: 0,kiranaShop:0, dairy:0,fruits: 0, meats: 0, snacks:0});
  }

  getExpenses = (data) => {
      return [...data || []].map(d => {
          d.date = new Date(d.date);            
          d.groceries = d.groceries.toString();
          return d;
      });
  }
 
  render() {
    return (
      <>
        <CommonToastContainer />
        <div className="mb-3">
          <h4>Dashboard</h4>
        </div>

        <div className="row">
          <div className="col-sm-12 col-md-6 d-flex">
            <div className="card flex-fill border-0 illustration">
              <div className="card-body p-0 d-flex flex-fill">
                <div className="row g-0 w-100">
                  <div className="col-8">
                    <div className="p-3 m-1">
                      <h4>Welcome Back, </h4>
                      <p className="mb-0">
                        {this.props?.userInfo
                          ? this.props?.userInfo?.fullName
                          : "Guest"}{" "}
                        to Expense Manager Dashboard
                      </p>
                    </div>
                  </div>
                  <div className="col-4 align-self-end text-end">
                    <img
                      src={require("../images/customer-support.jpg")}
                      className="img-fluid illustration-img"
                      alt=""
                    ></img>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-12 col-md-3 d-flex">
            <div className="card flex-fill border-0">
              <div className="card-body py-4">
                <div className="d-flex align-items-start">
                  <div className="flex-grow-1">
                    <h4 className="mb-2">
                      ₹ {this.props?.userInfo?.salary}.00
                    </h4>
                    <p className="mb-2">Total Income</p>
                    <div className="mb-0">
                      <span className="text-muted">Total savings</span>
                      <span className="badge text-success me-2">
                        ₹ {this.props?.userInfo?.salary - this.state?.totalAmount }.00&nbsp;
                        <i className="fa-solid fa-arrow-down pe-2"></i>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-12 col-md-3 d-flex">
            <div className="card flex-fill border-0">
              <div className="card-body py-4">
                <div className="d-flex align-items-start">
                  <div className="flex-grow-1">
                    <h4 className="mb-2">₹ {this.state?.totalAmount}.00</h4>
                    <p className="mb-2">Total expenses</p>
                    <div className="mb-0">
                      <span className="text-muted">Total shoppings till</span>
                      <span className="badge text-success me-2">
                        {this.state.expensesList?.length}&nbsp;
                        <i className="fa-solid fa-arrow-up pe-2"></i>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* 2nd row start */}
        <div className="row">

        <div className="col-sm-12 col-md-6 d-flex">
          <div className="card flex-fill border-0">
            <div className="card-body py-4">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <Chart type="pie" height="20rem" data={this.state.chartData} options={this.state.chartOptions} className="w-full md:w-50rem" />
                  <div className="d-flex flex-row-reverse text-white">
                    <div className="p-2 bg-info">Expenses category</div>
                  </div>
                </div>
                </div>
              </div>
            </div>
        </div>

        <div className="col-sm-12 col-md-6 d-flex">
          <div className="card flex-fill border-0">
            <div className="card-body py-4">
              <div className="d-flex align-items-end">
                <div className="flex-grow-1">
                <Chart type="doughnut" height="20rem" data={this.state.chartData1} options={this.state.chartOptions} className="w-full md:w-30rem" />
                <div className="d-flex flex-row-reverse text-white">
                    <div className="p-2 bg-info">Expenses payment type</div>
                  </div>
                </div>
                </div>
              </div>
            </div>
        </div>
        </div>
        <div className="card border-0">
          <div className="card-header">
            <h5 className="card-title">Expenses</h5>
            <h6 className="card-subtitle text-muted">
              Top 5 expenses in this year
            </h6>
          </div>
          <div className="card-body">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">S.No</th>
                  <th scope="col">Shop Name</th>
                  <th scope="col">Type</th>
                  <th scope="col">Amount</th>
                </tr>
              </thead>
              <tbody>
              {
                this.state.sortedExpenses?.slice(0,5).map((item, index) => (
                <tr key={index}>
                  <th scope="row">{index+1}</th>
                  <td>{item.shopName}</td>
                  <td><span className={item.paymentType === "Cash" ? "badge rounded-pill bg-warning" : "badge rounded-pill bg-info"}>{item.paymentType}</span></td>
                  <td>Rs. {item.amount} /-</td>
                </tr>
                )
              )}
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  }
}
