import React, { useState, useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { Table, Radio, Divider, Row, Button, Modal, Col, Space, message } from 'antd';
import 'antd/dist/antd.css';
import { ExclamationCircleOutlined } from '@ant-design/icons'
import AddEmployee from './AddEmployee';

export const ExternalApi = () => {
    const [selectionType, setSelectionType] = useState('checkbox');
    const [listItems, setListItems] = useState([]);
    const [employee, setEmployee] = useState({});
    const [isOpenModal, setIsOpenModal] = useState(false)
    const { getAccessTokenSilently } = useAuth0();
    const serverUrl = process.env.REACT_APP_SERVER_URL;


    useEffect(() => {
        getEmployees();
    }, [])

    const getEmployees = async () => {
        try {

            const token = await getAccessTokenSilently();
            const response = await fetch(
                `${serverUrl}/employees`,
                {
                    headers: {
                        authorization: `Bearer ${token}`,
                    },
                }
            )
            const responseData = await response.json();
            console.log(responseData)
            setListItems(responseData)
        } catch (error) {
            message.error(error.message)
        }
    };

    function getEmployeeById(Id) {
        const requestUrl = `${serverUrl}/employees/`;
        fetch(requestUrl + Id, {
            method: 'GET',
        })
            .then(res => res.json())
            .then(response => {
                // console.log('Success:', JSON.stringify(response))
                setEmployee(response)
            })
            .catch(error => {
                console.error('Error:', error)
                message.error(error)
            })
    }

    const addNewEmployee = async (newEmployee) => {
        try {

            const token = await getAccessTokenSilently();
            const response = await fetch(
                `${serverUrl}/employees`,
                {
                    method: "POST",
                    body: JSON.stringify(newEmployee),
                    headers: {
                        authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            )
            const responseData = await response.json();
            console.log(responseData)
            message.success("Employee added successfully!")
            getEmployees()
        } catch (error) {
            message.error(error.message)
        }
    };

    function editEmployee(employee) {
        const requestUrl = `${serverUrl}/employees/`
        fetch(requestUrl + employee.id, {
            method: 'PUT',
            body: JSON.stringify(employee),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(response => {
                console.log('Success:', JSON.stringify(response))
                message.success("Employee updated successfully!")
                getEmployees()
                setEmployee({})
            })
            .catch(error => {
                console.error('Error:', error)
                message.error(error)
            })
    }

    function deleteEmployee(Id) {
        const requestUrl = `${serverUrl}/employees/`
        fetch(requestUrl + Id, {
            method: 'DELETE',
        })
            .then(res => res.json())
            .then(response => {
                console.log('Success:', JSON.stringify(response))
                message.success("Note has been deleted!")
                getEmployees()
            })
            .catch(error => {
                console.error('Error:', error)
                message.error(error)
            })
    }

    function onEditEmployeeClick(Id) {
        getEmployeeById(Id)
        setIsOpenModal(true)
    }

    function onDeleEmployeeClick(Id) {
        Modal.confirm({
            title: 'Delete Employee!',
            icon: <ExclamationCircleOutlined />,
            content: "Are you sure you want to delete this employee?",
            onOk() {
              console.log('OK');
              deleteEmployee(Id);
            },
            onCancel() {
              console.log('Cancel');
            },
        })
    }


    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
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
            textWrap: 'word-break',
            
        },
        {
            title: 'Address',
            dataIndex: 'address',
            textWrap: 'word-break',
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Button style={{}} type="text" onClick={() => onEditEmployeeClick(record.id)}>Edit</Button>
                    <Button type="text" danger  onClick={() => onDeleEmployeeClick(record.id)} >Delete</Button>
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
        setEmployee({});
    };

    return (

        <div>
            <Row>
                <Button type="primary" onClick={openModal}>
                    Add
              </Button>
                <AddEmployee
                    employee={employee}
                    closeModal={closeModal}
                    addNewEmployee={addNewEmployee}
                    editEmployee={editEmployee}
                    isOpenModal={isOpenModal}
                />
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
                        rowKey="id"
                    />
                </Col>
            </Row>

        </div>
    );
}
export default ExternalApi;
