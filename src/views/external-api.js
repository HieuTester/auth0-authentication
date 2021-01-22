import React, { useState, useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { Table, Radio, Divider, Row, Button, Modal, Col, Form, Input, Space, message } from 'antd';
import 'antd/dist/antd.css';

export const ExternalApi = () => {
  const [selectionType, setSelectionType] = useState('checkbox');
  const [listItems, setListItems] = useState([]);
  const [isOpenModal, setIsOpenModal] = useState(false)
  const { getAccessTokenSilently } = useAuth0();
  const serverUrl = process.env.REACT_APP_SERVER_URL; 

  const tailLayout = {
      wrapperCol: { offset: 0, span: 24 },
  };

  const layout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
  };

  useEffect(() => {
      getEmployees();
  }, [])

  const getEmployees = async () => {
    try {
    
      const token = await getAccessTokenSilently();
      const response = await fetch(
        `${serverUrl}/api/employees`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      )
      const responseData = await response.json();
      setListItems(responseData.data.employees)
      console.log(listItems)
    } catch (error) {
      message.error(error.message)
    }
  };


  const columns = [
      {
          title: 'Name',
          dataIndex: 'name',
          render: (text) => <a>{text}</a>,
      },
      {
          title: 'Age',
          dataIndex: 'age',
      },
      {
        title: 'Email',
        dataIndex: 'email',
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            width: 300,
        },
      {
          title: 'Address',
          dataIndex: 'address',
      },
      {
          title: 'Action',
          key: 'action',
          render: (text, record) => (
            <Space size="middle">
              <Button style={{}}type="text" >Edit</Button>
              <Button type="text" danger  >Delete</Button>
            </Space>
          ),
        },
  ];

  const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
          console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      },
      getCheckboxProps: (record) => ({
          disabled: record.name === 'Disabled User',
          // Column configuration not to be checked
          name: record.name,
      }),
  };

  const openModal = () => {
      setIsOpenModal(true);
  };
  const closeModal = () => {
      setIsOpenModal(false);
  };

  const handleOk = () => {
      setIsOpenModal(false);
  };
  const handleCancel = () => {
      setIsOpenModal(false);
  };

  return (

      <div>
          <Row>
              <Button type="primary" onClick={openModal}>
                  Add
              </Button>
              <Modal
                  title="Add new employee"
                  visible={isOpenModal}
                  footer={null}
                  onCancel={closeModal}
              >
                  <Form {...layout}
                  className="form"
                      name="basic"
                      initialValues={{
                          remember: true,
                      }}
                  // onFinish={onFinish}
                  // onFinishFailed={onFinishFailed}
                  >
                      <Form.Item {...tailLayout}
                          label="Name"
                          name="name"
                          rules={[
                              {
                                  required: true,
                                  message: 'Please input your employee\'s name!',
                              },
                          ]}
                      >
                          <Input />
                      </Form.Item>

                      <Form.Item {...tailLayout}
                          label="Age"
                          name="age"
                          rules={[
                              {
                                  required: true,
                                  message: 'Please input Employee\'s age!',
                              },
                          ]}
                      >
                          <Input />
                      </Form.Item>


                      <Form.Item {...tailLayout}>
                          <Col span={24} style={{ textAlign: 'right' }}>
                              <Button type="primary" htmlType="submit">
                                  Submit
                              </Button>
                          </Col>
                      </Form.Item>
                  </Form>

              </Modal>
          </Row>
          <Row>
              <Radio.Group
                  onChange={({ target: { value } }) => {
                      setSelectionType(value);
                  }}
                  value={selectionType}
              >
              </Radio.Group>

              <Divider />
              <Col span={18} offset={3}>
                  <Table
                      rowSelection={{
                          type: selectionType,
                          ...rowSelection,
                      }}
                      columns={columns}
                      dataSource={listItems}
                  />
              </Col>
          </Row>

      </div>
  );
}
export default ExternalApi;
