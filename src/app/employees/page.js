"use client";
import { getEmployees, createEmployee, updateEmployee, deleteEmployee } from '../api/employees';
import { getDepartments } from '../api/departments';
import { useEffect, useState } from 'react';
import Image from "next/image";
import Link from 'next/link';

export default function Employees() {
  const [departmentID, setDepartmentID] = useState(null);
  const [currentDate, setCurrentDate] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [employeeAddress, setEmployeeAddress] = useState('');

  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState(null);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const openModalEdit = (employee = null) => {
    setEmployeeToEdit(employee);
    setDepartmentID(employee.DepartementID);
    setEmployeeName(employee.Name);
    setEmployeeAddress(employee.Address);
    setIsModalOpen(true);
  };

  const fetchEmployees = async () => {
    try {
      const response = await getEmployees();
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    } finally {
      setLoading(false);
    }
  };
  const fetchDepartments = async () => {
    try {
      const response = await getDepartments();
      setDepartments(response.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const employeeData = {
        departementID: departmentID >>> 0,
        name: employeeName,
        address: employeeAddress,
      };

      if (employeeToEdit) {
        await updateEmployee(employeeToEdit.ID, employeeData);
      } else {
        await createEmployee(employeeData);
      }

      // Reset form
      fetchEmployees();
      setDepartmentID(null);
      setEmployeeName('');
      setEmployeeAddress('');
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error creating/updating employee:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteEmployee(id);
      fetchEmployees();
    } catch (error) {
      console.error('Error delete deleteEmployee:', error);
    }
  };

  const getCurrentDate = () => {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    const date = new Date().toLocaleDateString('en-US', options);
    setCurrentDate(date);
  };

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
    getCurrentDate();
  }, []);

  return (
    <div className="page-wrapper">
      <div className="container-fluid">
        <div className="row">
          <div className="col-xl-3 col-lg-4 col-md-12 theiaStickySidebar">
            <aside className="sidebar sidebar-user">
              <div className="row">
                <div className="col-12">
                  <div className="card ctm-border-radius shadow-sm grow">
                    <div className="card-body py-4">
                      <div className="row">
                        <div className="col-md-12 mr-auto text-left">
                          <div className="custom-search input-group">
                            <div className="custom-breadcrumb">
                              <ol className="breadcrumb no-bg-color d-inline-block p-0 m-0 mb-2">
                                <li className="breadcrumb-item d-inline-block">
                                  <a href="" className="text-dark">Home</a>
                                </li>
                                <li className="breadcrumb-item d-inline-block active">Dashboard</li>
                              </ol>
                              <h4 className="text-dark">Admin Dashboard</h4>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="user-card card shadow-sm bg-white text-center ctm-border-radius grow">
                <div className="user-info card-body">
                  <div className="user-avatar mb-4">
                    <Image src="/img/profiles/profile.png" alt="User Avatar" className="img-fluid rounded-circle" width="100" height="100"/>
                  </div>
                  <div className="user-details">
                    <h4>
                      <b>Welcome Admin</b>
                    </h4>
                    <p>{currentDate}</p>
                  </div>
                </div>
              </div>
              <div className="sidebar-wrapper d-lg-block d-md-none d-none">
                <div className="card ctm-border-radius shadow-sm border-none grow">
                  <div className="card-body">
                    <div className="row no-gutters">
                      <div className="col-6 align-items-center text-center">
                        <Link href="/" className="text-dark p-4 first-slider-btn ctm-border-right ctm-border-left ctm-border-top">
                          <span className="lnr lnr-home pr-0 pb-lg-2 font-23"></span>
                          <span class>Dashboard</span>
                        </Link>
                      </div>
                      <div className="col-6 align-items-center shadow-none text-center">
                        <Link href="/employees" className="text-white active p-4 second-slider-btn ctm-border-right ctm-border-top">
                          <span className="lnr lnr-users pr-0 pb-lg-2 font-23"></span>
                          <span class>Employees</span>
                        </Link>
                      </div>
                      <div className="col-6 align-items-center shadow-none text-center">
                        <Link href="/departments" className="text-dark p-4 ctm-border-right ctm-border-left">
                          <span className="lnr lnr-apartment pr-0 pb-lg-2 font-23"></span>
                          <span class>Departments</span>
                        </Link>
                      </div>
                      <div className="col-6 align-items-center shadow-none text-center">
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
          <div className="col-xl-9 col-lg-8  col-md-12">

            <div className="row"> 
              <div className="col-12">
                <div className="card shadow-sm grow ctm-border-radius">
                  <div className="card-body align-center">
                  <h4 className="card-title float-left mb-0 mt-2">{employees.length ?employees.length : '0' } Employees</h4>
                  <ul className="nav nav-tabs float-right border-0 tab-list-emp">
                    <li className="nav-item pl-3">
                    <a onClick={openModal} className="btn btn-theme button-1 text-white ctm-border-radius p-2 add-person ctm-btn-padding" data-toggle="modal" data-target="#addTeam">
                      <i className="fa fa-plus"></i> Add Employee </a>
                    </li>
                  </ul>
                  </div>
                </div>
              </div>

              <div className="col-12">
              <div className="ctm-border-radius shadow-sm grow card">
                <div className="card-body">
                <div className="table-back employee-office-table">
                  <div className="table-responsive">
                  <table className="table custom-table table-hover table-hover">
                    <thead>
                    <tr>
                      <th>Name</th>
                      <th>Address</th>
                      <th>Departement</th>
                      <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {employees.map((item, index) => (
                      <tr>
                        <td>
                          <a className="avatar">
                            <Image src="/img/profiles/profile.png" alt="Linda Craver" className="img-fluid" width={32} height={32} />
                          </a>
                          <h2>
                            <a>{item.Name}</a>
                          </h2>
                        </td>
                        <td>{item.Address}</td>
                        <td>{item.Departement?.DepartementName}</td>
                        <td className="d-flex justify center">
                          <div className="team-action-icon float-right">
                            <button className="btn btn-theme text-white ctm-border-radius" onClick={() => openModalEdit(item)}>
                              <i className="fa fa-pencil"></i>
                            </button>
                            <button className="btn btn-theme text-white ctm-border-radius ml-2" onClick={() => handleDelete(item.ID)} >
                              <i className="fa fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    </tbody>
                  </table>
                  </div>
                </div>
                </div>
              </div>
              </div>
                
            </div>

          </div>
        </div>
      </div>

      {isModalOpen && (
        <>
          <div className="modal fade show" id="addDepartmentModal" style={{ display: 'block' }} tabIndex="-1" role="dialog" aria-labelledby="addDepartmentModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="addDepartmentModalLabel">{employeeToEdit ? 'Edit' : 'Add'} Employee</h5>
                  <button type="button" className="close" onClick={closeModal} aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label>Select Departement <span className="text-danger">*</span></label>
                      <select value={departmentID} onChange={(e) => setDepartmentID(e.target.value)} className="form-control" required>
                        <option value="" disabled selected>
                        Select Departement
                        </option>
                        {departments.map((option) => (
                          <option key={option.ID} value={option.ID}>
                            {option.DepartementName}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Employee Name <span className="text-danger">*</span></label>
                      <input
                        className="form-control"
                        type="text"
                        value={employeeName}
                        onChange={(e) => setEmployeeName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Address <span className="text-danger">*</span></label>
                      <input
                        className="form-control"
                        type="text"
                        value={employeeAddress}
                        onChange={(e) => setEmployeeAddress(e.target.value)}
                        required
                      />
                    </div>
                    <button
                      type="button"
                      className="btn btn-danger ctm-border-radius float-right ml-3"
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-theme button-1 ctm-border-radius text-white float-right"
                    >
                      {employeeToEdit ? 'Update' : 'Add'}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </div>
  );
}
