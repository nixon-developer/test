"use client";

import { useState, useEffect } from 'react';
import { Button, Input, message, Checkbox, Form } from 'antd';
import Loading from '@/components/common/Loading';

function NewItemGroupForm({ onSave, onCancel }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    const { name, active } = values;
    const data = { name, active };

    try {
      const res = await fetch('/api/item-groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        onSave();
        message.success('Group created successfully!');
      } else {
        message.error(result.message || 'Failed to create group.');
      }

      form.resetFields(); // Reset form after save
    } catch (error) {
      message.error('An error occurred while creating the group. Contact Developer');
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
      initialValues={{ active: true }}
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
            {isSubmitting ? 'Saving...' : 'Save'}
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

export default NewItemGroupForm