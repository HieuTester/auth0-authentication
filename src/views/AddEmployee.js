import React, { useEffect } from 'react';
import { Form, Modal, Button, Input, Col, InputNumber  } from 'antd';
import moment from 'moment'



const tailLayout = {
    wrapperCol: { offset: 0, span: 24 },
};
const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
};

function AddEmployee(props) {
    const [form] = Form.useForm();

    const {
        closeModal,
        employee,
        editEmployee,
        addNewEmployee,
        isOpenModal
    } = props
    useEffect(() => {
        if (props.employee.id) {
            console.log("values: ", employee)
            const values = {
                id: employee.id,
                name: employee.name,
                age: employee.age,
                email: employee.email,
                phone: employee.phone,
                address: employee.address,
            }
            form.setFieldsValue(values)
        }
    }, [employee.id]);

    const handleOk = () => {
        closeModal();
        clearFormValues();
    };

    const handleCancel = () => {
        closeModal();
        clearFormValues();
    };

    const clearFormValues = () => {
        form.resetFields();
    }

    const genNewId = () => Math.random().toString(36).substr(2, 23)

    const onFinish = values => {

        const newEmployee = {
            email: values.email,
            age: values.age,
            name: values.name,
            address: values.address,
            phone: values.phone,
        }
        if (employee.id) {
            newEmployee["id"] = employee.id
            newEmployee["modifyDate"] = moment().format('DD/MM/YYYY')
            editEmployee(newEmployee)
        } else {
            newEmployee["id"] = genNewId()
            newEmployee["createdAt"] = moment().format('DD/MM/YYYY')
            addNewEmployee(newEmployee);
        }
        closeModal();
        clearFormValues();
    };

    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };

    // const showCategoryModal = () => {
    //     openAddCate();
    // };

    return (
        <>
           <Modal
                    title="Add new employee"
                    visible={isOpenModal}
                    footer={null}
                    onCancel={ handleCancel}
                >
                    <Form {...layout}
                        className="form"
                        name="basic"
                        initialValues={{
                            remember: true,
                        }}
                        form={form}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                    // onFinish={onFinish}
                    // onFinishFailed={onFinishFailed}
                    >
                        <Form.Item {...tailLayout}
                            label="Name"
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input name!',
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
                                    message: 'Please input age!',
                                },
                                {
                                    type: 'number', min: 1, max: 120,
                                    message: "Invalid age!"
                                }
                            ]}
                        >
                            <InputNumber />
                        </Form.Item>

                        <Form.Item {...tailLayout}
                            label="Email"
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input email!',
                                },
                                {
                                    type: 'email',
                                    message: 'The input is not valid E-mail!',
                                },
                            ]}
                        >
                            <Input type="email" />
                        </Form.Item>

                        <Form.Item {...tailLayout}
                            label="Phone"
                            name="phone"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input phone!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item {...tailLayout}
                            label="Address"
                            name="address"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input address!',
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
        </>
    );
}

export default AddEmployee;