"use client";
import { getDepartments, createDepartment, updateDepartment, deleteDepartment } from '../api/departments';
import { useEffect, useState } from 'react';
import Image from "next/image";
import Link from 'next/link';


export default function Departments() {
  const [currentDate, setCurrentDate] = useState('');
  const [departmentName, setDepartmentName] = useState('');
  const [maxClockInTime, setMaxClockInTime] = useState('');
  const [minClockOutTime, setMinClockOutTime] = useState('');

  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [departmentToEdit, setDepartmentToEdit] = useState(null);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const openModalEdit = (department = null) => {
    setDepartmentToEdit(department);
    setDepartmentName(department.DepartementName);
    setMaxClockInTime(department.MaxClockInTime);
    setMinClockOutTime(department.MaxClockOutTime);
    setIsModalOpen(true);
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
      const departmentData = {
        DepartementName: departmentName,
        MaxClockInTime: maxClockInTime,
        MaxClockOutTime: minClockOutTime,
      };

      if (departmentToEdit) {
        await updateDepartment(departmentToEdit.ID, departmentData);
      } else {
        await createDepartment(departmentData);
      }

      // Reset form
      fetchDepartments();
      setDepartmentName('');
      setMaxClockInTime('');
      setMinClockOutTime('');
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error creating/updating department:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDepartment(id);
      fetchDepartments();
    } catch (error) {
      console.error('Error delete department:', error);
    }
  };
  
  const getCurrentDate = () => {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    const date = new Date().toLocaleDateString('en-US', options);
    setCurrentDate(date);
  };

  useEffect(() => {
    getCurrentDate();
    fetchDepartments();
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
                                  <a href="index.html" className="text-dark">Home</a>
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
                        <Link href="/employees" className="text-dark p-4 second-slider-btn ctm-border-right ctm-border-top">
                          <span className="lnr lnr-users pr-0 pb-lg-2 font-23"></span>
                          <span class>Employees</span>
                        </Link>
                      </div>
                      <div className="col-6 align-items-center shadow-none text-center">
                        <Link href="/departments" className="text-white active p-4 ctm-border-right ctm-border-left">
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
                  <h4 className="card-title float-left mb-0 mt-2">{departments.length ? departments.length : '0'} Departments</h4>
                  <ul className="nav nav-tabs float-right border-0 tab-list-emp">
                    <li className="nav-item pl-3">
                    <a className="btn btn-theme button-1 text-white ctm-border-radius p-2 add-person ctm-btn-padding" onClick={openModal} >
                      <i className="fa fa-plus"></i> Add Department </a>
                    </li>
                  </ul>
                  </div>
                </div>
              </div>

              <div className="col-12">
                <div className="row">
                {departments.map((item, index) => (
                  <div className="col-md-6" key={index}>
                    <div className="ctm-border-radius shadow-sm grow card">
                      <div className="card-header">
                        <h4 className="card-title d-inline-block mb-0 mt-2">{item.DepartementName}</h4>
                        <div className="team-action-icon float-right">
                          <button className="btn btn-theme text-white ctm-border-radius" onClick={() => openModalEdit(item)}>
                            <i className="fa fa-pencil"></i>
                          </button>
                          <button className="btn btn-theme text-white ctm-border-radius ml-2" onClick={() => handleDelete(item.ID)} >
                            <i className="fa fa-trash"></i>
                          </button>
                        </div>
                      </div>
                      <div className="card-body">
                        <span className="avatar" data-toggle="tooltip" data-placement="top" title="Maria Cotton">
                          <img src="/img/profiles/profile.png" alt="Maria Cotton" className="img-fluid" height={32} width={32} />
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
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
                  <h5 className="modal-title" id="addDepartmentModalLabel">{departmentToEdit ? 'Edit' : 'Add'} Department</h5>
                  <button type="button" className="close" onClick={closeModal} aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label>Departement Name <span className="text-danger">*</span></label>
                      <input
                        className="form-control"
                        type="text"
                        value={departmentName}
                        onChange={(e) => setDepartmentName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Max Clock In Time <span className="text-danger">*</span></label>
                      <div className="cal-icon">
                        <input
                          className="form-control datetimepicker p-2"
                          type="time"
                          value={maxClockInTime}
                          onChange={(e) => setMaxClockInTime(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Min Clock Out Time <span className="text-danger">*</span></label>
                      <div className="cal-icon">
                        <input
                          className="form-control datetimepicker p-2"
                          type="time"
                          value={minClockOutTime}
                          onChange={(e) => setMinClockOutTime(e.target.value)}
                          required
                        />
                      </div>
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
                      {departmentToEdit ? 'Update' : 'Add'}
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
