"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Button, Input, Select, message, Table, Modal, Typography, Pagination } from 'antd';
import { EditOutlined, DeleteOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import styles from './ItemGroups.module.css'; // Import CSS module for custom styles

import Loading from '@/components/common/Loading';

const UpdateItemGroupForm = dynamic(() => import('./UpdateItemGroupForm'), {
  loading: () => <Loading />, 
});

const NewItemGroupForm = dynamic(() => import('./NewItemGroupForm'), {
  loading: () => <Loading />, 
});

const { Search } = Input;
const { Option } = Select;


function ItemGroups() {
const [isLoading, setIsLoading] = useState(true);
  const [itemGroups, setItemGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [isNewModalVisible, setIsNewModalVisible] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteGroupId, setDeleteGroupId] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterName, setFilterName] = useState('');
  const [filterGroup, setFilterGroup] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [groupToDelete, setGroupToDelete] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true); // Set loading to true before fetching
        await Promise.all([fetchItemGroups()]); // Wait for both fetches to complete
      } catch (error) {
        console.error("Error fetching data:", error);
        toast("Failed to fetch data");
      } finally {
        setIsLoading(false); // Set loading to false after both fetches complete
      }
    };
  
    fetchData();
  }, []);

  const fetchItemGroups = async () => {
    try {
      const res = await fetch('/api/item-groups');
      const data = await res.json();
      setItemGroups(data);
    } catch (error) {
      console.error("Error fetching:", error);
      toast("Failed to fetch item groups");
    }
  };

  const handleSave = () => {
    toast.success('Group saved successfully!');
    fetchItemGroups();
    setIsNewModalVisible(false);
  };

  const handleUpdate = () => {
    toast.success('Group updated successfully!');
    fetchItemGroups();
    setIsUpdateModalVisible(false);
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/item-groups/${deleteGroupId}`, { method: 'DELETE' });
  
      if (res.ok) {
        await fetchItemGroups();
        setShowConfirm(false);
        setDeleteGroupId(null);
        message.success('Group deleted successfully!');
      } else {
        const result = await res.json();
        message.error(result.message || 'Failed to delete group.');
      }
    } catch (error) {
      console.error("Error deleting:", error);
      message.error('Failed to delete group. Contact developer');
    }
  };
  

  const openDeleteConfirm = (group) => {
    setDeleteGroupId(group._id);
    setGroupToDelete(group.name);
    setShowConfirm(true);
  };

  const closeDeleteConfirm = () => {
    setShowConfirm(false);
    setDeleteGroupId(null);
  };

  const clearFilters = () => {
    setFilterName('');
    setFilterStatus('all');
  };

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    } else if (sortConfig.key === key && sortConfig.direction === 'descending') {
      direction = 'ascending';
    }
    setSortConfig({ key, direction });
  };

  const sortedAndFilteredGroups = itemGroups
    .filter(group => group.name.toLowerCase().includes(filterName.toLowerCase()))
    .filter(group => filterStatus === 'all' ? true : group.active === (filterStatus === 'active'))
    .sort((a, b) => {
      if (sortConfig.key === 'name') {
        if (a.name < b.name) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (a.name > b.name) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      } else if (sortConfig.key === 'active') {
        return sortConfig.direction === 'ascending' ? a.active - b.active : b.active - a.active;
      }
      return 0;
    });

    const paginatedGroups = sortedAndFilteredGroups.slice(
      (currentPage - 1) * rowsPerPage,
      currentPage * rowsPerPage
    );

    const columns = [
      {
        title: (
          <div style={{ cursor: 'pointer' }} onClick={() => requestSort('name')}>
            Group
            {sortConfig.key === 'name' &&
              (sortConfig.direction === 'ascending' ? (
                <ArrowUpOutlined style={{ marginLeft: 8 }} />
              ) : (
                <ArrowDownOutlined style={{ marginLeft: 8 }} />
              ))}
          </div>
        ),
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: (
          <div style={{ cursor: 'pointer' }} onClick={() => requestSort('active')}>
            Status
            {sortConfig.key === 'active' &&
              (sortConfig.direction === 'ascending' ? (
                <ArrowUpOutlined style={{ marginLeft: 8 }} />
              ) : (
                <ArrowDownOutlined style={{ marginLeft: 8 }} />
              ))}
          </div>
        ),
        dataIndex: 'active',
        key: 'active',
        render: (active) => (active ? 'Active' : 'Inactive'),
      },
      {
        title: 'Actions',
        key: 'actions',
        align: 'right',
        render: (text, record) => (
          <>
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => {
                setSelectedGroup(record);
                setIsUpdateModalVisible(true);
              }}
            />
            <Button type="link" icon={<DeleteOutlined />} onClick={() => openDeleteConfirm(record)} />
          </>
        ),
      },
    ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
  ];

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <div className={styles.listContainer}>
          <h6 className="text-end pt-3 pe-3" strong>GROUPS</h6>
        <div className={styles.filterContainer}>
          <Search
          className="pe-2"
            placeholder="Search by Group"
            allowClear
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            style={{ width: 200 }}
          />
          
          <Select
            placeholder="Filter by Status"
            value={filterStatus}
            onChange={(value) => setFilterStatus(value)}
            allowClear
            style={{ width: 200 }}
          >
            <Option value="all">All Status</Option>
            <Option value="active">Active</Option>
            <Option value="inactive">Inactive</Option>
          </Select>
          <Button className="m-2" type="link" onClick={clearFilters}>
            Clear Filters
          </Button>
          <Button className="m-2" type="primary" onClick={() => setIsNewModalVisible(true)}>
            Add Group
          </Button>
        </div>

        <div className={styles.tableContainer}>
          <Table
            columns={columns}
            dataSource={paginatedGroups}
            pagination={false}
            rowKey="_id"
            bordered
            scroll={{ y: 'calc(85vh - 200px)' }} // Adjust height to fit view
          />
          <Pagination
          className={styles.paginationContainer}
            current={currentPage}
            pageSize={rowsPerPage}
            total={sortedAndFilteredGroups.length}
            showSizeChanger
            pageSizeOptions={['5', '10', '25', '50', '100']}
            onShowSizeChange={(current, size) => {
                          setRowsPerPage(size);
                          setCurrentPage(1); // Reset to first page
                        }}
                        onChange={(page) => setCurrentPage(page)}
                                  showQuickJumper
                                  showTotal={(total) => `Total ${total} items`}
                                  itemRender={(current, type, originalElement) => {
                                    if (type === 'prev') {
                                      return <a>Previous</a>;
                                    }
                                    if (type === 'next') {
                                      return <a>Next</a>;
                                    }
                                    if (type === 'first') {
                                      return <a>First</a>;
                                    }
                                    if (type === 'last') {
                                      return <a>Last</a>;
                                    }
                                    return originalElement;
                                  }}
          />
        </div>
      </div>

      <Modal
        title="Create New Group"
        open={isNewModalVisible}
        footer={null}
        onCancel={() => setIsNewModalVisible(false)}
        destroyOnClose
      >
        <NewItemGroupForm
          onSave={handleSave}
          onCancel={() => setIsNewModalVisible(false)}
        />
      </Modal>

      <Modal
        title="Edit Group"
        open={isUpdateModalVisible}
        footer={null}
        onCancel={() => setIsUpdateModalVisible(false)}
        destroyOnClose
      >
        <UpdateItemGroupForm
          itemGroup={selectedGroup}
          onUpdate={handleUpdate}
          onCancel={() => setIsUpdateModalVisible(false)}
        />
      </Modal>

      <Modal
        title="Delete Confirmation"
        open={showConfirm}
        onOk={handleDelete}
        onCancel={closeDeleteConfirm}
        okText="Delete"
        okButtonProps={{ danger: true }}
        cancelText="Cancel"
      >
        <Typography.Text>Are you sure you want to delete the group {groupToDelete}?</Typography.Text>
      </Modal>
    </>
  );
}

export default ItemGroups;