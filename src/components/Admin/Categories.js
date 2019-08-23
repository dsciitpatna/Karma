import React, { Component, Fragment } from 'react';
import "antd/dist/antd.css";
import { connect } from "react-redux";
import { Button,Modal,Table, Divider,notification,Icon } from 'antd';
import {fetchCategory,addCategory,deleteCategory,updateCategory} from '../../redux/actions/categoryActions'
import './users.css'
class Categories extends Component {

  state = { 
    visible: false ,
    visibleUpdateModal: false,
    newCategoryName : '',
    updateCategoryName : '',
    categoryNumber: 0,
  }

  onChange = (e) => {
    this.setState({
      [e.target.name]:e.target.value
    })
  }
  
  showModal = () => {
    this.setState({
      visible: true,
    });
  }

  handleOk = (e) => {
    this.props.addCategory(this.state.newCategoryName);
    this.setState({
      visible: false,
      newCategoryName: ''
    });
  }

  handleCancel = (e) => {
    this.setState({
      visible: false,
      newCategoryName: ''
    });
  }

  updateShowModal = (id,name) => {
    this.setState({
      visibleUpdateModal: true,
      categoryNumber:id,
      updateCategoryName:name,
    });
  }

  handleOkUpdate = () => {
    this.props.updateCategory(this.state.updateCategoryName,this.state.categoryNumber);
    this.setState({
      visibleUpdateModal: false,
      updateCategoryName: '',
      categoryNumber: 0
    });
  }

  handleCancelUpdate = (e) => {
    this.setState({
      visibleUpdateModal: false,
      newCategoryName: '',
      categoryNumber: 0
    });
  }

  handleDelete = (id) => {
    this.props.deleteCategory(id);
  }

  sucessfulNotification=(type)=>{
    notification.open({
      message: type,
      description:
        '',
      icon: <Icon type="check-circle" style={{ color: '#108ee9' }} />,
  });
  }

  componentDidUpdate(){
    this.props.fetchCategory();
    if(this.props.status===200&&this.props.statusType!=='fetchCategory'){
      this.sucessfulNotification(this.props.statusType);
    }
  }
  componentDidMount(){
    this.props.fetchCategory();
  }


  render() {
    const { isAuthenticated, user} = this.props;
    const { Column } = Table;

    if (isAuthenticated && user.isVendor === false && user.isAdmin === true) {
      return (
        <Fragment>
          <h1 className="mainHeader">Categories</h1>
          <br />
          <Button type="primary" onClick={this.showModal}>
          Add Category
          </Button>
          <Modal
            title="Add a new category"
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
          >
              <input type="text" name="newCategoryName" onChange={this.onChange} />
           </Modal>
           <div className="padding"> 
            <Table dataSource={this.props.category.categories} rowKey="_id">
              <Column title="Category Name" dataIndex="name" key="name" />
              <Column
                title="Action"
                key="_id"
                render={(text, record) => (
                  <span>
                    <span onClick={()=> {this.updateShowModal(record._id,record.name)}} style={{cursor:'pointer',color:'blue'}}>Update</span>
                    <Modal
                      title="Update Modal"
                      visible={this.state.visibleUpdateModal}
                      onOk={() => {this.handleOkUpdate()}}
                      onCancel={this.handleCancelUpdate}
                    >
                        <input type="text" name="updateCategoryName" onChange={this.onChange} value={this.state.updateCategoryName} />
                    </Modal>
                    <Divider type="vertical" />
                    <span onClick={()=>{this.handleDelete(record._id)}} style={{cursor:'pointer',color:'red'}}>Delete</span>
                  </span>
                )}
              />
            </Table>
          </div>
        </Fragment>
      )
    }
    else {
      return (
        <p>Unauthorized Access</p>
      )
    }
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
  category: state.category.categories,
  status:state.category.status,
  statusType:state.category.statusType,
});

export default connect(
  mapStateToProps,
  {fetchCategory,addCategory,deleteCategory,updateCategory}
)(Categories);