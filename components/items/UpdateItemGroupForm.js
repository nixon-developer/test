"use client";

import { useState, useEffect } from 'react';
import { Button, Input, message, Checkbox, Form } from 'antd';
import Loading from '@/components/common/Loading';

function UpdateItemGroupForm({ itemGroup, onUpdate, onCancel }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (itemGroup) {
      form.setFieldsValue({
        name: itemGroup.name,
        active: itemGroup.active,
      });
    }
  }, [itemGroup, form]);

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    const { name, active } = values;
    const data = { name, active };

    try {
      const res = await fetch(`/api/item-groups/${itemGroup._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        onUpdate();
        message.success('Group updated successfully!');
        form.resetFields();
      } else {
        message.error(result.message || 'Failed to update group.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    form.resetFields(); // Clear form fields when cancel is clicked
    onCancel();
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Form
      form={form}
      onFinish={handleSubmit}
      layout="vertical"
      disabled={isSubmitting}
    >
      <hr />
      <Form.Item
        name="name"
        label="Name"
        rules={[{ required: true, message: 'Please enter the group name' }]}
      >
        <Input disabled={isSubmitting} />
      </Form.Item>
      
      <Form.Item
        name="active"
        valuePropName="checked"
      >
        <Checkbox disabled={isSubmitting}>Active</Checkbox>
      </Form.Item>
      <Form.Item>
        <div className="d-flex">
          <Button type="primary" htmlType="submit" className="w-100 m-2" disabled={isSubmitting}>
            {isSubmitting ? 'Updating...' : 'Update'}
          </Button>
          <Button
            type="default"
            className="w-100 m-2"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </Form.Item>
    </Form>
  )
}

export default UpdateItemGroupForm